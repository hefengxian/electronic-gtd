import Vue from 'vue'
import axios from 'axios'

// import 'iview/dist/styles/iview.css'
import IView from 'iview'

import App from './App'
import router from './router'
import store from './store'

import './assets/app.less'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(IView)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
