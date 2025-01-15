import { dbconnect } from "./db/index.js";
import { app } from "./app.js";
import dotenv from 'dotenv'

dotenv.config({
    path: "./.env"
})

dbconnect()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log(`Mongo Db error ${err}`);
})