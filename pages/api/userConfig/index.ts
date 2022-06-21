import { NextApiResponse, NextApiRequest } from "next";
import {
  RESTDataResponse,
  ErrorMessageResponse,
} from "../../../utils/customTypes";
import ip from "ip";

/**
 * @export
 * @param {(NextApiResponse<RESTDataResponse | ErrorMessageResponse>)} resp
 * @param {NextApiRequest} request
 */
export default async function handler(
  request: NextApiRequest,
  resp: NextApiResponse<RESTDataResponse | ErrorMessageResponse>
) {
  try {
    // Fetch current IP address
    let ipAddress = ip.address();

    // Modify IP address to forward to docker container
    ipAddress =
      ipAddress.substring(0, ipAddress.lastIndexOf(".") + 1) +
      (parseInt(ipAddress.substring(ipAddress.length - 1)) + 1).toString();

    // GET request to REST endpoint of Hasura to fetch user configuration
    const response = await fetch(
      `http://${ipAddress}:8080/api/rest/config/${request.body.userId}`,
      {
        method: "GET",
        headers: request.body.hasuraHeaders,
      }
    );

    // Parse response as JSON
    const userConfig = await response.json();

    // Send 200 response with table names
    resp.status(200).json({ data: userConfig });
  } catch (err) {
    // Log error in the backend container
    console.error(err);

    // Send 500 response
    resp
      .status(500)
      .json({ message: "Error fetching user config" } as ErrorMessageResponse);
  }
}
