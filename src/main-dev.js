import Vue from 'vue'
import ZkTable from 'vue-table-with-tree-grid'
import App from './App.vue'  //挂载点
import router from './router'
import axios from './network/axios'

import './plugins/element.js'        //导入elementUI,按需导入
import './assets/css/global.css'    //导入全局样式
import './assets/fonts/iconfont.css' //导入字体图标

//导入富文本编辑器和对应的样式
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import 'nprogress/nprogress.css'

Vue.prototype.$http = axios

//使用插件
Vue.use(VueQuillEditor, /* { default global options } */)
Vue.component('tree-table', ZkTable)

Vue.config.productionTip = false

Vue.filter('dataFormat', function (originVal) {
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
