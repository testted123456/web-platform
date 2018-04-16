import FlowCase from '@/views/flowCase/FlowCase'
import FlowCaseDir from '@/views/flowCase/FlowCaseDir'
import FlowCaseMain from '@/views/flowCase/FlowCaseMain'

export default {
  path: 'flowCase',
  name: 'FlowCaseMain',
  component: FlowCaseMain,

  children: [
    {
      path: 'flowCase',
      name: 'FlowCase',
      component: FlowCase
    },
    {
      path: 'flowCaseDir',
      name: 'FlowCaseDir',
      component: FlowCaseDir
    }
  ]
}
