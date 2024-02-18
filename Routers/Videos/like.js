import express from "express";
import { Videos } from "../../Models/Video.js";
import { User } from "../../Models/User.js";
import { decodeJwtToken } from "../../service.js";

let router = express.Router();

//Add Liked Videos
router.put("/like-video", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let data = req.body.id;
    let userId = decodeJwtToken(token);

    let user = await User.findById({ _id: userId });
    //adding new videos to existing likes list
    let likedVideos = [...user.likedVideos];
    if(!likedVideos.includes(data)){
      likedVideos.push(data)
    }
    let addLikedVideos = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { likedVideos: likedVideos } }
    );

    if (!addLikedVideos)
      return res.status(400).json({ message: "Error Occured" });

    //Adding like to video
    let videoData = await Videos.findById({ _id: data });
    let likes = [...videoData.likes];
    if(!likes.includes(userId)){
      likes.push(userId)
    }
    let video = await Videos.findOneAndUpdate(
      { _id: data },
      { $set: { likes: likes } }
    );
    res.status(200).json({ message: "Video added to likedlist Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

//Get User Liked videos
router.get("/get-liked-videos", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);

    let Video = await Videos.find();
    let user = await User.findById({ _id: userId });
    //filter Favourites Profiles
    let likedVideos = Video.filter((val) => {
      if (user.likedVideos.includes(val._id)) {
        return val;
      }
    });
    for(var i = 0; i < likedVideos.length; i++) {
      let creator = likedVideos[i].creator;
      let user = await User.findById({ _id: creator });

      likedVideos[i]["channelName"] = user.channelName ? user.channelName:user.name
      likedVideos[i]["img"] = user.image;
    }
    res
      .status(200)
      .json({ message: "Liked Videos Got Successfully", likedVideos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

// UnLike video
router.put("/unlike-video", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let id = req.body.id;
    let userId = decodeJwtToken(token);

    let user = await User.findById({ _id: userId });
    //Remove video from likedVideos
    let likedVideos = user.likedVideos.filter((val) => {
      if (id !== val._id) {
        return val;
      }
    });
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { likedVideos: likedVideos } }
    );

    //Removing like from video
    let videoData = await Videos.findById({ _id: id });
    let likes = videoData.likes.filter((val) => {
      if (userId !== val._id) {
        return val;
      }
    });
    let video = await Videos.findOneAndUpdate(
      { _id: id },
      { $set: { likes: likes } }
    );
    res.status(200).json({ message: "UnLiked Video Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

export let likeRouter = router;
