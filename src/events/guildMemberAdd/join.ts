import { event } from "../../utils";

export default event(
  "guildMemberAdd",
  async ({ log, client }, member) => {
    console.log(member)
  }
);
