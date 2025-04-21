import axios from 'axios';
const isDev = process.env.NODE_ENV === 'development'
const instance = axios.create({
  baseURL: isDev ? '/web-api/api' : ((window.sys_con.baseURL || location.host) + '/api'),
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
  if ([4002].includes(response.data.code)) {
    localStorage.clear()
    setTimeout(() => location.reload(), 2000)
  }
  if (response.status == 200) {
    if (typeof res === 'string') res = res.replace('NaN', null)
    else res = response.data
  }

  if(response?.data && response.data instanceof Blob) {
    res = {
      code: 200,
      data: response.data
    }
  }
  if (response.data.code != 200 && typeof response.data != 'string' && !(response.data instanceof Blob)) {
  res = response.data
  console.log((response.data.data && response.data.data.exception) || response.data.msg || '请求异常');
  }
  return res
}, error => {
  console.log(error)
  // 错误返回
  let msg = error.response.data.error
  console.log(msg || '请求异常');
  return Promise.reject(error.response)
})

export default instance
