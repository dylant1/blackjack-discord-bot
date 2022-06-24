const { SlashCommandBuilder } = require("@discordjs/builders");
const { Collection, Formatters } = require("discord.js");
const { Users, CurrencyShop } = require("../dbObjects.js");

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
    .setName("transfer")
    .setDescription("Transfer currency to other user"),
  async execute(interaction) {
    const currentAmount = currency.getBalance(interaction.user.id);
    const transferAmount = interaction.options.getInteger("amount");
    const transferTarget = interaction.options.getUser("user");

    if (transferAmount > currentAmount)
      return interaction.reply(
        `Sorry ${interaction.user}, you only have ${currentAmount}.`
      );
    if (transferAmount <= 0)
      return interaction.reply(
        `Please enter an amount greater than zero, ${interaction.user}.`
      );

    currency.add(interaction.user.id, -transferAmount);
    currency.add(transferTarget.id, transferAmount);

    return interaction.reply(
      `Successfully transferred ${transferAmount}💰 to ${
        transferTarget.tag
      }. Your current balance is ${currency.getBalance(interaction.user.id)}💰`
    );
  },
};
