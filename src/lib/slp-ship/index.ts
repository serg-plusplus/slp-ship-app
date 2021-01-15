import { Bch } from "lib/badger";

const ORACLE_ADDRESS = process.env.REACT_APP_BCH_ORACLE_ADDRESS;
const BCH_FEE = process.env.REACT_APP_BCH_FEE;

export async function toWSLP(
  bch: Bch,
  slpTokenId: string,
  slpVolume: string,
  ethDestAddress: string
) {
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
    throw new Error("Oops");
  }
}

(window as any).toWSLP = toWSLP;

function toSatoshi(val: number | string) {
  return +val * 10 ** 8;
}
