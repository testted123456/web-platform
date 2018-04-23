<template>
  <div class="loginShow" v-if="ifLoginShow">
    <div class="login-center">
      <div class="logo"><img src="../assets/logo88.png" alt="element-logo" ></div>
      <!--<div style="color:#444;font-size:24px;padding-bottom: 6px;">测试平台</div>-->

      <el-form ref="form"  label-width="1px" :model="formData">
        <el-form-item label="" prop="username" :rules="[{ required: true, message: '用户名不能为空'} ]">
          <el-input v-model="formData.username" placeholder="输入用户名"></el-input>
        </el-form-item>
        <el-form-item label=""  prop="password" :rules="[{ required: true, message: '密码不能为空'} ]">
          <el-input type="password"  v-model="formData.password" placeholder="输入密码"  @keyup.native="checkSubmit"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login" style="width:330px;" :loading="loading">{{loginState}}</el-button>
        </el-form-item>
      </el-form>

    </div>

  </div>
</template>


<script>
 export default {
    data() {
    return {
      ifLoginShow:false,
      loginState:'登录',
      loading: false,
      formData: {
        username:'',
        password:''
      }

    };
  },
   created() {
     this.checkLogin();
   },
  methods: {
    checkLogin(){

        var vueThis = this;
        vueThis.usrAxios({
          method: 'get',
          url: '/user/getUserBySession'
        }).then(function (res) {
          if(res.data.code === 10000){
            vueThis.$router.push('/home/welcome');
          }else {
            vueThis.ifLoginShow = true;   //让登录输入框显示出来
          }
        }).catch(function (err) {
          vueThis.ifLoginShow = true;
          vueThis.$message.error('抱歉，服务器异常！' );
        });
    },

    login(){

      // 判断input是否为空
      var  vueThis = this;
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loginState = '登录中';
          this.loading = true;


          vueThis.usrAxios({
            method: 'post',
            data: this.formData,
            url: 'user/login'
          }).then(function (res) {
            if(res.data.code === 10000){
              vueThis.$router.push('/home/welcome');

              vueThis.userInfo.name = res.data.data.username;

            }else {
              vueThis.$message.error('登陆失败：' + res.data.msg);
              vueThis.loginState = '登录';
              vueThis.loading = false;
              return;
            }
          }).catch(function (err) {
            vueThis.$message.error('抱歉，服务器异常！' );
            vueThis.loginState = '登录';
            vueThis.loading = false;
            return;
          });


        } else {
          return false;
        }
      });
    },
    checkSubmit(event) {
      if (event.keyCode == 13){
        this.login();
      }
    }

  }
}
</script>

<style>
  html,body{
    width:100%;
    height:100%;
  }
  .loginShow{
    width:100%;
    height:100%;
    position: fixed;
    top:0;
    left:0;
    background-image: url("../assets/loginbg.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  .login-center{
    width: 330px;
    margin: 200px auto 0;
    /*border: 1px solid #ccc;*/
    padding: 51px 50px 20px;
    border-radius: 5px;
    background: #fff;
  }
  .logo{
    width:100px;
    height:100px;
    margin:0 auto;
  }
  .logo img{
    width:100%;
  }
</style>

