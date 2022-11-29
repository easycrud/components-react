import {def2formily, parseContent} from '@easycrud/toolkits';
import React from 'react';
import {Form, FormButtonGroup, Submit, FormItem} from '@formily/antd';
import {createForm} from '@formily/core';
import {CrudFormProps} from './types';
import {createSchemaField, SchemaReactComponents} from '@formily/react';
import formilyComponents from './formily-components';
const form = createForm();

function CrudForm(props: CrudFormProps) {
  const {tableDef} = props;
  const table = parseContent(tableDef);
  const schema = def2formily(table);
  const components: SchemaReactComponents = {};
  Object.values(schema.properties || {}).forEach((prop) => {
    const name = prop['x-component'];
    components[name] = formilyComponents[name];
  });
  console.log(components);
  const SchemaField = createSchemaField({
    components: {
      ...components,
      FormItem,
    },
  });

  return (
    <Form
      form={form}
      labelCol={5}
      wrapperCol={16}
      onAutoSubmit={console.log}
    >
      <SchemaField schema={schema} />
      <FormButtonGroup.FormItem>
        <Submit block size="large">
                提交
        </Submit>
      </FormButtonGroup.FormItem>
    </Form>
  );
}

export default CrudForm;
