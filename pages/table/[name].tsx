import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { useQuery } from "react-query";
import { useRouter } from 'next/router';
import React from 'react';
import { itemsDashboard } from '..';
import AppHeader from '../../components/AppHeader';
import AppSider from '../../components/AppSider';
import BaseTable from '../../components/BaseTable';



let urls = ['http://mockURL/getUsers', 'http://mockURL/getManagers'];


/**
 * @return {*}
 */
const Post = (): any => {
  const router = useRouter();
  const {name}: any = router.query;
  enum dataState { LOADING, READY }
  //Add state deciding whether to show loader or table
  const [ loading, setLoading ] = React.useState(dataState.LOADING);

 const hasuraProps: { hasuraSecret:string, hasuraEndpoint:RequestInfo | URL } = getServerSideProps("none");
 const hasuraHeaders = {
  "Content-Type": "application/json",
  "x-hasura-admin-secret": hasuraProps.hasuraSecret,
} as HeadersInit;

const { isSuccess, data } = useQuery("userQuery", () =>
  fetch(hasuraProps.hasuraEndpoint as RequestInfo, {
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
    .then((res) => {
      return res.data.users
    }).finally(() => { setLoading(dataState.READY)})
);


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
          { loading == dataState.READY? <BaseTable data= { data }/>: <p>No</p> }         
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Post;


function getServerSideProps(context: any) {
  return {
    hasuraSecret: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET as string,
    hasuraEndpoint: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT as
      | RequestInfo
      | URL,
  }
}