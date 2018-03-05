import Home from  '@/views/Home'
import Welcome from '@/views/welcome'
import Api from './api/apiRouter'
import TestCase from './testCase/testCaseRouter'
import Group from './group/groupRouter'

export default {
  path: '/home',
  name: 'home',
  component: Home,
  children: [
    Api,
    TestCase,
    Group,
    {
      path: 'welcome',
      name: 'Welcome',
      component: Welcome
    }
  ]
}
