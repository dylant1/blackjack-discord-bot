const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
const { Collection, Formatters, MessageEmbed } = require("discord.js");
const currency = new Collection();
global.currentCards = [];
global.dealerCards = [];
global.currentPlayer = "";
global.currentValue = 0;
global.dealerValue = [];
const getValue = (arr) => {
  let sum = 0;
  for (const card of arr) {
    // console.log(card);
    sum += card[0];
  }
  return sum;
};
const dealCard = () => {
  const suits = ["Clubs", "Spades", "Hearts", "Diamonds"];
  const values = [
    // "Ace",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    // "Jack",
    // "Queen",
    // "King",
  ];
  //this is super scuffed rn change later

  const cardSuit = suits[Math.floor(Math.random() * suits.length)];
  const cardValue = values[Math.floor(Math.random() * values.length)];

  return [cardValue, cardSuit];
};

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
    let players = [];
    let numPlayers = 0;
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
          // initialize game
          console.log(dealCard());

          numPlayers = numPlayers + 1;
          // players.push(interaction.user.username);
          // console.log(interaction.user.username);
          currentPlayer = interaction.user.username;

          currentCards.push(dealCard());
          currentCards.push(dealCard());

          console.log(currentCards);
          currentValue = getValue(currentCards);

          const exampleEmbed = new MessageEmbed()
            .setColor("#0099ff")
            // .setTitle("Some title")
            // .setURL("https://discord.js.org/")
            .setAuthor({
              name: "Game Started",
              iconURL: "https://i.imgur.com/AfFp7pu.png",
              url: "https://discord.js.org",
            })
            // .setDescription("Some description here")
            // .setThumbnail("https://i.imgur.com/AfFp7pu.png")
            .addFields(
              // {
              //   name: `${numPlayers}/1`,
              //   value: `${interaction.user.username}`,
              // },
              {
                name: "Dealer's Cards",
                value: "getHand",
              },
              {
                name: "Your Cards",
                value: "getcards(",
              }
              // {
              //   name: "Inline field title",
              //   value: "Some value here",
              //   inline: true,
              // },
              // {
              //   name: "Inline field title",
              //   value: "Some value here",
              //   inline: true,
              // }
            )
            // .addField("Inline field title", "Some value here", true)
            // .setImage("https://i.imgur.com/AfFp7pu.png")
            // .setTimestamp()
            .setFooter({
              text: "Type /hit, /stand, /double, /split",
              iconURL: "https://i.imgur.com/AfFp7pu.png",
            });

          message.reply({ embeds: [exampleEmbed] });
          // message.reply(
          //   `Round initialized. Click the 🃏 reaction above to join in.`
          // );
          // console.log(collected);
        } else {
          message.reply("Getting Help");
        }
      })
      .catch((collected) => {
        message.reply("Reaction Error. You didn't react with anyting?");
      });
  },
};
