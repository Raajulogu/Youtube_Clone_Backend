import express from "express";
import { User } from "../../Models/User.js";
import { decodeJwtToken } from "../../service.js";
import { Videos } from "../../Models/Video.js";

let router = express.Router();

//Get Channel
router.get("/get-channel/:id", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let id=req.params.id
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });
    if(!req.params.id){
       id = userId;
    }
    if (!user) {
      res.status(400).json({ message: "Invalid Authorization" });
    }
    let channel = await User.findById({ _id: id });
    let Video = await Videos.find({ channelName: channel.channelName });
    
    let isOwner= id === userId ? true : false;
    let result = {
      channel,
      Video,
      isOwner
    };

    res.status(200).json({ message: "Channel Got Successfully", result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

export let channelLater = router;
