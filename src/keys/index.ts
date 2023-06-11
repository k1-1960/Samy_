import { Keys } from "../types";
import "dotenv/config";

const keys: Keys = {
  clientToken: process.env.CLIENT_TOKEN ?? "nil",
  testGuild: process.env.TEST_GUILD ?? "nil",
  mongoDBKey: process.env.MONGODB_URI ?? "nil",
};

if (Object.values(keys).includes("nil"))
  throw new Error("Not all ENV variables are defined!");

export default keys;
