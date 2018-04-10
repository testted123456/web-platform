import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Home from './home/homeRouter.js'
import ApisInfoCheck from '@/views/testCase/apisInfoCheckComponent.vue'
import ApiExecuteResult from '@/views/testCase/apiExecuteResult.vue'
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
    },
    {
      path:'/apiExecuteResult',
      name:'ApiExecuteResult',
      component:ApiExecuteResult
    }
  ]
})
