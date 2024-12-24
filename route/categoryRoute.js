
const express = require("express")
const { categoryController, getCategoryById, getAllCategories, deleteCategory, updateCategory } = require("../controller/categoryController")


const router = express.Router()


router.post("/", categoryController)
router.put("/:id", updateCategory)
router.get("/:id", getCategoryById)
router.get("/", getAllCategories)
router.delete("/:id", deleteCategory)

module.exports = router