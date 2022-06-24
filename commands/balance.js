const { SlashCommandBuilder } = require("@discordjs/builders");
const { Collection } = require("discord.js");
const { Users} = require("../dbObjects.js");

const currency = new Collection();
console.log(currency);
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
    .setName("balance")
    .setDescription("View Balance!"),
  async execute(interaction) {
    const storedBalances = await Users.findAll();
    storedBalances.forEach((b) => currency.set(b.user_id, b));
    const target = interaction.options.getUser("user") ?? interaction.user;

    return interaction.reply(
      `${target.tag} has ${currency.getBalance(target.id)}💰`
    );
  },
};
