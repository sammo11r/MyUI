/* eslint-disable max-len */
import React from "react";
import { signOut } from "next-auth/react";
import { Form, Button, Row } from "antd";

import "antd/dist/antd.css";

/**
 *
 * @return {*}
 */
export default function SignOut() {
  return (
    <Row
      data-testid="row-element"
      justify="center"
      align="middle"
      style={{ minHeight: "100vh" }}
    >
      <Form
        data-testid="form-element"
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 24,
        }}
        autoComplete="off"
      >
        <Button
          data-testid="submit-button"
          type="primary"
          htmlType="submit"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign out
        </Button>
      </Form>
    </Row>
  );
}
