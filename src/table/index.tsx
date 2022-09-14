import {parseContent, TableDefinition} from '@easycrud/toolkits';
import {Table, TableProps} from 'antd';
import type {ColumnType} from 'antd/es/table';
import deepmerge from 'deepmerge';
import React, {useEffect, useState} from 'react';

type CrudTableProps = TableProps<Record<string, any>> &
{
  tableDef: TableDefinition,
  baseUrl?: string,
}

function CrudTable(props: CrudTableProps) {
  const {tableDef, baseUrl, columns, dataSource} = props;
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

  const [data, setData] = useState(dataSource || []);
  useEffect(() => {
    if (data && data.length) {
      return;
    }
    const request = async () => {
      // const res = await fetch(`${baseUrl}/${table.tableName}`, {
      //   method: 'POST',
      //   headers: {'Content-Type': 'application/json'},
      //   mode: 'cors',
      //   body: JSON.stringify({
      //     data: {
      //     },
      //   }),
      // });
      // const {data} = await res.json();
      // setData(data.data);
      setData([{
        id: 1,
      }]);
    };
    request().catch((err)=> {
      console.log(err);
    });
  }, [baseUrl, table, data]);

  return <Table
    {...props}
    dataSource={data}
    columns={Object.values(mergedColumns)} />;
};

CrudTable.Summary = Table.Summary;

export default CrudTable;
