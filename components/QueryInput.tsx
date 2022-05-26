import React, { useState } from "react";
import { Input, Form, Button } from 'antd';
import { useQuery } from "react-query";

const { TextArea } = Input;

export default function QueryInput({ hasuraProps }: any) {
    const [queryString, setQueryString] = useState("");

    const hasuraHeaders = {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": hasuraProps.hasuraSecret,
    } as HeadersInit;

    // This query is only executed when the state of queryString changes
    const { isSuccess, data } = useQuery(["userInputQuery", queryString], () =>
    fetch(hasuraProps.hasuraEndpoint, {
        method: "POST",
        headers: hasuraHeaders,
        body: JSON.stringify({
        query: queryString,
        }),
    })
        .then((res) => res.json())
        .then((res) => {
        res.data;
        console.log(res.data);
        }),
    {
        enabled: !!queryString,
    }
    );

    const onFinish = (values: any) => {
        setQueryString(values.query);
    }

    return (
        <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        >
        <Form.Item
            label="Query"
            name="query"
            rules={[{ required: true, message: 'Please input your query!' }]}
        >
            <TextArea id="textarea" rows={8}/>
        </Form.Item>

        <Form.Item>
            <Button type="primary" htmlType="submit">
            Execute Query
            </Button>
        </Form.Item>
        </Form>
    )
}
