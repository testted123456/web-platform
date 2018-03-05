<template>
  <el-container  id="apiEdit">
    <el-container >
      <el-main>
        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="4" >
            <label>API目录名称:</label>
          </el-col>
          <el-col :span="16">
            <el-input v-model="api.name"  placeholder="请输入接口目录名称"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="4">
            <label>API目录描述:</label>
          </el-col>
          <el-col :span="16">
            <el-input v-model="api.description" placeholder="请输入接口目录描述"></el-input>
          </el-col>
        </el-row>

      </el-main>
    </el-container>
    <el-footer style="text-align: right;">
      <el-button type="primary" @click="saveApi">确认</el-button>
      <el-button>取消</el-button>
    </el-footer>
  </el-container>

</template>

<script>
  export default {
    name: 'ApiDirEdit',
    data () {
      return {
        api: {}
      }
    },

    computed: {
      id: function () {
        return this.$route.params.id;
      }
    },

    created() {
      this.init();
    },

    watch:{
      id: function () {
        this.init();
      }
    },

    methods: {
      init(){
        this.$http.get(this.apiServer + "api/getApi?id=" + this.$route.params.id).then(function (res) {
          if(res.data.code == '10000'){
            this.api = res.data.data;
          }
        },function (res) {
        });
      },

      saveApi(){
        this.$http.post("http://localhost:8082/inter/api/addApiDir", this.api).then(function (res) {
          if(res.data.code == '10000'){
            this.$message({
              message: '恭喜你，更新接口成功',
              type: 'success'
            });

            this.api.id = res.data.data.id;
          }else{
            this.$message.error('抱歉，更新接口失败：' + res.data.msg);
          }
        },function (res) {
          this.$message.error('服务器请求失败！');
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #apiEdit {
    font-size: 0.875em;
  }
  .el-row {
    width: 100%;
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  .el-col {
    text-align: left;
  }
  .el-main {
    padding-right: 20%;
    padding-top: 30px;
  }
  .el-container {
    margin-left: 30px;
    margin-top: 5px;
  }
</style>
