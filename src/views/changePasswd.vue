<template>
    <div class="loginShow" v-if="ifLoginShow">
    <div class="login-center">
      <div class="logo"><img src="../assets/logo88.png" alt="element-logo" ></div>
      <el-form ref="form"  :model="formData">
        <el-form-item label="初始密码：" prop="password0" :rules="[{ required: true, message: '用户名不能为空'} ]">
          <el-input v-model="formData.password0" placeholder="输入初始密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码："  prop="password1" :rules="[{ required: true, message: '新密码不能为空'} ]">
          <el-input type="password"  v-model="formData.password1" placeholder="输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="再次输入新密码："  prop="password2" :rules="[{ required: true, message: '新密码不能为空'} ]">
          <el-input type="password"  v-model="formData.password2" placeholder="再次输入新密码"  @keyup.native="checkSubmit"></el-input>
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
        ifLoginShow:true,
        loginState:'登录',
        loading: false,
        formData: {
          password0:'',
          password1:'',
          password2:''
        }
      };
  },
   mounted() {
     // this.checkLogin();
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
        });
    },

    login(){
      // 判断input是否为空
      var  vueThis = this;
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return false;
        } else {
          this.loginState = '登录中';
          this.loading = true;

          vueThis.usrAxios({
            method: 'post',
            data: this.formData,
            url: 'user/login'
          }).then(function (res) {
            if (res.data.code === 10000) {
              vueThis.$router.push('/home/welcome');

              //修改登录用户信息
              var userInfo = {
                username: res.data.data.username,
                nickname: res.data.data.nickname
              }
              vueThis.$store.commit('permission/' + 'changeUserInfo', userInfo)

              //修改用户权限
              if (res.data.data.roles === undefined || res.data.data.roles === 'undefined') {
                var permissData = {
                  del: false,
                  save: false,
                  add: false
                }
              } else if (res.data.data.roles.length == 0) {
                vueThis.$message.error('请去联系管理员添加角色');
              } else if (res.data.data.roles.length == 1) {
                var roleName = res.data.data.roles[0].roleName;
                if (roleName == 'testLeader' || roleName == 'testManger' || roleName == 'admin') {
                  var permissData = {
                    del: true,
                    save: true,
                    add: true
                  }
                } else {
                  var permissData = {
                    del: false,
                    save: false,
                    add: false
                  }
                }

              }

              vueThis.$store.commit('permission/' + 'changeDBgroup', permissData)

            } else {
              vueThis.$message.error('登陆失败：' + res.data.msg);
              vueThis.loginState = '登录';
              vueThis.loading = false;
              return;
            }
          }).catch(function (err) {
            vueThis.$message.error(err);
            vueThis.loginState = '登录';
            vueThis.loading = false;
            return;
          });


        }
      });
    },
    checkSubmit(event) {
      if (event.keyCode == 13){
        // this.login();
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
    width: 600px;
    margin: 160px auto 0;
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

