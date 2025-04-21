import axios from 'axios'
const instance = axios.create({
  baseURL: window.sys_con.baseURL,
  timeout: 60000, // 设置请求超时时间
  headers: {
    'Content-Type': 'application/json', // 设置默认的请求头
  }
})

// 增加请求拦截器
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.token = JSON.parse(token)?.token
    config.headers.Authorization = 'Bearer ' + JSON.parse(token)?.token
  }
  return config
}, error => {
  // 预处理请求有异常error时抛出错误
  return Promise.reject(error)
})

// 增加响应拦截器
instance.interceptors.response.use((response) => {
  let res
  if (response.status == 200) {
    if (typeof res === 'string') res = res.replace('NaN', null)
    else res = response.data
  }
  if(res.error) $message.error(res.error)

  return res
}, error => {
  // 错误返回
  let msg = error.response.data.error
  $message.error(msg)
  return error.response
})

export default {
  get: params => {
    let query = ""
    for (let key in params) {
      if(params[key]) query += `${key}=${params[key]}&`
    }
    return instance.get('/data?' + query)
  },
  post: data => instance.post('/data', data ),
  login: data => instance.login('/login', data ),
  edit: data => instance.update('/data', data ),
  delete: id => instance.delete('/data/' + id )
}
