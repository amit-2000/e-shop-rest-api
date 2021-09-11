const { findById, findByIdAndRemove, populate } = require("../models/category");
const Category = require("../models/category");
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");

//
module.exports.all = async (req, res) => {
  try {
    const orderList = await Order.find()
      // .populate("user", "name")
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          // populate: "category",
        },
      })

      .sort({ dateOrdered: -1 });
    if (orderList) {
      res.send(orderList);
    }
  } catch (error) {
    if (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

//
module.exports.getOneOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name");
    if (order) {
      res.send(order);
    } else {
      res.status(200).json("No order found");
    }
  } catch (error) {
    if (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

//
module.exports.postOrder = async (req, res) => {
  try {
    // var orderItemIdsResolve;
    // Promise.all takes iterable promise inputs and  "return a single promise".
    // that resolve to an array of the results of the input promises.

    const orderItemsIds = Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });

        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
      })
    );
    // long method
    // here orderItemsIds returning a promise. so we need to await or call .then()  to resolve ppromise.
    // const orderItemsIdsResolved = await orderItemsIds.then((items) => {
    //   return items;
    // });
    // short method
    const orderItemIdsResolved = await orderItemsIds;
    // console.log(orderItemIdsResolveed);
    const totalPrices = await Promise.all(
      orderItemIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          "product",
          "price"
        );

        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      })
    );
    const totPrice = totalPrices.reduce((prev, newVal) => {
      return prev + newVal;
    });
    // console.log(totPrice);

    let order = new Order({
      orderItems: orderItemIdsResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totPrice,
      user: req.body.user,
    });
    order = await order.save();

    if (!order) return res.status(400).send("the order cannot be created!");

    res.send(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// update status
module.exports.update_order_status = async (req, res) => {
  try {
    const id = req.params.id;
    // findByIdAndUpdate requies third option as {new :true} to get updated data.************
    const order = await Order.findByIdAndUpdate(
      id,
      {
        status: req.body.status,
      },
      { new: true }
    );
    if (!order) {
      res.status(404).json({ message: "No item present with this category" });
    }
    res.status(201).json(order);
  } catch (error) {
    console.log("Error While updating data", error);
    res.status(500).json({ message: error.message });
  }
  // res.status(201).json(order);
};

// Delete order
module.exports.delete_order = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    order.remove();
    order.orderItems.map(async (item) => {
      return await OrderItem.findByIdAndRemove(item);
    });
    return res.status(200).json({ message: "Deleted order and orderIted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.total_Sales = async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
    ]);
    if (!totalSales) {
      return res.status(400).send("Order sales can not be generated");
    }
    return res.status(200).send({ totalSales: totalSales.pop().totalSales });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Total count
module.exports.getCount = async (req, res) => {
  try {
    // const products = await Product.find().select("name image  price");
    const order_Count = await Order.countDocuments((count) => count);
    if (!order_Count) {
      res.status(500).json({ message: "no product count.." });
    }
    res.send({ total_order_count: order_Count });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
// users order.
module.exports.getUserOrders = async (req, res) => {
  try {
    const User_orderList = await Order.find({ user: req.params.userid })
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          // populate: "category",
        },
      })
      .sort({ dateOrdered: -1 });
    if (User_orderList) {
      res.send(User_orderList);
    }
  } catch (error) {
    if (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// module.exports.deleteOrder = async (req, res) => {
//   try {
//     await Order.findByIdAndRemove(req.params.id).then((order) => {
//       if (order) {
//         console.log("***********Deleted Order**********", order);
//         const orderItem = order.orderItems;
//         orderItem.map(async (id) => {
//           await OrderItem.findByIdAndRemove(id)
//             .then((item) => {
//               console.log(item);
//               return;
//             })
//             .then((res) => {
//               console.log("####### res ######", res);
//               return;
//             })
//             .catch((err) => {
//               console.log("$$$$$$$$$$ Error $$$$$$$$", err);
//             });
//         });
//         console.log(
//           "**********orderItem in order *********************",
//           orderItem
//         );
//         return res
//           .status(200)
//           .json({ success: true, message: "Order deleted successfully." });
//       } else {
//         return res.status(404).json({ message: "Order not found" });
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports.order_item = async (req, res) => {
//   console.log("helloo");
//   try {
//     const orderItems = await OrderItem.find();
//     res.status(200).json(orderItems);
//   } catch (error) {
//     return res.status(500).json({ error });
//   }
// };

// {
//     "orderItems" : [
//         {
//             "quantity": 3,
//             "product" : "611a39acf698c92e2cd963d6"
//         },
//         {
//             "quantity": 2,
//             "product" : "611ce3edfac05e1e4c8dd002"
//         }
//     ],
//     "shippingAddress1" : "Flowers Street , 45",
//     "shippingAddress2" : "1-B",
//     "city": "Prague",
//     "zip": "0085400",
//     "country": "Czech Republic",
//     "phone": "+545155454",
//     "user": "6127a2d2cf5bd63934bd47e8"
// }
