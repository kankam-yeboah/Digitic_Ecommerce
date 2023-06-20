import mongoose from "mongoose";
import CustomError from "./customError.js";

export const validateMongodbID = (mongodbID) => {
  const isValid = mongoose.Types.ObjectId.isValid(mongodbID);
  if (!isValid) {
    throw new CustomError(`This request id is invalid or not Found`, 400);
  }
};
