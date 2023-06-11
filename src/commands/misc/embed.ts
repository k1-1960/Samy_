import { SlashCommandBuilder } from "discord.js";
import { command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("embed")
  .setDescription("Create and send a custom embed.")
  .addStringOption((option) =>
    option
      .setName("body")
      .setDescription("Provide the embed content.")
      .setMinLength(1)
      .setMaxLength(2000)
      .setRequired(true)
  );

export default command(meta, ({ interaction }) => {
  const body: string = interaction?.options?.getString("body") as string;

  return interaction.reply({
    ephemeral: true,
    embeds: [JSON.parse(body)],
  });
});
