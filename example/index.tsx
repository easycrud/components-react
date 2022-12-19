import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {CrudTable, CrudForm} from '../.';
import * as users from './users.json';
import {Button, Popconfirm, Space} from 'antd';
import {QuestionCircleOutlined} from '@ant-design/icons';

const App = () => {
  return (
    <div>
      <CrudTable tableDef={users} columns={
        [
          {
            key: 'password',
            search: {
              disable: true,
            },
          },
          {
            title: 'Action',
            key: 'action',
            search: {
              disable: true,
            },
            render: (_, record) => (
              <Space size="middle">
                <Button type='link'>Edit</Button>
                <Popconfirm title="Are you sure?"
                  icon={<QuestionCircleOutlined style={{color: 'red'}} />}
                  onConfirm={() => {}}
                >
                  <Button type='link'>Delete</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]
      } dataSource={[{'username': 'test', 'password': 'test'}]} />
      <CrudForm tableDef={users} schema={{
        'properties': {
          'password': {
            'x-component': 'Password',
          },
        },
      }} />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
);
