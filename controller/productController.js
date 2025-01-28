const Product = require('../model/ProductModel');
const fs = require("fs");
const path = require("path");

// Helper function to get file paths
const getFilePath = (file) => (file ? file.path : null);


const createProduct = async (req, res) => {
  try {
    const { files } = req;
    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      categories: req.body.categories,
      sku: req.body.sku,
      heading: req.body.heading,
      subHeading: req.body.subHeading,
      oldPrice: req.body.oldPrice,
      size: req.body.size 
        ? Array.isArray(req.body.size) 
          ? req.body.size 
          : req.body.size.split(',').map((s) => s.trim()) 
        : [], // Default to an empty array
      color: req.body.color,
      gsm: req.body.gsm,
      fabric: req.body.fabric,
      tag: req.body.tag,
      image: getFilePath(files.image?.[0]),
      imageOne: getFilePath(files.imageOne?.[0]),
      imageTwo: getFilePath(files.imageTwo?.[0]),
      imageThree: getFilePath(files.imageThree?.[0]),
      imageFour: getFilePath(files.imageFour?.[0]),
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};






// Get All Products with Pagination, Sorting, and Filtering
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "heading", order = "asc", ...filters } = req.query;

    const filterCriteria = {};
    if (filters.name) filterCriteria.name = { $regex: filters.name, $options: "i" };
    if (filters.categories) filterCriteria.categories = { $in: filters.categories.split(",") };
    if (filters.minPrice || filters.maxPrice) {
      filterCriteria.price = {};
      if (filters.minPrice) filterCriteria.price.$gte = parseFloat(filters.minPrice);
      if (filters.maxPrice) filterCriteria.price.$lte = parseFloat(filters.maxPrice);
    }

    const totalProducts = await Product.countDocuments(filterCriteria);

    const products = await Product.find(filterCriteria)
      .sort({ [sort]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: parseInt(page),
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const { files } = req;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product fields
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.categories = req.body.categories || product.categories;

    // Replace existing files if new ones are uploaded
    if (files.image?.[0]) product.image = getFilePath(files.image[0]);
    if (files.imageOne?.[0]) product.imageOne = getFilePath(files.imageOne[0]);
    if (files.imageTwo?.[0]) product.imageTwo = getFilePath(files.imageTwo[0]);
    if (files.imageThree?.[0]) product.imageThree = getFilePath(files.imageThree[0]);
    if (files.imageFour?.[0]) product.imageFour = getFilePath(files.imageFour[0]);

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Array of image paths
    const imagePaths = [
      product.image,
      product.imageOne,
      product.imageTwo,
      product.imageThree,
      product.imageFour,
    ];

    // Delete associated image files if they exist
    for (const filePath of imagePaths) {
      if (filePath) {
        const fullPath = path.resolve(filePath); // Resolve to absolute path
        if (fs.existsSync(fullPath)) {
          try {
            await fs.promises.unlink(fullPath); // Asynchronously delete the file
            console.log(`Deleted file: ${fullPath}`);
          } catch (err) {
            console.error(`Failed to delete file: ${fullPath}`, err);
          }
        } else {
          console.log(`File not found: ${fullPath}`);
        }
      }
    }

    // Delete the product
    await Product.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Search Products



const SearchKeyword = async (req, res) => {
  try {
    const { keyword } = req.params;

    // Define the query with proper handling for string fields and arrays
    const result = await Product.find({
      $or: [
        { heading: { $regex: keyword, $options: "i" } }, // String field
        { subHeading: { $regex: keyword, $options: "i" } }, // String field
        { description: { $regex: keyword, $options: "i" } }, // String field
        { sku: { $regex: keyword, $options: "i" } }, // String field
        { categories: { $elemMatch: { $regex: keyword, $options: "i" } } }, 
      ],
    });

    res.status(200).send({
      success: true,
      message: "Search results",
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
};













module.exports = { createProduct, deleteProduct, getProductById, getProducts, updateProduct,SearchKeyword };
