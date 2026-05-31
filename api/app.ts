import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "node:http";
import postRoute from "./routes/post.routes.js";
import authRoute from "./routes/auth.routes.js";
import testRoute from "./routes/test.routes.js";
import userRoute from "./routes/user.routes.js";
import chatRoute from "./routes/chat.routes.js";
import messageRoute from "./routes/message.routes.js";
import { setupSocket } from "./lib/socket.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Real Estate API is running!" });
});

app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

const httpServer = http.createServer(app);

if (process.env.NODE_ENV !== "test") {
  setupSocket(httpServer);
  httpServer.listen(8800, () => {
    console.log("Server is running on port 8800");
  });
}

export default app;
