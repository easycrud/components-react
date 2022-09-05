import {ProColumns, ProTable, ProTableProps} from '@ant-design/pro-components';
import type {ParamsType} from '@ant-design/pro-provider';
import {parseContent, TableDefinition} from '@easycrud/toolkits';
import deepmerge from 'deepmerge';
import * as React from 'react';

type CrudTableProps = ProTableProps<Record<string, any>, ParamsType> &
{
  tableDef: TableDefinition,
  baseUrl: string,
}

const CrudTable = (props: CrudTableProps) => {
  const {tableDef, baseUrl, columns} = props;
  const table = parseContent(tableDef);
  const fields = table.columns;
  const fieldMap = fields.reduce<{
    [key: string]: ProColumns<Record<string, any>, 'text'>
  }>((prev, curr) => {
    prev[curr.name] = {
      dataIndex: curr.name,
      title: curr.alias || curr.name,
    };
    return prev;
  }, {});
  const columnMap = (columns || []).reduce<{
    [key: string]: ProColumns<Record<string, any>, 'text'>
  }>((prev, curr) => {
    if (curr.dataIndex) {
      prev[curr.dataIndex.toString()] = curr;
    }
    return prev;
  }, {});
  const mergedColumns = deepmerge(fieldMap, columnMap);

  const request = async (
    params: ParamsType & {
      pageSize?: number;
      current?: number;
    },
  ) => {
    const res = await fetch(`${baseUrl}/${table.tableName}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      mode: 'cors',
      body: JSON.stringify({
        data: {
          ...params,
          page: params.current,
        },
      }),
    });
    const {code, data} = await res.json();
    return {
      data: data.data,
      success: code === 0,
      total: data.pagination.total,
    };
  };
  return <ProTable
    request={request}
    {...props}
    columns={Object.values(mergedColumns)} />;
};

CrudTable.Summary = ProTable.Summary;

export default CrudTable;
