import axios from 'axios'
//导入nprogress
import Nprogress from 'nprogress'

axios.defaults.baseURL = "http://8.140.157.218:5000/api/private/v1/"

//在request拦截器中展示进度条
axios.interceptors.request.use(config => {
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')  //请求头携带token
  return config //在最后必须return
})
//在response拦截器中隐藏进度条
axios.interceptors.response.use(response => {
  Nprogress.done()
  return response //在最后也必须return
})

export default axios