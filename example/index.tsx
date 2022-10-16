import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {CrudTable} from '../.';
import * as users from './users.json';

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
        ]
      } dataSource={[{'username': 'test', 'password': 'test'}]} />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
);
