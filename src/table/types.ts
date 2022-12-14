import {TableDefinition} from '@easycrud/toolkits';
import {ColumnType, TablePaginationConfig, TableProps} from 'antd/es/table';
import {FilterValue, SorterResult, TableAction} from 'antd/es/table/interface';

// type GetProperty<T, key extends keyof T> = Required<T>[key]

// type AddParameters<
//   TFunction extends (...args: any) => any,
//   TParameters extends [...args: any]
// > = (
//   ...args: [...Parameters<TFunction>, ...TParameters]
// ) => ReturnType<TFunction>;

export type CrudColumnType<RecordType> = ColumnType<RecordType> & {
  hide?: boolean,
  search?: Partial<{
    enable: boolean,
    element: JSX.Element
  }>
}

export type CrudColumnMap = {
  [key: string]: CrudColumnType<Record<string, any>>
}

interface CrudTableCurrentDataSource<RecordType> {
  currentDataSource: RecordType[];
  action: TableAction | 'search';
}

export interface TableData<RecordType> {
  data: RecordType[],
  pagination: TablePaginationConfig
}

export type CrudTableProps<RecordType> = Omit<TableProps<RecordType>, 'columns' | 'onChange'> &
{
  tableDef: Partial<TableDefinition>,
  requestData?: (pagination?: TablePaginationConfig, search?: Record<string, any>) => Promise<TableData<RecordType>>,
  // Currently not support nested columns.
  columns?: CrudColumnType<RecordType>[],
  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
    extra: CrudTableCurrentDataSource<RecordType>,
    search?: Record<string, any>
  ) => void,
  searchBar?: {
    hide: boolean
  }
}

