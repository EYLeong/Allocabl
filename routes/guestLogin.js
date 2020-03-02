const express = require("express");
const router = express.Router();

const glCtrl = require("../controllers/guestLoginController");

router.get("/", glCtrl.createGuestAccount);

module.exports = router;