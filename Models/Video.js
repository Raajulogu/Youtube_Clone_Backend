import mongoose from "mongoose";

let notesSchema = new mongoose.Schema({
  filename: {
    type: "string",
    required: true,
  },
  filePath: {
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
    required: true,
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