import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(express.urlencoded({
    limit:"16kb"
}))

var corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions))

app.use(express.json({
    limit:"16kb"
}))

app.use(cookieParser())

app.use(express.static("public"))

// Routes

import userRouter from "./routes/user.routes.js"
import threadRouter from "./routes/thread.routes.js"
import adminRouter from "./routes/admin.routes.js"


app.use("/api/v1/users", userRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/threads", threadRouter)


export { app }