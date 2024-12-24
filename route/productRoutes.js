const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const upload = require("../middlewares/multer");

// Create Product
router.post('/', upload.single('image'), upload.single("imageOne"), 
upload.single("imageTwo"),
upload.single("imageThree"),
upload.single("imageFour"),
productController.createProduct)

// Get All Products
router.get("/", productController.getProducts);

// Get Product by ID
router.get("/:id", productController.getProductById);

// Update Product
router.put("/:id", upload.fields([
  { name: 'imageOne', maxCount: 1 },
  { name: 'imageTwo', maxCount: 1 },
  { name: 'imageThree', maxCount: 1 },
  { name: 'imageFour', maxCount: 1 }
]), productController.updateProduct);

// Delete Product
router.delete("/:id", productController.deleteProduct);

module.exports = router;
