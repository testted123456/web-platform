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
        })
        .then(function (res) {
          if(res.data.code === 10000){
            var roles = res.data.data.roles;
            var roleName = roles[0].roleName;

            if(roles.length == 0){
              vueThis.$message.error('请去联系管理员添加角色' );
            }else if(roles.length == 1){
              if(roleName == 'tester'){

                vueThis.userInfo.name = res.data.data.username;

                var permissData={
                  del:false,
                  edit:false
                }
                vueThis.$store.commit( 'permission/' + 'changeDBgroup', permissData)

                console.log(permissData)
              }
            }
          }
        })
        .catch(function (err) {
          // vueThis.$message.error('抱歉，服务器异常！9999999999' );
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
