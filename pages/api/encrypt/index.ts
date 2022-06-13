import bcrypt from "bcrypt";

export default async function handler(req: any, res: any) {
  return new Promise<void>((resolve, reject) => {
    try {
      // Create yaml document
      const encryptedPassword = bcrypt.hashSync(req.body.password, 10);

      // Send 200 response and resolve promise
      res.status(200).json({ encryptedPassword: encryptedPassword });
      resolve();
    } catch (err) {
      // Log error in the backend container
      console.error(err);

      // Send 500 response and resolve promise
      res.status(500).json({ message: "Error encrypting password" });
      resolve();
    }
  });
}