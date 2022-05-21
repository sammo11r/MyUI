import { Table } from 'antd';
import React from 'react';


function BaseTable({ data }: any){
  if(data){
    return (
      <Table dataSource={ data } 
      columns= { 
        Object.keys(data[0]).map( (key) => {
          return {
            title: key,
            dataIndex: key,
            key: key  
          }
        })
      }/>
  )
  } else {
    return <a>No data</a>
  } 
}

export default BaseTable;
