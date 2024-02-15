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
    let watchlater = [data, ...user.watchlater];
    let addWacheLaterVideos = await Videos.findOneAndUpdate(
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
      if (id !== val.id) {
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
export let whatchLater = router;
