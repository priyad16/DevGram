const mongoose = require("mongoose");
const validator = require("validator");
const userschema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,

      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Not a strong password" + value);
        }
      },
    },
     age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      required: true,

      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender is not valid");
        }
      },
    },
    bio: {
      type: String,
      default: "this is a default bio",
    },
    avatar: {
      type: String,
      default:
        "https://aui.atlassian.com/aui/latest/docs/images/avatar-person.svg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Avatar URL: " + value);
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);
const usermodel=mongoose.model("user",userschema);
module.exports=usermodel;
