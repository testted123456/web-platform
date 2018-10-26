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
            <i class="el-icon-setting"></i>
            <span>快捷支付</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1-1">认证绑卡BK001</el-menu-item>
            <el-menu-item index="1-2">认证短信校验BK003</el-menu-item>
            <el-menu-item index="1-3">解绑卡BK004</el-menu-item>
            <el-menu-item index="1-4">快捷支付订单生成ZF001</el-menu-item>
            <el-menu-item index="1-5">快捷支付确认支付ZF003</el-menu-item>
            <el-menu-item index="1-6">支付查询CX002</el-menu-item>
            <el-menu-item index="1-7">支付清算TX8020</el-menu-item>
            <el-menu-item index="1-8">清算查询CX004</el-menu-item>
            <el-menu-item index="1-9">支付回调</el-menu-item>
            <el-menu-item index="1-10">解绑通知回调</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>银联扫码支付</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="2-1">扫码支付SMZF002</el-menu-item>
            <el-menu-item index="2-2">条码支付SMZF002</el-menu-item>
            <el-menu-item index="2-3">回调SMZF008</el-menu-item>
            <el-menu-item index="2-4">交易查询SMZF006</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>银行卡鉴权</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="3-1">瑞银信绑卡鉴权</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>身份证人工认证</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="4-1">敬众身份认证</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>活体识别</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="5-1">身份证正面照认证</el-menu-item>
            <el-menu-item index="5-2">身份证反面照认证</el-menu-item>
            <el-menu-item index="5-3">第一次身份信息核实</el-menu-item>
            <el-menu-item index="5-4">第二次身份信息核实</el-menu-item>
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
    name: 'MockMain',
    data () {
      return {

      }
    },
    methods: {
      handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath);
      },
      select(index, indexPath){
        switch (index){
          case '1-1':{
            this.$router.push({name: 'Mock', query: {name: "认证绑卡",code: "BK001", ctrl: "fastPay"}});
          }
          break;
          case '1-2':{
            this.$router.push({name: 'Mock', query: {name: "认证短信校验",code: "BK003", ctrl: "fastPay"}});
          }
          break;
          case '1-3':{
            this.$router.push({name: 'Mock', query: {name: "解绑卡",code: "BK004", ctrl: "fastPay"}});
          }
          break;
          case '1-4':{
            this.$router.push({name: 'Mock', query: {name: "快捷支付订单生成",code: "ZF001", ctrl: "fastPay"}});
          }
          break;
          case '1-5':{
            this.$router.push({name: 'Mock', query: {name: "快捷支付确认支付",code: "ZF003", ctrl: "fastPay"}});
          }
          break;
          case '1-6':{
            this.$router.push({name: 'Mock', query: {name: "支付查询",code: "CX002", ctrl: "fastPay"}});
          }
          break;
          case '1-7':{
            this.$router.push({name: 'Mock', query: {name: "支付清算",code: "TX8020", ctrl: "fastPay"}});
          }
          break;
          case '1-8':{
            this.$router.push({name: 'Mock', query: {name: "清算查询",code: "CX004", ctrl: "fastPay"}});
          }
          break;
          case '1-9':{
            this.$router.push({name: 'CallBack', query: {name: "fastPayCallBack"}});
          }
          break;
          case '1-10':{
            this.$router.push({name: 'UnBindCallBack', query: {name: "unBindCallBack"}});
          }
          break;
          case '2-1':{
            this.$router.push({name: 'Mock', query: {name: "扫码支付",code: "SMZF002", ctrl: "ydzf"}});
          }
          break;
          case '2-2':{
            this.$router.push({name: 'Mock', query: {name: "条码支付",code: "SMZF003", ctrl: "ydzf"}});
          }
          break;
          case '2-3':{
            this.$router.push({name: 'CallBackSMZF008', query: {name: "CallBackSMZF008"}});
          }
          break;
          case '2-4':{
            this.$router.push({name: 'Mock', query: {name: "交易查询",code: "SMZF006", ctrl: "ydzf"}});
          }
          break;
          case '3-1':{
            this.$router.push({name: 'Mock', query: {name: "瑞银信绑卡鉴权",code: "CardAuth", ctrl: "authencrypt"}});
          }
          break;
          case '4-1':{
            this.$router.push({name: 'Mock', query: {name: "敬众身份认证",code: "JZIDAuth", ctrl: "jz"}});
          }
          break;
          case '5-1':{
            this.$router.push({name: 'Mock', query: {name: "身份证正面照认证",code: "FaceFront", ctrl: "faceid"}});
          }
          break;
          case '5-2':{
            this.$router.push({name: 'Mock', query: {name: "身份证反面照认证",code: "FaceBack", ctrl: "faceid"}});
          }
          break;
          case '5-3':{
            this.$router.push({name: 'Mock', query: {name: "第一次身份信息核实",code: "FaceVerify1", ctrl: "faceid"}});
          }
          break;
          case '5-4':{
            this.$router.push({name: 'Mock', query: {name: "第二次身份信息核实",code: "FaceVerify2", ctrl: "faceid"}});
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
