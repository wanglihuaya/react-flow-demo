import { request } from '@umijs/max';

/** 获取TemplateList GET /flows */
export async function getTemplates(options?: { [key: string]: any }) {
  // params: {
  //   current?: number;
  //   pageSize?: number;
  // },

  return request<API.TemplateList>(`${API_URL}/templates`, {
    method: 'GET',
    // params: {
    //   ...params,
    // },
    ...(options || {}),
  });
}

/** 根据id获取单个templateGET /template */
export async function getTemplate(id: string, options?: { [key: string]: any }) {
  return request<API.SourceTemplate>(`${API_URL}/templates/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 新建template */
export async function addTemplate(body: API.TemplateParams, options?: { [key: string]: any }) {
  return request<any>(`${API_URL}/templates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { data: { ...body } },
    ...(options || {}),
  });
}

/** 删除template */
export async function deleteTemplate(id: string, options?: { [key: string]: any }) {
  return request<any>(`${API_URL}/templates/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 更新template */
export async function updateTemplate(
  id: string,
  body: API.FlowParams,
  options?: { [key: string]: any },
) {
  return request<any>(`${API_URL}/templates/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { data: { ...body } },
    ...(options || {}),
  });
}
