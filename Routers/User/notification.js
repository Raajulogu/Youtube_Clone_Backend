import express from "express";
import { User } from "../../Models/User.js";
import { decodeJwtToken } from "../../service.js";

let router = express.Router();

router.put("/update-notification", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);

    let user = await User.findById({ _id: userId });
    //Traverse the notifications array
    user.notifications.map((val) => {
      val.isViewed == true;
    });
    let notifications = [...user.notifications];
    //Update Notification
    let setNotifications = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { notifications: notifications } }
    );
    res.status(200).json({ message: "Notification Added Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

export let notificationRouter = router;
