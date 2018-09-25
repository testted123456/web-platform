import MockMain from  '@/views/mock/MockMain'
import Mock from '@/views/mock/Mock'
import MockDir from '@/views/mock/MockDir'
import CallBack from '@/views/mock/CallBack'
import UnBindCallBack from '@/views/mock/UnBindCallBack'
import CallBackSMZF008 from '@/views/mock/CallBackSMZF008.vue'

export default {
  path: 'mock',
  name: 'MockMain',
  component: MockMain,
  children: [
    {
      path: 'mock',
      name: 'Mock',
      component: Mock
    },
    {
      path: 'mockDir',
      name: 'MockDir',
      component: MockDir
    },
    {
      path: 'CallBack',
      name: 'CallBack',
      component: CallBack
    },
    {
      path: 'UnBindCallBack',
      name: 'UnBindCallBack',
      component: UnBindCallBack
    },
    {
      path: 'CallBackSMZF008',
      name: 'CallBackSMZF008',
      component: CallBackSMZF008
    }
  ]
}
