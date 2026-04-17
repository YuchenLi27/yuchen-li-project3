import words from "./words.js";

const capitalize = (value) => {
  if (!value || typeof value !== "string") {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
};

const getRandomWord = () => {
  const index = Math.floor(Math.random() * words.length);
  return words[index];
};

export const generateGameName = () => {
  const first = capitalize(getRandomWord());
  const second = capitalize(getRandomWord());
  const third = capitalize(getRandomWord());

  return `${first} ${second} ${third}`;
};