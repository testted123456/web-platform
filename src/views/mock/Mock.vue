<template>
  <el-container>
    <el-main>
      <div style="padding-bottom: 60px;">
        <div style="width:80%;text-align: left">
          <el-form   ref="mock"  :label-position="labelPosition"  label-width="100px" :model="mockInfo">
            <!--名称-->
            <el-form-item label="名称" prop="name" :rules="[{ required: true, trigger: 'blur',message: '名称不能为空'} ]">
              <el-input v-model="mockInfo.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <!--url-->
            <el-form-item label="url" prop="url" :rules="[{ required: true, trigger: 'blur',message: 'url不能为空'} ]">
              <el-input v-model="mockInfo.url" placeholder="请输入url"></el-input>
            </el-form-item>
            <!--环境-->
            <el-form-item label="postWay" prop="postWay" :rules="[{ required: true, message: 'http方式不能为空'} ]">
              <el-col :span="8">
                <el-radio v-model="mockInfo.postWay" label="get">get</el-radio>
                <el-radio v-model="mockInfo.postWay" label="post">post</el-radio>
              </el-col>
            </el-form-item>
            <!--环境-->
            <el-form-item label="环境" prop="env" :rules="[{ required: false, message: '环境不能为空'} ]">
              <el-col :span="8">
                <el-select v-model="mockInfo.env" placeholder="请选择">
                  <el-option
                    v-for="item in enviornment"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <!--等待时长-->
            <el-form-item label="等待时长" prop="delayTime" :rules="[{ required: false, trigger: 'blur',message: '等待时长不能为空'} ]">
              <el-input v-model="mockInfo.delayTime" placeholder="请输入等待时长"></el-input>
            </el-form-item>
            <!--错误率-->
            <el-form-item label="错误率" prop="rate" :rules="[{ required: false, trigger: 'blur',message: '等待时长不能为空'} ]">
              <el-input v-model="mockInfo.rate" placeholder="请输入 0~1 范围内的小数"></el-input>
            </el-form-item>

            <!--流程用例-->
            <el-form-item label="类型" prop="resType" :rules="[{ required: true, message: '不能为空'} ]">
              <el-radio v-model="mockInfo.resType" label="json">json</el-radio>
              <el-radio v-model="mockInfo.resType" label="xml">xml</el-radio>
            </el-form-item>
            <!--状态-->
            <el-form-item label="状态" prop="httpCode" :rules="[{ required: false, message: ''} ]">
              <el-col :span="8">
                <el-select v-model="mockInfo.httpCode" placeholder="请选择">
                  <el-option
                    v-for="item in responseState"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>

            <!--转发-->
            <el-form-item label="转发" prop="isProxy" :rules="[{ required: false, message: ''} ]">
              <el-col :span="6">
                <el-radio v-model="mockInfo.isProxy" label="true">是</el-radio>
                <el-radio v-model="mockInfo.isProxy" label="false">否</el-radio>
              </el-col>
            </el-form-item>

            <!--ip-->
            <el-form-item label="" prop="" :rules="[{ required: false, message: ''} ]" v-if="mockInfo.isProxy == 'true' ">
              <el-col :span="24">
                <el-table :data="tempIpMap">
                  <el-table-column label="name" class-name="cell-input">
                    <template slot-scope="scope">
                      <el-input v-model.trim="tempIpMap[scope.$index].name"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="value" class-name="cell-input">
                    <template slot-scope="scope">
                      <el-input v-model.trim="tempIpMap[scope.$index].value"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column class-name="cell-input" label="操作" width="120px">
                    <template slot-scope="scope">
                      <el-button
                        @click.native.prevent="addHeadersRow(scope.$index, tempIpMap)"
                        type="text" size="small"><i class="el-icon-plus"></i></el-button>
                      <el-button
                        @click.native.prevent="deleteHeadersRow(scope.$index, tempIpMap)"
                        type="text" size="small"><i class="el-icon-delete"></i></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-form-item>

            <!--request-->
            <el-form-item label="request" prop="request" :rules="[{ required: true, message: ''} ]">
              <el-row>
                <el-col>
                  <el-button size="small" v-if="isJson(mockInfo.request)"
                             @click.native.prevent="formatJSON(1)"
                             round>格式化Json
                  </el-button>
                  <el-button style="color: red"
                             size="small" v-else
                             disabled
                             round
                  >不是Json格式
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-input type="textarea"  :autosize="{ minRows: 9}" resize="none" placeholder="请输入内容" v-model="mockInfo.request"></el-input>
                </el-col>
              </el-row>
            </el-form-item>

            <!--response-->
            <el-form-item label="response" prop="response" :rules="[{ required: true, message: ''} ]">
              <el-row>
                <el-col>
                  <el-button size="small" v-if="isJson(mockInfo.response)"
                             @click.native.prevent="formatJSON(2)"
                             round>格式化Json
                  </el-button>
                  <el-button style="color: red"
                             size="small" v-else
                             disabled
                             round
                  >不是Json格式
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-input type="textarea"  :autosize="{ minRows: 9}" resize="none" placeholder="请输入内容" v-model="mockInfo.response"></el-input>
                </el-col>
              </el-row>
            </el-form-item>

            <!--rule-->
            <el-form-item label="rule" prop="rule" :rules="[{ required: true, message: ''} ]">
              <el-row>
                <el-col>
                  <div style="border: 1px solid #cccccc; padding-top: 10px">
                    <hd-ace-rule ref="rule" style="width: 100%;height: 200px" editorID="rule" @aceTextChange="ruleTextChange" :value="mockInfo.rule"></hd-ace-rule>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>


          </el-form>

        </div>

      </div>




    </el-main>
    <!--页面最底部 footer-->
    <el-footer style="text-align: right">
      <el-button type="primary" @click="saveCase" >确认</el-button>
    </el-footer>
  </el-container>
