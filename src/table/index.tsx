import {parseContent} from '@easycrud/toolkits';
import {Button, Col, Form, Input, Layout, Row, Table} from 'antd';
import type {TablePaginationConfig} from 'antd/es/table';
import deepmerge from 'deepmerge';
import React, {useEffect, useState} from 'react';
import {CrudColumnType, CrudTableProps} from './types';

async function request(
    api: string,
    pagination: TablePaginationConfig = {current: 1, pageSize: 20},
    search?: Record<string, any>,
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
        ...search,
      },
    }),
  });
  const {data} = await res.json();
  return data.data;
};

function CrudTable(props: CrudTableProps<Record<string, any>>) {
  const {tableDef, api, columns, dataSource} = props;
  let {onChange} = props;
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
  const columnMap = (columns || []).reduce<{
    [key: string]: CrudColumnType<Record<string, any>>
  }>((prev, curr) => {
    const key = curr.dataIndex?.toString() || curr.key;
    if (key) {
      prev[key] = curr;
    }
    return prev;
  }, {});
  const mergedColumns = Object.values(deepmerge(fieldMap, columnMap))
      .filter((column) => !column.hide);

  const dataSourceWithKey = dataSource?.map((record, i) => ({key: i, ...record}));
  const [data, setData] = useState(dataSourceWithKey);
  useEffect(() => {
    if (!api) {
      return;
    }
    request(api).then((data) => setData(data)).catch((err)=> {
      console.log(err);
    });
  }, [api, data]);

  if (api && !onChange) {
    onChange = (pagination, _filters, _sorter, _extra, search) => request(api, pagination, search);
  }

  const [form] = Form.useForm();
  const searchForm = mergedColumns.filter((c) => !c.search?.disable).map((column) => {
    return <Col span={4} key={column.key || column.dataIndex}>
      <Form.Item name={column.dataIndex} label={column.title}>
        {column.search?.element || <Input />}
      </Form.Item>
    </Col>;
  });
  const onSearch = () => {
    console.log(form.getFieldsValue());
    onChange?.(
        {current: 1, pageSize: 20}, {}, [],
        {currentDataSource: [...data!], action: 'search'},
        form.getFieldsValue(),
    );
  };

  return <Layout style={{background: '#fff'}}>
    <Form form={form}>
      <Row gutter={16}>{searchForm}</Row>
      <Row>
        <Col>
          <Button type='primary' onClick={onSearch}>Search</Button>
        </Col>
      </Row>
    </Form>
    <Table
      {...props}
      onChange={
        (pagination, filters, sorter, extra) =>
          onChange?.(pagination, filters, sorter, extra, form.getFieldsValue())
      }
      dataSource={data}
      columns={mergedColumns}
      style={{marginTop: 20}} />
  </Layout>;
};

CrudTable.Summary = Table.Summary;

export default CrudTable;
