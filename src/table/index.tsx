import {parseContent} from '@easycrud/toolkits';
import {Button, Col, Form, Input, Layout, Row, Table} from 'antd';
import deepmerge from 'deepmerge';
import React, {useEffect, useState} from 'react';
import {CrudColumnMap, CrudTableProps, TableData} from './types';

function CrudTable(props: CrudTableProps<Record<string, any>>) {
  const {tableDef, requestData, columns, dataSource, searchBar, pagination} = props;
  let {onChange} = props;
  const table = parseContent(tableDef);
  const fields = table.columns;
  // convert table definition schema to map of antd table columns
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
  // merge table definition schema with user defined columns by column name
  const columnMap = (columns || []).reduce<CrudColumnMap>((prev, curr) => {
    const key = curr.dataIndex?.toString() || curr.key;
    if (key) {
      prev[key] = curr;
    }
    return prev;
  }, {});
  const mergedColumns = Object.values(deepmerge(fieldMap, columnMap))
      .filter((column) => !column.hide);

  // Load table data
  const [data, setData] = useState<TableData<Record<string, any>>>({
    data: [],
    pagination: {},
  });
  useEffect(() => {
    if (!requestData) {
      // if no requestData function is provided, use dataSource as data
      const dataSourceWithKey = dataSource?.map((record, i) => ({key: i, ...record}));
      setData({
        data: dataSourceWithKey || [],
        pagination: pagination || {},
      });
      return;
    }
    // if requestData function is provided, use it to load data
    requestData().then((res) => setData(res)).catch((err)=> {
      console.log(err);
    });
  }, [requestData, dataSource, pagination]);

  if (requestData && !onChange) {
    // set onChange function if onChange function is not provided
    onChange = (pagination, _filters, _sorter, _extra, search) => requestData(pagination, search);
  }

  // setup search bar and search function
  const [form] = Form.useForm();
  const searchColumns = mergedColumns.filter((c) => c.search?.enable);
  const searchForm = searchColumns.map((column) => {
    return <Col span={4} key={column.key || column.dataIndex}>
      <Form.Item name={column.dataIndex} label={column.title}>
        {column.search?.element || <Input />}
      </Form.Item>
    </Col>;
  });
  const onSearch = () => {
    onChange?.(
        {...data.pagination, current: 1}, {}, [],
        {currentDataSource: [...data.data!], action: 'search'},
        form.getFieldsValue(),
    );
  };

  return <Layout style={{background: '#fff'}}>
    {!searchBar?.hide && searchColumns.length > 0 && <Form form={form}>
      <Row gutter={16}>{searchForm}<Button type='primary' onClick={onSearch}>Search</Button></Row>
    </Form>}
    <Table
      {...props}
      onChange={
        (pagination, filters, sorter, extra) =>
          onChange?.(pagination, filters, sorter, extra, form.getFieldsValue())
      }
      dataSource={data.data}
      pagination={data.pagination}
      columns={mergedColumns}
      style={{marginTop: 20}} />
  </Layout>;
};

CrudTable.Summary = Table.Summary;

export default CrudTable;
