// const Task = require("../models/task");

const getTest = async (req, res) => {
  try {
    res.status(200).json({ data: "backend running" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// const getTask = async (req, res) => {
//   try {
//     const { id: taskID } = req.params;
//     const task = await Task.findOne({ _id: taskID });
//     if (!task) {
//       return res.status(404).json({ error: `No task with id : ${taskID}` });
//     }
//     res.status(201).json({ task });
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// };

module.exports = {
  getTest,
};
