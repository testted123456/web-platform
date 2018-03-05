import ApiMain from  '@/views/business/api/ApiMain'
import ApiNew from '@/views/business/api/ApiNew'
import ApiEdit from '@/views/business/api/ApiEdit'
import ApiDirNew from '@/views/business/api/ApiDirNew'
import ApiDirEdit from '@/views/business/api/ApiDirEdit'

export default {
  path: 'api',
  name: 'ApiMain',
  component: ApiMain,
  children: [
    {
      path: 'apiNew',
      name: 'ApiNew',
      component: ApiNew
    },
    {
      path: 'apiEdit/:id',
      name: 'ApiEdit',
      component: ApiEdit
    },
    {
      path: 'apiDirNew',
      name: 'ApiDirNew',
      component: ApiDirNew
    },
    {
      path: 'apiDirEdit/:id',
      name: 'ApiDirEdit',
      component: ApiDirEdit
    }
  ]
}
