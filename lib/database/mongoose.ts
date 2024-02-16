import mongoose, {Mongoose} from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;
// In Express Js  u connect to MongoDB once but in Next Js we call it on each and every server action.
// Thats because Next Js runs in a serverless environment, Server less Functions are stateless hence startup
//  to handle a request and shut down right after, without maintaining a continous connection to database
interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}