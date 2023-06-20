import jwt from "jsonwebtoken";

const generateToken = (id, expiryTime) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, { expiresIn: expiryTime });
};

export default generateToken;
