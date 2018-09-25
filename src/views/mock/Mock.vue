<template>
  <el-container>
    <el-main>
      <div style="padding-bottom: 60px;">
        <div style="width:80%;text-align: left">
          <el-form  ref="mock"  label-width="100px" :model="mockInfo">

            <el-form-item>
              <el-row>
                <div style="text-align: center;font-size: large" >{{mockInfo.name}}</div>
              </el-row>
            </el-form-item>
            <!--request-->
            <el-form-item label="请求消息：" prop="request" >
            <el-row>
              <el-col>
                <div id="request" style="min-height: 280px" ></div>
              </el-col>
            </el-row>
          </el-form-item>

            <!--response-->
            <el-form-item label="响应消息：" prop="response" >
              <el-row>
                <el-col>
                  <div id="response" style="min-height: 280px" ></div>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-main>
    <!--页面最底部 footer-->
    <el-footer style="text-align: right">
      <el-button type="primary" @click="save" >确认</el-button>
      <el-button type="primary" @click="reset" >恢复默认</el-button>
    </el-footer>
  </el-container>
</template>

<script>
  import { formatJson, isJson } from "@/assets/js/formatJson.js";
  import hdAceRule from '@/components/hd-ace-rule'
  import hdInput from '@/components/ele-extend/hd-input'
  import hdAce from '@/components/hd-ace'

  export default {
    components: {hdAceRule,hdInput,hdAce},
    name: 'Mock',
    data () {
      return {
        mockInfo: {
          name: 'xx',
          request: '',
          response: '',
          defaultResponse:''
        },
        reqEditor: null,
        resEditor: null
      }
    },

    watch:{
      $route(){
        this.getData();
      }
    },

    mounted() {
      this.getData();
      // document.getElementsByClassName("xml").innerText = this.mockInfo.request;
    },

    methods: {
      formatJson,
      isJson,
      //获取初始化值
      getData(){
        ace.require("ace/ext/language_tools");
        this.reqEditor = ace.edit("request");
        this.resEditor = ace.edit("response");
        this.reqEditor.setOptions({
          //      enableBasicAutocompletion: true,
          //      enableSnippets: true,
          enableLiveAutocompletion: true,//只能补全
        });
        this.resEditor.setOptions({
          //      enableBasicAutocompletion: true,
          //      enableSnippets: true,
          enableLiveAutocompletion: true,//只能补全
        });
        //editor.setTheme("ace/theme/monokai");//monokai模式是自动显示补全提示
        //editor.getSession().setMode("ace/mode/javascript");//语言
        this.reqEditor.getSession().setMode("ace/mode/xml");
        this.resEditor.getSession().setMode("ace/mode/xml");
        this.reqEditor.setFontSize(14);
        this.resEditor.setFontSize(14);

        var vueThis = this;
        var code = this.$route.query.code;
        var name = this.$route.query.name;
        var ctrl = this.$route.query.ctrl;
        var ctrlUrl = ctrl + "/getInfos?name=";

        this.mockAxios({
          method: 'get',
          url: ctrlUrl + code
        }).then(function (res) {
          if (res.data.code === 10000) {
            vueThis.mockInfo.name = name;
            vueThis.mockInfo.request = res.data.data.request;
            vueThis.mockInfo.response = res.data.data.response;
            vueThis.mockInfo.defaultResponse = res.data.data.defaultResponse;
          } else {
            vueThis.$message.error('抱歉，获取Mock信息失败：' + res.data.msg);
          }
          vueThis.reqEditor.setValue(vueThis.mockInfo.request);
          vueThis.resEditor.setValue(vueThis.mockInfo.response);
        }).catch(function (err) {
          vueThis.$message.error('抱歉，服务器异常！');
          console.log(err)
        });

      },

      //新增，编辑 确认按钮事件
      save() {
        let response = this.resEditor.getValue();
        let code = this.$route.query.code;
        let vueThis = this;
        this.mockAxios({
          method: 'post',
          url: 'fastPay/setResponse/' + code,
          data: {
            "response": response
          }
        }).then(function (res) {
          if (res.data.code === 10000) {
            vueThis.$message({
              message: '恭喜你，更新Mock接口成功',
              type: 'success'
            });
          } else {
            vueThis.$message.error('抱歉，获取Mock信息失败：' + res.data.msg);
          }
        }).catch(function (err) {
          vueThis.$message.error('抱歉，服务器异常！');
          console.log(err)
        });

      },

      reset(){
        this.resEditor.setValue(this.mockInfo.defaultResponse);

        let code = this.$route.query.code;
        let vueThis = this;
        this.mockAxios({
          method: 'get',
          url: 'fastPay/resetResponse/?name=' + code
        }).then(function (res) {
          if (res.data.code === 10000) {
            vueThis.$message({
              message: '恭喜你，更新Mock接口成功',
              type: 'success'
            });
          } else {
            vueThis.$message.error('抱歉，获取Mock信息失败：' + res.data.msg);
          }
        }).catch(function (err) {
          vueThis.$message.error('抱歉，服务器异常！');
          console.log(err)
        });
      }

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
