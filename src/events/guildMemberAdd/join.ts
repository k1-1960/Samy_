import { event } from "../../utils";
import Guild from "../../models/guild";
import axios from "axios";
import { TextChannel, AttachmentBuilder, BaseMessageOptions } from "discord.js";

export default event("guildMemberAdd", async ({ log, client }, member) => {
  let guildData = await Guild.Model.findOne({
    _id: member.guild.id,
  });

  if (guildData && guildData?.configuration?.welcome) {
    if (guildData?.configuration?.welcome?.enabled === false) return;
    if (guildData?.configuration?.welcome?.channel?.length < 1) return;

    let channel = (await member?.guild?.channels?.fetch(
      guildData?.configuration?.welcome?.channel
    )) as TextChannel;
    let title =
      guildData?.configuration?.welcome?.title.length > 0
        ? guildData?.configuration?.welcome?.title
        : "Welcome";
    let subtitle =
      guildData?.configuration?.welcome?.subtitle.length > 0
        ? guildData?.configuration?.welcome?.subtitle
        : "Thanks for joining.";
    let background =
      guildData?.configuration?.welcome?.background.length > 0
        ? guildData?.configuration?.welcome?.background
        : "https://i.imgur.com/0BF5QmT.jpg";
    let content = guildData?.configuration?.welcome?.plain_message?.replace(
      /{user}/g,
      member.user.toString()
    ) as string;
    
    const imageURL = `https://api.munlai.me/image/welcomecard?image=${encodeURIComponent(
      member?.user?.displayAvatarURL({ extension: "png", size: 512 })
    )}&username=${encodeURIComponent(member.user.username)}&discriminator=${
      member.user.discriminator
    }&title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(
      subtitle.replace(/{memberCount}/g, member.guild.memberCount)
    )}&background=${encodeURIComponent(background)}`;

    try {
      const response = await axios.get(imageURL, {
        responseType: "arraybuffer",
      });
      const attachment = new AttachmentBuilder(response.data);

      if (content?.length > 0) {
        channel?.send({
          files: [attachment],
          content,
        });
      } else {
        channel?.send({
          files: [attachment],
        });
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  }
});
