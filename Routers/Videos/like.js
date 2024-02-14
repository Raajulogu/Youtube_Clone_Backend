import express from "express";
import {  Videos } from "../../Models/Video.js";
import { User, decodeJwtToken } from "../../Models/User.js";

let router = express.Router();

//Add Liked Videos
router.put("/like", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let data = req.body.id;
    let userId = decodeJwtToken(token);

    let user = await User.findById({ _id: userId });
    //adding new videos to existing likes list
    let likedVideos = [data, ...user.likedVideos];
    let addLikedVideos = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { likedVideos: likedVideos } }
    );

    if (!addLikedVideos)
      return res.status(400).json({ message: "Error Occured" });

    res.status(200).json({ message: "Video added to likedlist Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get User Liked videos
router.get("/get-likes", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);

    let Videos = await Videos.find();
    let user = await User.findById({ _id: userId });
    //filter Favourites Profiles
    let likedVideos = Videos.filter((val) => {
      if (user.likedVideos.includes(val._id)) {
        return val;
      }
    });

    res
      .status(200)
      .json({ message: "Liked Videos Got Successfully", likedVideos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// UnLike video
router.put("/unlike", async (req, res) => {
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

    res.status(200).json({ message: "UnLiked Video Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export let likeRouter = router;