const express = require("express");
const router = express.Router();

const rainbowController = require("../controllers/rainbowController");

router.get("/createGuest", rainbowController.createGuestAccount);

module.exports = router;
