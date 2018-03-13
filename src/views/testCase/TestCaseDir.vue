<template>
  <el-container  style="font-size: 0.875em;">
      <el-main>
        <el-form   ref="testCaseDir"  :label-position="labelPosition"  label-width="150px" :model="testCaseDirInfo" style="width:78%;">
          <el-form-item label="用例目录名称" prop="name" :rules="[{ required: true, trigger: 'blur',message: '用例目录名称不能为空'} ]">
            <el-input v-model="testCaseDirInfo.name" placeholder="请输入用例目录名称"></el-input>
          </el-form-item>
          <el-form-item label="用例目录描述" prop="description" :rules="[{ required: false, trigger: 'blur',message: '用例目录描述不能为空'} ]">
            <el-input v-model="testCaseDirInfo.description" placeholder="请输入用例目录描述"></el-input>
          </el-form-item>
        </el-form>
      </el-main>
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
        labelPosition:'right',
        testCaseDirInfo: {
          id: '',
          name: '',
          description: '',
          pId: '',
          type:false
        }
      }
    },
    methods: {
      saveApi(){
        var caseDirID = this.$route.query.id;
        var caseDirThis = this;
        this.$refs['testCaseDir'].validate((valid) => {
          if (valid) {
            if(caseDirID == 0){    /////////////////////////////////新增界面 确认按钮事件
              this.testCaseDirInfo.pId = this.$route.query.pId;
              this.$http.post(this.testCaseServer+"testCase/addCaseDir",this.testCaseDirInfo).then(function (res) {
                if(res.data.code === 10000){
                  this.$message({
                    message: '恭喜你，新增用例成功',
                    type: 'success'
                  });
                  // 跳转到当且caseDir的详情页
                  //存数据  树节点刷新
                  this.$store.commit('changeTestCaseStatus', 1);
                  this.testCaseDirInfo.id = res.data.data.id;
                  this.$store.commit('setNewTestCase', this.testCaseDirInfo);
                  this.$router.push({name: 'TestCaseDir', query: {id: res.data.data.id}});
                }else{
                  this.$message.error('抱歉，新增用例目录失败：' + res.data.msg);
                }
              },function (res) {
                this.$message.error('抱歉，新增用例目录失败：' + res.data.msg);
              });
            }else{     /////////////////////////编辑界面 确认按钮事件

            }
          } else {
            return false;
          }
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

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
