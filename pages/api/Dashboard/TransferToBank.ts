import type { NextApiRequest, NextApiResponse } from "next";
import connection from "../../../connection/connect";
import {
  UserModel,
  TransferModel,
  NotificationModel,
} from "../../../connection/Model";
import bcrypt from "bcrypt";
import { verify } from "jsonwebtoken";

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    if (req.method == "POST") {
      let {
        token,
        password,
        note,
        bank,
        amount,
        recipentAccount,
        username,
        isDaruz,
      }: any = req.body;
      let { id }: any = verify(token, process.env.JSONWEBTOKENSECRET as string);
      if (id) {
        UserModel.findOne({ _id: id })
          .then(async (ress) => {
            if (ress) {
              let same = await bcrypt.compare(password, ress.password);
              if (same) {
                if (ress.accountbalance >= amount + 50) {
                  TransferModel.create({
                    userid: ress._id,
                    reciepientaccountnumber: recipentAccount,
                    reciepientbank: bank,
                    amount,
                    note,
                    isDaruz,
                    mode:"success",
                    date: new Date().toISOString(),
                    reciepientusername: username ? username : "null",
                  })
                    .then((value1) => {
                      NotificationModel.create({
                        userid: id,
                        text: `Successfully transfer the amount N${amount} to ${username ? username : recipentAccount
                          }, recipient bank: ${isDaruz ? "Daruz Bank" : bank}`,
                        isSuccess: true,
                        date: new Date().toISOString(),
                      })
                        .then(async (value:any) => {
                          let respon = await CreateChart(
                            ress,
                            amount,
                            isDaruz,
                            recipentAccount
                          );
                          if (respon.status) {
                            res.send({
                              message: `Successfully transfer the amount N${amount} to ${username ? username : recipentAccount
                                }, recipient bank : ${isDaruz ? "Daruz Bank" : bank}`,
                              id: value1._id,
                              isSuccess: true,
                              status: true,
                            });
                          } else {
                            res.send(respon);
                          }
                        })
                        .catch((err) => {
                          console.log(err.message);
                          res.send({
                            message: "Network error1",
                            status: false,
                          });
                        });
                    })
                    .catch((err) => {
                      console.log(err.message);
                      res.send({
                        message: "Network error2",
                        status: false,
                      });
                    });
                } else {
                  let respon = await NotificationModel.create({
                    userid: id,
                    text: `The transfer was failed due insufficient balance`,
                    isSuccess: false,
                    date: new Date().toISOString(),
                  })
                    .then((valu) => {
                      return {
                        status: true,
                        id: valu._id,
                      };
                    })
                    .catch((err) => {
                      console.log(err.message);
                      return {
                        message: "Network error3",
                        status: false,
                      };
                    });
                  if (respon.status) {
                    let response: any = await TransferModel.create({
                      userid: ress._id,
                      reciepientaccountnumber: recipentAccount,
                      reciepientbank: bank,
                      amount,
                      note,
                      charge: 50,
                      isDaruz,
                      mode:"fail",
                      date: new Date().toISOString(),
                      reciepientusername: username ? username : "null",
                    })
                      .then((valu) => {
                        return {
                          status: true,
                          id: valu._id,
                        };
                      })
                      .catch((err) => {
                        console.log(err.message);
                        return {
                          message: "Network error4",
                          status: false,
                        };
                      });
                    if (response.status) {
                      res.send({
                        message:
                          "Insufficient funds. plaese check your balance or contact your bank for more information",
                        id: response.id,
                        isSuccess: false,
                        status: true,
                      });
                    } else {
                      return response;
                    }
                  } else {
                    return respon;
                  }
                }
              } else {
                res.send({
                  message: "Wrong password",
                  status: false,
                });
              }
            }
          })
          .catch((err) => {
            res.send({
              message: "failed due to error",
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

export const returnMonth = () => {
  return {
    "Jan":{
      withdraw: 0,
      deposit: 0,
    },
    "Feb":{
      withdraw: 0,
      deposit: 0,
    },
    "Mar":{
      withdraw: 0,
      deposit: 0,
    },
    "Apr":{
      withdraw: 0,
      deposit: 0,
    },
    "May":{
      withdraw: 0,
      deposit: 0,
    },
    "Jun":{
      withdraw: 0,
      deposit: 0,
    },
    "Jul":{
      withdraw: 0,
      deposit: 0,
    },
    "Aug":{
      withdraw: 0,
      deposit: 0,
    },
    "Sep": {
      withdraw: 0,
      deposit: 0,
    },
    "Oct":{
      withdraw: 0,
      deposit: 0,
    },
    "Nov":{
      withdraw: 0,
      deposit: 0,
    },
    "Dec": {
      withdraw: 0,
      deposit: 0,
    },
  };
};

async function CreateChart(
  ress: any,
  amount: any,
  isDaruz: any,
  accountnumber: any
) {
  let data: any;
  if (
    ress.monthlychart.year !== new Date().getFullYear()
  ) {
    data = {
      year: new Date().getFullYear(),
      chart: returnMonth(),
    };
    data.chart[`${new Date().toDateString().substring(4,7)}.withdraw `]+= amount;
    
    let result = await UserModel.findByIdAndUpdate(ress._id, {
      $set: { monthlychart: data },
      $inc: { accountbalance: -(amount + 50) },
    })
      .then(async (value) => {
        if (isDaruz) {
          let myResult = await MakeTransferToRecipcent(
            accountnumber,
            amount,
            ress
          );
          return myResult;
        } else {
          return {
            status: true,
            message: "Done",
          };
        }
      })
      .catch((err) => {
        console.log(err.message);
        return {
          message: "Network error5",
          status: false,
        };
      });
    return result;
  } else {
    let $inc: any = { accountbalance: -(amount + 50) }
    $inc[`monthlychart.chart.${new Date().toDateString().substring(4,7)}.withdraw`] = +amount;
    let result: any = await UserModel.findByIdAndUpdate<any>(ress._id, {
      $inc: $inc
    }).then(async (value: any) => {
      if (isDaruz) {
        let myResult = await MakeTransferToRecipcent(
          accountnumber,
          amount,
          ress
        );
        return myResult;
      } else {
        return {
          status: true,
          message: "Done",
        };
      }
    })
    .catch((err: any) => {
      console.log(err.message);
      return {
        message: "Network error6",
        status: false,
      };
    });
  return result;
}
}

const MakeTransferToRecipcent = async (
  accountnumber: any,
  amount: any,
  ress: any
) => {
  // let monthlychart: any = { chart: [] };
  // monthlychart.chart[new Date().getMonth()] = {};
  // monthlychart.chart[new Date().getMonth()].deposit="" 
  let $inc:any = { accountbalance: +amount}
  $inc[`monthlychart.chart.${new Date().toDateString().substring(4,7)}.deposit`] = +amount

  let result = await UserModel.findOneAndUpdate(
    { accountnumber },
    { $inc:$inc }
  )
    .then(async(vale: any) => {
    let result= await NotificationModel.create({
        userid: `${accountnumber}`,
        text: `${ress.username} just sent you the amount N${amount}  with Daruz Bank sender account number: ${ress.accountnumber}`,
        isSuccess: true,
        date: new Date().toISOString(),
      })
        .then((value: any) => {
          return {
            status: true,
            message: "done",
          };
        })
        .catch((err: any) => {
          console.log(err.message);
          return {
            message: "Network error7",
            status: false,
          };
        });
        return result
    })
    .catch((err) => {
      console.log(err.message);
      return {
        message: "Network error8",
        status: false,
      };
    });
  return result;
};
