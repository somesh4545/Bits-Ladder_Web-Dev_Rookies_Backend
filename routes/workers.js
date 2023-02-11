const express = require("express");
const {
  getWorkerExperiences,
  addWorkerExperience,
  removeWorkerExperience,
} = require("../controllers/worker/experience");
const {
  workerPostRecommendations,
} = require("../controllers/worker/postRecommendations");
const { updateWorkerRating } = require("../controllers/worker/rating");
const { updateWorkerSkills } = require("../controllers/worker/skills");
const {
  workerRegistration,
  workerLogin,
  updateWorker,
  getWorkerByID,
} = require("../controllers/worker/workers");

const router = express.Router();

// use this route to add new worker during registration process
router.route("/").post(workerRegistration);

// route to a
router.route("/login").post(workerLogin);

// route to get worker by id
// route to update certain details of the worker
router.route("/:id").get(getWorkerByID).patch(updateWorker);

// route for post(problems) recommendations
router.route("/:id/recommendations").get(workerPostRecommendations);

// route for adding getting and removing work experiences
router
  .route("/:id/experiences")
  .get(getWorkerExperiences)
  .post(addWorkerExperience)
  .delete(removeWorkerExperience);

// route for updating rating of worker
router.route("/:id/rating").patch(updateWorkerRating);

// route for adding deleting skills of the worker with single api
router.route("/:id/skills").patch(updateWorkerSkills);

module.exports = router;
