const { SlashCommandBuilder } = require("@discordjs/builders");
const { Collection } = require("discord.js");
const { Users } = require("../dbObjects.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("View Inventory"),
  async execute(interaction) {
    //TODO: THIS IS THE WRONG USERNAME COMMAND
    const target = interaction.options.getUser("user") ?? interaction.user;
    const user = await Users.findOne({ where: { user_id: target.id } });
    const items = await user.getItems();

    if (!items.length) return interaction.reply(`${target.tag} has nothing!`);

    return interaction.reply(
      `${target.tag} currently has ${items
        .map((i) => `${i.amount} ${i.item.name}`)
        .join(", ")}`
    );
  },
};
