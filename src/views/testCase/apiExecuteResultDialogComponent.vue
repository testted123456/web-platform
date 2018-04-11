<template>

</template>

<script>

  export default {
    props: [],
    components: {},
    name: 'apiExecuteResultDialogComponent',
    data(){
      return {



      }
    },
    created(){
    },
    watch:{

    },
    mounted() {
    },
    methods: {
      getData() {
        var vueThis = this;
        var caseID = this.$route.query.testCaseId;
        // 获取表格内容
        vueThis.testCaseAxios({
          method: 'get',
          data: {},
          url: "testCase/checkCase?testCaseId=" + caseID
        })
          .then(function (res) {
            if (res.data.code === 10000) {
              vueThis.apisInfoCheck = res.data.data;
            }
          })
          .catch(function (err) {
            vueThis.$message.error('抱歉，服务器异常！');
          });
      },
    }
  }

</script>

<style scoped>
  .el-row {
    /*width:100%;*/
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    padding-top: 6px;
  }
  .font-center{
    text-align: center;
  }
  .font-blod{
    font-weight:bolder;
    color:#909399;
  }
  .json-box{
    display: block;
    margin:0;
    width:100%;
    height:200px;
    border:1px solid #ccc;
    border-radius: 4px;
    resize: none;
    outline: none;
    /*overflow: scroll;*/
  }
  .el-tree {
    margin-right: 2px;
  }
  .el-input--small{
    margin-left: 2px;
    margin-right:10px;
  }
  .el-input__inner{
    width: 80%;
    padding-right: 0px;
    overflow-x: hidden;
  }
  .vue-transfer-tree {
    border: 0.5px solid;
    border-radius: 5px;
    min-height: 500px;
    height: 500px;
    margin-left: 2px;
    margin-right: 2px;
    padding-right: 1px;
    overflow-y: auto;
    overflow-x: auto;
  }
  .vue-transfer-label{
    width: 100%;
    background:#f5f7fa;
    display: inline-block;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    min-height: 30px;
    margin-top:1px;
    padding-left: 3px;
    padding-top: 10px;
    font-weight: 500;
  }
  .vue-transfer-input{
    border-radius: 15px;
    margin-left:10%;
    margin-right: 10%;
    width: 80%;
    margin-top: 10px;
    min-height: 32px;
    border-width: 0.5px;
  }

</style>
