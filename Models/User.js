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
  avatar:{
    type: "string",
  }
});

let User = mongoose.model("User", userSchema);
export { User };
