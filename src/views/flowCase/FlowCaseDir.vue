<template>
  <el-container  style="font-size: 0.875em;">
      <el-main>
        <el-form   ref="flowCaseDir"  :label-position="labelPosition"  label-width="150px" :model="flowCaseDirInfo" style="width:78%;">
          <el-form-item label="用例流目录名称" prop="name" :rules="[{ required: true, trigger: 'blur',message: '用例流目录名称不能为空'} ]">
            <el-input v-model="flowCaseDirInfo.name" placeholder="请输入测试集目录名称"></el-input>
          </el-form-item>
          <el-form-item label="用例流目录描述" prop="description" :rules="[{ required: false, trigger: 'blur',message: '用例流目录描述不能为空'} ]">
            <el-input v-model="flowCaseDirInfo.description" placeholder="请输入用例流目录描述"></el-input>
          </el-form-item>
        </el-form>
      </el-main>
      <el-footer style="text-align: right;">
        <el-button type="primary" @click="saveFlowCase">确认</el-button>
      </el-footer>
  </el-container>

</template>

<script>

  export default {
    components: {},
    name: 'FlowCaseDir',
    data () {
      return {
        labelPosition:'right',
        flowCaseDirInfo: {
          id: '',
          name: '',
          description: '',
          pId: '',
          type:0
        }
      }
    },
    watch:{
      $route(){
        this.getData();
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      getData(){
        var flowCaseDirID = this.$route.query.id;
        var vueThis = this;
        if(flowCaseDirID == 0){
            this.flowCaseDirInfo= {
                id: '',
                name: '',
                description: '',
                pId: '',
                type:0
            }
        }else{
          vueThis.testCaseAxios({
            method: 'get',
            data: {
            },
            url: 'flowCase/getById?id='+ flowCaseDirID
          })
          .then(function (res) {
            if(res.data.code === 10000){
              vueThis.flowCaseDirInfo= {
                id: res.data.data.id,
                name: res.data.data.name,
                description: res.data.data.description,
                pId: res.data.data.pId,
                type:res.data.data.type
              }
            }else{
              vueThis.$message.error('抱歉，获取信息失败：' + res.data.msg);
            }
          })
          .catch(function (err) {
            vueThis.$message.error(err);
          });
        }
      },
      saveFlowCase(){
        var flowCaseDirID = this.$route.query.id;
        this.$refs['flowCaseDir'].validate((valid) => {
          if (valid) {
            if(flowCaseDirID == 0){    /////////////////////////////////新增界面 确认按钮事件
              this.flowCaseDirInfo.pId = this.$route.query.pId;
              this.submitAjax();
            }else{     /////////////////////////编辑界面 确认按钮事件
              this.submitAjax();
            }
          } else {
            return false;
          }
        });
      },
      //确认按钮ajax事件
      submitAjax(){
        var flowCaseDirThis = this;
        flowCaseDirThis.testCaseAxios({
            method: 'post',
            data: flowCaseDirThis.flowCaseDirInfo,
            url: 'flowCase/addOrUpdate'
          })
          .then(function (res) {
            if(res.data.code === 10000){
              flowCaseDirThis.$message({
                message: '恭喜你，更新用例流目录成功',
                type: 'success'
              });
              //存数据  树节点刷新
              if(flowCaseDirThis.$route.query.id == 0){
                flowCaseDirThis.$store.commit('changeFlowCaseStatus', 1);
                flowCaseDirThis.flowCaseDirInfo.id = res.data.data.id;
                flowCaseDirThis.$store.commit('setNewFlowCase', flowCaseDirThis.flowCaseDirInfo);
                flowCaseDirThis.$router.push({name: 'FlowCaseDir', query: {id: res.data.data.id}});
              }else{
                flowCaseDirThis.$store.commit('changeFlowCaseStatus', 2);
                flowCaseDirThis.flowCaseDirInfo = res.data.data;
                flowCaseDirThis.$store.commit('setNewFlowCase', flowCaseDirThis.flowCaseDirInfo);
              }

            }else{
              flowCaseDirThis.$message.error('抱歉，新增用例流目录失败：' + res.data.msg);
            }
          })
          .catch(function (err) {
            flowCaseDirThis.$message.error(err);
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
