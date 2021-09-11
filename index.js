const express = require("express");
const app = express();
require("dotenv").config();
const { config } = require("dotenv");
const cors = require("cors");
app.use(cors());
app.options("*"); // " * " => allowing all http  req from any other origin
const PORT = process.env.PORT || 8000;
const db = require("./config/mongoose"); // starting db.
const cool = require("cool-ascii-faces");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { authJWT } = require("./helper/jwt");
const { errorHandler } = require("./helper/error_handler");
//  ################### middlewares ##############################
// app.use(bodyParser.urlencoded()); // setting up body-parser middleware ??? for urlencoded only...
app.use(bodyParser.json()); // now it will understand json (which is parse from postman).
app.use(morgan("tiny")); //{ tiny => to display log request in  specific format.}
// app.use(authJWT());
app.use(errorHandler);
// static folder
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
//
//
// ############# routers ###########

const productsRouter = require("./routes/products");
const categoryRouter = require("./routes/categories");
const orderRouter = require("./routes/orders");
const userRouter = require("./routes/users");
app.get('/cool', (req, res) => res.send(cool()))
app.get("/", (req, res) => {
  res.send("this is home page");
});
const api = process.env.API_URL; //status : working //  env api // http://localhost:8000/api/v1
app.use(`${api}/products`, productsRouter);
app.use(`${api}/category`, categoryRouter);
app.use(`${api}/user`, userRouter);
app.use(`${api}/order`, orderRouter);
//

// console.log(api);

app.listen(PORT, (err) => {
  if (err) {
    console.log("Error");
    return;
  }
  console.log("Server is running on port ", PORT);
});
