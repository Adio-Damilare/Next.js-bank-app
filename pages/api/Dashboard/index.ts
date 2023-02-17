import type { NextApiRequest, NextApiResponse } from 'next'
import connection from "../../../connection/connect"
import { UserModel } from "../../../connection/Model"
import { verify } from "jsonwebtoken"

export default async function Handler(req: NextApiRequest, res: NextApiResponse<any>) {
    try {
        if (req.method == "GET") {
            let Bearer: any = req.headers.authorization;
            Bearer = Bearer.split(" ")
            let { id }: any = verify(Bearer[1], process.env.JSONWEBTOKENSECRET as string)
            if (id) {
                UserModel.findOne({ _id: id }).then((ress) => {
                    if(ress){

                        res.send({
                            user:ress,
                            status:true
                        }) 
                    }else{
                        res.send({
                            message:"user not found",
                            status:true
                        }) 
                    }
                    
                }).catch((err)=>{

                    res.send({
                        message: "failed due to error",
                        status: false
                    })
                })
            } else {
                res.send({
                    message: "invalid token",
                    status: false
                })
            }
        }

    } catch (err: any) {
        res.send({
            message: `${err.message}`,
            status: false
        })
    }
    connection()
}