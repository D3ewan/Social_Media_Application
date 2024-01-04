const mongoose=require('mongoose');

try{
    const connect=async ()=>{
        await mongoose.connect(process.env.link);
        console.log('MongoDB connected');
    }
    module.exports={connect};
}
catch(error){
    console.log(error);
}