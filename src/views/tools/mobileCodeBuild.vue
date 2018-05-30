<template>
  <el-container>
    <el-main>
      <div style="padding-left: 160px;padding-top: 40px;">
        <!--表单-->
        <el-form   ref="identityInfo"  :label-position="labelPosition"  label-width="100px" :model="identityInfo">

          <!--环境-->
          <el-form-item label="环境" prop="env" :rules="[{ required: true, message: '环境不能为空'} ]" style="text-align: left">
            <el-col :span="8">
              <el-select v-model="identityInfo.env" placeholder="请选择">
                <el-option
                  v-for="item in enviornment"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <!--流程用例-->
          <el-form-item label="是否注册" prop="caseType" :rules="[{ required: true, message: '不能为空'} ]" style="text-align: left">
            <el-radio v-model="identityInfo.caseType" label="true">已注册</el-radio>
            <el-radio v-model="identityInfo.caseType" label="false">未注册</el-radio>
          </el-form-item>
        </el-form>

        <el-row>
          <el-col :span="8" style="text-align: center">
            <el-button type="primary" @click="makeID">点击生成</el-button>
          </el-col>
        </el-row>
        <el-row v-show="ifShow">
          <el-col :span="8" style="text-align: left">
            <el-input v-model="idCardInfo" placeholder="生成的id信息"></el-input>
          </el-col>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  export default{
    name: 'idCardCodeBuild',
    data() {
      return {
        ifShow:false,
        labelPosition:'left',
        idCardInfo:'',
        identityInfo:{
          env:'',
          caseType:'false'

        },
        enviornment:[],

      }
    },

    computed:{

    },

    created(){
    },

    methods: {
      getData(){
        var vueThis = this;
        //获取环境列表select
        this.testCaseAxios({
          method: 'get',
          url: "env/getAllEnvs"
        })
          .then(function (res) {
            if(res.data.code === 10000){
              var tempEnviornment = [];
              res.data.data.forEach(function (e, index) {
                tempEnviornment.push({value: e.name, label: e.name})
              });
              vueThis.enviornment = tempEnviornment;
              ///////////////////////获取环境信息成功之后 再去获取页面其他信息

              if (caseID == 0){   //新增case页面
                vueThis.testCase = {
                  caseType:'false',
                  env:vueThis.enviornment[0].value,
                  type:true,
                  system:vueThis.apiSystems[0].value
                }
                vueThis.testCase.testCaseInterfaces = [];
                vueThis.copyCaseShow = true;
              }else{
                // case编辑页面
                // 获取测试用例详情信息内容
                vueThis.copyCaseShow = false;
                vueThis.executeBtnShow = true;//执行按钮显示
                vueThis.testCaseAxios({
                  method: 'get',
                  url: "testCase/getCaseById?id=" + caseID
                })
                  .then(function (res) {
                    if(res.data.code === 10000){
                      vueThis.testCase = res.data.data;
                      if(vueThis.testCase.caseType){
                        vueThis.testCase.caseType = "true"
                      }else{
                        vueThis.testCase.caseType = "false"
                      }

                    }else{
                      vueThis.$message.error(res.data.msg);
                    }
                  })
                  .catch(function (err) {
                    vueThis.$message.error(err);
                  });
              }
            }else{
              vueThis.$message.error('抱歉，获取环境信息失败：' + res.data.msg);
            }
          })
          .catch(function (err) {
            vueThis.$message.error(err);
          });
      },

      //生成身份证id
      makeID(){
        console.log(this.identityInfo.selectedOptions)
      }
    }
  }
</script>
<style scoped>
  .el-row {
    width: 100%;
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
</style>
