const express = require("express");
const router = express.Router();

const databaseController = require("../controllers/databaseController");

router.post("/getAgent", databaseController.getAgentID);

module.exports = router;
