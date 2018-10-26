<template>
  <el-container>
    <el-main>
      <div style="padding-left: 160px;padding-top: 40px;">
        <!--表单-->
        <el-form   ref="mobileentity"  :label-position="labelPosition"  label-width="100px" :model="entityInfo">

          <!--环境-->
          <el-form-item label="环境" prop="env" :rules="[{ required: true, message: '环境不能为空'} ]" style="text-align: left">
            <el-col :span="8">
              <el-select v-model="entityInfo.env" placeholder="请选择">
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
          <el-form-item label="是否注册" prop="isRegistered" :rules="[{ required: true, message: '不能为空'} ]" style="text-align: left">
            <el-radio v-model="entityInfo.isRegistered" label="true">已注册</el-radio>
            <el-radio v-model="entityInfo.isRegistered" label="false">未注册</el-radio>
          </el-form-item>
        </el-form>

        <el-row style="padding-top: 20px">
          <el-col :span="4" style="text-align: center">
            <el-button type="primary" @click="makeID">点击生成</el-button>
          </el-col>

          <el-col :span="2" style="text-align: left" v-show="ifIdShow">
            <p style="font-size: 14px;line-height: 12px;">手机号信息:</p>
          </el-col>
          <el-col :span="8" style="text-align: left" v-show="ifIdShow">
            <el-input v-model="idCardInfo" placeholder="生成的手机号信息"></el-input>
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
        ifIdShow:false,
        ifSelectShow:true,
        labelPosition:'left',
        idCardInfo:'',
        entityInfo:{
          env:'',
          isRegistered:'false',
        },
        enviornment:[],
      }
    },

    computed:{

    },

    created(){
      this.getData();
    },

    methods: {
      getData(){
        this.getEnv();
      },
      // 获取环境信息
      getEnv(){
        var vueThis = this;
        this.testCaseAxios({
          method: 'get',
          url: "envs/getAllEnvs"
        })
          .then(function (res) {
            if(res.data.code === 10000){
              var tempEnviornment = [];
              res.data.data.forEach(function (e, index) {
                tempEnviornment.push({value: e.name, label: e.name})
              });
              vueThis.enviornment = tempEnviornment;
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
        this.$refs['mobileentity'].validate((valid) => {
          if (valid) {
            var vueThis = this;
            this.toolAxios({
              method: 'post',
              data:{
                "env":vueThis.entityInfo.env,
                "isRegistered":vueThis.entityInfo.isRegistered,
              },
              url: "testData/getMobileNO"
            })
              .then(function (res) {
                if(res.data.code === 10000){
                  vueThis.ifIdShow = true;
                  vueThis.idCardInfo = res.data.data;
                }else{
                  vueThis.$message.error('抱歉，获取环境信息失败：' + res.data.msg);
                }
              })
              .catch(function (err) {
                vueThis.$message.error(err);
              });
          } else {
            return false;
          }
        });

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
