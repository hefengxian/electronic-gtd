import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main-layout',
      component: () => import('../components/main-layout'),
      children: [
        {
          path: '/',
          component: () => import('../components/todo/todo')
        },
        {
          path: 'todo',
          name: 'todo',
          component: () => import('../components/todo/todo')
        },
        {
          path: '/landing-page',
          name: 'landing-page',
          component: () => import('../components/LandingPage')
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
