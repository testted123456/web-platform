<template>
  <el-header class="qcHeader">
    <div class="header-logo"><img src="../assets/logo3.png" alt="element-logo" ></div>

    <el-menu :default-active="portalActiveIndex" class="el-menu-demo header-operations" mode="horizontal"
             @select="handleSelect">
      <el-menu-item index="1">接口</el-menu-item>
      <el-menu-item index="2">测试用例</el-menu-item>
      <el-menu-item index="3">用例流</el-menu-item>
      <el-menu-item index="4">测试集</el-menu-item>
      <el-menu-item index="5">配置</el-menu-item>
      <!--<el-menu-item index="6">监控</el-menu-item>-->
      <el-menu-item index="7">报表</el-menu-item>
      <el-menu-item index="8">工具</el-menu-item>
      <el-menu-item index="9">质量管理</el-menu-item>
      <el-menu-item index="10">注销</el-menu-item>
    </el-menu>
  </el-header>
</template>

<script>

  export default {
  name: 'app',
  data() {
    return {
        portalActiveIndex: '-1',
        routers: [
            '/home/api',
            '/home/case',
            '/home/flowCase',
            '/home/group',
            '/home/cfg',
            '/home/gjhgkjgkjhkhj',
            '/home/report'
        ]
    };
  },
  mounted () {

   },
  methods: {

    handleSelect(key, keyPath) {
        var index = key;
        if(index > 8){return}
        var routerName = this.routers[index - 1];
        this.$router.push(routerName);
    }
  }
}
</script>

<style>
  a{
    text-decoration:none;
  }
    .qcHeader{
        width:100%;
        height: 60px !important;
        border-bottom: solid 1px #e6e6e6;
        background-color: #428bca;
    }
  .header-logo {
      display: inline-block;
      vertical-align: middle;
      width: 190px;
      float: left;
      padding-top: 6px;
  }
  .header-logo img{
      width:100%;
  }
  .header-operations{
      display: inline-block;
      float: right;
      padding-right: 30px;
      height: 100%;
      background-color: transparent;
  }
  .el-menu--horizontal {
      border-right: none;
      border-bottom: none;
  }

  .el-menu--horizontal>.el-menu-item {
      color: #fff;
  }
  .el-menu--horizontal>.el-menu-item.is-active {
      border-bottom:4px solid #fff;
      color: #fff;
      background-color: transparent;
  }
  .el-menu--horizontal .el-menu-item:not(.is-disabled):focus, .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
      outline: 0;
      color: #fff;
      background-color: #428bca;
      border-bottom:4px solid #fff;
  }
  .el-menu--horizontal>.el-menu-item a, .el-menu--horizontal>.el-menu-item a:hover {
      color: inherit;
  }
</style>
