import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import {useRouter} from 'next/router';
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
  return (
    <Layout style={{
      height: '100vh',
    }}>
      <AppHeader />
      <Layout>
        <AppSider 
        itemsDashboard={itemsDashboard} 
        selectedKeys={[name]} // fix pls
        openKeys={['baseTables']} />
        <Layout
          style={{
            padding: '0 24px 24px',
          }}
        >
          <BaseTable url = { urls[(name-1)] }/>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Post;
