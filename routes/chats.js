const {
  testing,
  createChatRoom,
  allChats,
  getChatRoomMsgs,
  addMsgToChatRoom,
  deleteAllChatRooms,
  deleteAllChatRoomMsgs,
  getNameOfUser,
} = require("../controllers/chats");
const express = require("express");

const chatsRouter = express.Router();

chatsRouter
  .route("/")
  .get(testing)
  .post(createChatRoom)
  .delete(deleteAllChatRooms);

chatsRouter.route("/user/:id").get(allChats);

chatsRouter.route("/user/:id/getName").get(getNameOfUser);

chatsRouter
  .route("/chatRoom/:id")
  .get(getChatRoomMsgs)
  .post(addMsgToChatRoom)
  .delete(deleteAllChatRoomMsgs);

module.exports = chatsRouter;
