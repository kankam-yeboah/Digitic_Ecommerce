import * as userServices from "../services/userServices.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/secretToken.js";
import CustomError from "../utils/customError.js";
import jwt from "jsonwebtoken";
import { validateMongodbID } from "../utils/validateMongodbID.js";

//Create a new user account
export const createUser = asyncHandler(async (req, res) => {
  const _userInstance = req.body;
  const _email = req.body.email.toLowerCase();
  //Check if user account already exist
  const findUser = await userServices.findUserinDB({ email: _email });
  if (!findUser) {
    //Create new user in Database
    const newUser = await userServices.createUserinDB(_userInstance);
    const refreshToken = generateToken(newUser._id, "3d");
    const updatedUser = await userServices.updateUserinDB(newUser._id, { refreshtoken: refreshToken });
    if (!updatedUser) throw new CustomError("Token generation process terminated");
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.status(201).json({
      clientid: newUser._id,
      accesstoken: generateToken(newUser._id, "1d"),
    });
  } else {
    throw new CustomError("User Already Exist", 401);
  }
});

//Login into a user account
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await userServices.findUserinDB({ email });
  if (foundUser && (await foundUser.isPasswordMatched(password))) {
    const refreshToken = generateToken(foundUser._id, "3d");
    //Update client Information with new refresh token.
    await userServices.updateUserinDB(foundUser._id, { refreshtoken: refreshToken });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.status(200).json({
      clientid: foundUser._id,
      accesstoken: generateToken(foundUser._id, "1d"),
    });
  } else {
    throw new CustomError("Invalid Credentials", 401);
  }
});

//Logout a user from an account.
export const logoutUser = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  //New approach: use client id to clear the user refresh token if
  // this error below occurs and disable the access token due to empty refresh token.

  if (!refreshToken) throw new CustomError("No refresh token available to process", 401, { operation: "logout", process_code: "0001" });
  const user = await userServices.findUserinDB({ refreshtoken: refreshToken });
  if (!user) {
    res.clearCookie("refreshToken");
    return res.sendStatus(204);
  }
  await userServices.updateUserinDB(user._id, { refreshtoken: "" });
  res.clearCookie("refreshToken");
  res.sendStatus(204);
});

//Get user's information from DB
export const getUser = asyncHandler(async (req, res) => {
  const { clientid } = req.user;
  const user = await userServices.findUserinDBWithID(clientid);
  if (user) {
    res.status(200).json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phonenumber: user.phonenumber,
    });
  } else {
    throw new CustomError(
      `Can't process a get request with ${req.originalUrl} and method ${req.method}.
     Either account ${clientid} does not exist or a bad request from client`,
      401
    );
  }
});

//Get new access and refresh token for the user
export const handleRefreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  // check if there is no refresh token in cookie and it authenticity
  if (!refreshToken) throw new CustomError("Cookie Token Process Error // No refresh token in cookies received from client. ", 401);
  const user = await userServices.findUserinDB({ refreshtoken: refreshToken });
  if (!user) throw new CustomError("Refresh token does not exist ~ Error // resource not found");

  jwt.verify(refreshToken, process.env.TOKEN_KEY, (error, decoded) => {
    if (error || decoded.id !== user._id) throw new CustomError("Invalid refresh Token", 401);
    //Generate new access and refresh token for client response
    const refreshToken = generateToken(user._id, "3d");
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.status(200).json({
      accesstoken: generateToken(foundUser._id, "1d"),
    });
  });
});

//Update a user's information
export const updateUser = asyncHandler(async (req, res) => {
  const { clientid } = req.user;
  const updateInfo = req.body;

  //check if client request updateInfo object is empty
  if (Object.keys(updateInfo).length === 0) throw new CustomError("Update Information required for request process", 401);
  const updatedUser = await userServices.updateUserinDB(clientid, updateInfo);
  if (updatedUser) {
    res.status(200).json({
      status: "SUCCESS",
    });
  } else {
    throw new CustomError(
      `Can't process an update request with ${req.originalUrl} and method ${req.method}.
     Either account ${clientid} does not exist or a bad request from client`,
      401
    );
  }
});

//Delete a user account
export const deleteUser = asyncHandler(async (req, res) => {
  const { clientid } = req.user;
  const result = await userServices.deleteUserinDB(clientid);
  if (result) {
    res.status(200).json({
      status: "DELETED",
      message: `User ~account ${clientid} has been deleted successfully`,
    });
  } else {
    throw new CustomError(
      `Can't process delete request with ${req.originalUrl} and method ${req.method}.
     Either account ${clientid} does not exist or a bad request from client`,
      401
    );
  }
});

//ADMIN ROLES
//Get all users in database
export const getAllUsers = asyncHandler(async (req, res) => {
  const allUsers = await userServices.findAllUsersinDB();
  res.status(200).json({
    status: "SUCCESS",
    users: allUsers,
  });
});

//Block a user by admin
export const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);
  const updateInfo = { isblocked: true };
  const blocked = await userServices.updateUserinDB(id, updateInfo);
  if (blocked) {
    res.status(200).json({
      status: "SUCCESS",
      message: `User account ${id} has been blocked`,
    });
  } else {
    throw new Error("User block process terminated ~Error");
  }
});

//Unblock a user by admin
export const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);
  const updateInfo = { isblocked: false };
  const unblocked = await userServices.updateUserinDB(id, updateInfo);
  if (unblocked) {
    res.status(200).json({
      status: "SUCCESS",
      message: `User account ${id} has been unblocked`,
    });
  } else {
    throw new Error("User unblock process terminated ~Error");
  }
});
