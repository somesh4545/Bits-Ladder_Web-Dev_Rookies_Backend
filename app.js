const express = require("express");
const app = express();

const errorMiddleware = require("./middlewares/error");

const test = require("./routes/test");
const categories = require("./routes/categories");
const workers = require("./routes/workers");
const client = require("./routes/client")
const posts = require("./routes/posts")
const admin = require("./routes/admin")

const connectToDB = require("./db/connect");
require("dotenv").config();

// middleware
app.use(express.json());

// routes
app.use("/api/v1/test", test);

// categories route
app.use("/api/v1/categories", categories);

// workers route
app.use("/api/v1/workers", workers);

// client route
app.use("/api/v1/client", client)

// all post route
app.use('/api/v1/posts', posts)

// admin route
app.use('/api/v1/admin', admin)

const start = async () => {
  try {
    await connectToDB(process.env.MONGO_URI);
    app.listen(5000, () => {
      console.log("listening on port " + 5000);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
app.use(errorMiddleware);
