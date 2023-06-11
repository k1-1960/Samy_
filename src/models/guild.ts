import { Schema, model } from "mongoose";

const Presets = {
  configuration: {
    welcome: {
      plain_message: "",
      title: "",
      subtitle: "",
      background: "",
      embedded: false
    },
    goodbyes: {
      plain_message: "",
      title: "",
      subtitle: "",
      background: "",
      embedded: false
    },
    invite_track: {
      plain_message: "{invited} was invited by {inviter}. {inviter} now has {invitedCount} people invited."
    },
  },

  economy: {
    shop: {
      items: [],
      on_discount: 0, // 0 = false, > 0 = discount.
    },
  },
};

const Model = model(
  "guilds",
  new Schema({
    _id: { type: String, required: true },
    configuration: {
      type: Object,
      default: Presets.configuration,
    },
    economy: {
      type: Object,
      default: Presets.economy,
    },
  })
);

export default { Presets, Model };
