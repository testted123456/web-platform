<template>
  <el-header class="qcHeader">
    <!--<div class="header-logo"><img src="../assets/logo3.png" alt="element-logo" ></div>-->
    <!--<div class="header-logo"><img src="../assets/logo_2.png" alt="element-logo" ></div>-->
    <div class="header-logo">欣象信息欢迎您！</div>
    <div class="user">{{$store.state.permission.userInfo.nickname}}</div>

    <el-menu :default-active="portalActiveIndex" class="el-menu-demo header-operations" mode="horizontal"
             @select="handleSelect"
             background-color="#428bca"
             text-color="#fff"
             active-text-color="#fff"
    >
      <el-menu-item index="1">接口</el-menu-item>
      <el-menu-item index="2">测试用例</el-menu-item>
      <!--<el-menu-item index="3">用例流</el-menu-item>-->
      <el-menu-item index="4">测试集</el-menu-item>
      <el-menu-item index="5">配置</el-menu-item>
      <el-menu-item index="6">报表</el-menu-item>
      <el-menu-item index="7">工具</el-menu-item>
      <el-menu-item index="8">Mock</el-menu-item>
      <!--<el-menu-item index="9">质量管理</el-menu-item>-->
      <el-menu-item index="9">App测试桩</el-menu-item>-
      <el-menu-item index="10" @click="loginOut">注销</el-menu-item>

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
            '/home/report',
            '/home/tools',
            '/home/mock',
            '/home/appMock'
        ]
    };
  },
  mounted () {

   },
  methods: {

    handleSelect(key, keyPath) {
        var index = key;
        if(index > 9){return}
        var routerName = this.routers[index - 1];
        this.$router.push(routerName);
    },
    loginOut(){
      // console.log('out')
      var vueThis = this;
      vueThis.usrAxios({
        method: 'get',
        url: 'user/logout'
      }).then(function (res) {
        if(res.data.code === 10000){
          vueThis.$router.push({name:'Login'});

        }else {
          vueThis.$message.error('退出失败：' + res.data.msg);

        }
      }).catch(function (err) {
        vueThis.$message.error('抱歉，服务器异常！' );

      });
    }
  }
}
</script>

<style>
  a{
    text-decoration:none;
  }
  .user{
    float: left;
    color: white;
    font-size: 24px;
    /*font-size: 150%;*/
    padding-top: 14px;
    font-family: STXingkai	;
    font-style: italic;
  }
    .qcHeader{
        width:100%;
        height: 61px !important;
        border-bottom: solid 1px #e6e6e6;
        background-color: #428bca;
    }
  .header-logo {
      display: inline-block;
      /*vertical-align: middle;*/
      width: 230px;
      float: left;
      padding-top: 14px;
      font-size: 24px;
      color:white;
      /*font-family: Hiragino Sans GB;*/
    font-family: STXingkai;

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
  /*.el-menu--horizontal {*/
      /*border-right: none;*/
      /*border-bottom: none;*/
  /*}*/

  /*.el-menu--horizontal>.el-menu-item {*/
      /*color: #fff;*/
  /*}*/
  /*.el-menu--horizontal>.el-menu-item.is-active {*/
      /*border-bottom:4px solid #fff;*/
      /*color: #fff;*/
      /*background-color: transparent;*/
  /*}*/
  /*.el-menu--horizontal .el-menu-item:not(.is-disabled):focus, .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {*/
      /*outline: 0;*/
      /*color: #fff;*/
      /*background-color: #428bca;*/
      /*border-bottom:4px solid #fff;*/
  /*}*/
  /*.el-menu--horizontal>.el-menu-item a, .el-menu--horizontal>.el-menu-item a:hover {*/
      /*color: inherit;*/
  /*}*/
</style>
