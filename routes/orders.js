const express = require("express");

const router = express.Router();
const orderController = require("../controller/order");
router.get("/", orderController.all);
router.post("/", orderController.postOrder);
router.get("/:id", orderController.getOneOrder);
router.put("/:id", orderController.update_order_status);
router.delete("/:id", orderController.delete_order);
// router.get("/orderItems", orderController.order_item);
router.get("/get/totalsales", orderController.total_Sales);
router.get("/get/count", orderController.getCount);
router.get("/get/userorders/:userid", orderController.getUserOrders);
module.exports = router;
