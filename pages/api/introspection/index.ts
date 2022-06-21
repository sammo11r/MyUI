import { NextApiRequest, NextApiResponse } from "next";
import {
  ErrorMessageResponse,
  RESTDataResponse,
} from "../../../utils/customTypes";
import ip from "ip";

/**
 * @export
 * @param {NextApiRequest} req
 * @param {(NextApiResponse<RESTDataResponse | ErrorMessageResponse>)} res
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RESTDataResponse | ErrorMessageResponse>
) {
  try {
    // Fetch Hasura endpoint IP address
    let hasuraIP = ip.address();

    // Modify Hasura endpointIP address
    hasuraIP =
      hasuraIP.substring(0, hasuraIP.lastIndexOf(".") + 1) +
      (parseInt(hasuraIP.substring(hasuraIP.length - 1)) + 1).toString();

    // GET request to REST endpoint of Hasura to fetch all table names
    const response = await fetch(
      `http://${hasuraIP}:8080/api/rest/introspect`,
      {
        headers: req.body.hasuraHeaders,
        method: "GET",
      }
    );

    // Parse response as a JSON
    const tableData = await response.json();

    // Send 200 response with table names
    res.status(200).json({ data: tableData });
  } catch (err) {
    // Error logging
    console.error(err);

    // Sending error response with status 500
    res
      .status(500)
      .json({
        message: "Error executing introspection query",
      } as ErrorMessageResponse);
  }
}
