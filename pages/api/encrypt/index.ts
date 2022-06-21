import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import {
  PasswordResponse,
  ErrorMessageResponse,
} from "../../../utils/customTypes";

/**
 * @export
 * @param {NextApiRequest} req
 * @param {(NextApiResponse<PasswordResponse | ErrorMessageResponse>)} res
 * @return {*}
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PasswordResponse | ErrorMessageResponse>
) {
  return new Promise<void>((resolve, reject) => {
    try {
      // Create yaml document
      const encryptedPassword = bcrypt.hashSync(req.body.password, 10);

      // Send 200 response and resolve promise
      res
        .status(200)
        .json({ encryptedPassword: encryptedPassword } as PasswordResponse);
      resolve();
    } catch (error) {
      // Log the error in the backend container
      console.error(error);

      // Resolve promise and send 500 response and 
      res
        .status(500)
        .json({ message: "Error encrypting password" } as ErrorMessageResponse);
      resolve();
    }
  });
}
