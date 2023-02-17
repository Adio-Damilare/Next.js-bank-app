import type { NextApiRequest, NextApiResponse } from "next";
import connection from "../../../connection/connect";
import bcrypt from "bcrypt";
import { UserModel } from "../../../connection/Model";
import { sign } from "jsonwebtoken";
import { expressjwt, Request as JWTRequest } from "express-jwt";

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await connection();
  if (req.method == "POST") {
    const { password, email } = req.body;
    UserModel.findOne({ email }, { "_id ": 1, verify: 1, password: 1,accountnumber:1 })
      .then(async (result) => {
        if (result) {
          let compareResult = await bcrypt.compare(password, result.password);
          if (!compareResult) {
            res.send({
              message: "Wrong email and password",
              status: false,
            });
          } else {
            if (result.verify) {
              let jsonresult = sign(
                { id: result._id,accountnumber:result.accountnumber},
                process.env.JSONWEBTOKENSECRET as string,
                { expiresIn: "45h" }
              );
              res.send({
                message: "done",
                status: true,
                token: jsonresult,
              });
            } else {
              res.send({
                message: "done",
                status: true,
                token: "Not yet verify",
              });
            }
          }
        } else {
          res.send({
            message: "Wrong email and password",
            status: false,
          });
        }
      })
      .catch((error) => {
        console.log(error.message);
        res.send({
          message: "Failed due to error",
          status: false,
        });
      });
  }
}
