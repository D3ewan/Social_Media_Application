require('dotenv').config({path:'./.env'});
const express=require('express');
const app=express();
const mainRouter=require('./routes/index');
const dbConnect=require('./dbController');
const cookieParser=require('cookie-parser');

//middlewares
app.use(express.json());
app.use(cookieParser());

// app.use((req,res,next)=>{
//     console.log(req.body);
//     next();
// });

//mainRouter
app.use('/api',mainRouter);


//database connection 
dbConnect.connect();

const PORT=process.env.PORT;

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})