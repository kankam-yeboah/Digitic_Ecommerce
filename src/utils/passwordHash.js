import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = async (plainPassword) => {
  const hash = await bcrypt.hash(plainPassword, saltRounds);
  return hash;
};

export const comparePassword = async (plainPassword, hash) => {
  const result = await bcrypt.compare(plainPassword, hash);
  return result;
};
