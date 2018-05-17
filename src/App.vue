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
            //修改登录用户信息
            var userInfo={
              username:res.data.data.username,
              nickname:res.data.data.nickname
            }
            vueThis.$store.commit( 'permission/' + 'changeUserInfo', userInfo)

            //修改用户权限
            if(res.data.data.roles === undefined || res.data.data.roles === 'undefined'){
              var permissData={
                del:false,
                save:false,
                add:false
              }
            }else if(res.data.data.roles.length == 0){
              vueThis.$message.error('请去联系管理员添加角色' );
            }else if(res.data.data.roles.length == 1){
              var roleName = res.data.data.roles[0].roleName;
              if(roleName == 'testLeader' || roleName =='testManger' || roleName == 'admin'){
                var permissData={
                  del:true,
                  save:true,
                  add:true
                }
              }else{
                var permissData={
                  del:false,
                  save:false,
                  add:false
                }
              }

            }

            vueThis.$store.commit( 'permission/' + 'changeDBgroup', permissData)
          }
        })
        .catch(function (err) {
          console.log('getUserBySession:' +err);
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
