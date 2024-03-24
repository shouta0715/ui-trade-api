import { Extension } from "@/types/extension";

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const symbols = "!@#$%^&*_-+=";

const char = alphabet + numbers + symbols;
const codeType = ["React", "Vue", "Angular", "HTML"];

export const randomNum = (min = 0, max = 1000) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomBool = () => {
  return Math.random() >= 0.5;
};

export const randomString = () => {
  const length = randomNum(5, 20);
  let result = "";

  Array.from({ length }).forEach(() => {
    result += char[randomNum(0, char.length - 1)];
  });

  return result;
};

export const randomExtension = (): Extension => {
  const exs: Extension[] = ["html", "css", "js", "ts", "tsx", "jsx"];

  return exs[randomNum(0, exs.length - 1)];
};

export const randomCodeType = () => {
  return codeType[randomNum(0, codeType.length - 1)];
};

export const randomCommand = () => {
  return `npm install ${randomString()}`;
};

export const randomEmail = () => {
  return `${randomString()}@${randomString()}.com`;
};
