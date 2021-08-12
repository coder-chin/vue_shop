import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import Nprogress from 'nprogress'
import ZkTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

//导入富文本编辑器对应的样式
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme
//导入nprogress css
// import 'nprogress/nprogress.css'
//使用插件
Vue.use(VueQuillEditor /* { default global options } */)

Vue.component('tree-table', ZkTable)
Vue.config.productionTip = false
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
//http://127.0.0.1:8888/api/private/v1/

//在request拦截器中展示进度条
axios.interceptors.request.use(config => {
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config //在最后必须return config
})
//在response拦截器中隐藏进度条
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config //在最后必须return config
})

Vue.filter('dataFormat', function(originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}-${mm}-${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
