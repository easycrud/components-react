import {TableDefinition} from '@easycrud/toolkits';
import {ColumnType, TableProps} from 'antd/es/table';

type GetProperty<T, key extends keyof T> = Required<T>[key]

type AddParameters<
  TFunction extends (...args: any) => any,
  TParameters extends [...args: any]
> = (
  ...args: [...Parameters<TFunction>, ...TParameters]
) => ReturnType<TFunction>;

export type CrudColumnType<RecordType> = ColumnType<RecordType> & {
  search: {
    enable: boolean,
    element: JSX.Element
  }
}

export type CrudTableProps<RecordType> = Omit<TableProps<RecordType>, 'columns' | 'onChange'> &
{
  tableDef: TableDefinition,
  api?: string,
  // Currently not support nested columns.
  columns?: CrudColumnType<RecordType>[],
  onChange?: AddParameters<
    GetProperty<TableProps<RecordType>, 'onChange'>,
    [search: Record<string, any>]
  >,
}

