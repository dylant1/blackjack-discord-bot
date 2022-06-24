const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("beep").setDescription("Beep!"),
  async execute(interaction) {
    return interaction.reply("Boop!");
  },
};
