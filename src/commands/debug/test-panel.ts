import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { command, embedColor, Panel } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("panel")
  .setDescription("Test command for panel system.");

export default command(
  meta,
  async ({ interaction, client }) => {
    new Panel(interaction)
      .returnAfterAction(true)
      .addAction({
        id: "action:yes",
        type: 0,
        todo: (int, next) => {
          console.log("OK");
          next();
        },
        next: "on_yes_screen",
      })
      .addAction({
        id: "action:no",
        type: 0,
        next: "on_no_screen",
      })
      .addScreen({
        id: "main",
        type: 0,
        embeds: [
          new EmbedBuilder()
            .setTitle("Tap yes!")
            .setDescription("I know you want it ;)")
            .setColor(embedColor),
        ],
        components: [
          new ActionRowBuilder().addComponents([
            new ButtonBuilder()
              .setCustomId("yes")
              .setLabel("Yes!")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId("no")
              .setLabel("NO!")
              .setStyle(ButtonStyle.Danger),
          ]),
        ],
      })
      .addScreen({
        id: "on_yes_screen",
        type: 0,
        embeds: [
          new EmbedBuilder()
            .setTitle("Yupiii, this is working!")
            .setDescription("Yes! this is totally working!")
            .setColor(embedColor),
        ],
        components: [],
      })
      .addScreen({
        id: "on_no_screen",
        type: 0,
        embeds: [
          new EmbedBuilder()
            .setTitle("Ouh, ok.")
            .setDescription("This isn't working, :(")
            .setColor(embedColor),
        ],
        components: [],
      })
      .init();
  },
  1
);
