import express from "express";
import { Videos } from "../../Models/Video.js";
import { User } from "../../Models/User.js";
import { decodeJwtToken } from "../../service.js";

let router = express.Router();

// Add watchlater videos
router.put("/add-watchlater", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let data = req.body.id;
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });
    //adding new videos to existing watched list
    let watchlater = [...user.watchlater];
    if(!watchlater.includes(data)){
      watchlater.push(data)
    }
    let addWacheLaterVideos = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { watchlater: watchlater } }
    );

    if (!addWacheLaterVideos) {
      return res.status(400).json({ messag: "error Occured" });
    }
    res
      .status(200)
      .json({ message: "Video Added WatchLater list Successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

// Videos remove to watch later list
router.put("/remove-watchlater", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let id = req.body.id;
    let userId = decodeJwtToken(token);

    let user = await User.findById({ _id: userId });

    // Remove Video from watched list
    let watchlater = user.watchlater.filter((val) => {
      if (id !== val) {
        return val;
      }
    });
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { watchlater: watchlater } }
    );

    res.status(200).json({ messag: "Remove Watchlater Video Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

// Get watch later list
router.get("/get-watchlater", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });

    let videoData = await Videos.find();

    let video = [];
    videoData.map((val) => {
      if (user.watchlater.includes(val._id)) {
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
      .json({ messag: "Watchlater Video got Successfully", video });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});
export let whatchLater = router;
