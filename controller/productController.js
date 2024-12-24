const Product = require("../model/productModel"); // Example: Assuming a Mongoose model
const fs = require("fs");
const path = require("path");

// Helper function to get file paths
const getFilePath = (file) => (file ? file.path : null);


  const createProduct= async (req, res) => {
    try {
      const { files } = req;
      const productData = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        categories: req.body.categories,
        sku:req.body.sku,
        
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
      console.log(error)
      res.status(500).json({ message: error.message });
    }
  }

  // Get All Products
  const getProducts= async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get Product by ID
  const getProductById= async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update Product
  const updateProduct= async (req, res) => {
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
      product.category = req.body.category || product.category;

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
  }

  

  const deleteProduct= async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Delete associated image files if they exist
      [product.image, product.imageOne, product.imageTwo, product.imageThree, product.imageFour].forEach((filePath) => {
        if (filePath) {
          fs.unlink(path.resolve(filePath), (err) => {
            if (err) console.error(`Failed to delete file: ${filePath}`);
          });
        }
      });
  
      // Delete the product
      await Product.deleteOne({ _id: req.params.id }); // Use deleteOne instead of remove
  
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  


module.exports = {createProduct, deleteProduct, getProductById,getProducts ,updateProduct };
