<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    mounted() {
      console.log('first')
      this.getRights();
    },
    methods:{
      //获取用户权限
      getRights(){

        var vueThis = this;

        vueThis.usrAxios({
          method: 'get',
          url: '/user/getUserBySession'
        }).then(function (res) {
          if(res.data.code === 10000){
            var roles = res.data.data.roles;
            // var roleName = roles[0].roleName;

            var userInfo={
              username:res.data.data.username,
              nickname:res.data.data.nickname
            }
            vueThis.$store.commit( 'permission/' + 'changeUserInfo', userInfo)


            console.log(vueThis.$store.state.permission.userInfo.nickname)


            if(roles.length == 0){
              vueThis.$message.error('请去联系管理员添加角色' );
            }else if(roles.length == 1){

              var permissData={
                del:true,
                edit:false
              }
              vueThis.$store.commit( 'permission/' + 'changeDBgroup', permissData)


              // if(roleName == 'tester'){
              //
              //
              // }

            }
          }
        })
        .catch(function (err) {
          console.log(err);
          vueThis.$router.push({name: 'Login'});
        });
      }
    }
  }
</script>

<style>
    html,body{
        margin:0 !important;
        height:100%;
        width:100%;
    }
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        overflow: auto;
        height:100%;
        /*margin-top: 60px;*/
    }
</style>
