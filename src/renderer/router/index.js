import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 不用异步组件
export default new Router({
  routes: [
    {
      path: '/',
      name: 'main-layout',
      component: require('../components/main-layout').default,
      children: [
        {
          path: '',
          component: require('../components/todo/todo').default
        },
        {
          path: 'todo',
          name: 'todo',
          component: require('../components/todo/todo').default
        },
        {
          path: 'landing-page',
          name: 'landing-page',
          component: require('../components/LandingPage').default
        },
        {
          path: 'file-tool',
          name: 'file-tool',
          component: require('../components/file-tool/file-tool').default
        }
      ]
    },
    {
      path: '*',
      redirect: '/todo'
    }
  ]
})
