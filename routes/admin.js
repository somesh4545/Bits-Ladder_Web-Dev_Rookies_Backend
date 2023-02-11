const express = require("express");
const { getAllWorkers, getAllClients, getStats, blackListClient, blackListWorker, verifyWorker, getAllPairs } = require("../controllers/admin");

const router = express.Router();

router.route("/workers").get(getAllWorkers);
router.route("/worker/:id").patch(blackListWorker)
router.route("/worker/verification/:id").patch(verifyWorker)
router.route("/clients").get(getAllClients);
router.route("/client/:id").patch(blackListClient)
router.route("/stats").get(getStats)

router.route("/pairing").get(getAllPairs)

module.exports = router;