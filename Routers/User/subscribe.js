import express from "express";
import { User } from "../../Models/User.js";
import { decodeJwtToken } from "../../service.js";
import { Videos } from "../../Models/Video.js";

let router = express.Router();

// Subscribe Channel
router.put("/subscribe-channel", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let channelId = req.body.id;
    let userId = decodeJwtToken(token);
    //User Data
    let user = await User.findById({ _id: userId });
    //Channel Data
    let channel = await User.findById({ _id: channelId });

    //Updating Channel in user session
    let subscribing = [...user.subscribing];
    if (!subscribing.includes(channelId)) {
      subscribing.push(channelId);
    }
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { subscribing: subscribing } }
    );
    //Updating Subscriber in channel session
    let subscribers = [...channel.subscribers];
    if (!subscribers.includes(userId)) {
      subscribers.push(userId);
    }
    await User.findOneAndUpdate(
      { _id: channelId },
      { $set: { subscribers: subscribers } }
    );

    res.status(200).json({ message: "Subscribed Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

//UnSubscribe Channel
router.put("/unsubscribe-channel", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let channelId = req.body.id;
    let userId = decodeJwtToken(token);

    //User Data
    let user = await User.findById({ _id: userId });
    //Channel Data
    let channel = await User.findById({ _id: channelId });

    //Updating Channel in user session
    let subscribing = user.subscribing.filter((val) => {
      if (channelId !== val._id) {
        return val;
      }
    });
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { subscribing: subscribing } }
    );
    //Updating Subscriber in channel session
    let subscribers = channel.subscribers.filter((val) => {
      if (userId !== val._id) {
        return val;
      }
    });
    await User.findOneAndUpdate(
      { _id: sender },
      { $set: { subscribers: subscribers } }
    );

    res.status(200).json({ message: "UnSubscribed Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

//Get Subscribed Channles
router.get("/get-subscribes", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);

    let videos = await Videos.find();
    let user = await User.findById({ _id: userId });
    //filter Subscribed Channels
    let subscribes = videos.filter((val) => {
      if (user.subscribing.includes(val.creator)) {
        return val;
      }
    });
    for (var i = 0; i < subscribes.length; i++) {
      let creator = subscribes[i].creator;
      let user = await User.findById({ _id: creator });

      subscribes[i]["channelName"] = user.channelName
        ? user.channelName
        : user.name;
      subscribes[i]["img"] = user.image;
    }
    res
      .status(200)
      .json({ message: "Subscribed Channels Got Successfully", subscribes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

router.get("/get-subscribers/:id", async (req, res) => {
  try {
    let id = req.params.id;

    let channel = await User.findById({ _id: id });
    let subscribers =
      channel && channel.subscribers ? channel.subscribers.length : 0;
    res
      .status(200)
      .json({ message: "Subscribers Got Successfully", subscribers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

export let subscribeRouter = router;
