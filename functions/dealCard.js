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

  return [cardSuit, cardValue];
};

module.exports = function () {
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

  return [cardSuit, cardValue];
};
