import Dexie from "dexie";

export enum Table {
  WSLPTOKENS = "wslptokens",
}

export const db = new Dexie("MyAppDatabase");
db.version(1).stores({
  [Table.WSLPTOKENS]: "++id, &slpId, &wslpAddress, symbol, name",
});

export const wslpTokens = db.table<IWSLP, number>(Table.WSLPTOKENS);

export interface IWSLP {
  id?: number;
  slpId: string;
  wslpAddress: string;
  symbol: string;
  name: string;
}