</template>

<script>
  import { formatJson, isJson } from "@/assets/js/formatJson.js";
  import hdAceRule from '@/components/hd-ace-rule'


  export default {
    components: {hdAceRule},
    name: 'Mock',
    data () {
      return {
        submitinfo:{},
        enviornment:[],
        labelPosition:'left',
        mockTab:'request',
        activeIndex:0,
        mockInfo: {
          id: '',
          pId: '',
          type:true,
          name:'',
          url:'',
          postWay:'get',
          request:'',
          response:'',
          rule:'',
          resType:'json',  //返回类型(xml/json),可选，不填默认为json
          env:"stb",  //接口环境(stb/sit)，可选，不填则默认stb
          config:[] ,  //接口配置信息，可选
          isProxy:'false',                //接口是否需要转发，默认为false，即使为true，业务对应第一级目录isProxy为true，且ipMap存在对应值
          delayTime:'',
          httpCode:'',
          ipMap:null,   //当isProxy为true时，必填
          rate:''

        },
        //响应转态码
        responseState:[
          {
            value:'404'
          },
          {
            value:'500'
          }
        ],
        // ip
        tempIpMap:[
          {
            name:'',
            value:''
          }
        ]

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
      formatJson,
      isJson,
      //获取初始化值
      getData(){
        this.getEnv();
        var vueThis = this;
        var id = this.$route.query.id;
        if(id == 0){
          this.mockInfo= {
            id: '',
            pId: '',
            type:true,
            name:'',
            url:'',
            postWay:'get',
            request:'',
            response:'',
            rule:'',
            resType:'json',
            env:"stb",
            config:[] ,
            isProxy:'false',
            delayTime:'',
            httpCode:'',
            ipMap:null,
            rate:''
          }

          this.tempIpMap = [{name:'',value:''}];

        }else{
          vueThis.mockAxios({
            method: 'get',
            url: "web-mock/mock/getInterfaceInfo?id="+ id
          })
            .then(function (res) {
              if(res.data.code === 10000){
                vueThis.mockInfo= {

                  id: res.data.data.id,
                  pId: res.data.data.pId,
                  type:true,
                  name:res.data.data.name,
                  url:res.data.data.url,
                  postWay:res.data.data.postWay,
                  request:res.data.data.request,
                  response:res.data.data.response,
                  rule:res.data.data.rule,
                  resType:res.data.data.resType,  //返回类型(xml/json),可选，不填默认为json
                  env:res.data.data.env,  //接口环境(stb/sit)，可选，不填则默认stb
                  config:[] ,  //接口配置信息，可选
                  isProxy:res.data.data.isProxy,                //接口是否需要转发，默认为false，即使为true，业务对应第一级目录isProxy为true，且ipMap存在对应值
                  delayTime:res.data.data.delayTime,
                  httpCode:res.data.data.httpCode,
                  ipMap:null,   //当isProxy为true时，必填
                  rate:res.data.data.rate

                }

                if(vueThis.mockInfo.isProxy){
                  vueThis.tempIpMap = res.data.data.ipMap;
                  vueThis.mockInfo.isProxy = 'true'
                }else{
                  vueThis.tempIpMap = [{name:'',value:''}];
                  vueThis.mockInfo.isProxy = 'false'
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
      //获取环境列表select
      getEnv(){
        var vueThis = this;

        this.mockAxios({
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

            }else{
              vueThis.$message.error('抱歉，获取环境信息失败：' + res.data.msg);
            }
          })
          .catch(function (err) {
            vueThis.$message.error(err);
          });
      },
      //tab 切换
      handleClick(tab, event){
        this.activeIndex = tab.index;
      },
      //新增，编辑 确认按钮事件
      saveCase() {
        var mockID = this.$route.query.id;
        this.$refs['mock'].validate((valid) => {
          if (valid) {

            //转换数据格式
            this.submitinfo = JSON.stringify(this.mockInfo);
            this.submitinfo = JSON.parse(this.submitinfo);
            this.submitinfo.config = [
              {"delayTime":this.mockInfo.delayTime},
              {"httpCode":this.mockInfo.httpCode}
            ];

            if(this.mockInfo.isProxy == 'true' ){
              this.submitinfo.ipMap = this.tempIpMap;
              this.submitinfo.isProxy = true;
            }else{
              this.submitinfo.isProxy = false;
              this.submitinfo.ipMap = null;
            }

            delete this.submitinfo.delayTime;
            delete this.submitinfo.httpCode;
            console.log(this.submitinfo)

            if(mockID == 0){    /////////////////////////////////新增界面 确认按钮事件
              this.mockInfo.pId = this.$route.query.pId;
              this.submitGetData()
            }else{     /////////////////////////编辑界面 确认按钮事件
              this.submitGetData()
            }
          } else {
            return false;
          }
        });
      },

      //确认按钮  请求ajax
      submitGetData(){
        var vueThis = this;
        vueThis.mockAxios({
          method: 'post',
          data: vueThis.submitinfo,
          url: 'web-mock/mock/setInterface'
        })
          .then(function (res) {
            if(res.data.code === 10000){
              vueThis.$message({
                message: '恭喜你，保存成功',
                type: 'success'
              });


              if(vueThis.$route.query.id == 0){
                //存数据  树节点刷新
                vueThis.$store.commit('changeMockStatus', 1);
                vueThis.$store.commit('setNewMock', vueThis.submitinfo);
                // vueThis.mockInfo.id = res.data.data.id;
                vueThis.$router.push({name: 'Mock', query: {id: res.data.data.id}});
              }else{
                //存数据  树节点刷新
                vueThis.$store.commit('changeMockStatus', 2);
                vueThis.$store.commit('setNewMock', vueThis.submitinfo);
              }

            }else{
              vueThis.$message.error('抱歉，获取信息失败：' + res.data.msg);
            }
          })
          .catch(function (err) {
            vueThis.$message.error(err);
          });
      },

      ruleTextChange(text){
        this.mockInfo.rule = text;
      },
      formatJSON(text){
        if(text == 1){
          this.mockInfo.request = formatJson(this.mockInfo.request)
        }else if(text == 2){
          this.mockInfo.response= formatJson(this.mockInfo.response)
        }
      },
      //增加
      addHeadersRow(index, rows){
        var obj = {
          name: '',
          value: ''
        }
        rows.splice(index + 1, 0, obj);
      },
      //删除消息头中的一行
      deleteHeadersRow(index, rows) {
        if (index == 0 && rows.length == 1) {
          return;
        } else {
          rows.splice(index, 1);
        }
      },

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-row {
    margin-top: 10px;
  }

  .ace-clouds .ace_constant.ace_numeric {
    color: #000;
  }

</style>
