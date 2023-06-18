import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "..", "..", ".env") });

import { REST, Routes, APIUser } from "discord.js";
import commands from "../commands";
import keys from "../keys";

const publicCommands = commands
  .map(({ commands }) =>
    commands
      .filter(({ type }) => type === 0)
      .map(({ meta }) => meta)
  )
  .flat();

const testCommands = commands
  .map(({ commands }) =>
    commands.filter(({ type }) => type === 1).map(({ meta }) => meta)
  )
  .flat();

const privateCommands = commands
  .map(({ commands }) =>
    commands.filter(({ type }) => type === 2).map(({ meta }) => meta)
  )
  .flat();

const rest = new REST({ version: "10" }).setToken(keys.clientToken);

async function main() {
  const currentUser = (await rest.get(Routes.user())) as APIUser;

  const public_endpoint = Routes.applicationCommands(currentUser.id);

  const private_endpoint = Routes.applicationGuildCommands(
    currentUser.id,
    keys.privateGuild
  );
  const test_endpoint = Routes.applicationGuildCommands(
    currentUser.id,
    keys.testGuild
  );

  console.log({
    privateCommands,
    publicCommands,
    testCommands,
  });

  process.env.NODE_ENV === "production"
    ? await rest.put(public_endpoint, { body: publicCommands })
    : null;

  test_endpoint ? await rest.put(test_endpoint, { body: testCommands }) : null;
  private_endpoint
    ? await rest.put(private_endpoint, { body: privateCommands })
    : null;

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
