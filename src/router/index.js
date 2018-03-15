import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Home from './home/homeRouter.js'
import ApisInfoCheck from '@/views/testCase/apisInfoCheckComponent.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    Home,
    {
      path:'/apisInfoCheck',
      name:'ApisInfoCheck',
      component:ApisInfoCheck
    }
  ]
})
