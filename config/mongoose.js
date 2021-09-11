const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost/ECOMERCE_REST_APIS_");
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    dbName: "E-shop",
  })
  .then(() => {
    console.log("Database connected successfully..");
  })
  .catch((error) => {
    console.log("Error while connecting to database...");
  });

const db = mongoose.connection;

// db.on("error", (err) => {
//   console.log("error while connecting to server...", err);
// });

// db.once("open", () => {
//   console.log("database connected successfully");
// });

module.exports = db;
