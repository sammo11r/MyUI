import React from 'react';
import { Spin } from 'antd';
import 'antd/dist/antd.css';

/**
 * @return {*} 
 */
function Loader() {
    return <Spin style={{margin: 'auto', position: 'relative', top: '50%', left: '50%'}}/>
}

export default Loader;
