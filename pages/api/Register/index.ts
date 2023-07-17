import type { NextApiRequest, NextApiResponse } from "next";
import connection from "../../../connection/connect";
import { UserModel } from "../../../connection/Model";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { returnMonth } from "../Dashboard/TransferToBank";

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  connection();
  if (req.method == "POST") {
    let { firstname, lastname, email, password, username } = req.body;
    if (firstname && lastname && email && password && username) {
      UserModel.findOne<any>({ email: email })
        .then(async (user: any) => {
          if (user) {
            res.send({
              message: "Email already exist",
              status: false,
            });
          } else {
            let number: number = GenerateOtp();
            let otp = await HashPassword(`${number}`);
            let result: any = await HashPassword(password);
            let sendmail = await sendMail({ number, email });
            UserModel.create<any>({
              ...req.body,
              password: result,
              otp,
              accountnumber: GenerateAccountNumber(),
              monthlychart: {
                chart: returnMonth(),
                year: new Date().getFullYear(),
              },
            })
              .then((result: any) => {
                res.send({
                  message: "user created successfully",
                  status: true,
                });
              })
              .catch((err: any) => {
                res.send({
                  message: err.message,
                  status: false,
                });
              });
          }
        })
        .catch((err: any) => {
          console.log(err.message);
          res.send({
            message: "Failed due to error",
            status: false,
          });
        });
    } else {
      res.send({
        message: "invalid request",
        status: false,
      });
    }
  }
  if (req.method == "GET") {
  }
  if (req.method == "PUT") {
  }
}

export const HashPassword = async (password: string) => {
  const saltRounds: number = Number(process.env.SALTROUND);
  const result = await bcrypt.hash(password, saltRounds);
  return result;
};

export const sendMail = (props: any) => {
  let mailTranspoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USERNAME,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  let detail = {
    from: process.env.NODEMAILER_USERNAME,
    to: props.email,
    subject: "Daruz bank application",
    html: `<section style="height: 70vh; border:18px ridge  #561f86; border-radius:15px; min-width:90%; display: flex; justify-content: center; align-items: center;">

        <div style="min-width: 100%; border: 1px solid rgb(206, 200, 200);height: 100%; text-align: center; display: flex; justify-content: center; align-items: center; flex-direction: column;">
            <h2><b>Thank you✔</b></h2>
            <strong style="display: block;">
                <article style="font-size:18px;">Your verification Token🔑 is ${props.number}</article>
            </strong>
        </div>
    </section>`,
  };
  return mailTranspoter.sendMail(detail, async (res) => {
    console.log(res)
    if (res) return false;
    return true;
  }).catch((err:any)=>{
    console.log(err.message)
    return true
  });
};

export const GenerateOtp = () =>
  Math.floor(Math.random() * (9999 - 1000)) + 1000;
const GenerateAccountNumber = () =>
  Math.floor(Math.random() * (9999999999 - 1000000000)) + 1000000000;
