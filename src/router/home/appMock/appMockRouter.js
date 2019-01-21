import AppMockMain from '@/views/appMock/AppMockMain'
import AppMockNew from '@/views/appMock/AppMockNew'
import AppMockEdit from '@/views/appMock/AppMockEdit'
import AppMockDirNew from '@/views/appMock/AppMockDirNew'
import AppMockDirEdit from '@/views/appMock/AppMockDirEdit'

export default {
  path: 'appMock',
  name: 'AppMockMain',
  component: AppMockMain,
  children: [
    {
      path: 'appMockNew',
      name: 'AppMockNew',
      component: AppMockNew
    },
    {
      path: 'appMockEdit/:id',
      name: 'AppMockEdit',
      component: AppMockEdit
    },
    {
      path: 'appMockDirNew',
      name: 'AppMockDirNew',
      component: AppMockDirNew
    },
    {
      path: 'appMockDirEdit/:id',
      name: 'AppMockDirEdit',
      component: AppMockDirEdit
    }
  ]
}
