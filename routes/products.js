const express = require("express");
const multer = require("multer");
const router = express.Router();
const Product = require("../models/product");
const prodController = require("../controller/products");
const uploadOptions = require("../controller/products");
router.get("/", prodController.all);
// router.get("/:id", prodController.prodByCategory);
router.get("/:id", prodController.isProduct, prodController.getOne);
router.post(
  "/",
  uploadOptions.single("image"),
  prodController.isCategory,
  prodController.create
);
// update product gallery
router.put(
  "/gallery-img/:id",
  uploadOptions.array("images", 10),
  prodController.updateGallery
);
router.put(
  "/:id",
  prodController.isCategory,
  prodController.isProduct,
  prodController.updateProduct
);

// delete product
router.delete("/:id", prodController.isProduct, prodController.deleteProduct);
// get total count of product.
router.get("/get/count", prodController.getCount);
router.get("/get/featured/:count", prodController.featured);

module.exports = router;
