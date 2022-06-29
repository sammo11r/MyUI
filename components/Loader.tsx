import React from "react";
import { Spin } from "antd";
import "antd/dist/antd.css";
import { LoaderProps } from "../utils/customTypes";

/**
 * The throbber used to represent loading
 *
 * @return {*}  {JSX.Element}
 */
export default function Loader({ testid }: LoaderProps): JSX.Element {
  return (
    <Spin
      data-testid={testid}
      style={{ margin: "auto", position: "relative", top: "50%", left: "50%" }}
    />
  );
}
