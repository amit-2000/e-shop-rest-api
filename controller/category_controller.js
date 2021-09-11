const Category = require("../models/category");

module.exports.all = async (req, res) => {
  try {
    const categoryList = await Category.find();
    // categoryList.save();
    res.status(201).send(categoryList);
  } catch (error) {
    if (error) {
      res.status(500).json({ message: error.message });
      console.log("error while getting users...", error);
    }
  }
};

module.exports.getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ message: "No item present with this category" });
    }
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.create = async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      image: req.body.image,
      countInStock: req.body.count,
      icon: req.body.icon,
    });
    await category.save();
    console.log("productCreated ==>>", category);
    res.status(201).json(category);
  } catch (error) {
    console.log("Error While inserting data", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    // findByIdAndUpdate requies third option as {new :true} to get updated data.************
    const category = await Category.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
      },
      { new: true }
    );
    if (!category) {
      res.status(404).json({ message: "No item present with this category" });
    }
    res.status(201).json(category);
  } catch (error) {
    console.log("Error While updating data", error);
    res.status(500).json({ message: error.message });
  }
  res.status(201).json(category);
};

module.exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndRemove(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Category deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  return res.status(404).json({ message: "item not found" });
};

// middleware to check category is presend or not in our database.

module.exports.isCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
  } catch (error) {
    console.log("category not found");
    return res
      .status(500)
      .json({ message: "category not found...(this is middlware)" });
  }
  next();
};
