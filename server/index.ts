import express from 'express';
import dotenv from 'dotenv';
import dbConnect from "./dbConnect";
import authRouter from "./routers/authRouter";
import postsRouter from "./routers/postsRouter";
import userRouter from "./routers/userRouter";
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import cors from 'cors'
import Cloudinary from 'cloudinary';
// cloudinary=cloudinary.v2();
const cloudinary = Cloudinary.v2;

dotenv.config({ path: "./.env" })

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

//middleware
app.use(express.json({ limit: '10mb' }));
app.use(morgan('common'));
app.use(cookieParser());

let origin = 'http://localhost:5173';
console.log("here env", process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
    origin = process.env.CORS_ORIGIN
}
app.use(cors({
    credentials: true,
    origin
}))

app.use('/auth', authRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);
app.get('/', (req, res) => {
    res.status(200).send("ok from server");
})

const PORT = process.env.PORT || 3000;
dbConnect()
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});