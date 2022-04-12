import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css
import './utils/format' // new Date.format

import App from './App'
import store from './store'
import router from './router'
import VueResource from 'vue-resource'
import '@/icons' // icon
import '@/permission' // permission control

import VueClipboard from 'vue-clipboard2'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

import axios from 'axios'
// 挂在到Vue实例，后面可通过this调用
Vue.prototype.$http = axios

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// this.$http.jsonp
Vue.config.productionTip = false
Vue.use(VueResource)
// 剪切板
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
