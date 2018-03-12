<template>
  <el-container  id="testCaseDirEdit">
    <el-container >
      <el-main>
        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="4" >
            <label>用例目录名称:</label>
          </el-col>
          <el-col :span="16">
            <el-input v-model="api.name"  placeholder="请输入用例目录名称"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="4">
            <label>用例目录描述:</label>
          </el-col>
          <el-col :span="16">
            <el-input v-model="api.description" placeholder="请输入用例目录描述"></el-input>
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
    components: {},
    name: 'TestCaseDir',
    data () {
      return {
        api: {
          id: '',
          name: '',
          description: '',
          pId: '',
          type: true
        }
      }
    },
    methods: {
      saveApi(){
        this.api.pId = this.$route.query.pId;

        this.$http.post(this.testCaseServer+"addCaseDir", this.api).then(function (res) {
          this.$store.commit('changeStatus', 1);
          this.$store.commit('setNewApi', this.api);
          this.$router.push('/apiEdit');
        },function (res) {

        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #testCaseDirEdit {
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
