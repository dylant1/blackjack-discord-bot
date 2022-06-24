const fs = require("node:fs");
const path = require("node:path");
const { Collection, Client, Formatters, Intents } = require("discord.js");
const { Op } = require("sequelize");
const { Users, CurrencyShop } = require("./dbObjects.js");

require("dotenv").config();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
const currency = new Collection();
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

client.once("ready", async () => {
  const storedBalances = await Users.findAll();
  // console.log(storedBalances[0].dataValues);
  storedBalances.forEach((b) => currency.set(b.user_id, b));
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  currency.add(message.author.id, 1);
});

Reflect.defineProperty(currency, "add", {
  value: async (id, amount) => {
    const user = currency.get(id);

    if (user) {
      user.balance += Number(amount);
      return user.save();
    }

    const newUser = await Users.create({ user_id: id, balance: amount });
    currency.set(id, newUser);

    return newUser;
  },
});

Reflect.defineProperty(currency, "getBalance", {
  value: (id) => {
    const user = currency.get(id);
    return user ? user.balance : 0;
  },
});

client.on("messageReactionAdd", async (reaction, user) => {
  // When a reaction is received, check if the structure is partial
  if (reaction.partial) {
    // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
    try {
      await reaction.fetch();
    } catch (error) {
      console.error("Something went wrong when fetching the message:", error);
      // Return as `reaction.message.author` may be undefined/null
      return;
    }
  }

  // Now the message has been cached and is fully available
  console.log(`The's message "${reaction.message.content}" gained a reaction!`);
  console.log("username: ", user.username);
  // The reaction is now also fully available and the properties will be reflected accurately:
  console.log(
    `${
      reaction.count - 1
    } user(s) have given the same reaction to this message!`
  );
});

// COMMAND INTERACTION
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(process.env.TOKEN);
