const { SlashCommandBuilder } = require("@discordjs/builders");
const { Collection, Formatters } = require("discord.js");
const { Users } = require("../dbObjects.js");

const currency = new Collection();
Reflect.defineProperty(currency, "getBalance", {
  value: (id) => {
    const user = currency.get(id);
    return user ? user.balance : 0;
  },
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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View Leaderboard"),
  async execute(interaction) {
    // return interaction.reply(
    //   Formatters.codeBlock(
    //     currency
    //       .sort((a, b) => b.balance - a.balance)
    //       .filter((user) => client.users.cache.has(user.user_id))
    //       .first(10)
    //       .map(
    //         (user, position) =>
    //           `(${position + 1}) ${client.users.cache.get(user.user_id).tag}: ${
    //             user.balance
    //           }💰`
    //       )
    //       .join("\n")
    //   )
    // );
    return interaction.reply("WIP");
  },
};
