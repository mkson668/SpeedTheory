const mongoose = require("mongoose");

// Documentation for creating schema https://mongoosejs.com/docs/api/schema.html
const CartSchema = new mongoose.Schema(
    {
        userId: 
        {
            type: String,
            required: true
        },
        // use array schema type https://mongoosejs.com/docs/schematypes.html#arrays
        products: 
        [
            {
                productId:
                {
                    type: String
                },
                quantity: 
                {
                    type: Number,
                    default: 1
                }
            }
        ]
    },
    {timestamps:true}
);

module.exports = mongoose.model("Cart", CartSchema);