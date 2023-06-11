import mongoose, { ConnectOptions, Model } from "mongoose";
import guild from "../models/guild";
import keys from "../keys";

const log = (...args: any[]) => console.log("[DATABASE]", ...args);

let options: ConnectOptions = {
  dbName: "Samy",
};
function connect() {
  mongoose
    .connect(keys.mongoDBKey, options)
    .then(() => {
      log("MongoDB connection has been stabilished.");
    })
    .catch((error: any) => {
      if (error) throw error;
    });
}
async function checkData(model: any, query: object) {
  let data = await model.findOne(query);
  if (!data) {
    await new model(query).save();
    return true;
  } else {
    return false;
  }
}

export { checkData, connect };
