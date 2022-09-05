import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {CrudTable} from '../.';
import * as users from './users.json';

const App = () => {
  return (
    <div>
      <CrudTable tableDef={users} columns={[
        {
          dataIndex: 'username',
          title: '用户名',
        },
        {
          dataIndex: 'password',
          hideInSearch: true,
        },
      ]} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
