import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { command, embedColor } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("stats")
  .setDescription("Get information about the bot's statistics.");

export default command(
  meta,
  async ({ interaction, client }) => {
    const users: any = await client?.users?.cache.filter(
      (x) => x.bot === false
    );
    const embed = new EmbedBuilder()
      .setTitle("Stats.")
      .setDescription(`<:account:1118775466233434143> Usuarios: ${users.size}.`)
      .setColor(embedColor);

    interaction?.reply({
      embeds: [embed],
    });
  },
  1
);
