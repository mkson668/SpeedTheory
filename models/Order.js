const mongoose = require("mongoose");

// Documentation for creating schema https://mongoosejs.com/docs/api/schema.html
const OrderSchema = new mongoose.Schema(
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
        ],
        amount: 
        {
            type: Number,
            required: true
        },
        // we use object because Stripe parses it as an object
        address: 
        {
            type: Object,
            required: yes
        },
        status: 
        {
            type: String,
            default: "pending"
        }
    },
    {timestamps:true}
);

module.exports = mongoose.model("Order", OrderSchema);