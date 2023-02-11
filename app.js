const express = require("express");
const app = express();
const cors = require("cors");

const errorMiddleware = require("./middlewares/error");

const test = require("./routes/test");
const categories = require("./routes/categories");
const workers = require("./routes/workers");
const client = require("./routes/client");
const posts = require("./routes/posts");
const notification = require("./routes/notification");
const chats = require("./routes/chats");
const admin = require("./routes/admin");

const connectToDB = require("./db/connect");
require("dotenv").config();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/v1/test", test);

// categories route
app.use("/api/v1/categories", categories);

// workers route
app.use("/api/v1/workers", workers);

// client route
app.use("/api/v1/client", client);

// all post route
app.use("/api/v1/posts", posts);

// notification route
app.use("/api/v1/notification", notification);

// router for chats
app.use("/api/v1/chats", chats);

// admin route
app.use("/api/v1/admin", admin);

const port_no = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectToDB(process.env.MONGO_URI);
    app.listen(port_no, () => {
      console.log(`listening on port ${port_no}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
app.use(errorMiddleware);
