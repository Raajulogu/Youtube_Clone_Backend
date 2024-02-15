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
    let history = [data, ...user.history];
    let addHistory = await Videos.findOneAndUpdate(
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
      if (id !== val.id) {
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
export let historyLater = router;
