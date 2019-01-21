import ReportMain from  '@/views/report/reportMain'
import ApiSystem from  '@/views/report/apiSystem'
import ApiQuote from  '@/views/report/apiQuote'
import CaseSystem from  '@/views/report/caseSystem'
import CaseQuote from  '@/views/report/caseQuote'
import GroupSum from  '@/views/report/groupSum'
import GroupRate from  '@/views/report/groupRate'
import gantetu from  '@/views/report/gantetu'
import GroupDetail from '@/views/report/groupDetail'
import JenkinsResult from '@/views/report/jenkinsResult'

export default {
  path: 'report',
  name: 'ReportMain',
  component: ReportMain,
  children: [
    {
      path: 'apiSystem',
      name: 'ApiSystem',
      component: ApiSystem
    },
    {
      path: 'apiQuote',
      name: 'ApiQuote',
      component: ApiQuote
    },
    {
      path: 'caseSystem',
      name: 'CaseSystem',
      component: CaseSystem
    },
    {
      path: 'caseQuote',
      name: 'CaseQuote',
      component: CaseQuote
    },
    {
      path: 'groupSum',
      name: 'GroupSum',
      component: GroupSum
    },
    {
      path: 'groupRate',
      name: 'GroupRate',
      component: GroupRate
    },
    {
      path: 'groupDetail',
      name: 'GroupDetail',
      component: GroupDetail
    },
    {
      path: 'gantetu',
      name: 'gantetu',
      component: gantetu
    },
    {
      path: 'jenkinsResult',
      name: 'JenkinsResult',
      component: JenkinsResult
    }
  ]
}
