import React from 'react';
import Home from './components/Home';
import { Layout } from 'antd';
const { Content } = Layout;

function App() {
  return (
    <Layout style={{ backgroundColor: 'white' }}>
      <Content style={{ padding: '0 200px' }}>
        <Home />
      </Content>
    </Layout>
  );
}

export default App;
