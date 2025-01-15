import mongoose, { Schema } from "mongoose";

const nodeSchema = new Schema({
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

export const Node = mongoose.model("Node",nodeSchema)