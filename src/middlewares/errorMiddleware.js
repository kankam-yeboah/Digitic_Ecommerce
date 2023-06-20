import CustomError from "../utils/customError.js";

export default (req, res, next) => {
  const err = new CustomError(`Can't find ${req.originalUrl} with method ${req.method} on the server`, 404);
  next(err);
};
