const express = require("express");

const router = express.Router();
const emailController = require("../controller/email_controller");
router.get("/", emailController.getAllEmails);

module.exports = router;
