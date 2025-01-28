const express = require ('express')
const colors = require ('colors')
const morgan = require ('morgan')
const cors = require ('cors')
const dotenv = require ("dotenv")
const router = require('./route/userRoute.js')
const category = require('./route/categoryRoute.js')
const Product = require('./route/productRoutes.js')
const path = require('path');
const bodyParser = require('body-parser');
const connectDB = require('./config/db.js')


// rest object 
const app = express()





app.use(morgan("dev"))
app.use(cors())
// Increase the size limit to 50MB
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB()
//listen 
app.listen(PORT , () =>{
    console.log("Server Running".bgWhite)
})
