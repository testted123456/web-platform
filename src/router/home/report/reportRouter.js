import ReportMain from  '@/views/report/reportMain'
import Reportchart from  '@/views/report/reportchart'
import Reportchart2 from  '@/views/report/reportchart2'

export default {
  path: 'report',
  name: 'ReportMain',
  component: ReportMain,
  children: [
    {
      path: 'reportchart',
      name: 'Reportchart',
      component: Reportchart
    },
    {
      path: 'reportchart2',
      name: 'Reportchart2',
      component: Reportchart2
    }
  ]
}
