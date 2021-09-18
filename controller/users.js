const { Router, response } = require("express");
const { findOne, count } = require("../models/user");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// get all users
module.exports.all = async (req, res) => {
  try {
    // const users = await User.find().select("-passwordHash");
    const users = await User.find()
    // const users = {};
    res.status(200).json(users);

    // return;
  } catch (error) {
    res.status.json({ message: error.message });
    // return;
  }
};

module.exports.userById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-passwordHash");
    if (!user) {
      res.status(404).json({ message: "No item present with this category" });
    }
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.register = async (req, res) => {
  try {
    let newPassword;
    if (req.body.passwordHash) {
      newPassword = bcrypt.hashSync(req.body.passwordHash, 10);
    }
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      passwordHash: newPassword,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });

    user = await user.save();

    if (user) {
      const secret = process.env.JWT_SECRET_KEY;
      const token = jwt.sign(
        {
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          isAdmin: user.isAdmin,
        },
        secret,
        {
          expiresIn: "1d",
        }
      );
      return res.status(200).json({
        user: user.name,
        token,
        message: " token contains user id, name, email, isAdmin",
      });
    }
    console.log("registered user ==>>", user);
    res.status(201).json(user);
  } catch (error) {
    console.log("Error While inserting data", error);
    res.status(500).json({ message: error.message });
  }
};

// post , login by email and password.
module.exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(400).json({ message: " user not found" });
    }
    if (user && bcrypt.compareSync(req.body.passwordHash, user.passwordHash)) {
      const secret = process.env.JWT_SECRET_KEY;
      const token = jwt.sign(
        {
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          isAdmin: user.isAdmin,
        },
        secret,
        {
          expiresIn: "2d",
        }
      );
      return res.status(200).json({ user: user.email, token });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, errorMsg: "error while finding user" });
  }
};

module.exports.getCountOfUsers = async (req, res) => {
  try {
    const count = await User.countDocuments((count) => count);
    if (count) {
      return res.status(200).json({ user_count: count });
    } else {
      return res.status(200).json({ message: "No user count" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// {
// "name" :"alexander ",
// "email":"amitperane@gmail".com",
// "phone":976765,
// "passwordHash":"aaaaaaaaaa",
// "isAdmin":"false",
// "street":"Lombard north Street",
// "apartment" : "A202",
// "zip":"12324",
// "city":"San Francisco ",
// "country":"america"
// }

//Admin

// _id
// :
// 6127a292a582125908375ff1
// isAdmin
// :
// true
// street
// :
// "Lombard Street"
// apartment
// :
// "A202"
// zip
// :
// "12324"
// city
// :
// "San Francisco "
// country
// :
// "america"
// name
// :
// "john samson"
// email
// :
// "john@69.com"
// phone
// :
// 5642548456
// passwordHash
// :
// "385jng@$("
// createdAt
// :
// 2021-08-26T14:17:54.047+00:00
// updatedAt
// :
// 2021-08-26T14:17:54.047+00:00
// __v
// :
// 0
