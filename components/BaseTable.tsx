<<<<<<< HEAD
import { Table } from 'antd';
import React from 'react';
import { useQuery } from "react-query";
import BaseTableData from './BaseTableData';

function BaseTable({ hasuraProps, name }: any) {
  console.log(`rendering base table header ${name}!`)
  enum columnStates { LOADING, READY }
  //Add state deciding whether to show loader or table
  const [columnState, setColumnState] = React.useState({ columns: [{}], columnState: columnStates.LOADING });
  const hasuraHeaders = {
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': hasuraProps.hasuraSecret,
  } as HeadersInit;

  let tableName = name;

  useQuery('columnQuery', async () => {
    setColumnState({ columns: [{}], columnState: columnStates.LOADING })
    let result = await fetch(hasuraProps.hasuraEndpoint as RequestInfo, {
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
  
      setColumnState({ columns: result, columnState: columnStates.READY })        
      return result
    }
  );


  return (
    <div>
      {columnState.columnState == columnStates.READY ?
          //If there is data, display table
          <BaseTableData key={`table-${tableName}`} tableName={tableName} columns={columnState.columns} hasuraProps={ hasuraProps }/> :
        //If data is still loading, display throbber
        <p>Loading</p>
      }
    </div>
  )
}

export default BaseTable;


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
=======
import {Table} from 'antd';
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
      "email": "yemoemail3@domain.com",
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

/**
 * @param {*} { url }
 * @return {*}
 */
function BaseTable({url}: any) {
  const data = getData(url);
  console.log(`passed param: ${url}`);
  if (data) {
    return (
      <Table dataSource={data}
        columns= {
          Object.keys(data[0]).map( (key) => {
            return {
              title: key,
              dataIndex: key,
              key: key,
            };
          })
        }/>
    );
  } else {
    return <a>No data</a>;
  };
}

export default BaseTable;
>>>>>>> 996f586c89c88c17918bf01439a67a321a61babc
