import mongoose, { Schema, model } from "mongoose";
import { hashPassword, comparePassword } from "../utils/passwordHash.js";

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, "Input field ~firstname is required"],
      min: [4, "Input field ~firstname must have at least 4 characters"],
      max: [250, "Input field ~firstname must have at most 250 characters"],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "Input field ~lastname is required"],
      min: [4, "Input field ~firstname must have at least 4 characters"],
      max: [250, "Input field ~firstname must have at most 250 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Input field ~email is required"],
      unique: true,
    },
    phonenumber: {
      type: String,
      required: [true, "Input field ~phonenumber is required"],
      unique: true,
    },
    role: {
      type: String,
      default: "user",
    },
    isblocked: {
      type: Boolean,
      default: false,
    },
    refreshtoken: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Input field ~password is required"],
    },
    cart: {
      type: Array,
      default: [],
    },
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  this.password = await hashPassword(this.password);
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const passwordToUpdate = this.getUpdate().password;
  passwordToUpdate ? (this.getUpdate().password = await hashPassword(passwordToUpdate)) : next();
});

userSchema.methods.isPasswordMatched = async function (plainPassword) {
  return await comparePassword(plainPassword, this.password);
};

export default model("users", userSchema);
