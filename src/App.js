import { React } from "react";
import { Layout } from 'antd';
import "./styles/process_iframe.less";
import Process from './pages/process/Process'
const { Footer, Sider, Content } = Layout;

function App() {
  return (
    <div style={{height:'100%'}}>
      <Layout>
          <Sider>Sider</Sider>
          <Layout>
              <Content>
                  <Process></Process>
              </Content>
              <Footer>
                  流程管理
              </Footer>
          </Layout>
      </Layout>
    </div>
    
  );
}

export default App;
