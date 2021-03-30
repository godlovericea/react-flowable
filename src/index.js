import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './styles/reset.less'
import App from './App';
import reportWebVitals from './reportWebVitals';
import zhCN from 'antd/es/locale/zh_CN';
import 'antd/dist/antd.css';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');




ReactDOM.render(
  <BrowserRouter>
      <ConfigProvider locale={zhCN}>
              <App />
      </ConfigProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
