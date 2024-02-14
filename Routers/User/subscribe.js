import express from "express";
import { User, decodeJwtToken } from "../../Models/User.js";

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
    let subscribing = [channelId, ...user.subscribing];
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { subscribing: subscribing } }
    );
    //Updating Subscriber in channel session
    let subscribers = [userId, ...channel.subscribers];
    await User.findOneAndUpdate(
      { _id: sender },
      { $set: { subscribers: subscribers } }
    );

    res.status(200).json({ message: "Subscribed Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
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
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get Subscribed Channles
router.get("/get-subscribes", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);

    let channels = await User.find({ youtuber: true });
    let user = await User.findById({ _id: userId });
    //filter Subscribed Channels
    let subscribes = channels.filter((val) => {
      if (user.subscribing.includes(val._id)) {
        return val;
      }
    });

    res.status(200).json({ message: "Subscribed Channels Got Successfully", subscribes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-subscribers", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);

    let users = await User.find();
    let channel = await User.findById({ _id: userId });
    //filter Subscribers Data
    let subscribers = users.filter((val) => {
      if (channel.subscribers.includes(val._id)) {
        return val;
      }
    });

    res.status(200).json({ message: "Subscribers Got Successfully", subscribers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export let subscribeRouter = router;
