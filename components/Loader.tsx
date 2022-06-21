import React from "react";
import { Spin } from "antd";
import "antd/dist/antd.css";

/**
 * The throbber used to represent loading
 *
 * @return {*}  {JSX.Element}
 */
export default function Loader(): JSX.Element {
  return (
    <Spin
      style={{ margin: "auto", position: "relative", top: "50%", left: "50%" }}
    />
  );
}
