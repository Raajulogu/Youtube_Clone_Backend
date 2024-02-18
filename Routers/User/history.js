import express from "express";
import { Videos } from "../../Models/Video.js";
import { User } from "../../Models/User.js";
import { decodeJwtToken } from "../../service.js";

let router = express.Router();

// Add videos to History
router.put("/add-history", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let data = req.body.id;
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });
    //adding new videos to existing history
    let history = [...user.history];
    if(history[history.length-1]!==data){
      history.push(data)
    }
    let addHistory = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { history: history } }
    );

    if (!addHistory) {
      return res.status(400).json({ messag: "error Occured" });
    }
    res.status(200).json({ message: "Video Added History Successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

// Videos remove to History
router.put("/remove-videos-history", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let id = req.body.id;
    let userId = decodeJwtToken(token);

    let user = await User.findById({ _id: userId });

    // Remove Video from History
    let history = user.history.filter((val) => {
      if (id !== val) {
        return val;
      }
    });
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { history: history } }
    );

    res.status(200).json({ messag: "Remove Video History Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

// Get history list
router.get("/get-history", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });

    let videoData = await Videos.find();

    let video = [];
    videoData.map((val) => {
      if (user.history.includes(val._id)) {
        video.push(val);
      }
    });
    for(var i = 0; i < video.length; i++) {
      let creator = video[i].creator;
      let user = await User.findById({ _id: creator });

      video[i]["channelName"] = user.channelName ? user.channelName:user.name
      video[i]["img"] = user.image;
    }
    res
      .status(200)
      .json({ messag: "History Video got Successfully", video });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

export let historyLater = router;
