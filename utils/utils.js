const Notification = require("../models/notification");
const Worker = require("../models/workers");
const axios = require("axios");

async function sendNotification(
  title,
  description,
  userType,
  userID,
  sendSMS = false
) {
  await Notification.create({ title, description, userType, userID });

  if (sendSMS == true) {
    const worker = await Worker.findOne({ _id: userID }).select("phone_no");

    const url = "Your api url to send the sms";

    axios
      .get(url)
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = { sendNotification };
