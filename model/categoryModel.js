const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Path `name` is required.'], // This triggers the error
    },
    description: {
        type: String,
        default: '',
    },
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
