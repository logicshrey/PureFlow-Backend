import mongoose, { Schema } from "mongoose";

const mongodbSchema = new Schema({
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
    ref: "User"
}   
},{ timestamps:true })

export const Mongodb = mongoose.model("Mongodb",mongodbSchema)