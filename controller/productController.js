const Product = require("../model/ProductModel");
const path = require("path");

// Create Product


const createProduct = async (req, res) => {
    try {
      const { heading,subsubHeading,oldPrice, size , color , gsm ,fabric,sku,description, price,categories,  } = req.body;
      const image = req.file; // Multer stores the file info in `req.file`
  
      if (!image) {
        return res.status(400).json({ message: 'Image file is required.' });
      }
  
      // Ensure the image path exists before accessing it
      const imagePath = image.path;
  
      // Create a new product
      const newProduct = new Product({
        heading,subsubHeading,oldPrice, size , color , gsm ,fabric,sku,description, price,categories,
        image: imagePath , 
    

      });
  
      await newProduct.save();
  
      res.status(201).json({
        message: 'Product created successfully',
        product: newProduct
      });
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: 'Error creating product', error });
    }
  };

  


// Get All Products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
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
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product", error: err.message });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to update product", error: err.message });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product", error: err.message });
  }
};

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };
