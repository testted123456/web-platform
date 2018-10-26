<template>
  <el-container  id="callBackSMZF008">
      <el-main >
        <div style="padding-bottom: 60px;">
          <div style="width:80%;text-align: left">
            <el-form    label-width="100px" >

              <el-form-item>
                <el-row>
                  <div style="text-align: center;font-size: large" >{{this.name}}</div>
                </el-row>
              </el-form-item>

              <el-form-item label="未成功流水号:" prop="reqMsgId">
                <el-select v-model="reqMsgId" placeholder="请选择">
                  <el-option
                    v-for="item in reqMsgIds"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="请求消息：" prop="response" >
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
    <el-footer style="text-align: right;">
      <el-button type="primary" @click="save">确认并回调</el-button>
    </el-footer>
  </el-container>

</template>

<script>
  import hdAceRule from '@/components/hd-ace-rule'
  import hdInput from '@/components/ele-extend/hd-input'
  import hdAce from '@/components/hd-ace'
  export default {
    name: 'CallBackSMZF008',

    data () {
      return {
        name: '',
        request: '',
        response: '',
        reqMsgIds: [],
        reqMsgId: '',
        mockInfo: {
          name: '',
          request: '',
          response: ''
        }
      }
    },

    mounted() {
      this.getData();
    },

    methods: {
      getData(){
        ace.require("ace/ext/language_tools");
        this.resEditor = ace.edit("response");
        this.resEditor.setOptions({
          enableLiveAutocompletion: true,//只能补全
        });
        this.resEditor.getSession().setMode("ace/mode/xml");

        let vueThis = this;

        this.mockAxios({
          method: 'get',
          url: 'ydzf/getInfos?name=SMZF008'
        }).then(function (res) {
          if (res.data.code === 10000) {
            // vueThis.mockInfo.name = name;
            vueThis.mockInfo.response = res.data.data.response;
          } else {
            vueThis.$message.error('抱歉，获取Mock信息失败：' + res.data.msg);
          }
          vueThis.resEditor.setValue(vueThis.mockInfo.response);
        }).catch(function (err) {
          vueThis.$message.error('抱歉，服务器异常！');
          console.log(err)
        });

        this.mockAxios({
          method: 'get',
          url: 'ydzf/getUnhandledOrder'
        }).then(function (res) {
          if (res.data.code === 10000) {
            vueThis.reqMsgIds = res.data.data;
          } else {
            vueThis.$message.error('抱歉，获取未处理订单失败：' + res.data.msg);
          }
        }).catch(function (err) {
          vueThis.$message.error('抱歉，服务器异常！');
          console.log(err)
        });
      },

      save(){
        if(this.reqMsgId === ''){
          this.$message.error('请选择未处理号！');
        }else{
          let vueThis = this;
          let response = this.resEditor.getValue();
          this.mockAxios({
            method: 'post',
            url: 'ydzf/setResponse/SMZF008',
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

          this.mockAxios({
            method: 'get',
            url: 'ydzf/callback/SMZF008/' +  vueThis.reqMsgId
          }).then(function (res) {
            if (res.data.code === 10000) {
              vueThis.$message({
                message: '恭喜你，回调成功',
                type: 'success'
              });
            } else {
              vueThis.$message.error('抱歉，回调失败：' + res.data.msg);
            }
          }).catch(function (err) {
            vueThis.$message.error('抱歉，服务器异常！');
            console.log(err)
          });
        }
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

  .el-table__header {
    width: 100%;
  }
  .el-aside{
    width: 280px !important;
    overflow-x: scroll;
  }
  .el-main {
    padding-right: 15%;
  }
</style>
