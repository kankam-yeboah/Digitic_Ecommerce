import productModel from "../models/Products.js";

export const createProductinDB = async (productInstance) => {
  try {
    return await productModel.create(productInstance);
  } catch (error) {
    throw new Error(error);
  }
};

export const getProductinDB = async (productid) => {
  try {
    return await productModel.findById(productid);
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllProductinDB = async () => {
  try {
    return await productModel.find();
  } catch (error) {
    throw new Error(error);
  }
};

export const updateProductinDB = async (id, updateInfo) => {
  try {
    return await productModel.findByIdAndUpdate(id, updateInfo, {
      new: true,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const deletedProductinDB = async (id) => {
  try {
    return await productModel.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(error);
  }
};
