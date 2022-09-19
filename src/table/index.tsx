import {parseContent, TableDefinition} from '@easycrud/toolkits';
import {Table, TableProps} from 'antd';
import type {ColumnType, TablePaginationConfig} from 'antd/es/table';
import deepmerge from 'deepmerge';
import React, {useEffect, useState} from 'react';

type CrudTableProps = TableProps<Record<string, any>> &
{
  tableDef: TableDefinition,
  api?: string,
}

async function request(
    api?: string,
    pagination: TablePaginationConfig = {current: 1, pageSize: 20},
) {
  if (!api) {
    return;
  }

  const {current, pageSize} = pagination;

  const res = await fetch(api, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    mode: 'cors',
    body: JSON.stringify({
      data: {
        page: current,
        pageSize,
      },
    }),
  });
  const {data} = await res.json();
  return data.data;
};

function CrudTable(props: CrudTableProps) {
  const {tableDef, api, columns, dataSource} = props;
  const table = parseContent(tableDef);
  const fields = table.columns;
  const fieldMap = fields.reduce<{
    [key: string]: Record<string, any>
  }>((prev, curr) => {
    prev[curr.name] = {
      dataIndex: curr.name,
      title: curr.alias || curr.comment || curr.name,
      key: curr.name,
    };
    return prev;
  }, {});
  const columnMap = (columns as ColumnType<Record<string, any>>[] || []).reduce<{
    [key: string]: ColumnType<Record<string, any>>
  }>((prev, curr) => {
    if (curr.dataIndex) {
      prev[curr.dataIndex.toString()] = curr;
    }
    return prev;
  }, {});
  const mergedColumns = deepmerge(fieldMap, columnMap);

  const [data, setData] = useState(dataSource);
  useEffect(() => {
    if (data) {
      return;
    }
    request(api).then((data) => setData(data)).catch((err)=> {
      console.log(err);
    });
  }, [api, data]);

  return <Table
    onChange={(pagination) => request(api, pagination)}
    {...props}
    dataSource={data}
    columns={Object.values(mergedColumns)} />;
};

CrudTable.Summary = Table.Summary;

export default CrudTable;
