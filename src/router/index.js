import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Home from './home/homeRouter.js'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    Home
  ]
})
