import {ProTable, ProTableProps} from '@ant-design/pro-components';
import type {ParamsType} from '@ant-design/pro-provider';
import {TableDefinition} from '@easycrud/toolkits';
import * as React from 'react';

type CrudTableProps = ProTableProps<Record<string, any>, ParamsType> &
{
  tableDef: TableDefinition
}

const CrudTable = (props: CrudTableProps) => {
  return <ProTable {...props}>the snozzberries taste like snozzberries</ProTable>;
};

CrudTable.Summary = ProTable.Summary;

export default CrudTable;
