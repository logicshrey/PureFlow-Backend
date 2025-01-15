import mongoose from "mongoose"
import { DB_NAME }from '../constants.js'

const dbconnect =  async () => {

    try {
         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
         console.log("Mongo Db Connection Successful!");
    } catch (error) {
        console.log("Mongo Db Connection Error",error);
        process.exit(1)
    }

}

export { dbconnect }