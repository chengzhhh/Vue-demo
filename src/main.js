import Vue from 'vue'
/* //引入element ui组件 */
import ElementUI from 'element-ui'
/* //引入elementui css文件 */
import 'element-ui/lib/theme-chalk/index.css'
/* //引入App.vue */
import App from './App.vue'
import router from './router'
/* //引入公共样式 */
import './assets/common.css'
// 引入moment格式化时间插件
import moment from 'moment'
// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 引入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//  引入axios
import axios from 'axios'
Vue.prototype.axios = axios
// 定义过滤器，用于过滤时间
Vue.filter('dateFilter', (input, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input * 1000).format(format)
})
// 创建axios请求拦截，添加URL公共属性
axios.interceptors.request.use(
  function(config) {
    config.baseURL = 'http://localhost:8888/api/private/v1'
    config.headers.Authorization = localStorage.getItem('myToken')
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

/* //使用elementui */
Vue.use(ElementUI)
// 使用富文本编辑器
Vue.use(VueQuillEditor)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
