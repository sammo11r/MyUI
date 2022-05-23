import React from 'react';

import 'antd/dist/antd.css';
import {Spin} from 'antd';

function Loader() {
    return <Spin style={{margin: 'auto', position: 'relative', top: '50%', left: '50%'}}/>
}

export default Loader;
