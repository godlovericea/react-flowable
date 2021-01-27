import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import zhCN from 'antd/es/locale/zh_CN';
import 'antd/dist/antd.css';
import { ConfigProvider } from 'antd';


ReactDOM.render(
  <ConfigProvider locale={zhCN}>
      <React.StrictMode>
          <App />
      </React.StrictMode>
  </ConfigProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
