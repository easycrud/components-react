import {def2formily, parseContent} from '@easycrud/toolkits';
import React from 'react';
import {Form, FormButtonGroup, Submit, FormItem} from '@formily/antd';
import {createForm} from '@formily/core';
import {CrudFormProps} from './types';
import {createSchemaField, SchemaReactComponents} from '@formily/react';
import formilyComponents from './formily-components';
import deepmerge from 'deepmerge';
const form = createForm();

function CrudForm(props: CrudFormProps) {
  const {tableDef, formProps, schema} = props;
  const table = parseContent(tableDef);
  const defaultSchema = def2formily(table);
  const mergedSchema = deepmerge(defaultSchema, schema || {});
  const components: SchemaReactComponents = {};
  Object.values(mergedSchema.properties || {}).forEach((prop) => {
    const name = prop['x-component'];
    components[name] = formilyComponents[name];
  });
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
      {...formProps}
    >
      <SchemaField schema={mergedSchema} />
      <FormButtonGroup.FormItem>
        <Submit block size="large">
          Submit
        </Submit>
      </FormButtonGroup.FormItem>
    </Form>
  );
}

export default CrudForm;
