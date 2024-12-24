const mongoose = require("mongoose")



const productSchema = new mongoose.Schema({
  image: { type: String, required: true },
  imageOne: { type: String },
  imageTwo: { type: String },
  imageThree: { type: String },
  imageFour: { type: String },
  heading: { type: String },
  subHeading: { type: String },
  oldPrice: { type: Number },
  price: { type: Number, required: true },
  size: { type: String },
  color: { type: String },
  gsm: { type: String },
  fabric: { type: String },
  sku: { type: String, unique: true, sparse: true }, // Allows multiple null values
  categories: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  tag: { type: [String] },
  description: { type: String },
});





module.exports = mongoose.model("ProductCommerce", productSchema);
