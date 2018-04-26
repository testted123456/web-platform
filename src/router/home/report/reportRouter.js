import ReportMain from  '@/views/report/reportMain'
import ApiSystem from  '@/views/report/apiSystem'
import Quote from  '@/views/report/quote'

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
      path: 'quote',
      name: 'Quote',
      component: Quote
    }
  ]
}
