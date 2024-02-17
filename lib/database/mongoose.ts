import mongoose, {Mongoose} from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;
{/*In Express Js  u connect to MongoDB once but in Next Js we call it on each and every server action.
Thats because Next Js runs in a serverless environment, Server less Functions are stateless hence startup
to handle a request and shut down right after, without maintaining a continuous connection to database
(Merits)This approach ensures that  each request is handled independently allowing for better scalability,
and reliability as there is no need to manage persistent connections across many instances */}
interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose

if(!cached) {
    cached = (global as any).mongoose = {
        conn: null,
        promise:null
    }
}

export const connectToDatabase = async () => {
    if(cached.conn) return cached.conn;

    if(!MONGODB_URL) throw new Error('MONGODB_URL is not defined');

    cached.promise = 
       cached.promise || 
       mongoose.connect(MONGODB_URL, {
        dbName: 'imaginify', 
        bufferCommands: false
    })
    cached.conn = await cached.promise;
    return cached.conn;
}