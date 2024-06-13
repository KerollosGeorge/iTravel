import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import xss from "xss-clean";
//routes
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import hotelsRoute from "./routes/hotel.js";
import roomsRoute from "./routes/room.js";
import reviewRoute from "./routes/review.js";
import paymentRoute from "./routes/payment.js";

import { hotelsData } from "./Hotels_data.js";
import Hotel from "./models/Hotel.js";
import bodyParser from "body-parser";
import { upload } from "./utils/uploadImages.js";
// import { dirname } from "path";
// import { fileURLToPath } from "url";

// const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
dotenv.config();

//if database is disconnected
mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected.");
});

// middlewares
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "https//deploy-mern-1whq.vercel.app",
    ], // Specify an array of allowed origins
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
//control the limit of requests
/* app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, //15 min
    max: 100, //100 requset
  })
); */
app.use(xss());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//for test (upload images)
app.post("/api/uploads", upload, (req, res) => {
  const { files } = req;
  if (!files || files.length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      status: StatusCodes.BAD_REQUEST,
      message: "No files were uploaded.",
    });
  }
  const file = files[0];
  res.send({
    file: file.originalname,
    path: file.path,
  });
});

//routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/payment", paymentRoute);

//Public Images
app.use(express.static("public"));
// app.use(express.static("../client/build"));
app.get("/", (req, res) => {
  res.send("Welcome to iTravel apis");
  // res.sendFile(`${__dirname}/client/build/index.html`);
});

//error handler
app.use((err, req, res, next) => {
  const errorStatus = err.status || StatusCodes.INTERNAL_SERVER_ERROR; //500
  const errMessage =
    err.message || "Something went wrong, please try again later";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errMessage,
    stack: err.stack,
  });
});

const PORT = process.env.PORT || 8000;
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to mongoDB.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    /* Add data one time */
    // Hotel.insertMany(hotelsData);
    // Room.insertMany(roomsData);
  } catch (error) {
    console.log(error);
  }
};
start();
