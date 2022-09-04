import {ProColumns, ProTable, ProTableProps} from '@ant-design/pro-components';
import type {ParamsType} from '@ant-design/pro-provider';
import {parseContent, TableDefinition} from '@easycrud/toolkits';
import deepmerge from 'deepmerge';
import * as React from 'react';

type CrudTableProps = ProTableProps<Record<string, any>, ParamsType> &
{
  tableDef: TableDefinition
}

const CrudTable = (props: CrudTableProps) => {
  const {tableDef, columns} = props;
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
  return <ProTable {...props} columns={Object.values(mergedColumns)} />;
};

CrudTable.Summary = ProTable.Summary;

export default CrudTable;
