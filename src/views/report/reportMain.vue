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
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>接口统计</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1-1">按系统统计</el-menu-item>
            <el-menu-item index="1-2">按引用统计</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>用例统计</span>
          </template>
          <el-menu-item-group>
            <!--<el-menu-item index="2-1">按系统统计</el-menu-item>-->
            <el-menu-item index="2-2">按引用统计</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>group统计</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="3-1">数量</el-menu-item>
            <el-menu-item index="3-2">成功率</el-menu-item>
            <!--<el-menu-item index="3-3">甘特图</el-menu-item>-->
            <el-menu-item index="3-4">详情</el-menu-item>
          </el-menu-item-group>

        </el-submenu>
        <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>Jenkins</span>
        </template>
          <el-menu-item-group>
            <el-menu-item index="4-1">打包结果</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <router-view></router-view>
  </el-container>
</template>

<script>
  export default {
    components: { },
    name: 'reportMain',
    data () {
      return {

      }
    },
    computed: {

    },
    mounted(){

    },
    watch: {

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
          case '1-1':{
            this.$router.push({name: 'ApiSystem'});
          }
          break;
          case '1-2':{
            this.$router.push({name: 'ApiQuote'});
          }
          break;
          case '2-1':{
            this.$router.push({name: 'CaseSystem'});
          }
          break;
          case '2-2':{
            this.$router.push({name: 'CaseQuote'});
          }
          break;
          case '3-1':{
            this.$router.push({name: 'GroupSum'});
          }
          break;
          case '3-2':{
            this.$router.push({name: 'GroupRate'});
          }
          break;
          case '3-3':{
            this.$router.push({name: 'gantetu'});
          }
          break;
          case '3-4':{
            this.$router.push({name: 'GroupDetail'});
          }
          break;
          case '4-1':{
            this.$router.push({name: 'JenkinsResult'});
          }
        }
      }
    }
  }
</script>

<style scoped>
  .el-menu-item{
    text-align: left;
  }

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
