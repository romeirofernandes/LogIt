import Dexie, { Table } from "dexie";

export interface Habit {
  id: string;
  name: string;
  logs: Date[];
  createdAt: Date;
  order: number;
}

export class LogItDB extends Dexie {
  habits!: Table<Habit, string>;

  constructor() {
    super("logitDB");
    this.version(1).stores({
      habits: "id, name, createdAt, order",
    });
  }
}

export const db = new LogItDB();
