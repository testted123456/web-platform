import Group from '@/views/group/Group'
import GroupDir from '@/views/group/GroupDir'
import GroupMain from '@/views/group/GroupMain'

export default {
  path: 'group',
  name: 'GroupMain',
  component: GroupMain,
  children: [
    {
      path: 'group',
      name: 'Group',
      component: Group
    },
    {
      path: 'groupDir',
      name: 'GroupDir',
      component: GroupDir
    }
  ]
}
