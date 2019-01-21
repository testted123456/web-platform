<template>
  <el-container id="appMockNew">
      <el-main>
        <div style="padding-bottom: 60px;">
          <div style="width:80%;text-align: left">
            <el-form  ref="api"  :label-position="labelPosition"  label-width="100px" :model="api">
              <el-form-item label="API名称:" prop="name" :rules="[{ required: true, trigger: 'blur',message: 'API名称不能为空'} ]">
                <el-input v-model="api.name" placeholder="请输入接口名称"></el-input>
              </el-form-item>

              <el-form-item label="API URL:" prop="url" :rules="[{ required: true, trigger: 'blur',message: 'API URL不能为空'} ]">
                <el-input v-model="api.url" placeholder="请输入接口URL"></el-input>
              </el-form-item>

              <el-form-item label="API处理器:" prop="handler"  :rules="[{ required: true, trigger: 'change',message: '请选择'} ]">
                <el-select v-model="api.handler" placeholder="请选择">
                  <el-option
                    v-for="item in handlers"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="API协议:" prop="apiProtocol" >
                <el-col :span="10">
                  <el-radio v-model="api.apiProtocol" label="0">Http</el-radio>
                  <el-radio v-model="api.apiProtocol" label="1">Https</el-radio>
                </el-col>
                <el-col :span="4">
                  <el-select v-model="api.apiSendWay" placeholder="请选择">
                    <el-option label="Get" value="0"></el-option>
                    <el-option label="Post" value="1"></el-option>
                  </el-select>
                </el-col>
              </el-form-item>

            </el-form>
          </div>

        <el-row style="padding-left: 30px">
          <el-col :span="2"></el-col>
          <el-col :span="22" >
            <el-tabs v-model="activeName" @tab-click="handleClick" >

              <!--Request-Headers -->
              <el-tab-pane label="Request Headers" name="ReqHeaders">
                <el-table
                  :data="api.requestHead" style="width: 100%"
                >
                  <el-table-column
                    label="Key"
                    width="230">
                    <template slot-scope="scope">
                      <el-input v-model="api.requestHead[scope.$index].Key"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="Value"
                    width="450">
                    <template slot-scope="scope">
                      <el-input v-model="api.requestHead[scope.$index].Value"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="" width="100">
                    <template slot-scope="scope">
                      <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="删除" placement="top">
                        <el-button @click.native.prevent="deleteHeadersRow(scope.$index, api.requestHead)" type="text" size="small"><i class="el-icon-delete"></i></el-button>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="增加" placement="top" v-if="showAddHeader(scope.$index, api.requestHead)">
                        <el-button @click.native.prevent="addHeadersRow(scope.$index, api.requestHead)" v-if="showAddHeader(scope.$index, api.requestHead)" type="text" size="small"><i class="el-icon-plus"></i></el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>

              <!--request body-->
              <el-tab-pane label="Request Body" name="ReqBody">
                <el-row v-if="api.apiSendWay == 1">
                  <el-col :span="16">
                    <el-radio v-model="api.requestBodyType" label="0" disabled>form-data</el-radio>
                    <el-radio v-model="api.requestBodyType" label="1">x-www-form-urlencoded</el-radio>
                    <el-radio v-model="api.requestBodyType" label="2">row</el-radio>
                    <el-radio v-model="api.requestBodyType" label="3" disabled="">binary</el-radio>
                  </el-col>
                  <el-col :span="8">
                    <el-dropdown v-if="api.requestBodyType == 2" @command="selectRequestBodyRow">
                      <span class="el-dropdown-link">
                        {{api.requestBodyRowType}}<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="Text">Text</el-dropdown-item>
                        <el-dropdown-item command="Text(text/plain)">Text(text/plain)</el-dropdown-item>
                        <el-dropdown-item command="Json(application/json)">Json(application/json)</el-dropdown-item>
                        <el-dropdown-item command="Javascript(application/javascript)">Javascript(application/javascript)</el-dropdown-item>
                        <el-dropdown-item command="XML(application/xml)">XML(application/xml)</el-dropdown-item>
                        <el-dropdown-item command="XML(text/xml)">XML(text/xml)</el-dropdown-item>
                        <el-dropdown-item command="HTML(text/html)">HTML(text/html)</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4" >
                    <el-button size="small" v-if="isJson(api.requestBody)"
                               @click.native.prevent="api.requestBody = formatJson(api.requestBody)"
                               round
                    >格式化Json</el-button>
                    <el-button style="color: red"
                               size="small" v-else
                               disabled
                               round
                    >不是Json格式</el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col>
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 12, maxRows:12}"
                      placeholder="请输入请求消息体"
                      v-model="api.requestBody">
                    </el-input>
                  </el-col>
                </el-row>
              </el-tab-pane>

              <!--Response-Headers-->
              <el-tab-pane label="Response Headers" name="ResHeaders">
                <el-table
                  :data="api.responseHead" style="width: 100%"
                >
                  <el-table-column
                    label="Key"
                    width="230">
                    <template slot-scope="scope">
                      <el-input v-model="api.responseHead[scope.$index].Key"></el-input>
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="Value"
                    width="450">
                    <template slot-scope="scope">
                      <el-input v-model="api.responseHead[scope.$index].Value"></el-input>
                    </template>
                  </el-table-column>

                  <el-table-column
                    fixed="right"
                    label="" width="100">
                    <template slot-scope="scope">
                      <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="删除" placement="top">
                        <el-button @click.native.prevent="deleteHeadersRow(scope.$index, api.responseHead)" type="text" size="small"><i class="el-icon-delete"></i></el-button>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="增加" placement="top" v-if="showAddHeader(scope.$index, api.responseHead)">
                        <el-button @click.native.prevent="addHeadersRow(scope.$index, api.responseHead)"  type="text" size="small"><i class="el-icon-plus"></i></el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>

              <!--Response-Body-->
              <el-tab-pane label="Response Body" name="ResType">
                <el-row>
                  <el-row v-if="api.apiSendWay == 1">
                    <el-col :span="16">
                      <el-radio v-model="api.responseBodyType" label="0" disabled>form-data</el-radio>
                      <el-radio v-model="api.responseBodyType" label="1">x-www-form-urlencoded</el-radio>
                      <el-radio v-model="api.responseBodyType" label="2">row</el-radio>
                      <el-radio v-model="api.responseBodyType" label="3" disabled="">binary</el-radio>
                    </el-col>
                    <el-col :span="8">
                      <el-dropdown v-if="api.responseBodyType == 2" @command="selectResponseBodyRow">
                      <span class="el-dropdown-link">
                        {{api.responseBodyRowType}}<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="Text">Text</el-dropdown-item>
                          <el-dropdown-item command="Text(text/plain)">Text(text/plain)</el-dropdown-item>
                          <el-dropdown-item command="Json(application/json)">Json(application/json)</el-dropdown-item>
                          <el-dropdown-item command="Javascript(application/javascript)">Javascript(application/javascript)</el-dropdown-item>
                          <el-dropdown-item command="XML(application/xml)">XML(application/xml)</el-dropdown-item>
                          <el-dropdown-item command="XML(text/xml)">XML(text/xml)</el-dropdown-item>
                          <el-dropdown-item command="HTML(text/html)">HTML(text/html)</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-col>
                  </el-row>
                  <el-col :span="4" >
                    <el-button size="small" v-if="isJson(api.responseBody)"
                               @click.native.prevent="api.responseBody = formatJson(api.responseBody)"
                               round
                    >格式化Json</el-button>
                    <el-button style="color: red"
                               size="small" v-else
                               disabled
                               round
                    >不是Json格式</el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col>
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 12, maxRows:12}"
                      placeholder="请输入响应消息体"
                      v-model="api.responseBody"
                    >
                    </el-input>
                  </el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
        </div>
      </el-main>
    <el-footer style="text-align: right;">
      <el-button :plain="true" type="primary" @click="saveApi">确认</el-button>
      <el-button>取消</el-button>
    </el-footer>
  </el-container>

