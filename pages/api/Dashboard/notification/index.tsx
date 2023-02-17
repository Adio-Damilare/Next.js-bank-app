import type { NextApiRequest, NextApiResponse } from "next";
import connection from "../../../../connection/connect";
import { UserModel, NotificationModel } from "../../../../connection/Model";
import { verify } from "jsonwebtoken";

export default async function Handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        let { admin, token }: any = req.headers;
        if (req.method == "GET") {
            if (admin == "Oluwadamilare") {
                let { id }: any = await verify(token, process.env.JSONWEBTOKENSECRET as string)
                UserModel.findById(id).then((user: any) => {
                    NotificationModel.find({ $and: [{ $or: [{ userid: user._id }, { userid: `${user.accountnumber}` }] }, { view: false }] }).then((value: any) => {
                        if (value.length > 0) {
                            NotificationModel.updateMany({ $and: [{ $or: [{ userid: user._id }, { userid: `${user.accountnumber}` }] }, { view: false }] }, { view: true }).then((val: any) => {
                                res.send({ results: value, status: true })
                            }).catch((err: any) => {
                                res.send({
                                    message: `Network Error`,
                                    status: false,
                                });
                            })
                        } else {
                            res.send({ results: value, status: true })
                        }
                    }).catch((err: any) => {
                        res.send({
                            message: `Network Error`,
                            status: false,
                        });
                    })
                }).catch((err: any) => {
                    res.send({
                        message: `Network Error`,
                        status: false,
                    });
                })

            } else {
                res.status(404).send({
                    message: "Page not Found",
                    status: false,
                });
            }
        }
        // if (req.method == "POST") {
        //     let { admin, id } = req.body
        //     if (admin == "Oluwadamilare") {
        //         NotificationModel.findByIdAndUpdate(id, { view: true }).then((value: any) => {
        //             res.send({
        //                 message: "done updating",
        //                 status: true
        //             })
        //         }).catch((err: any) => {
        //             res.send({
        //                 message: `Network Error`,
        //                 status: false,
        //             });
        //         })
        //     }
        // }
        // else {
        //     res.status(404).send({
        //         message: "Page not Found",
        //         status: false,
        //     });
        // }
    } catch (err: any) {
        res.send({
            message: `${err.message}`,
            status: false,
        });
    }
    connection();
}
