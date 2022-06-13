import { signIn, getSession, getCsrfToken } from "next-auth/react";
import { Form, Input, Button, Row } from "antd";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import "antd/dist/antd.css";
import React from "react";

import { Image } from 'antd';

/**
 * Export sign in
 *
 * @export
 * @return {*}
 */
export default function SignIn() {
  const { t } = useTranslation();

  interface values {
    username: string;
    password: number;
    remember: boolean;
  }

  const onFinish = async (values: values) => {
    await signIn("login-credentials", {
      username: values.username,
      password: values.password,
    });
  };

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
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          data-testid="form-title"
          style={{
            textAlign: "center",
          }}
          wrapperCol={{
            span: 24, 
          }}
        >
          <img src="https://media.discordapp.net/attachments/967745638047580184/984971934582321262/unknown.png" alt="MyUI logo" />
        </Form.Item>

        <Form.Item
          label={t("login.username")}
          name="username"
          data-testid="username-input"
          rules={[
            {
              required: true,
              message: t("login.username_message"),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t("login.password")}
          name="password"
          data-testid="password-input"
          rules={[
            {
              required: true,
              message: t("login.password_message"),
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          data-testid="submit-form"
          style={{
            textAlign: "center",
            margin: 10,
          }}
          wrapperCol={{
            span: 24,
          }}
        >
          <Button type="primary" htmlType="submit" data-testid="submit-button">
            {t("login.submit")}
          </Button>
        </Form.Item>
      </Form>
    </Row>
  );
}

/**
 * @param {*} context
 * @return {*}
 */
export async function getServerSideProps(context: any) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: {
      csrfToken: await getCsrfToken(context),
      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
}
