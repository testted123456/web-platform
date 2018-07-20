import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import ChangePasswd from '@/views/changePasswd'
import Home from './home/homeRouter.js'
import ApisInfoCheck from '@/views/testCase/apisInfoCheckComponent.vue'
import AceTest from '@/views/AceTest'
import Echart from '@/views/echartDemo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/changePasswd',
      name: 'ChangePasswd',
      component: ChangePasswd
    },
    Home,
    {
      path:'/apisInfoCheck',
      name:'ApisInfoCheck',
      component:ApisInfoCheck
    },
    {
      path:'/ace',
      name:'AceTest',
      component:AceTest
    },
    {
      path:'/echart',
      name:'Echart',
      component:Echart
    }
  ]
})
