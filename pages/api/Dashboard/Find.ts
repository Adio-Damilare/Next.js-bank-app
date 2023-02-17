import type { NextApiRequest, NextApiResponse } from "next";
import connection from "../../../connection/connect";
import { UserModel } from "../../../connection/Model";
import { verify } from "jsonwebtoken";

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    let { admin, data,token }: any = req.headers;
    data = JSON.parse(data);
    if (admin == "Oluwadamilare") {
      if (req.method == "GET") {
        let {id}:any=  verify(token,process.env.JSONWEBTOKENSECRET as string)
        if (data.accountnumber) {
          UserModel.find(
            { $and:[{...data},{_id:{$ne:id}}]},
            {
              accountnumber: 1,
              username: 1,
              firstname: 1,
              lastname: 1,
              profilepic: 1,
              email: 1,
            }
          ).then((value) => {
            console.log(value);
            if (value) {
              res.send({
                user: value,
                status: true,
              });
            } else {
              res.send({
                message: "User No found",
                status: false,
              });
            }
          });
        } else {
          let key=Object.keys(data)[0];
          let value=Object.values(data)[0];
          let filter:any={}
          filter[`${key}`]={
            $regex:`.*${value}*.`, $options:"i"
          }
          UserModel.find(
            {$and:[{...filter},{_id:{$ne:id}}]},
            {
              accountnumber: 1,
              username: 1,
              firstname: 1,
              lastname: 1,
              profilepic: 1,
              email: 1,
            }
          ).then((value) => {
            console.log(value + " " +"1");
            if (value) {
              res.send({
                user: value,
                status: true,
              });
            } else {
              res.send({
                message: "User No found",
                status: false,
              });
            }
          });
        }
      }
    } else {
      res.status(404).send({
        message: "Page not Found",
        status: false,
      });
    }
  } catch (err: any) {
    res.send({
      message: `${err.message}`,
      status: false,
    });
  }
  connection();
}
