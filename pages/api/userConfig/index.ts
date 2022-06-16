import { NextApiRequest, NextApiResponse } from "next";
import { ErrorMessageResponse, RESTDataResponse } from "../../../customTypes";
import ip from "ip";

export default async function handler(req: NextApiRequest, res: NextApiResponse<RESTDataResponse | ErrorMessageResponse>) {
    try {
      // Fetch current IP address
      let ipAddress = ip.address();

      // Modify IP address to forward to docker container
      ipAddress =
        ipAddress.substring(0, ipAddress.lastIndexOf(".") + 1) +
        (parseInt(ipAddress.substring(ipAddress.length - 1)) + 1).toString();

      // GET request to REST endpoint of Hasura to fetch user configuration
      const response = await fetch(`http://${ipAddress}:8080/api/rest/config/${req.body.userId}`, {
        method: "GET",
        headers: req.body.hasuraHeaders,
      });

      // Parse response as JSON
      const userConfig = await response.json();
    
      // Send 200 response with table names
      res.status(200).json({ data: userConfig });
    } catch (err) {
      // Log error in the backend container
      console.error(err);

      // Send 500 response
      res.status(500).json({ message: "Error fetching user config" } as ErrorMessageResponse);
    }
}
