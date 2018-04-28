import MockMain from  '@/views/mock/MockMain'
import MockNew from '@/views/mock/MockNew'
import MockEdit from '@/views/mock/MockEdit'
import MockDirNew from '@/views/mock/MockDirNew'
import MockDirEdit from '@/views/mock/MockDirEdit'

export default {
  path: 'mock',
  name: 'MockMain',
  component: MockMain,
  children: [
    {
      path: 'mockNew',
      name: 'MockNew',
      component: MockNew
    },
    {
      path: 'mockEdit/:id',
      name: 'MockEdit',
      component: MockEdit
    },
    {
      path: 'mockDirNew',
      name: 'MockDirNew',
      component: MockDirNew
    },
    {
      path: 'mockDirEdit/:id',
      name: 'MockDirEdit',
      component: MockDirEdit
    }
  ]
}
