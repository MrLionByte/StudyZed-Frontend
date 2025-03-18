import React from 'react';
import { DatePicker, Space } from 'antd';
const { RangePicker } = DatePicker;
const App = () => (
  <Space direction="vertical" size={5}>
    <RangePicker />
  </Space>
);
export default App;
