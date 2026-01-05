import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = async (rawPassword) => {
  return await bcrypt.hash(rawPassword, saltRounds);
};

export const comparePassword = async (inputPassword, hashPassword) => {
  return await bcrypt.compare(inputPassword, hashPassword);
};
