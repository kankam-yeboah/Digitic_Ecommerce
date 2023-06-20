import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import CustomError from "../utils/customError.js";
import { findUserinDBWithID } from "../services/userServices.js";

export const authenticationMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  //populate client request object user
  req.user = {};
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      if (!decoded) throw new CustomError("Process terminated ~ Error defined trying to process the access token", 401);
      req.user.clientid = decoded?.id;
      next();
    } catch (error) {
      throw new CustomError(error.message, 401);
    }
  } else {
    throw new CustomError("There is no token attached to the header of the request", 401);
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  const { role } = await findUserinDBWithID(req.user.clientid);
  if (role !== "admin") {
    throw new CustomError("Request process terminated ~unauthorized client ? requires administrative access.", 403);
  } else {
    next();
  }
});
