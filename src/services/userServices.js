import userModel from "../models/Users.js";

export const findUserinDB = async (userInfo) => {
  try {
    return await userModel.findOne(userInfo);
  } catch (error) {
    throw new Error(error);
  }
};

//Return all users in the database
export const findAllUsersinDB = async () => {
  try {
    return await userModel.find();
  } catch (error) {
    throw new Error(error);
  }
};

export const findUserinDBWithID = async (id) => {
  try {
    return await userModel.findById(id);
  } catch (error) {
    throw new Error(error);
  }
};

export const createUserinDB = async (_userInstance) => {
  try {
    return await userModel.create(_userInstance);
  } catch (error) {
    throw new Error(error);
  }
};

export const updateUserinDB = async (id, updateInfo) => {
  try {
    return await userModel.findByIdAndUpdate(
      id,
      {
        firstname: updateInfo?.firstname,
        lastname: updateInfo?.lastname,
        email: updateInfo?.email?.toLowerCase(),
        phonenumber: updateInfo?.phonenumber,
        refreshtoken: updateInfo?.refreshtoken,
        password: updateInfo?.password,
        isblocked: updateInfo?.isblocked,
      },
      {
        new: true,
      }
    );
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteUserinDB = async (id) => {
  try {
    return await userModel.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(error);
  }
};
