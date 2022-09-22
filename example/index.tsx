import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {CrudTable} from '../.';
import * as users from './users.json';
import {Space} from 'antd';

const App = () => {
  return (
    <div>
      <CrudTable tableDef={users} columns={
        [
          {
            title: 'Action',
            key: 'action',
            search: {
              disable: true,
            },
            render: (_, record) => (
              <Space size="middle">
                <a>Edit</a>
                <a>Delete</a>
              </Space>
            )},
        ]
      } dataSource={[{'username': 'testf', 'password': 'test'}]} />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
);
