const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const app = express();
const recommendationRoutes = require("./router/recommendationRoutes");
dotenv.config();

app.use(morgan("tiny"));
app.use(
  cors({
    origin: [
      "*",
      "http://localhost:5173",
      "https://localhost:5173",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
  })
);
app.use(bodyParser.json());

//Routes
// /api/recommendation/
app.use("/api/recommendation", recommendationRoutes);
// app.use("/api/auth", require("./router/authRoutes");
//End of Routes

//error handling
app.use((error, req, res, next) => {
  try {
    console.log(error);
    if (res.headerSent) {
      return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occured!" });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message || "An unknown error occured!" });
  }
});

//DB connection
// mongoose
//   .connect(
//     `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
//   )
//   .then(() => {
//     console.log("Connected with mongoDB");
//     // app.listen(process.env.PORT || 5001);
//     app.listen(process.env.PORT || 5002);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
app.listen(process.env.PORT || 5001, () => {
  console.log("Listening");
});
