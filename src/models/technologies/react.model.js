import mongoose, { Schema } from "mongoose";
import { User } from "../user.model.js";
import { Admin } from "../admin.model.js";

const reactSchema = new Schema({
topic: {
    type: String,
    required: true
},
tagline: {
    type: String,
    required: true
},
image: {
    type: String
},
brew_article:{
    type: String,
    required: true
},
common_id:{
    type: String
},
user_id:{
    type: Schema.Types.ObjectId,
    ref: "Admin"
} 
},{ timestamps:true })

export const React = mongoose.model("React",reactSchema)