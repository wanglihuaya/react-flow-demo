import { request } from '@umijs/max';

/** 获取TraceList GET /flows */
export async function getTraces(options?: { [key: string]: any }) {
  // params: {
  //   current?: number;
  //   pageSize?: number;
  // },

  return request<API.TraceList>(`${API_URL}/traces`, {
    method: 'GET',
    // params: {
    //   ...params,
    // },
    ...(options || {}),
  });
}

/** 根据id获取单个traceGET /trace */
export async function getTrace(id: string, options?: { [key: string]: any }) {
  return request<API.SourceTrace>(`${API_URL}/traces/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 新建trace */
export async function addTrace(body: API.TraceParams, options?: { [key: string]: any }) {
  return request<any>(`${API_URL}/traces`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { data: { ...body } },
    ...(options || {}),
  });
}

/** 删除trace */
export async function deleteTrace(id: string, options?: { [key: string]: any }) {
  return request<any>(`${API_URL}/traces/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 更新trace */
export async function updateTrace(
  id: string,
  body: API.FlowParams,
  options?: { [key: string]: any },
) {
  return request<any>(`${API_URL}/traces/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { data: { ...body } },
    ...(options || {}),
  });
}
