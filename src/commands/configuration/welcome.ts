import {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ModalBuilder,
  ChannelSelectMenuBuilder,
  TextInputBuilder,
  ChannelSelectMenuInteraction,
} from "discord.js";
import { command } from "../../utils";
import Guild from "../../models/guild";

const meta = new SlashCommandBuilder()
  .setName("welcomes")
  .setDescription("Manage the welcome system.");

export default command(meta, async ({ client, interaction }) => {
  if (!interaction?.memberPermissions?.has("ManageGuild"))
    return interaction.reply({
      content:
        "Unfortunately, you do not have sufficient permissions to perform this action.",
      ephemeral: true,
    });

  let data = await Guild.Model.findOne({
    _id: interaction?.guild?.id,
  });

  let initialEmbed = (ddata: any) =>
    new EmbedBuilder({
      title: "</welcomes:0>",
      description:
        "This is the current setting, to change it use the components below.",
      fields: Object.entries(ddata?.configuration?.welcome).map(
        ([key, value]: [string, any]) => {
          return {
            name: key[0].toUpperCase() + key.replace("_", " ").slice(1),
            value:
              key === "channel" && value?.length > 0 ? `<#${value}>` : value,
          };
        }
      ),
    });

  const Tip = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder({
      custom_id: "this_is_a_tip",
      placeholder: "Select the property to modify.",
      options: [{ label: "x", value: "y" }],
      disabled: true,
    })
  );

  const Properties = new ActionRowBuilder<ButtonBuilder>().addComponents(
    Object.entries(data?.configuration?.welcome)
      .slice(0, 5)
      .map(([key, value]: [string, any]) => {
        return new ButtonBuilder({
          custom_id: `modal_${interaction?.guildId}_${key}`,
          label: key[0].toUpperCase() + key.replace("_", " ").slice(1),
          style: 2,
        });
      })
  );

  const Properties2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    Object.entries(data?.configuration?.welcome)
      .slice(5)
      .map(([key, value]: [string, any]) => {
        return new ButtonBuilder({
          custom_id: `modal_${interaction?.guildId}_${key}`,
          label: key[0].toUpperCase() + key.replace("_", " ").slice(1),
          style: 2,
        });
      })
  );

  const message = await interaction.reply({
    embeds: [initialEmbed(data)],
    components: [Tip.toJSON(), Properties.toJSON(), Properties2.toJSON()],
  });

  const mesage_data = await message?.fetch();
  console.log(mesage_data);

  const collector = message.createMessageComponentCollector({
    time: 60e3,
    filter: (i) =>
      i?.user?.id === interaction?.user?.id && i?.customId?.startsWith("modal"),
  });

  collector.on("collect", async (i) => {
    collector.resetTimer();
    if (i?.customId?.startsWith(`modal_${interaction?.guildId}`)) {
      let prop = i?.customId?.slice(`modal_${interaction?.guildId}_`.length);
      if (prop === "embedded" || prop === "channel" || prop === "enabled") {
        if (prop === "channel") {
          let udata = await Guild.Model.findOne({
            _id: interaction?.guild?.id,
          });
          let channelSelect =
            new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
              new ChannelSelectMenuBuilder()
                .addChannelTypes(0)
                .setCustomId("channel")
                .setPlaceholder("Select the channel for the welcomes.")
            );

          i.deferUpdate().then(async () => {
            i.editReply({
              embeds: [],
              content: "Select the channel below.",
              components: [channelSelect],
            });

            let channelCollector = message.createMessageComponentCollector({
              filter: (int) => int?.user?.id === interaction?.user?.id,
              time: 60e3,
            });

            channelCollector.on(
              "collect",
              async (int: ChannelSelectMenuInteraction) => {
                if (int.customId !== "channel") return;
                let channel = int.values[0];

                if (
                  udata &&
                  udata.configuration &&
                  udata.configuration.welcome
                ) {
                  udata.configuration.welcome[prop] = channel;

                  await Guild.Model.findOneAndUpdate(
                    {
                      _id: interaction?.guildId,
                    },
                    Object(udata)
                  );

                  int.deferUpdate().then(() => {
                    int.editReply({
                      content: `✅ | \`${prop}\` property successfully changed.`,
                      embeds: [initialEmbed(udata)],
                      components: [
                        Tip.toJSON(),
                        Properties.toJSON(),
                        Properties2.toJSON(),
                      ],
                    });
                  });
                }
              }
            );
          });
        } else {
          let udata = await Guild.Model.findOne({
            _id: interaction?.guild?.id,
          });

          if (udata && udata.configuration && udata.configuration.welcome) {
            udata.configuration.welcome[prop] =
              !udata.configuration.welcome[prop];

            await Guild.Model.findOneAndUpdate(
              {
                _id: interaction?.guildId,
              },
              Object(udata)
            );

            i.deferUpdate().then(() => {
              i?.editReply({
                content: `✅ | \`${prop}\` property successfully changed.`,
                embeds: [initialEmbed(udata)],
                components: [
                  Tip.toJSON(),
                  Properties.toJSON(),
                  Properties2.toJSON(),
                ],
              });
            });
          }
        }
      } else {
        let modal_to_show = new ModalBuilder()
          .setTitle(`New value for ${prop}.`)
          .setCustomId(
            `submitmodal.${interaction?.guildId}.welcome.${prop}.${mesage_data.id}`
          )
          .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
              new TextInputBuilder()
                .setCustomId("new_value")
                .setLabel("New value.")
                .setPlaceholder(
                  `The actual value is ${
                    data?.configuration?.welcome[prop] || "Empty string."
                  }`.slice(0, 95) + "..."
                )
                .setMinLength(4)
                .setMaxLength(1024)
                .setStyle(2)
            )
          );

        i.showModal(modal_to_show.toJSON());
        const filter = (int: any) =>
          int?.customId ===
          `submitmodal.${interaction?.guildId}.welcome.${prop}.${mesage_data.id}`;
        i?.awaitModalSubmit({ filter, time: 60e3 })
          .then(async (int) => {
            let udata = await Guild.Model.findOne({
              _id: interaction?.guild?.id,
            });

            if (udata && udata.configuration && udata.configuration.welcome) {
              let nv = int?.fields?.getTextInputValue("new_value") as string;
              if (prop === "background" && !nv.startsWith("https://cdn.discordapp.com/attachments")) {
                int?.deferUpdate().then(() => {
                  int?.editReply({
                    content: `❌ | \`${prop}\` property could not be modified because the url did not start with \`https://cdn.discordapp.com/attachments\`, the image must be served by discord.`,
                    embeds: [initialEmbed(udata)],
                    components: [
                      Tip.toJSON(),
                      Properties.toJSON(),
                      Properties2.toJSON(),
                    ],
                  });
                });
              } else {
                udata.configuration.welcome[prop] = nv;

                await Guild.Model.findOneAndUpdate(
                  {
                    _id: interaction?.guildId,
                  },
                  Object(udata)
                );

                int?.deferUpdate().then(() => {
                  int?.editReply({
                    content: `✅ | \`${prop}\` property successfully changed.`,
                    embeds: [initialEmbed(udata)],
                    components: [
                      Tip.toJSON(),
                      Properties.toJSON(),
                      Properties2.toJSON(),
                    ],
                  });
                });
              }
            }
          })
          .catch(console.error);
      }
    }
  });
});
