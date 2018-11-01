<template>
  <el-container>
    <el-main>
      <div style="padding-left: 160px;padding-top: 40px;">
        <!--表单-->
        <el-form   ref="identityInfo"  :label-position="labelPosition"  label-width="100px" :model="identityInfo">
          <!--省市区-->
          <el-form-item label="省市区" prop="province" :rules="[{ required: true, trigger: 'blur',message: '省市区不能为空'} ]" style="text-align: left">
            <!--<el-cascader-->
              <!--placeholder="试试搜索：指南"-->
              <!--:options="options"-->
              <!--v-model="identityInfo.selectedOptions"-->
              <!--filterable-->
            <!--&gt;</el-cascader>-->
            <!--:gutter="20"-->
            <el-row  style="margin-bottom: 10px;">
              <!--省-->
              <el-col :span="4" style="padding-right: 10px;">
                <el-select v-model="identityInfo.province" placeholder="请选择" @change="judgeMunicipal">
                  <el-option
                    v-for="item in provinces"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>

              <!--市-->
              <el-col :span="4" v-show="ifSelectShow" style="padding-right: 10px;">
                <el-select v-model="identityInfo.city" placeholder="请选择" @focus="getCitys">
                  <el-option
                    v-for="item in citys"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>

              <!--区-->
              <el-col :span="4" v-show="ifSelectShow" style="padding-right: 10px;">
                <el-select v-model="identityInfo.district" placeholder="请选择" @focus="getDistricts">
                  <el-option
                    v-for="item in districts"
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
          <el-form-item label="是否注册" prop="isRegistered" :rules="[{ required: true, message: '不能为空'} ]" style="text-align: left">
            <el-radio v-model="identityInfo.isRegistered" label="true">已注册</el-radio>
            <el-radio v-model="identityInfo.isRegistered" label="false">未注册</el-radio>
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
            ifIdShow:false,
            ifSelectShow:true,
            labelPosition:'left',
            idCardInfo:'',
            identityInfo:{
              env:'',
              isRegistered:'false',
              province:'',
              city:'',
              district:''
            },
            enviornment:[],
            provinces:[],
            citys:[],
            districts:[]

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
          this.getProvinces();
        },
        // 判断是否是直辖市
        judgeMunicipal(){
          console.log(this.identityInfo.province)
          if(this.identityInfo.province == '北京市' || this.identityInfo.province == '上海市' || this.identityInfo.province == '天津市' || this.identityInfo.province == '重庆市'){
            this.ifSelectShow = false;
          }else{
            this.ifSelectShow = true;
          }
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
        // 获取省份信息
        getProvinces(){
          var vueThis = this;
          this.toolAxios({
            method: 'get',
            url: "testData/getAllProvince"
          })
            .then(function (res) {
              if(res.data.code === 10000){
                var data = [];
                res.data.data.forEach(function (e, index) {
                  data.push({value: e, label: e})
                });
                vueThis.provinces = data;
              }else{
                vueThis.$message.error('抱歉，获取环境信息失败：' + res.data.msg);
              }
            })
            .catch(function (err) {
              vueThis.$message.error(err);
            });
        },
        // 获取市级信息
        getCitys(){
          var vueThis = this;
          if(vueThis.identityInfo.province == ''){
            vueThis.$message.error('请选择省份');
          }else{
            this.toolAxios({
              method: 'post',
              data:{
                "province":vueThis.identityInfo.province
              },
              url: "testData/getCityList"
            })
              .then(function (res) {
                if(res.data.code === 10000){
                  var data = [];
                  res.data.data.forEach(function (e, index) {
                    data.push({value: e, label: e})
                  });
                  vueThis.citys = data;
                }else{
                  vueThis.$message.error('抱歉，获取环境信息失败：' + res.data.msg);
                }
              })
              .catch(function (err) {
                vueThis.$message.error(err);
              });
          }

        },
        // 获取区信息
        getDistricts(){
          var vueThis = this;
          if(vueThis.identityInfo.province == '' || vueThis.identityInfo.city == ''){
            vueThis.$message.error('请选择省份 市区');
          }else{
            this.toolAxios({
              method: 'post',
              data:{
                "province":vueThis.identityInfo.province,
                "city":vueThis.identityInfo.city
              },
              url: "testData/getDistrictList"
            })
              .then(function (res) {
                if(res.data.code === 10000){
                  var data = [];
                  res.data.data.forEach(function (e, index) {
                    data.push({value: e, label: e})
                  });
                  vueThis.districts = data;
                }else{
                  vueThis.$message.error('抱歉，获取环境信息失败：' + res.data.msg);
                }
              })
              .catch(function (err) {
                vueThis.$message.error(err);
              });
          }

        },
        //生成身份证id
        makeID(){
          this.$refs['identityInfo'].validate((valid) => {
            if (valid) {
              var vueThis = this;
              this.toolAxios({
                method: 'post',
                data:{
                  "env":vueThis.identityInfo.env,
                  "isRegistered":vueThis.identityInfo.isRegistered,
                  "province":vueThis.identityInfo.province,
                  "city":vueThis.identityInfo.city,
                  "district":vueThis.identityInfo.district
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
