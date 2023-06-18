import { SlashCommandBuilder } from 'discord.js'
import { command } from '../../utils'

const meta = new SlashCommandBuilder()
  .setName('cvu')
  .setDescription('Get mercado pago cvu.');

export default command(meta, ({ interaction, client }) => {
  return interaction.reply({
    ephemeral: false,
    embeds: [{
      title: "Mercado pago cvu.",
      description: "0000003100060997419931",
      color: 0x59a9ff,
      footer: {
        text: "Una vez haya enviado el dinero envie el comprobante."
      }
    }]
  })
}, 2); 