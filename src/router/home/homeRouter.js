import Home from  '@/views/Home'
import Welcome from '@/views/welcome'
import Api from './api/apiRouter'
import TestCase from './testCase/testCaseRouter'
import FlowCase from './flowCase/flowCaseRouter'
import Group from './group/groupRouter'
import Cfg from './cfg/cfgRouter'
import Report from './report/reportRouter'

export default {
  path: '/home',
  name: 'home',
  component: Home,
  children: [
    Api,
    TestCase,
    FlowCase,
    Group,
    Cfg,
    Report,
    {
      path: 'welcome',
      name: 'Welcome',
      component: Welcome
    }
  ]
}
