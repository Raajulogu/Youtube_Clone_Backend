import express from "express";
import { Videos } from "../../Models/Video.js";
import { User } from "../../Models/User.js";
import multer from "multer";
import path from "path";
import {
  SendNotification,
  decodeJwtToken,
  getCurrentDate,
} from "../../service.js";

let router = express.Router();

//Multer setup for Video upload
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

let upload = multer({ storage: storage });

//Upload Video
router.post("/upload-video", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });

    let { title, body, type,video } = req.body;
    let creator = user._id;
    //Current Date
    let date = getCurrentDate();
    //Uploading video to Videos collection
    const uploadvideo = await new Videos({
      video,
      title,
      body,
      creator,
      type,
      date,
    }).save();

    //Update video to user's videos
    let videos = [uploadvideo._id, ...user.videos];
    let updateChannelVideos = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { videos: videos } }
    );

    //Send notification to subscribers
    //content for notification
    let content = {
      title,
      date,
      channelName: user.channelName ? user.channelName :user.name ,
      image: user.image,
      isViewed: false,
      id:user._id,
      video:uploadvideo._id
    };
    //Calling function for send notification
    user.subscribers.map((val) => {
      SendNotification({ id: val, content });
    });

    res.status(201).json({ message: "Video uploaded Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
});

//Update Views
router.put("/update-views", async (req, res) => {
  try {
    let id = req.body.id;
    let video = await Videos.findById({ _id: id });
    let views = video.views + 1;

    //Updating Views
    let updateViews = await Videos.findOneAndUpdate(
      { _id: id },
      { $set: { views: views } }
    );
    res.status(200).json({ message: "Views added Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

//Get All Videos
router.get("/get-videos", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);

    let user = await User.findById({ _id: userId });
    if (!user) {
      res.status(400).json({ message: "Invalid Authorization" });
    }
    let Video = await Videos.find();
    for(var i = 0; i < Video.length; i++) {
      let creator = Video[i].creator;
      let user = await User.findById({ _id: creator });

      Video[i]["channelName"] = user.channelName ? user.channelName:user.name
      Video[i]["img"] = user.image;
    }
    res.status(200).json({ message: "Videos Got Successfully", Video });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

//Get All Videos
router.get("/get-video-byId", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });

    if (!user) {
      res.status(400).json({ message: "Invalid Authorization" });
    }
    let Video = await Videos.find({ creator: userId });

    for(var i = 0; i < Video.length; i++) {
      let creator = Video[i].creator;
      let user = await User.findById({ _id: creator });

      Video[i]["channelName"] = user.channelName ? user.channelName:user.name
      Video[i]["img"] = user.image;
    }

    res.status(200).json({ message: "Video Got Successfully", Video });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

//Delete Video
router.delete("/delete-video/:id", async (req, res) => {
  try {
    let id = req.params.id;
    console.log(req.params)
    let user = await Videos.findByIdAndDelete({ _id: id });

    res.status(200).json({ message: "Video Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

export let videoRouter = router;
