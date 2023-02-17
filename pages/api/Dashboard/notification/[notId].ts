import type { NextApiRequest, NextApiResponse } from "next";
import connection from "../../../../connection/connect";
import { UserModel, NotificationModel } from "../../../../connection/Model";
import { verify } from "jsonwebtoken";

export default async function Handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        if (req.method == "POST") {
            let { admin,  } = req.body;
            const {notId}=(req.query)
            if (admin == "Oluwadamilare") {
                NotificationModel.findById(notId, { view: true }).then((value: any) => {
                    res.send({
                       value,
                        status: true
                    })
                }).catch((err: any) => {
                    res.send({
                        message: `Network Error`,
                        status: false,
                    });
                })
            }
        }
        else {
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
