import ReportMain from  '@/views/report/reportMain'
import ApiSystem from  '@/views/report/apiSystem'
import ApiBranch from  '@/views/report/apiBranch'

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
      path: 'apiBranch',
      name: 'ApiBranch',
      component: ApiBranch
    }
  ]
}
