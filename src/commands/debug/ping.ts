import { SlashCommandBuilder } from "discord.js";
import { command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("emit")
  .setDescription("[DEV] emit a event")
  .addStringOption((o) =>
    o.setName("eventname").setDescription("eventname").setRequired(true)
  );

export default command(meta, ({ interaction, client }) => {
  const eventname = interaction.options.getString("eventname") as string;

  client.emit(eventname, interaction.member);

  return interaction.reply({
    ephemeral: true,
    content: "Event emitted.",
  });
});
