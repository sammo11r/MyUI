import * as fs from "fs";
import YAML from "yaml";
import { NextApiRequest, NextApiResponse } from "next";
import {
  MessageResponse,
  ErrorMessageResponse,
} from "../../../utils/customTypes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MessageResponse | ErrorMessageResponse>
) {
  return new Promise<void>((resolve, reject) => {
    try {
      // Create yaml document
      const doc = new YAML.Document();
      doc.contents = req.body;

      // Use file system to write to file asynchronously
      fs.writeFileSync("/app/config/globalConfig.yaml", doc.toString(), "utf8");

      // Send 200 response and resolve promise
      res
        .status(200)
        .json({ message: "UserConfig Updated!" } as MessageResponse);
      resolve();
    } catch (err) {
      // Log error in the backend container
      console.error(err);

      // Send 500 response and resolve promise
      res
        .status(500)
        .json({ message: "Error writing file" } as ErrorMessageResponse);
      resolve();
    }
  });
}
