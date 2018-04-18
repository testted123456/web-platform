<template>
  <div v-if="ifLoginShow">
    <div class="login-center">
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
          url: 'env/getAllEnvs'
        }).then(function (res) {
          if(res.data.code === 10000){
            vueThis.$router.push('/home/welcome');
          }else {
            this.ifLoginShow = true;
          }
        }).catch(function (err) {
          this.ifLoginShow = true;
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
            }else {
              vueThis.$message.error('登陆失败：' + res.data.msg);
              this.loginState = '登录';
              this.loading = false;
              return;
            }
          }).catch(function (err) {
            vueThis.$message.error('抱歉，服务器异常！' );
            this.loginState = '登录';
            this.loading = false;
            return;
          });



//          this.cookieManager.saveCookie("name",this.formData.account,"23");
//          this.cookieManager.saveCookie("pws",this.formData.pws,"23");
//          this.cookieManager.getCookie("name");
//          this.cookieManager.getCookie("pws");


//          this.$http.post("http://localhost:8082/inter/api/addApi").then(function (res) {
//            if(res.data.succeed){
//              this.$router.push('/home/welcome');
//            }else{
//            }
//          }, function (res) {
//          });


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
  .login-center{
    width:330px;
    margin:200px auto 0;
  }
</style>

