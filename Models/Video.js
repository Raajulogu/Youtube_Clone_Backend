import mongoose from "mongoose";

let notesSchema = new mongoose.Schema({
  video: {
    type: "string",
    required: true,
  },
  title: {
    type: "string",
    required: true,
  },
  body: {
    type: "String",
    required: true,
  },
  likes: {
    type: "array",
    default: [],
  },
  views: {
    type: "number",
    default: 0,
  },
  comments:{
    type: "array",
    default: [],
  },
  date:{
    type: "string",
    required: true,
  },
  channelName:{
    type: "string",
  },
  creator:{
    type: "string",
    required: true,
  },
  type:{
    type: "string",
    required: true,
  }
});

let Videos = mongoose.model("Videos", notesSchema);
export { Videos };