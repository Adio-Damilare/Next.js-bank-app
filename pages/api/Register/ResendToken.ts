import type { NextApiRequest, NextApiResponse } from 'next'
import connection from "../../../connection/connect"
import { UserModel } from "../../../connection/Model"
import bcrypt from "bcrypt";
import { HashPassword ,sendMail,GenerateOtp} from './index';
export default async function Handler(req: NextApiRequest, res: NextApiResponse<any>) {
    connection()
    if(req.method ==="POST"){
        let {email}=req.body;
        let number= GenerateOtp()
        let result = await HashPassword(number.toString())
        sendMail({number,email})
        UserModel.findOneAndUpdate({email},{"$set":{"otp":result}}).then((ress)=>{
            res.send({
                message:"successfully sent",
                status:true
            })

        }).catch((err)=>{
            res.send({
                message:"Faile to send due to error",
                status:false
            })
        })
    }
}