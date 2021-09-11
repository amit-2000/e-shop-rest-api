const express = require("express");

const router = express.Router();
const categoryController = require("../controller/category_controller");
const { route } = require("./products");
router.get("/", categoryController.all);
router.get("/:id", categoryController.getCategoryById);
router.post("/", categoryController.create);
router.put("/:id", categoryController.updateCategory);
router.delete(
  "/:id",
  categoryController.isCategory,
  categoryController.deleteCategory
);
module.exports = router;