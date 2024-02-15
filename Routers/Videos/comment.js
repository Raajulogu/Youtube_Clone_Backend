import express from "express";
import { Videos } from "../../Models/Video.js";
import { User } from "../../Models/User.js";
import { getCurrentDate } from "../../service.js";

let router = express.Router();

//Add a Comment
router.put("/comment/:id", async (req, res) => {
  try {
    //Video ID
    let id = req.params.id;
    let comment = req.body.comment;
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);

    let user = await User.findById({ _id: userId });
    // Get current date
    let date = getCurrentDate();
    let video = await Videos.find({ _id: id });
    let comments = video[0].comments;
    let obj = {
      name: user.name,
      image: user.image,
      comment,
      date,
    };
    comments.push(obj);

    let addComment = await Videos.findOneAndUpdate(
      { _id: id },
      { $set: { comments: comments } }
    );
    if (!addComment) {
      return res.status(400).json({ message: "Error Occured" });
    }
    res.status(200).json({ message: "Comment Posted Sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

export let commentRouter = router;
