import mongoose from 'mongoose';

export default  async () => {
    const url = `mongodb+srv://${process.env.MONGOOSE_ID}:${process.env.MONGOOSE_PASSWORD}@cluster0.ygxeoeu.mongodb.net/SocialMedia?retryWrites=true&w=majority`;
    try {
        await mongoose.connect(url)
        console.log(`mongodb connected ${mongoose.connection.host} : ${mongoose.connection.port}`)
    } catch (error) {
        console.log("connection error", error.message)
        process.exit(1);
    }

}