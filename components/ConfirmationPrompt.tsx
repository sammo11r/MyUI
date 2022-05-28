import React, { useState } from 'react';
import { Popconfirm } from 'antd';
import 'antd/dist/antd.css';

/**
 * @param {*} { callback }
 * @return {*} 
 */
function ConfirmationPrompt({ callback }: any) {
  const [visible, setVisible] = useState(true);
    
  const showPopconfirm = () => {
    setVisible(true);
  };

  const handleOk = (callback: any) => {
    callback();
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

return <Popconfirm
    title="Title"
    placement="rightBottom"
    visible={visible}
    onConfirm={ handleOk }
    onCancel={ handleCancel }
  />
}

export default ConfirmationPrompt;
