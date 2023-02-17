import type { NextApiRequest, NextApiResponse } from "next";
import connection from "../../../connection/connect";
import {
  UserModel,
  TransferModel,
  NotificationModel,
} from "../../../connection/Model";
import bcrypt from "bcrypt";
import { verify } from "jsonwebtoken";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    if (req.method == "POST") {
      let { token, amount, password, DepWith }: any = req.body;
      let { id }: any = verify(token, process.env.JSONWEBTOKENSECRET as string);
      if (id) {
        UserModel.findOne({ _id: id })
          .then(async (ress) => {
            let same = await bcrypt.compare(password, ress.password);
            if (same) {
              if (amount > ress.accountbalance && DepWith) {
                TransferModel.create({
                  userid: ress._id,
                  reciepientaccountnumber: ress.accountnumber,
                  reciepientbank: "Daruz",
                  amount,
                  note: `${DepWith ? "withdraw" : "deposit"}`,
                  charge: 0,
                  isDaruz: true,
                  mode: "fail",
                  date: new Date().toISOString(),
                  reciepientusername: ress.username,
                })
                  .then((value1: any) => {
                    NotificationModel.create({
                      userid: ress.accountnumber,
                      text: "Insufficient funds. plaese check your balance or contact your bank for more information",
                      isSuccess: false,
                      date: new Date().toISOString(),
                    })
                      .then((value: any) => {
                        res.send({
                          message:
                            "Insufficient funds. plaese check your balance or contact your bank for more information",
                          status: true,
                          id:value1._id,
                          isSuccess: false,
                        });
                      })
                      .catch((err: any) => {
                        res.send({
                          message: "Network error",
                          status: false,
                        });
                      });
                  })
                  .catch((err: any) => {
                    res.send({
                      message: "Network error",
                      status: false,
                    });
                  });
              } else {
                TransferModel.create({
                  userid: ress._id,
                  reciepientaccountnumber: ress.accountnumber,
                  reciepientbank: "Daruz",
                  amount,
                  note: `${DepWith ? "withdraw" : "deposit"}`,
                  charge: 0,
                  isDaruz: true,
                  mode: "success",
                  date: new Date().toISOString(),
                  reciepientusername: ress.username,
                }).then((value: any) => {
                  NotificationModel.create({
                    userid: ress.accountnumber,
                    text: `${ress.username} you have successfuly ${
                      DepWith ? "withdraw" : "deposit"
                    } the amount of N${amount} `,
                    isSuccess: true,
                    date: new Date().toISOString(),
                  })
                    .then((value: any) => {
                      let $inc: any = {
                        accountbalance: DepWith ? -amount : +amount,
                      };
                      $inc[
                        `monthlychart.chart.${new Date()
                          .toDateString()
                          .substring(4, 7)}.${DepWith ? "withdraw" : "deposit"}`
                      ] = +amount;
                      UserModel.findOneAndUpdate(
                        { _id: id },
                        {
                          $inc: $inc,
                        }
                      )
                        .then((result: any) => {
                          res.send({
                            message: `${ress.username} you have successfuly ${
                              DepWith ? "withdraw" : "deposit"
                            } the amount of N${amount} `,
                            id: value._id,
                            status: true,
                            isSuccess: true,
                          });
                        })
                        .catch((err: any) => {
                          res.send({
                            message: "Network error",
                            status: false,
                          });
                        });
                    })
                    .catch((err: any) => {
                      res.send({
                        message: "Network error",
                        status: false,
                      });
                    });
                });
              }
            } else {
              res.send({
                message: "Wrong password",
                status: false,
              });
            }
          })
          .catch((err) => {
            res.send({
              message: "Network error",
              status: false,
            });
          });
      } else {
        res.send({
          message: "invalid token",
          status: false,
        });
      }
    }
  } catch (err: any) {
    res.send({
      message: `${err.message}`,
      status: false,
    });
  }
  connection();
}
