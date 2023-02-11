const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const Client = require("../models/client");
const Post = require("../models/post");
const Pairing = require("../models/pairing")
const { default: mongoose } = require("mongoose");

const registerClient = catchAsyncErrors(async (req, res, next) => {
  //client will register with only name, password and verified phone number
  const { name, phone, password } = req.body;

  // if(phone){
  //     return next(new ErrorHandler("Phone number already registered", 400));
  // }

  const client = await Client.create({
    name,
    phone,
    password,
  });
  res.status(201).json({ message: "user created successfully" });
});

const loginClient = catchAsyncErrors(async (req, res, next) => {
  const { name, password } = req.body;

  // checking if user has given password and email both

  if (!name || !password) {
    return next(new ErrorHandler("Please Enter name & Password", 400));
  }

  const client = await Client.findOne({ name }).select("+password");

  if (!client) {
    return next(new ErrorHandler("Invalid name or password", 401));
  }

  const pswd = await client.password;

  if (pswd !== password) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  res.status(200).json({ message: "client logged in succefully" });
});

const createPost = catchAsyncErrors(async (req, res, next) => {
  const { title, description, estimated_budget, owner, location } = req.body;
  if (!location) {
    return next(new ErrorHandler("Location property is required", 400));
  }
  const post = await Post.create({
    title,
    description,
    estimated_budget,
    owner,
    place: location.place,
    lang: location.lang,
    lat: location.lat,
  });
  if (!post) {
    return next(new ErrorHandler("Error while creating post", 500));
  }
  res.status(201).json({ message: "Post created succesfully" });
});

const getAllPosts = catchAsyncErrors(async (req, res, next) => {
  const posts = await Post.find();
  res.status(200).json(posts);
});

const getClientPost = catchAsyncErrors(async (req, res, next) => {
  const { id: owner_id } = req.params;
  const own_id = mongoose.Types.ObjectId(owner_id.trim());
  const post = await Post.find({ owner: own_id });
  console.log(post);
  if (!post) {
    return next(new ErrorHandler("Post with given ID not found", 404));
  }
  res.status(200).json({ data: post, success: true });
});

const updatePost = catchAsyncErrors(async (req, res, next) => {
  // post will have winner and it will be closed
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ success: false, message: `No post with id: ${id}` });

  const { isOpen, winner, owner_id } = req.body;

  const post = await Post.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: {
        winner: winner,
        isOpen: false,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if(!post){
    return next(ErrorHandler("Invalid id for post", 400)) 
  }
  await Pairing.create({
    owner: owner_id,
    worker: winner.worker,
    post: id
  })

  res.status(200).json({success: true, message: "Winner has been added"})
  
});

const addResponse = catchAsyncErrors((req, res, next) => {
  res.status(200).send("added response");
});
module.exports = {
  registerClient,
  loginClient,
  createPost,
  getAllPosts,
  getClientPost,
  updatePost,
};

// isOpen false -> winner field will be filled -> pairing schema will create object

// responses
