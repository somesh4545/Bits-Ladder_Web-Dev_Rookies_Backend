const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const Client = require('../models/client')
const Post = require("../models/post")

const registerClient = catchAsyncErrors(async (req, res, next) => {
    //client will register with only name, password and verified phone number
    const { name, phone, password } = req.body 

    // if(phone){
    //     return next(new ErrorHandler("Phone number already registered", 400));
    // }

    const client = await Client.create({
        name, 
        phone,
        password
    })
    res.status(201).json({ message: "user created successfully"})
});

const loginClient = catchAsyncErrors(async (req, res, next)=>{
    const {name, password} = req.body 

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

  res.status(200).json({message: "client logged in succefully"})
})

const createPost = catchAsyncErrors(async(req, res, next)=>{
  
  const {title, description, estimated_budget, owner, place
    ,lang
    ,lat} = req.body 
  const post = Post.create({title, description, estimated_budget, owner, place, lang, lat})
  if(post){
    res.status(201).json({ message: "post created successfully"})
  }
})



module.exports = {
    registerClient,
    loginClient,
    createPost
}
  

// isOpen false -> winner field will be filled -> pairing schema will create object

// responses 