import { 
  signIn,
  getSession,
  getCsrfToken 
} from "next-auth/react";
import { 
  Form,
  Input,
  Button,
  Row
} from 'antd';
import { Typography } from 'antd';

import 'antd/dist/antd.css';
import React from "react";

const { Title } = Typography;

export default function SignIn() {
  interface values {
    username: string;
    password: number;
    remember: boolean;
  }

  const onFinish = (values: values) => {
    signIn("credentials", { username: values.username, password: values.password })
  };

  return (
    <Row data-testid="row-element" justify="center" align="middle" style={{minHeight: '100vh'}}>
      <Form
        data-testid="form-element"
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 24,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          data-testid="form-title"
          wrapperCol={{
            offset: 8,
            span: 24,
          }}
        >
          <Title>MyUI</Title>
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          data-testid="username-input"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          data-testid="password-input"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          data-testid="submit-form"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit" data-testid="submit-button">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Row>
  );
}

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
    },
  }
}