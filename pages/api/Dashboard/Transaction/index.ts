import type { NextApiRequest, NextApiResponse } from "next";
import connection from "../../../../connection/connect";
import { UserModel, TransferModel } from "../../../../connection/Model";
import { verify } from "jsonwebtoken";

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    if (req.method == "GET") {
      let Bearer: any = req.headers.authorization;
      Bearer = Bearer.split(" ");
      let { id }: any = verify(
        Bearer[1],
        process.env.JSONWEBTOKENSECRET as string
      );
      if (id) {
        TransferModel.find<any>({ userid: id })
          .then((val: any) => {
            res.send({ value: val, status: true });
          })
          .catch((err: any) => {
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
