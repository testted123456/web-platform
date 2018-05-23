import MockMain from  '@/views/mock/MockMain'
import Mock from '@/views/mock/Mock'
import MockDir from '@/views/mock/MockDir'

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
    }
  ]
}
