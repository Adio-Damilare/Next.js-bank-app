import mongoose from "mongoose";
let MONGDB_URL:any=process.env.MONGODB_URL

export default async function connection(){
    mongoose.set("strictQuery", false);
   mongoose.connect(MONGDB_URL,(err)=>{
    if(err){
        console.log(err.message)
        console.log("connection failed")
    }else{
        console.log("connection successfully")
    }
   })

}