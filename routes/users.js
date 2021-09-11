const express = require("express");

const router = express.Router();
const userController = require("../controller/users");
router.get("/", userController.all);
router.post("/register", userController.register);
router.get("/:id", userController.userById);
router.post("/login", userController.login);
router.get("/get/count", userController.getCountOfUsers);
module.exports = router;
