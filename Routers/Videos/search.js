import express from "express";
import { Videos } from "../../Models/Video.js";

let router = express.Router();

router.put("/search-videos", async (req, res) => {
  try {   
    let videoData=await Videos.find();
    let text=req.body.text;
    let video=[];
    console.log(text)
    videoData.map((val)=>{
        if(val.title.toLowerCase().includes(text.toLowerCase()) || text.toLowerCase().includes(val.type.toLowerCase())){
            video.push(val)
        }
    })
    console.log(video)

    res.status(200).json({ message: "Searched video got Successfully",video });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

export let searchRouter = router;
