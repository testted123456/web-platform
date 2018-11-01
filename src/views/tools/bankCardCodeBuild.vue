<template>
  <el-container>
    <el-main>
      <div style="padding-left: 160px;padding-top: 40px;">
        <!--表单-->
        <el-form   ref="bankentityInfo"  :label-position="labelPosition"  label-width="100px" :model="bankentityInfo">
          <!--省市区-->
          <el-form-item label="银行名" prop="bankname" :rules="[{ required: true, trigger: 'blur',message: '银行名不能为空'} ]" style="text-align: left">

            <el-row  style="margin-bottom: 10px;">
              <!--银行名-->
              <el-col :span="4" style="padding-right: 10px;">
                <el-select v-model="bankentityInfo.bankname" placeholder="请选择">
                  <el-option
                    v-for="item in banknamelists"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <!--环境-->
          <el-form-item label="环境" prop="env" :rules="[{ required: true, message: '环境不能为空'} ]" style="text-align: left">
            <el-col :span="8">
              <el-select v-model="bankentityInfo.env" placeholder="请选择">
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
            <el-radio v-model="bankentityInfo.isRegistered" label="true">已注册</el-radio>
            <el-radio v-model="bankentityInfo.isRegistered" label="false">未注册</el-radio>
          </el-form-item>
        </el-form>

        <el-row style="padding-top: 20px">
          <el-col :span="4" style="text-align: center">
            <el-button type="primary" @click="makeID">点击生成</el-button>
          </el-col>

          <el-col :span="2" style="text-align: left" v-show="ifIdShow">
            <p style="font-size: 14px;line-height: 12px;"></p>
          </el-col>
          <el-col :span="8" style="text-align: left" v-show="ifIdShow">
            <el-input v-model="idCardInfo" placeholder="生成的银行卡信息"></el-input>
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
        bankentityInfo:{
          env:'',
          isRegistered:'false',
          bankname:''
        },
        enviornment:[],
        banknamelists:[]
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
        this.getBanklists();
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
      // 获取银行卡信息
      getBanklists(){
        var vueThis = this;
        this.toolAxios({
          method: 'get',
          url: "testData/getAllCNBankName"
        })
          .then(function (res) {
            if(res.data.code === 10000){
              var data = [];
              res.data.data.forEach(function (e, index) {
                data.push({value: e, label: e})
              });
              vueThis.banknamelists = data;
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
        this.$refs['bankentityInfo'].validate((valid) => {
          if (valid) {
            var vueThis = this;
            this.toolAxios({
              method: 'post',
              data:{
                "env":vueThis.bankentityInfo.env,
                "isRegistered":vueThis.bankentityInfo.isRegistered,
                "bankname":vueThis.bankentityInfo.bankname,
              },
              url: "testData/getIdCard"
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
