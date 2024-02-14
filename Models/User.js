import mongoose from "mongoose";
import jwt from "jsonwebtoken";

let userSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
    unique: true,
  },
  password: {
    type: "String",
    required: true,
  },
  image: {
    type: "string",
  },
  youtuber: {
    type: "boolean",
    default: false,
  },
  history: {
    type: "array",
    default: [],
  },
  videos: {
    type: "array",
    default: [],
  },
  subscribers: {
    type: "array",
    default: [],
  },
  subscribing: {
    type: "array",
    default: [],
  },
  channelName: {
    type: "string",
    unique: true,
  },
  likedVideos: {
    type: "array",
    default: [],
  },
  watchlater: {
    type: "array",
    default: [],
  },
  notifications: {
    type: "array",
    default: [],
  },
});

//Generate JWT token
let generateJwtToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY);
};

//Decode Jwt Token
const decodeJwtToken = (token) => {
  try {
    let decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded.id;
  } catch (error) {
    console.error("Error in Jwt Decoding", error);
    return null;
  }
};

let User = mongoose.model("User", userSchema);
export { User, generateJwtToken, decodeJwtToken };
