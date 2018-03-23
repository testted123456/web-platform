import CfgMain from '@/views/cfg/CfgMain'
import GVar from '@/views/cfg/GVar'
import DBCfg from '@/views/cfg/DBCfg'
import DBGroup from '@/views/cfg/DBGroup'
import ENV from '@/views/cfg/ENV'
import SysGit from '@/views/cfg/SysGit'
import SysBranch from '@/views/cfg/SysBranch'

export default {
  path: 'cfg',
  name: 'CfgMain',
  component: CfgMain,
  children: [
    {
      path: 'gVar',
      name: 'GVar',
      component: GVar
    },
    {
      path: 'dbCfg',
      name: 'DBCfg',
      component: DBCfg
    },
    {
      path: 'dbGroup',
      name: 'DBGroup',
      component: DBGroup
    },
    {
      path: 'env',
      name: 'ENV',
      component: ENV
    },
    {
      path: 'sysGit',
      name: 'SysGit',
      component: SysGit
    },
    {
      path: 'sysBranch',
      name: 'SysBranch',
      component: SysBranch
    }
  ]
}
