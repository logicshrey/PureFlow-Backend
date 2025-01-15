import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
title: {
    type: String,
    required: true
},
quantity: {
    type: String,
    required: true
},
image: {
    type: String
},
type:{
    type: String,
    required: true
},
water_type:{
    type: String,
    required: true
},
name:{
    type: String,
    required: true
},
address:{
    type: String,
    required: true
},
email:{
    type: String,
    required: true
},
mobile:{
    type: String,
    required: true
},
common_id:{
    type: String
},
user_id:{
    type: Schema.Types.ObjectId,
    ref: "User"
}   
},{ timestamps:true })

export const Order = mongoose.model("Order",orderSchema)