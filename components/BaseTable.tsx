import { Table } from 'antd';
import React from 'react';



const mockdata: { [key: string]: any } = {
  "http://mockURL/getUsers": [
      {
        "id": 1,
        "created_at": "2022-05-19T09:37:46.250791+00:00",
        "email": "demoemail1@domain.com",
        "name": "Demo user 1",
        "updated_at": "2022-05-19T09:37:46.250791+00:00",
        "manager": "Jeroen H"
      },
      {
        "id": 2,
        "created_at": "2022-05-19T09:37:55.471197+00:00",
        "email": "demoemail2@domain.com",
        "name": "Demo user 2",
        "updated_at": "2022-05-19T09:37:55.471197+00:00",
        "manager": "Richard"
      },
      {
        "id": 3,
        "created_at": "2022-05-19T09:38:01.858341+00:00",
        "email": "demoemail3@domain.com",
        "name": "Demo user 3",
        "updated_at": "2022-05-19T09:38:01.858341+00:00",
        "manager": "Daan"
      },
      {
        "id": 4,
        "created_at": "2022-05-19T09:38:06.79263+00:00",
        "email": "demoemail4@domain.com",
        "name": "Demo user 4",
        "updated_at": "2022-05-19T09:38:06.79263+00:00",
        "manager": "Sam"
      },
      {
        "id": 5,
        "created_at": "2022-05-19T09:38:11.294273+00:00",
        "email": "demoemail5@domain.com",
        "name": "Demo user 5",
        "updated_at": "2022-05-19T09:38:11.294273+00:00",
        "manager": "Nishad"
      }
    ],
    "http://mockURL/getManagers": [
    {
      "id": 1,
      "created_at": "2022-05-19T09:37:46.250791+00:00",
      "email": "betterdemoemail1@domain.com",
      "name": "Demo manager 1",
      "updated_at": "2022-05-19T09:37:46.250791+00:00",
    },
    {
      "id": 2,
      "created_at": "2022-05-19T09:37:55.471197+00:00",
      "email": "betterdemoemail2@domain.com",
      "name": "Demo manager 2",
      "updated_at": "2022-05-19T09:37:55.471197+00:00",
    }
  ],
}

//probably going to be async later
function getData(url: string){
  /* POST request for data can be handled here */
  return mockdata[url];
}

function BaseTable({ url }: any){
  let data = getData(url);
  console.log(`passed param: ${url}`);
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
