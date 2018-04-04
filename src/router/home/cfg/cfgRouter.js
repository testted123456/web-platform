import CfgMain from '@/views/cfg/CfgMain'
import GVar from '@/views/cfg/GVar'
import DBCfg from '@/views/cfg/DBCfg'
import DBGroup from '@/views/cfg/DBGroup'
import EnvDB from '@/views/cfg/EnvDB'
import SysGit from '@/views/cfg/SysGit'
import SysBranch from '@/views/cfg/SysBranch'
import EnvSys from '@/views/cfg/EnvSys'

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
      path: 'envDB',
      name: 'EnvDB',
      component: EnvDB
    },
    {
      path: 'envSys',
      name: 'EnvSys',
      component: EnvSys
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
