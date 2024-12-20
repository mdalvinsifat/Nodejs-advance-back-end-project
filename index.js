import express from 'express'
import colors from 'colors'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from "dotenv"
import ConnectDB from './config/db.js'


// rest object 
const app = express()



//middlewares 
app.use(express.json())
app.use(morgan("dev"))
app.use(cors())

//route
app.get("/", (req, res) =>{

   return res.status(200).send("<h1>Well Come to Node Function E-commerce </h1>")
})

//port
const PORT = process.env.PORT || 8080 
dotenv.config();

ConnectDB()
//listen 
app.listen(PORT , () =>{
    console.log("Server Running".bgWhite)
})
