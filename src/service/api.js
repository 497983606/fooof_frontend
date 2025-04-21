import request from './request'
// 通用请求
const setRequest = url => {
  return {
    // 批量查询
    get: (params = {}) => request.put(url, params),
    // 新增
    add: params => request.post(url, params),
    // 批量新增
    addbatch: params => request.post(url + '/batch', params),
    // 修改
    edit: params => request.patch(url + '/' + params.id, params),
    // 批量新增
    addBatch: params => request.post(url + '/batch', params),
    // 批量修改
    editbatch: params => request.patch(url + '/batch', params),
    // 批量修改
    batchDel: params => request.delete(url,  { data: { id: params } }),
    // 导出
    export: params => request.patch(url, params, { responseType: 'blob' }),
    // 删除  批量删除
    delete: params => {
      if (Array.isArray(params)) {
        return request.delete(url, { data: { id: params } })
      } else if (['number', 'string'].includes(typeof params)) {
        return request.delete(`${url}/${params}`, { data: { force: false } })
      } else {
        return request.delete(`${url}/${params.id}`, {
          data: { force: false }
        })
      }
    },
    request: (type, params = {}, config = {}, address = url) => request[type](address, params, config)
  };
}
// 用户
export const user = {
  login: params => request.post('/login/json', params),
  changePassword: (id, params) => request.patch('/password/'+id, params),
  ...setRequest('/user')
}

