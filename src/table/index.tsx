import {parseContent} from '@easycrud/toolkits';
import {Button, Col, Form, Input, Layout, Row, Table} from 'antd';
import deepmerge from 'deepmerge';
import React, {useEffect, useState} from 'react';
import {CrudColumnMap, CrudTableProps} from './types';

function CrudTable(props: CrudTableProps<Record<string, any>>) {
  const {tableDef, requestData, columns, dataSource, searchBar} = props;
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
  const columnMap = (columns || []).reduce<CrudColumnMap>((prev, curr) => {
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
    if (!requestData) {
      return;
    }
    requestData().then((data) => setData(data)).catch((err)=> {
      console.log(err);
    });
  }, [requestData, data]);

  if (requestData && !onChange) {
    onChange = (pagination, _filters, _sorter, _extra, search) => requestData(pagination, search);
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
    onChange?.(
        {current: 1, pageSize: 20}, {}, [],
        {currentDataSource: [...data!], action: 'search'},
        form.getFieldsValue(),
    );
  };

  return <Layout style={{background: '#fff'}}>
    {!searchBar?.hide && <Form form={form}>
      <Row gutter={16}>{searchForm}<Button type='primary' onClick={onSearch}>Search</Button></Row>
    </Form>}
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
