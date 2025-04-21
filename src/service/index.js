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
  debugger
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
  return res
}, error => {
  // 错误返回
  let msg = error.response.data.error
  console.log(msg || '请求异常');
  return Promise.reject(error.response)
})

export default {
  get: params => instance.get('/data', params ),
  post: data => instance.post('/data', data ),
  login: data => instance.login('/login', data ),
  edit: data => instance.update('/data', data ),
  delete: data => instance.delete('/data', data )
}
