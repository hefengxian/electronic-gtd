import Vue from 'vue'
import axios from 'axios'

// import 'iview/dist/styles/iview.css'
import IView from 'iview'

import App from './App'
import router from './router'
import store from './store'
import dataStore from './plugin/datastore'

import './assets/app.less'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(IView)
Vue.use(dataStore)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
