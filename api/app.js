import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import postRoute from "./routes/post.routes.js";
import authRoute from "./routes/auth.routes.js";
import testRoute from "./routes/test.routes.js";
import userRoute from "./routes/user.routes.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);
app.use("/api/users", userRoute);

app.listen(8800, () => {
  console.log("Server is running on port 8800");
});
