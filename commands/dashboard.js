const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
const { Collection, Formatters } = require("discord.js");
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
    .setName("dashboard")
    .setDescription("Blackjack Dashboard"),
  async execute(interaction) {
    const message = await interaction.reply({
      content: "Blackjack Dashboard",
      fetchReply: true,
    });
    message
      .react("💰")
      .then(() => message.react("🃏"))
      .then(() => message.react("❓"));

    const filter = (reaction, user) => {
      return (
        ["💰", "🃏", "❓"].includes(reaction.emoji.name) &&
        user.id === interaction.user.id
      );
    };

    message
      .awaitReactions({ filter, max: 1, time: 60000, errors: ["time"] })
      .then((collected) => {
        const reaction = collected.first();

        if (reaction.emoji.name === "💰") {
          message.reply("Viewing balance");
        } else if (reaction.emoji.name === "🃏") {
          message.reply(
            "Round initialized. Click the 🃏 reaction above to join in."
          );
          console.log(collected);
        } else {
          message.reply("Getting Help");
        }
      })
      .catch((collected) => {
        message.reply("Reaction Error. You didn't react with anyting?");
      });
  },
};
