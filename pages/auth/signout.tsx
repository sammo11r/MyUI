/* eslint-disable max-len */
import React from 'react';
import {signOut} from 'next-auth/react';
import {
  Form,
  Button,
  Row,
} from 'antd';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';

import 'antd/dist/antd.css';

/**
 *
 * @return {*}
 */
export default function SignOut() {
  const {t} = useTranslation();

  return (
    <Row
      data-testid='row-element'
      justify='center'
      align='middle'
      style={{minHeight: '100vh'}}
    >
      <Form
        data-testid='form-element'
        name='basic'
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 24,
        }}
        autoComplete='off'
      >
        <Button
          data-testid='submit-button'
          type='primary'
          htmlType='submit'
          onClick={() => signOut({callbackUrl: '/'})}
        >
          {t('logout.button')}
        </Button>
      </Form>
    </Row>
  );
}

/**
 * @param {*} context
 * @return {*}
 */
export async function getServerSideProps(context: any) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common'])),
    },
  };
}
