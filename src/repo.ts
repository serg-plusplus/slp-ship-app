import Dexie from "dexie";

export enum Table {
  CONTRACTS = "contacts",
}

export const db = new Dexie("MyAppDatabase");
db.version(1).stores({
  [Table.CONTRACTS]: "++id, first, last",
});

export const contacts = db.table<IContact, number>(Table.CONTRACTS);

export interface IContact {
  id?: number;
  first: string;
  last: string;
}