</template>

<script>

  import {formatJson, isJson} from "../../assets/js/formatJson"
  import {setContentType, parseContentType} from '../../assets/js/httpMsgUtil'

  export default {
    name: 'AppMockNew',
    data () {
      return {
        labelPosition:"right",
        api: {
          id: null,
          name: '',
          pId: null,
          url: '',
          apiProtocol: '0',
          type: true,
          apiSendWay: '1',
          handler: null,
          requestHead: [{
            Key: '',
            Value: ''
          }],
          requestBody: null,
          responseHead: [{
            Key: '',
            Value: ''
          }],
          requestBodyType: '2',
          requestBodyRowType: 'Text',
          responseBodyType: '2',
          responseBodyRowType: 'Text',
          responseBody: null,
          createdBy: '',
          createdTime: null,
          updatedBy: '',
          updatedTime: null
        },
        activeName: 'ReqHeaders',
        handlers: []
      }
    },

    created() {
      this.init();
    },

    computed: {
    },

    watch:{
      'api.requestBodyType': function(val, oldVal){
        setContentType(val, this.api.requestBodyRowType, this.api.requestHead);

        if(val === '2' && typeof this.api.requestBodyRowType === 'undefined'){
          this.$set(this.api, 'requestBodyRowType', 'Text');
        }
      },

      'api.requestBodyRowType': function (val, oldVal) {
        setContentType('2', val, this.api.requestHead);
      },

      'api.responseBodyType': function(val, oldVal){
        setContentType(val, this.api.responseBodyRowType, this.api.responseHead);

        if(val === '2' && typeof this.api.responseBodyRowType === 'undefined'){
          this.$set(this.api, 'responseBodyRowType', 'Text');
        }
      },

      'api.responseBodyRowType': function (val, oldVal) {
        setContentType('2', val, this.api.responseHead);
      }
    },

    methods: {
      formatJson, isJson,
      //初始化页面
      init(){
        let vueThis = this;

        this.appMockAxios({
          method: 'get',
          url: 'getApiHandlers'
        }).then(function (res) {
          if(res.data.code == '10000'){
            let tempHandlers = [];
            res.data.data.forEach(function (e, index) {
              tempHandlers.push({value: e, label: e})
            });
            vueThis.handlers = tempHandlers;
          }else{
            vueThis.$message.error('抱歉，获取Api处理器失败：' + res.data.msg);
          }
        }).catch(function (err) {
          console.log(err)
          vueThis.$message.error('抱歉，服务器异常！' );
        });
      },

      handleClick(tab, event) {
      },

      showAddHeader(index, rows){
        if(rows.length == index + 1 && (rows[index].Key != '' && rows[index].Value != '')){
          return true;
        }else{
          return false;
        }
      },

      //新增消息头一行
      addHeadersRow(index, rows){
        if(rows.length == index + 1 && (rows[index].Key != '' || rows[index].Value != '' )){
          rows.push({
            Key: '',
            Value: ''
          })
        }
      },

      //删除消息头中的一行
      deleteHeadersRow(index, rows) {
        if(index == 0 && rows.length == 1){
          rows[index].Key = '';
          rows[index].Value = '';
        }else {
          rows.splice(index, 1);
        }
      },

      validHeadersRow(rows){
         let size = rows.length;
         let row = rows[size-1];
         let Key = row.Key;
         let Value = row.Value;

         if((Key === '' || Value === '') && size === 1){
             return 0;
         }else if((Key === '' || Value === '') && size != 1){
             return 1;
         }else{
             return 2;
         }
      },

      selectRequestBodyRow(command){
        this.$set(this.api,'requestBodyRowType',command);
      },

      selectResponseBodyRow(command){
        this.$set(this.api,'responseBodyRowType',command);
      },

      //保存api
      saveApi(){
        if(this.api.name === '' || this.api.url === '' || this.api.handler === null){
          this.$message.error('有必填项未填，信息请填完整！');
          return;
        }

        if(this.api.responseBody === null ){
          this.$message.error('响应消息必填！');
          return;
        }

        /*if(isJson(this.api.responseBody) === false){
          this.$message.error('响应消息不是json格式！');
          return;
        }*/

        this.api.pId = this.$route.query.pId;

        //深拷贝对象
        let tempApi = JSON.stringify(this.api);
        tempApi = JSON.parse(tempApi);

        tempApi.requestHead = JSON.stringify(this.api.requestHead);
        tempApi.responseHead = JSON.stringify(this.api.responseHead);

        /*let validResult = this.validHeadersRow(this.api.requestHead);
        if(validResult === 0){
          tempApi.requestHead = null;
        }else if(validResult === 1){
          this.$message.error('请求消息头字段不能为空！');
          return;
        }*/

        /*validResult = this.validHeadersRow(this.api.responseHead);
        if(validResult === 0){
          tempApi.responseHead = null;
        }else if(validResult === 1){
          if(this.api.requestHead === null){
            this.api.requestHead = [{Key:'', Value:''}];
          }
          this.$message.error('响应消息头字段不能为空！');
          return;
        }*/

        let vueThis = this;

        this.appMockAxios({
          method: 'post',
          data: tempApi,
          url: "add"
        }).then(function (res) {
            if(res.data.code === 10000){
              vueThis.$message({
                message: '恭喜你，新增接口成功',
                type: 'success'
              });

              vueThis.$store.commit('changeAppMockStatus', 1);
              vueThis.api.id = res.data.data.id;
              vueThis.$store.commit('setNewAppMock', vueThis.api);
              vueThis.$router.push({ name: 'AppMockEdit', params: { id: vueThis.api.id }})
            }else{
              vueThis.$message.error('抱歉，新增接口失败：' + res.data.msg);
            }
        }, function (res) {
            vueThis.$message.error('服务器请求失败！');
        });
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
  .el-main {
    padding-right: 15%;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
