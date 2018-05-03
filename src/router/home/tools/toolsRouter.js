import ToolsMain from '@/views/tools/ToolsMain'
import CodeCheck from '@/views/tools/CodeCheck'

export default {
  path: 'tools',
  name: 'ToolsMain',
  component: ToolsMain,
  children: [
    {
      path: 'codeCheck',
      name: 'CodeCheck',
      component: CodeCheck
    },
    // {
    //   path: 'mockEdit/:id',
    //   name: 'MockEdit',
    //   component: MockEdit
    // },
    // {
    //   path: 'mockDirNew',
    //   name: 'MockDirNew',
    //   component: MockDirNew
    // },
    // {
    //   path: 'mockDirEdit/:id',
    //   name: 'MockDirEdit',
    //   component: MockDirEdit
    // }
  ]
}
