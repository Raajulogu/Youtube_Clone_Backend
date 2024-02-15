import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dbConnection } from "./db.js";
import { authRouter } from "./Routers/User/auth.js";
import { likeRouter } from "./Routers/Videos/like.js";
import { subscribeRouter } from "./Routers/User/subscribe.js";
import { videoRouter } from "./Routers/Videos/video.js";
import { whatchLater } from "./Routers/User/watchlater.js";
import { historyLater } from "./Routers/User/history.js";
import { notificationRouter } from "./Routers/User/notification.js";
import { commentRouter } from "./Routers/Videos/comment.js";

//ENV Configuration
dotenv.config();

let app = express();
let PORT = process.env.PORT;

//Middlewares
app.use(express.json());
app.use(cors());

//DB Connection
dbConnection();

//routes
app.use("/api/auth", authRouter);
app.use("/api/subscribe", subscribeRouter);
app.use("/api/like", likeRouter);
app.use("/api/comment", commentRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/watchlater", whatchLater);
app.use("/api/history", historyLater);
app.use("/api/video", videoRouter);

//Server connection
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
