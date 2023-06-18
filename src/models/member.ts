import { Schema, model } from "mongoose";

const Presets = {
  economy: {
    money: 0,
    inbank_money: 0,
    
  },
  xp_level: {
    level: 0,
    xp: 0
  }
};

const Model = model(
  "members",
  new Schema({
    _id: { type: String, required: true },
    guild: { type: String, required: true },
    perks: { type: Array, default: [] },
    inventory: { type: Array, default: [] },
    economy: {
      type: Object,
      default: Presets.economy,
    },
  })
);

export default { Presets, Model };
