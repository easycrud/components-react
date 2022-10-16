import {parseContent} from '@easycrud/toolkits';
import {Button, Col, Form, Input, Layout, Popconfirm, Row, Space, Table} from 'antd';
import deepmerge from 'deepmerge';
import React, {useEffect, useState} from 'react';
import {del, get} from '../api/api';
import {CrudColumnMap, CrudTableProps} from './types';
import {QuestionCircleOutlined} from '@ant-design/icons';

function CrudTable(props: CrudTableProps<Record<string, any>>) {
  const {tableDef, api, columns, dataSource, title, searchBar} = props;
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
  const presetCols: CrudColumnMap = {
    action: {
      title: 'Action',
      key: 'action',
      search: {
        disable: true,
      },
      render: (_, record) => (
        <Space size="middle">
          <Button type='link'>Edit</Button>
          <Popconfirm title="Are you sure?"
            icon={<QuestionCircleOutlined style={{color: 'red'}} />}
            onConfirm={() => del(api || '', table.pk, record)}
          >
            <Button type='link'>Delete</Button>
          </Popconfirm>
        </Space>
      )},
  };
  let columnMap = (columns || []).reduce<CrudColumnMap>((prev, curr) => {
    const key = curr.dataIndex?.toString() || curr.key;
    if (key) {
      prev[key] = curr;
    }
    return prev;
  }, {});
  columnMap = deepmerge(presetCols, columnMap);
  const mergedColumns = Object.values(deepmerge(fieldMap, columnMap))
      .filter((column) => !column.hide);

  const dataSourceWithKey = dataSource?.map((record, i) => ({key: i, ...record}));
  const [data, setData] = useState(dataSourceWithKey);
  useEffect(() => {
    if (!api) {
      return;
    }
    get(api).then((data) => setData(data)).catch((err)=> {
      console.log(err);
    });
  }, [api, data]);

  if (api && !onChange) {
    onChange = (pagination, _filters, _sorter, _extra, search) => get(api, pagination, search);
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
    {!searchBar?.hide && <Form form={form}>
      <Row gutter={16}>{searchForm}<Button type='primary' onClick={onSearch}>Search</Button></Row>
    </Form>}
    <Row>
      <Col span={1}><h1>{title || tableDef.tableName}</h1></Col>
      <Col span={1} offset={22}><Button type='primary'>Create</Button></Col>
    </Row>
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
