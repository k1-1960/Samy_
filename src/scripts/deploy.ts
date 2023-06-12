import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "..", "..", ".env") });

import { REST, Routes, APIUser } from "discord.js";
import commands from "../commands";
import keys from "../keys";

const body = commands
  .map(({ commands }) => commands.filter(({ exclusive }) => exclusive === false).map(({ meta }) => meta))
  .flat();

const private_body = commands
  .map(({ commands }) =>
    commands
      .filter(({ exclusive }) => exclusive === true)
      .map(({ meta }) => meta)
  )
  .flat();

const rest = new REST({ version: "10" }).setToken(keys.clientToken);

async function main() {
  const currentUser = (await rest.get(Routes.user())) as APIUser;

  const endpoint = Routes.applicationCommands(currentUser.id);
  const exclusive_endpoint = Routes.applicationGuildCommands(
    currentUser.id,
    keys.testGuild
  );

  exclusive_endpoint
    ? await rest.put(exclusive_endpoint, { body: private_body })
    : null;
  await rest.put(endpoint, { body });

  return currentUser;
}

main()
  .then((user) => {
    const tag = `${user.username}#${user.discriminator}`;
    const response =
      process.env.NODE_ENV === "production"
        ? `Successfully released commands in production as ${tag}!`
        : `Successfully registered commands for development in ${keys.testGuild} as ${tag}!`;

    console.log(response);
  })
  .catch(console.error);
