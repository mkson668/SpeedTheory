const mongoose = require("mongoose");

// Documentation for creating schema https://mongoosejs.com/docs/api/schema.html
const ProductSchema = new mongoose.Schema(
    {
        productId: 
        {
            type: String,
            required: true,
            unique: true, 
        },
        title: 
        {
            type: String, 
            required: true, 
            unique: true
        },
        description:
        {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        price: 
        {
            type: Number,
            required: true,
        },
        category: 
        {
            // possibility that item belongs to multiple categories
            type: Array,
        },
        color: 
        {
            type: String,
        }
    },
    {timestamps:true}
);

module.exports = mongoose.model("Product", ProductSchema);