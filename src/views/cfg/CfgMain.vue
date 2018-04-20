<template>
  <el-container>
    <el-aside width="240px" style="border-right:1px solid #e6e6e6">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            @select="select"
            style="border-right:0px solid #e6e6e6">
            <el-menu-item index="1">
              <i class="el-icon-setting"></i>
              <span slot="title">全局变量</span>
            </el-menu-item>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span>数据库配置</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="2-1">数据库分组</el-menu-item>
                <el-menu-item index="2-2">数据库地址</el-menu-item>
              </el-menu-item-group>

            </el-submenu>

            <!--<el-menu-item index="3">-->
              <!--<i class="el-icon-setting"></i>-->
              <!--<span slot="title">环境配置</span>-->
            <!--</el-menu-item>-->

            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span>环境配置</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="3-1">环境-数据库</el-menu-item>
                <el-menu-item index="3-2">环境-系统</el-menu-item>
              </el-menu-item-group>

            </el-submenu>

            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span>系统配置</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="4-1">git地址</el-menu-item>
                <el-menu-item index="4-2">git分支</el-menu-item>
              </el-menu-item-group>

            </el-submenu>

            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span>权限配置</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="6">角色</el-menu-item>
                <el-menu-item index="7">用户</el-menu-item>
                <el-menu-item index="8">权限</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
    </el-aside>
    <router-view></router-view>
  </el-container>
</template>

<script>
  import ElAside from "../../../node_modules/element-ui/packages/aside/src/main";

  export default {
    components: {ElAside},
    name: 'CfgMain',
    data () {
      return {

      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      select(index, indexPath){
          switch (index){
            case '1':{
              this.$router.push({name: 'GVar'});
            }
            break;
            case '2-1':{
              this.$router.push({name: 'DBGroup'});
            }
            break;
            case '2-2':{
              this.$router.push({name: 'DBCfg'});
            }
            break;
            case '3-1':{
              this.$router.push({name: 'EnvDB'});
            }
            break;
            case '3-2':{
              this.$router.push({name: 'EnvSys'});
            }
              break;
            case '4-1':{
              this.$router.push({name: 'SysGit'});
            }
            break;
            case '4-2':{
              this.$router.push({name: 'SysBranch'});
            }
            break;
            case '6':{
              this.$router.push({name: 'Role'});
            }
            break;
            case '7':{
              this.$router.push({name: 'User'});
            }
            break;
            case '8':{
              this.$router.push({name: 'Privilege'});
            }
              break;
          }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .el-menu-item{
    text-align: left;
  }

  /*.el-submenu__title{*/
    /*text-align: left;*/
  /*}*/

  .el-submenu{
    text-align: left;
  }

  .el-submenu__title{
    text-align: left;
  }

  .el-icon-setting{
    text-align: left;
  }

</style>
