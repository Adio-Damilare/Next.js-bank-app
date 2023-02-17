import type { NextApiRequest, NextApiResponse } from 'next'
import connection from "../../../connection/connect";
import bcrypt from "bcrypt";
import { UserModel } from "../../../connection/Model";

export default async function Handler(req: NextApiRequest, res: NextApiResponse<any>) {
    connection()
    if (req.method == "POST") {
        const { otp:token, email } = req.body;
        UserModel.findOne({ email }).then(async (result) => {
            if (result) {
                let compareResult = await bcrypt.compare(token, result.otp)
                if (!compareResult) {
                    res.send({
                        status: false,
                        message: "Wrong Token"
                    })
                }else{
                    UserModel.findOneAndUpdate({email},{otp:"null",verify:true}).then((value)=>{
                        res.send({
                            message:"done",
                            status:true
                        })
                    })
                }
            } else {
                res.send({
                    message: "Failed due to error",
                    status: false
                })
            }
        }).catch((error) => {
            console.log(error.message)
            res.send({
                message: "Failed due to error",
                status: false
            })
        })

    }
}
