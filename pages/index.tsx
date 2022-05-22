import React from 'react';
import { useQuery } from "react-query";

import {
  Layout,
  Menu,
} from 'antd';
import 'antd/dist/antd.css';
import {
  TableOutlined,
  PicCenterOutlined,
} from '@ant-design/icons';
import Link from 'next/link';


import AppHeader from '../components/AppHeader';
import AppSider from '../components/AppSider';

const {Content, Sider} = Layout;

/**
 * @param {*} label
 * @param {*} key
 * @param {*} icon
 * @param {*} children
 * @return {*}
 */
function getItem(label: any, key: any, icon: any, children: any) {
  return {
    key,
    icon,
    children,
    label,
  };
}


// const { isSuccess : isSuccessTable, data : tableNames } = useQuery("tableQuery", () =>
// fetch(hasuraProps.hasuraEndpoint as RequestInfo, {
//   method: "POST",
//   headers: hasuraHeaders,
//   body: JSON.stringify({
//     query: `
//     query LearnAboutSchema {
//       __schema {
//         queryType {
//           fields {
//             name
//           }
//         }
//       }
//     }
//   `,
//   }),
// })
//   .then((res) => res.json())
//   .then((res) => {
//     const data = res.data.__schema.queryType.fields;
//     console.log(data)
//     let instances =  data.map((instance: any) => instance.name);
//     // For every table hasura has query types for aggregate functions and functions on the primary key.
//     // We are not intrested in those tables, only the base table, so we filter them. 
//     instances = instances.filter((name: string) => {
//       return !name.endsWith('_aggregate') && !name.endsWith('_by_pk')
//     })
//     return instances
//   })
// );

const tableNames = ['Purchase', 'Inventory', 'users'];

export const itemsDashboard = [
  getItem('Base Tables', 'baseTables', <TableOutlined />, 
    tableNames.map( (name: string) => getItem(<Link href={`/table/${name}`}>{name}</Link>, `table${name}`, null, null))
  ),
  getItem('Dashboards', 'dashboards', <PicCenterOutlined />, [
    getItem(
        <Link href='/dashboard/1'>Dashboard 1</Link>,
        'dashboard1',
        null,
        null,
    ),
    getItem(
        <Link href='/dashboard/2'>Dashboard 2</Link>,
        'dashboard2',
        null,
        null,
    ),
    getItem(
        <Link href='/dashboard/3'>Dashboard 3</Link>,
        'dashboard3',
        null,
        null,
    ),
    getItem(
        <Link href='/dashboard/4'>Dashboard 4</Link>,
        'dashboard4',
        null,
        null,
    ),
  ]),
];

/**
 * @return {*}
 */
function App() {
  return (
    <Layout style={{
      height: '100vh',
    }}>
      <AppHeader />
      <Layout>
        <AppSider itemsDashboard={itemsDashboard} />
        <Layout
          style={{
            padding: '0 24px 24px',
          }}
        >
          <Content
            className='site-layout-background'
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

// Make sure this page is protected
App.auth = false;

export default App;
