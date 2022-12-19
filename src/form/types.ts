import {TableDefinition} from '@easycrud/toolkits';
import {FormProps} from '@formily/antd';
import {ISchema} from '@formily/react';

export type CrudFormProps = {
    tableDef: Partial<TableDefinition>,
    formProps?: FormProps,
    schema?: ISchema,
}
