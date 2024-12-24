const express = require ('express')
const colors = require ('colors')
const morgan = require ('morgan')
const cors = require ('cors')
const dotenv = require ("dotenv")
const ConnectDB = require ('./config/db.js')
const router = require('./route/userRoute.js')
const category = require('./route/categoryRoute.js')
const Product = require('./route/productRoutes.js')



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


app.use("/api/auth", router)
app.use("/api/category", category)
app.use("/api/product", Product)
ConnectDB()
//listen 
app.listen(PORT , () =>{
    console.log("Server Running".bgWhite)
})
