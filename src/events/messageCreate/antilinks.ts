import { event } from "../../utils";
export default event("messageCreate", async ({ log }, message: any) => {
  if (false === false) return;
  let allowedChannels: any = ["1081693455203450890"];
  let matchLinks =
    message?.content?.match(/((https?|ftp):\/\/)?([^\s/$.?#].[^\s]*)/gi) ||
    false;
  if (!allowedChannels?.includes(message?.channel?.id) && matchLinks) {
    message?.delete().then(() => {
      message?.channel
        ?.send({
          content: `<:delete_link:1118775516548304927> ${message.author.toString()} you can't send links here.\nThe link was removed.`,
        })
        .then((x: any) => {
          setTimeout(() => x.delete(), 7500);
        });
    });
  }
});
