import ToolsMain from '@/views/tools/ToolsMain'
import CodeCheck from '@/views/tools/CodeCheck'
import CoverageStatistics from '@/views/tools/coverageStatistics'


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
    {
      path: 'coverageStatistics',
      name: 'CoverageStatistics',
      component: CoverageStatistics
    }
    // ,
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
