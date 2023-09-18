import { request } from '@umijs/max';

/** 获取flowList GET /flows */
export async function getFlows(options?: { [key: string]: any }) {
  // params: {
  //   current?: number;
  //   pageSize?: number;
  // },

  return request<API.FlowList>(`${API_URL}/flows`, {
    method: 'GET',
    // params: {
    //   ...params,
    // },
    ...(options || {}),
  });
}

/** 根据id获取单个flow GET /flow */
export async function getFlow(id: string, options?: { [key: string]: any }) {
  return request<API.SourceFlow>(`${API_URL}/flows/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 新建flow */
export async function addFlow(body: API.FlowParams, options?: { [key: string]: any }) {
  return request<any>(`${API_URL}/flows`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { data: { ...body } },
    ...(options || {}),
  });
}

/** 删除flow */
export async function deleteFlow(id: string, options?: { [key: string]: any }) {
  return request<any>(`${API_URL}/flows/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 更新flow */
export async function updateFlow(
  id: string,
  body: API.FlowParams,
  options?: { [key: string]: any },
) {
  return request<any>(`${API_URL}/flows/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { data: { ...body } },
    ...(options || {}),
  });
}
