const Category = require('../model/categoryModel');


const categoryController = async (req, res) => {
        try {
            const { name, description } = req.body;
            const category = new Category({ name, description });
            await category.save();
            res.status(201).json({ message: 'Category created successfully', category });
        } catch (error) {
            res.status(500).json({ error: 'Failed to create category', details: error.message });
        }
    }

   const getCategoryById= async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            if (!category) return res.status(404).json({ error: 'Category not found' });
            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch category', details: error.message });
        }
    }

    
   const  updateCategory = async (req, res) => {
        try {
            const { name, description } = req.body;
            const category = await Category.findByIdAndUpdate(
                req.params.id,
                { name, description },
                { new: true }
            );
            if (!category) return res.status(404).json({ error: 'Category not found' });
            res.status(200).json({ message: 'Category updated successfully', category });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update category', details: error.message });
        }
    }




const deleteCategory=async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category', details: error.message });
    }
}

const getAllCategories= async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
    }
}


module.exports = {categoryController, getAllCategories , deleteCategory , updateCategory, getCategoryById  };
