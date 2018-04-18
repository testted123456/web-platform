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
      getRights(){
        var vueThis = this;
        vueThis.testCaseAxios({
          method: 'get',
          data: {
          },
          url: "testCase/getCaseById?id=" + 1
        })
          .then(function (res) {
            if(res.data.code === 10000){
              console.log('jkhkjhkjhjhkjhkjhkhhjkhjkhjkhkjhjjk')
            }
          })
          .catch(function (err) {
            vueThis.$message.error('抱歉，服务器异常！' );
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
