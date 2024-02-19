import express from "express";
import { User } from "../../Models/User.js";
import { decodeJwtToken } from "../../service.js";
import { Videos } from "../../Models/Video.js";

let router = express.Router();

router.put("/search-videos", async (req, res) => {
  try {   
    let videoData=await Videos.find();
    let text=req.body.text;
    let video=[];

    videoData.map((val)=>{
        if(val.title.includes(text) || text.includes(val.type)){
            video.push(val)
        }
    })

    res.status(200).json({ message: "Searched video got Successfully",video });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

export let searchRouter = router;
