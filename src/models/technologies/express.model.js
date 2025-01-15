import mongoose, { Schema } from "mongoose";

const expressSchema = new Schema({
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

export const Express = mongoose.model("Express",expressSchema)