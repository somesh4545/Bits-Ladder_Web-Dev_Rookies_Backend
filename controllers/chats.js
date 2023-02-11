const chatRooms = require("../models/chatRooms");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

const Client = require("../models/client");
const Worker = require("../models/workers");

const testing = catchAsyncErrors(async (req, res) => {
  const chat_roms = await chatRooms.find({});
  res.status(200).json({ data: chat_roms });
});

const createChatRoom = catchAsyncErrors(async (req, res) => {
  const body = req.body;

  const check = await chatRooms.findOne({
    $and: [
      { users: { $elemMatch: { $eq: body.senderID } } },
      { users: { $elemMatch: { $eq: body.receiverID } } },
    ],
  });
  if (!check) {
    const data = {
      users: [body.senderID, body.receiverID],
      creator: body.senderID,
    };
    const chatRoom = await chatRooms.create(data);
    // const chatroom = await chatRooms.findById(chats._id).select("_id");
    return res
      .status(200)
      .json({ data: chatRoom, message: "newly created", success: true });
  }
  res
    .status(200)
    .json({ data: check, message: "already created", success: true });
});

// for the initital chat screen fetching all the chat users of the current user
const allChats = catchAsyncErrors(async (req, res) => {
  const { id: userID } = req.params;
  const { sort, fields } = req.query;

  let result = chatRooms.find({
    users: { $elemMatch: { $eq: userID } },
  });

  // sorting features
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  // selecting required fields
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  } else {
    let chats = await result;

    res.status(200).json({ data: chats, total: chats.length });
  }
});

const getChatRoomMsgs = catchAsyncErrors(async (req, res) => {
  const { id: chatRoomID } = req.params;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  var skip = (page - 1) * limit;

  const msgs = await chatRooms
    .findById(chatRoomID)
    .slice("chats", [skip, limit]);
  if (!msgs) {
    res
      .status(404)
      .json({ success: false, error: 404, msg: "No chat room with this id" });
  } else {
    res
      .status(200)
      .json({ success: true, data: msgs.chats, total: msgs.chats.length });
  }
});

const deleteAllChatRoomMsgs = catchAsyncErrors(async (req, res) => {
  const { id: chatRoomID } = req.params;
  const msgs = await chatRooms.findByIdAndUpdate(
    chatRoomID,
    {
      $set: { chats: [], lastMsg: null },
    },
    { new: true }
  );
  if (!msgs) {
    res
      .status(404)
      .json({ success: false, error: 404, msg: "No chat room with this id" });
  }
  res
    .status(200)
    .json({ success: true, message: msgs.chats, total: msgs.chats.length });
});

const addMsgToChatRoom = catchAsyncErrors(async (req, res) => {
  const { id: chatRoomID } = req.params;
  const { sender_id, msg } = req.body;
  if (sender_id == null || msg == null) {
    res.status(404).json({ error: 404, msg: "All fileds are required" });
  }
  req.body.time = Date.now();
  req.body = JSON.stringify(req.body);
  const msgs = await chatRooms
    .findByIdAndUpdate(chatRoomID, {
      $push: { chats: { $each: [req.body], $position: 0 } },
      lastMsg: req.body,
      lastMsgTime: Date.now(),
    })
    .select("_id");
  if (!msgs) {
    res.status(404).json({
      success: false,
      error: 404,
      message: "No chat room with this id",
    });
  }
  res.status(200).json({ success: true, message: "success", time: Date.now() });
});

const deleteAllChatRooms = catchAsyncErrors(async (req, res) => {
  await chatRooms.deleteMany({});
});

const getNameOfUser = catchAsyncErrors(async (req, res) => {
  const { id: userID } = req.params;

  const client = await Client.findOne({ _id: userID }).select("name _id");
  if (!client) {
    const worker = await Worker.findOne({ _id: userID }).select("name _id");
    if (!worker) {
      res.status(404).json({
        success: false,
        message: "No user found with this ID",
      });
    } else {
      res.status(200).json({ success: true, message: "success", data: worker });
    }
  } else {
    res.status(200).json({ success: true, message: "success", data: client });
  }
});

module.exports = {
  testing,
  createChatRoom,
  allChats,
  getChatRoomMsgs,
  addMsgToChatRoom,
  deleteAllChatRooms,
  deleteAllChatRoomMsgs,
  getNameOfUser,
};
