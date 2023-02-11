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

    const url =
      " https://www.fast2sms.com/dev/bulkV2?authorization=JCDv7FSl1P5IgxmAz0kfw64QRbVchT8OdUMetZ2YXKEHiWryGaNdhi0jmZU4QVLGtlsJWDr6eO7KuYHX&route=v3&sender_id=FTWSMS&message=" +
      title +
      "\n" +
      description +
      "&language=english&flash=0&numbers=" +
      worker.phone_no;

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
