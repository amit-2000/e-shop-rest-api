const User = require("../models/user");

module.exports.getAllEmails = async () => {
  try {
    const users = await User.find();
    const Newusers = Promise.all(
      users.map((user) => {
        let map_user = user;
        return map_user;
      })
    );
    const newUsers1 = await Newusers;
    // console.log(newUsers1);
    return newUsers1;
    // return res.status(200).json({users});
  } catch (error) {
    if (error) {
      console.log("Error while getting all the elements");
      console.log(error.message);
      return;
    }
  }
};
