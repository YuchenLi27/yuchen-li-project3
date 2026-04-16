const words = [
  "Coconut", "Red", "House", "Ocean", "Tiger", "Cloud", "River", "Forest",
  "Moon", "Stone", "Silver", "Golden", "Piano", "Dream", "Sunny", "Maple",
  "Falcon", "Amber", "Velvet", "Winter", "Summer", "Cherry", "Shadow", "Crystal",
  "Garden", "Comet", "Snow", "Lotus", "Flame", "Breeze", "Lemon", "Cedar",
  "Star", "Pearl", "Willow", "Meadow", "Dawn", "Coral", "Echo", "Bloom",
  "Thunder", "Whisper", "Aurora", "Marble", "Clover", "Sparrow", "Ivory", "Honey",
  "Mist", "Lantern", "Harbor", "Quartz", "Glacier", "Feather", "Prairie", "Frost"
];

export const generateGameName = () => {
  const pick = () => words[Math.floor(Math.random() * words.length)];
  return `${pick()} ${pick()} ${pick()}`;
};