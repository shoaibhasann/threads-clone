import mongoose from "mongoose"

// function to connect with database
const connectDatabase = async () => {
    mongoose.set('strictQuery', true);
    try {
        const connecting = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database connected successfully to host: ${connecting.connection.host}`)
    } catch (error) {
        console.log(error);
    }
}

export default connectDatabase;