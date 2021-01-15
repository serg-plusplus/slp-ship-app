import { Bch } from "lib/badger";

const ORACLE_ADDRESS = "bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g";

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

    const bchTxId = await new Promise((res, rej) => {
      bch.sendTransaction(
        {
          to: ORACLE_ADDRESS,
          from: bch.defaultAccount,
          value: "0.00001",
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
