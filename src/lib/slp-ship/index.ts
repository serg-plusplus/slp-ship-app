import {
  ethers,
  providers,
  Contract,
  BigNumber as EthersBigNumber,
} from "ethers";
import BigNumber from "bignumber.js";
import { Bch } from "lib/badger";
import { ensureAllowance } from "./erc20";
import wslpabi from "./wslpabi.json";
import factoryabi from "./factoryabi.json";

const ORACLE_ADDRESS = process.env.REACT_APP_BCH_ORACLE_ADDRESS;
const BCH_FEE = process.env.REACT_APP_BCH_FEE;
const ETH_FACTORY_ADDRESS = process.env.REACT_APP_ETH_FACTORY_ADDRESS!;

(window as any).toWSLP = toWSLP;

export async function toWSLP(
  bch: Bch,
  slpTokenId: string,
  slpVolume: string,
  ethDestAddress: string
) {
  if (!slpTokenId) {
    throw new Error("Invalid SLP Token ID");
  }
  if (!(+slpVolume > 0)) {
    throw new Error("Invalid SLP Amount");
  }
  if (!ethers.utils.isAddress(ethDestAddress)) {
    throw new Error("Invalid Ethereum address");
  }

  try {
    const slpTxId = await new Promise((res, rej) => {
      bch.sendTransaction(
        {
          to: ORACLE_ADDRESS,
          from: bch.defaultAccount,
          value: slpVolume,
          sendTokenData: {
            tokenId: slpTokenId,
            tokenProtocol: "slp",
          },
        },
        (err: any, id: any) => {
          if (err) return rej(err);
          res(id);
        }
      );
    });

    await new Promise((r) => setTimeout(r, 5_000));

    const bchTxId = await new Promise((res, rej) => {
      bch.sendTransaction(
        {
          to: ORACLE_ADDRESS,
          from: bch.defaultAccount,
          value: toSatoshi(BCH_FEE!),
          opReturn: {
            data: ["SLP_SHIP", slpTxId, ethDestAddress],
          },
        },
        (err: any, id: any) => {
          if (err) return rej(err);
          res(id);
        }
      );
    });

    return bchTxId;
  } catch (err) {
    console.error(err);
    throw new Error("Oops! Something went wrong ;(");
  }
}

export async function fromWSLP(
  provider: providers.Web3Provider,
  account: string,
  ethTokenAddress: string,
  ethTokenVolume: string,
  slpDestAddress: string
) {
  if (!ethTokenAddress) {
    throw new Error("Invalid ERC20 Token address");
  }
  if (!(+ethTokenVolume > 0)) {
    throw new Error("Invalid token amount");
  }
  if (
    !(
      slpDestAddress.startsWith("simpleledger:") && slpDestAddress.length === 55
    )
  ) {
    throw new Error("Invalid SLP Destination address");
  }

  try {
    const wslp = new Contract(ethTokenAddress, wslpabi, provider.getSigner());
    const tokenDecimals = await wslp.decimals();
    const volume = new BigNumber(ethTokenVolume)
      .times(10 ** tokenDecimals)
      .integerValue();

    await ensureAllowance(provider, account, account, ethTokenAddress, volume);

    await wslp.withdraw(EthersBigNumber.from(volume.toFixed()), slpDestAddress);
  } catch (err) {
    console.error(err);
    throw new Error("Oops! Something went wrong ;(");
  }
}

export async function getAllWSLPTokens(provider: providers.Web3Provider) {
  const factory = new Contract(
    ETH_FACTORY_ADDRESS,
    factoryabi,
    provider.getSigner()
  );
  const size: number = await factory.allPairsLength();
  const allWslps: string[] = await Promise.all(
    Array.from({ length: size }).map((_, i) => factory.allTokens(i))
  );
  return Promise.all(
    allWslps.map(async (address) => {
      const wslp = new Contract(address, wslpabi, provider.getSigner());
      const [symbol, name]: [string, string] = await Promise.all([
        wslp.symbol(),
        wslp.name(),
      ]);
      return {
        address,
        symbol,
        name,
      };
    })
  );
}

export const bchjs = new (window as any).BchJS({
  restURL: "https://api.fullstack.cash/v3/",
  apiToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNTU1OWExY2U1MjBmMDAxOTA3ZDcyMyIsImVtYWlsIjoiYml0b2Zmb2dAZ21haWwuY29tIiwiYXBpTGV2ZWwiOjAsInJhdGVMaW1pdCI6MywiaWF0IjoxNTk5NDI5MDQ5LCJleHAiOjE2MDIwMjEwNDl9.NekXZiTIaQOWdtdoJkDa_U8fcW2q4W3RRC_F618TND8",
});

export async function getSLPBalance(cashAddress: string) {
  try {
    const data = await bchjs.Electrumx.utxo(cashAddress);
    const utxos = data.utxos;

    let allUtxos = await bchjs.SLP.Utils.tokenUtxoDetails(utxos);
    let tokens: any = {};
    allUtxos.forEach((utxo: any) => {
      if (utxo && utxo.utxoType === "token") {
        tokens[utxo.tokenId] = tokens[utxo.tokenId] || {
          tokenId: utxo.tokenId,
          balance: 0,
          slpAddress: bchjs.SLP.Address.toSLPAddress(cashAddress),
          decimalCount: utxo.decimals,
          tokenTicker: utxo.tokenTicker,
          tokenName: utxo.tokenName,
        };
        tokens[utxo.tokenId].balance += utxo.tokenQty;
      }
    });
    return Object.values(tokens);
  } catch (err) {
    throw err;
  }
}

function toSatoshi(val: number | string) {
  return +val * 10 ** 8;
}
