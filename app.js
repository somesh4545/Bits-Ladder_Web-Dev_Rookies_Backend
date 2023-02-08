const express = require("express");
const app = express();
const test = require("./routes/test");
const connectToDB = require("./db/connect");
require("dotenv").config();

// middleware
app.use(express.json());

// routes
app.use("/api/v1/test", test);

const start = async () => {
  try {
    // await connectToDB(process.env.MONGO_URI);
    app.listen(5000, () => {
      console.log("listening on port " + 5000);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
