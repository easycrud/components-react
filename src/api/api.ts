import type {TablePaginationConfig} from 'antd/es/table';

function getPkParams(pk: string[], record: Record<string, any>): string {
  if (pk.length === 1) {
    return record[pk[0]]
  }
  let params = pk.map(e => `${e}=${record[e]}`)
  return '?' + params.join('&')
}

export async function get(
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

export async function del(
    api: string,
    pk: string[],
    record: Record<string, any>,
) {
  if (!api) {
    return;
  }

  const res = await fetch(`${api}/${getPkParams(pk, record)}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    mode: 'cors',
  });
  const {data} = await res.json();
  return data.data;
};
