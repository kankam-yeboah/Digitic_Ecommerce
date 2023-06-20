import asyncHandler from "express-async-handler";
import * as productServices from "../services/productServices.js";
import slugify from "slugify";
import { validateMongodbID } from "../utils/validateMongodbID.js";
import CustomError from "../utils/customError.js";

export const createProduct = asyncHandler(async (req, res) => {
  if (req.body.title) req.body.slug = slugify(req.body.title, { lower: true });
  const productInstance = req.body;
  const newProduct = await productServices.createProductinDB(productInstance);
  res.status(201).json(newProduct);
});

export const getProduct = asyncHandler(async (req, res) => {
  const { productid } = req.params;
  validateMongodbID(productid);
  const foundProduct = await productServices.getProductinDB(productid);
  if (!foundProduct) throw new CustomError(`Product with id ${productid} does not exist`, 404);
  res.status(200).json(foundProduct);
});

export const getAllProduct = asyncHandler(async (req, res) => {
  const allProduct = await productServices.getAllProductinDB();
  res.status(200).json(allProduct);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { productid } = req.params;
  validateMongodbID(productid);
  if (req.body.title) {
    req.body.slug = slugify(req.body.title, { lower: true });
  }
  const updateInfo = req.body;
  const updatedProduct = await productServices.updateProductinDB(productid, updateInfo);
  if (!updatedProduct)
    throw new CustomError(
      `Update Product information request process terminated 
  ? request product ID ~ ${productid} not found.`,
      400
    );
  res.status(200).json(updatedProduct);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { productid } = req.params;
  validateMongodbID(productid);
  const deletedProduct = await productServices.deletedProductinDB(productid);
  if (!deletedProduct)
    throw new CustomError(
      `Delete Product request process terminated 
? request product ID ~ ${productid} not found.`,
      400
    );
  res.status(200).json(deletedProduct);
});
