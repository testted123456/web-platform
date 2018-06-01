import ToolsMain from '@/views/tools/ToolsMain'
import CodeCheck from '@/views/tools/CodeCheck'
import CoverageStatistics from '@/views/tools/coverageStatistics'
import MobileCodeBuild from '@/views/tools/mobileCodeBuild'
import IdCardCodeBuild from '@/views/tools/idCardCodeBuild'
import BankCardCodeBuild from '@/views/tools/bankCardCodeBuild'



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
    },
    {
      path: 'mobileCodeBuild',
      name: 'MobileCodeBuild',
      component: MobileCodeBuild
    },
    {
      path: 'idCardCodeBuild',
      name: 'IdCardCodeBuild',
      component: IdCardCodeBuild
    },
    {
      path: 'bankCardCodeBuild',
      name: 'BankCardCodeBuild',
      component: BankCardCodeBuild
    }



  ]
}
