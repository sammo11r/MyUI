import {useRouter} from 'next/router';
import React from 'react';
import BaseTable from '../../components/BaseTable';


let urls = ['http://mockURL/getUsers', 'http://mockURL/getManagers'];

/**
 * @return {*}
 */
const Post = (): any => {
  const router = useRouter();
  const {name} = router.query;
  return <div><p>{name}</p><BaseTable url = { urls[(name-1)] }/></div>;
};

export default Post;
