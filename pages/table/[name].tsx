import { Layout, Spin } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { useQuery } from "react-query";
import { useRouter } from 'next/router';
import React from 'react';
import { itemsDashboard } from '..';
import AppHeader from '../../components/AppHeader';
import AppSider from '../../components/AppSider';
import BaseTable from '../../components/BaseTable';
import { resolve } from 'path';


/**
 * @return {*}
 */
export default function Post({ hasuraProps }: any) {
  const router = useRouter();
  const { name }: any = router.query;

  enum dataState { LOADING, READY }
  //Add state deciding whether to show loader or table
  const [tableState, setTableState] = React.useState({ data: null, dataState: dataState.LOADING });

  const hasuraHeaders = {
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': hasuraProps.hasuraSecret,
  } as HeadersInit;

let tableName = name;
const { data: columns, error } = useQuery('columnQuery', () => 
fetch(hasuraProps.hasuraEndpoint as RequestInfo, {
  method: 'POST',
  headers: hasuraHeaders,
  body: JSON.stringify({
    query: `
query Columns {
__type(name: "${tableName}") {
fields {
name
}
}
}
`,
  }),
})
  .then((names) => names.json())
  .then((names) => {
    //GraphQL column names are returned under key "__type"
    return Object.values(names.data.__type.fields)
      .map((value: any) => value.name)
  })
);

const { data: tables } = useQuery('tableQuery', () => 
fetch(hasuraProps.hasuraEndpoint as RequestInfo, {
  method: 'POST',
  headers: hasuraHeaders,
  body: JSON.stringify({
    query: `
        {
          ${tableName} {
            ${columns}
          }
        }
        `,
  }),
})
  .then((res) => res.json())
  .then((res) => {
    if(!res || !res.data) return null
    return res.data[tableName]
  })
  .then((res) => {setTableState({ data: res, dataState: dataState.READY })}), 
  { enabled: !!columns });




  return (
    <Layout style={{
      height: '100vh',
    }}>
      <AppHeader />
      <Layout>
        <AppSider
          itemsDashboard={itemsDashboard}
          selectedKeys={['table' + name]}
          openKeys={['baseTables']} />
        <Layout
          style={{
            padding: '0 24px 24px',
          }}
        >
          {tableState.dataState == dataState.READY ? <BaseTable data={tableState.data} /> : <Spin size='large' style={{ margin: 'auto'}} />}
        </Layout>
      </Layout>
    </Layout>
  );
};



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


