const Product = require("../models/product");
const mongoose = require("mongoose");
// get all  products.
const Category = require("../models/category");
const multer = require("multer");

// validate uploaded files
const FILE_TYPE_MAP = {
  // mime type
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValidId = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");
    if (isValidId) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const filename = file.originalname.replace(" ", "-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${filename}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });
module.exports = uploadOptions;
module.exports.all = async (req, res) => {
  try {
    // query parameters :
    // const products = await Product.find().select("name image  price");
    // const products = await Product.find().populate("category");
    // get category in object
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }
    const products = await Product.find().populate("category");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get only one product.

module.exports.getOne = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    res.status(200).json(product);
  } catch (error) {
    res.status.json({ message: error.message });
  }
};

module.exports.create = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "no file found in request" });
  }
  const filename = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${filename}`, //http://localhost:8000/public/uploads/filename-22375.jpeg
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  try {
    await product.save();
    console.log("productCreated ==>>", product);
    res.status(201).json(product);
  } catch (error) {
    console.log("Error While inserting data", error);
    res.status(500).json({ message: error.message });
  }
};

// ........................................................
// update product gallery
module.exports.updateGallery = async (req, res) => {
  try {
    // we can use request.file or files.

    const files = req.files;
    let imgPaths = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    if (files) {
      files.map((file) => {
        imgPaths.push(`${basePath}${file.filename}`);
      });
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imgPaths,
      },
      {
        new: true,
      }
    );
    if (!product) {
      return res.status(404).json({ message: "No product found " });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.prodByCategory = async (req, res) => {
  try {
    const product = await Product.find({ category: req.params.id });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// middleware to check whether category is presend or not.

module.exports.isCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.body.category);
  } catch (error) {
    console.log("category not found");
    res
      .status(500)
      .json({ message: "category not found...(this is middlware)" });
    return;
  }
  next();
};

// update Product.

module.exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    // findByIdAndUpdate requies third option as {new :true} to get updated data.************
    const product = await Product.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      },
      { new: true }
    );
    if (!product) {
      res.status(404).json({ message: "No item present " });
    }
    res.status(201).json(product);
  } catch (error) {
    console.log("Error While updating data", error);
    res.status(500).json({ message: error.message });
  }
  // res.status(201).json(product);
};

module.exports.isProduct = async (req, res, next) => {
  // check whether id is valid or not || below is return boolean val.
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(500).json({ message: "Enter valid id" });
  }
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(500).json({
        message: "product not found...(this is middlware) or null",
        product,
      });
    }
  } catch (error) {
    console.log("product not found");
    return res.status(500).json({
      message: "product not found...(this is middlware) or enter valid id ",
    });
  }
  next();
};

module.exports.deleteProduct = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(500).json({ message: "Enter valid id" });
  }

  try {
    await Product.findByIdAndRemove(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "item deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get count of all products.

module.exports.getCount = async (req, res) => {
  try {
    // const products = await Product.find().select("name image  price");
    const productCount = await Product.countDocuments((count) => count);
    if (!productCount) {
      res.status(500).json({ message: "no product count.." });
    }
    res.send({ total_product_count: productCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
module.exports.featured = async (req, res) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    // const products = await Product.find().select("name image  price");
    // by using  + in front of string it will convert it in to number.
    const products = await Product.find({ isFeatured: true }).limit(+count);
    if (!products) {
      res.status(500).json({ message: "no product count.." });
    }
    res.send(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// {
//         "richDescription": null,
//         "image": null,
//         "images": [],
//         "brand": null,
//         "price": 50,
//         "rating": null,
//         "numReviews": null,
//         "isFeatured": null,
//         "name": "product batate 3   ",
//         "countInStock": 12,
//         "category": "611ce3edfac05e1e4c8dd002",
//         },
//         "description": "product  available this is category 611ce3edfac05e1e4c8dd002",
//     }
