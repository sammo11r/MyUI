/* eslint-disable require-jsdoc */
import React from "react";
import { Table } from "antd";
import { useQuery } from "react-query";

export default function Users({ hasuraProps }: any) {
  const hasuraHeaders = {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": hasuraProps.hasuraSecret,
  } as HeadersInit;

  const { isSuccess, data } = useQuery("userQuery", () =>
    fetch(hasuraProps.hasuraEndpoint, {
      method: "POST",
      headers: hasuraHeaders,
      body: JSON.stringify({
        query: `
      {
        users {
          id
          created_at
          email
          name
          updated_at
        }
      }
      `,
      }),
    })
      .then((res) => res.json())
      .then((res) => res.data)
  );

  console.log(data);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "CreatedAt",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "UpdatedAt",
      dataIndex: "updated_at",
      key: "updated_at",
    },
  ];

  if (isSuccess) {
    return <Table columns={columns} dataSource={data.users} />;
  } else {
    return <Table columns={columns} />;
  }
}

export function getServerSideProps(context: any) {
  const hasuraProps = {
    hasuraSecret: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET as String,
    hasuraEndpoint: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT as
      | RequestInfo
      | URL,
  };
  return {
    props: {
      hasuraProps,
    },
  };
}
