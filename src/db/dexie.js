import Dexie from "dexie";

export const db = new Dexie("TalentFlowDB");

db.version(1).stores({
  jobs: "++id, title, location, description"
});
