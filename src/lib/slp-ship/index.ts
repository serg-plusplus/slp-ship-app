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
// import factoryabi from "./factoryabi.json";

const ORACLE_ADDRESS = process.env.REACT_APP_BCH_ORACLE_ADDRESS;
const BCH_FEE = process.env.REACT_APP_BCH_FEE;

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

function toSatoshi(val: number | string) {
  return +val * 10 ** 8;
}
