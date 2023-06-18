import { Schema, model } from "mongoose";

const Presets = {
  configuration: {
    welcome: {
      plain_message: "",
      title: "",
      subtitle: "",
      background: "",
      channel: "",
      embedded: false,
      enabled: false,
    },
    goodbyes: {
      plain_message: "",
      title: "",
      subtitle: "",
      background: "",
      channel: "",
      embedded: false,
      enabled: false,
    },
    invite_track: {
      plain_message:
        "{invited} was invited by {inviter}. {inviter} now has {invitedCount} people invited.",
    },
    anti_links: {
      enabled: false,
      excluded_roles: [],
      excluded_channels: [],
      allowed_domains: [],
      informative_response: true,
      custom_informative_response:
        "Hey {user}, you can't send these types of links here.",
      channels_can_lower_popularity: [],
    },
  },
  economy: {
    shop: {
      items: [],
      on_discount: {
        discount: 0, // 0 → false, > 0 » discount.
        ends_in: 0, // timestamp (unix).
      },
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
