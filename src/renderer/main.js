import Vue from 'vue'
import axios from 'axios'

// import 'iview/dist/styles/iview.css'
import IView from 'iview'

// https://hinesboy.github.io/mavonEditor/dist/
import 'mavon-editor/dist/css/index.css'
import './assets/mavon-override.less'
import MavonEditor from 'mavon-editor'

import App from './App'
import router from './router'
import store from './store'
import dataStore from './plugin/datastore'
import localStore from './plugin/local-store/'

import './assets/app.less'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(IView)
Vue.use(MavonEditor)
Vue.use(dataStore)
Vue.use(localStore)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
