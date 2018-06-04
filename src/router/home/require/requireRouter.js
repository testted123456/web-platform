import RequireMain from '@/views/require/requireMain'
import RequireManage from '@/views/require/requireManage'
import RequireDetail from '@/views/require/requireDetail'


export default {
  path: 'require',
  name: 'RequireMain',
  component: RequireMain,
  children: [
    {
      path: 'requireManage',
      name: 'RequireManage',
      component: RequireManage
    },
    {
      path: 'requireDetail',
      name: 'RequireDetail',
      component: RequireDetail
    }
  ]
}
