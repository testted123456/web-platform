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
              <i class="el-icon-menu"></i>
              <span slot="title">静态代码检测</span>
            </el-menu-item>

            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">代码覆盖率统计</span>
            </el-menu-item>

            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>数据生成器</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="3-1">手机号码生成器</el-menu-item>
                <el-menu-item index="3-2">身份证生成器</el-menu-item>
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
    name: 'ToolsMain',
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
              this.$router.push({name: 'CodeCheck'});
            }
            break;
            case '2':{
              this.$router.push({name: 'CoverageStatistics'});
            }
            break;
            case '3-1':{
              this.$router.push({name: 'MobileCodeBuild'});
            }
              break;
            case '3-2':{
              this.$router.push({name: 'IdCardCodeBuild'});
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
