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
            <i class="el-icon-location"></i>
            <span>导航一</span>
          </template>
          <el-menu-item-group>
            <template slot="title">分组一</template>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-4">
            <template slot="title">选项4</template>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">导航二</span>
        </el-menu-item>
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
            this.$router.push({name: 'Reportchart'});
          }
            break;
          case '1-2':{
            this.$router.push({name: 'Reportchart2'});
          }
            break;

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
