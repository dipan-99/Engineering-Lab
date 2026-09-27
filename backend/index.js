import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import cors from 'cors'
import productRoutes from "./routes/product.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";

dotenv.config()
const app = express()

const port = 8082
const allowedOrigins = [
    process.env.CLIENT_ORIGIN,
    "http://localhost:5173",
    "http://127.0.0.1:5173"
].filter(Boolean);

mongoose.connect(process.env.dbURL, {
    tlsAllowInvalidCertificates: true
}).then(() => {
    console.log('DB Connected')
}).catch((err) => {
    console.log(err)
})

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(cookieParser())




app.use('/customers', customerRoutes)
app.use("/products", productRoutes);
app.use("/wishlist", wishlistRoutes);




app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})
