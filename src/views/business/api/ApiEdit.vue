<template>
  <el-container  id="apiEdit">
      <el-main >
        <div style="padding-bottom: 60px;">
          <div style="width:80%;text-align: left">
            <el-form   ref="api"  :label-position="labelPosition"  label-width="100px" :model="api">
              <el-form-item label="API名称:" prop="name" :rules="[{ required: true, trigger: 'blur',message: 'API名称不能为空'} ]">
                <el-input v-model="api.name" placeholder="请输入接口名称"></el-input>
              </el-form-item>

              <el-form-item label="API URL:" prop="urlAddress" :rules="[{ required: true, trigger: 'blur',message: 'API URL不能为空'} ]">
                <el-input v-model="api.urlAddress" placeholder="请输入接口URL"></el-input>
              </el-form-item>

              <el-form-item label="API分支:" prop="branch" :rules="[{ required: true, trigger: 'blur',message: '接口分支不能为空'} ]">
                <el-input v-model="api.branch" placeholder="请输入接口分支"></el-input>
              </el-form-item>

              <el-form-item label="API模块:" prop="module" :rules="[{ required: true, trigger: 'blur',message: '接口模块不能为空'} ]">
                <el-input v-model="api.module" placeholder="请输入接口模块"></el-input>
              </el-form-item>

              <el-form-item label="API系统:" prop="system" :rules="[{ required: true, trigger: 'blur',message: '接口系统不能为空'} ]">
                <el-select v-model="api.system" placeholder="请选择">
                  <el-option
                    v-for="item in apiSystems"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="API协议:" prop="apiType" :rules="[{ required: true, trigger: 'blur',message: '接口协议不能为空'} ]">
                <el-col :span="10">
                  <el-radio v-model="api.apiType" label="0">Http</el-radio>
                  <el-radio v-model="api.apiType" label="1">Https</el-radio>
                  <el-radio v-model="api.apiType" label="2">MQ</el-radio>
                </el-col>
                <el-col :span="4">
                  <el-select v-model="api.postWay" v-if="api.apiType!=2" placeholder="请选择">
                    <el-option label="Get" value="0"></el-option>
                    <el-option label="Post" value="1"></el-option>
                  </el-select>
                </el-col>
              </el-form-item>

            </el-form>
          </div>

        <el-row v-if="api.apiType!=2" style="padding-left: 30px">
          <el-col :span="2"></el-col>
          <el-col :span="22" >
            <el-tabs v-model="activeName" @tab-click="handleClick" >

              <!--Request-Headers -->
              <el-tab-pane label="Req Headers" name="ReqHeaders">
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
                       <el-button @click.native.prevent="addHeadersRow(scope.$index, api.requestHead)"  type="text" size="small"><i class="el-icon-plus"></i></el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>

              <!--request body-->
              <el-tab-pane label="Req Body" name="ReqBody">
                <el-row v-if="api.postWay == 1">
                  <el-col :span="18">
                    <el-radio v-model="requestBodyType" label="0" disabled>form-data</el-radio>
                    <el-radio v-model="requestBodyType" label="1">x-www-form-urlencoded</el-radio>
                    <el-radio v-model="requestBodyType" label="2">row</el-radio>
                    <el-radio v-model="requestBodyType" label="3" disabled="">binary</el-radio>
                  </el-col>
                  <el-col :span="6" style="text-align: right">
                    <el-dropdown v-if="requestBodyType == 2" @command="selectRequestBodyRow">
                      <span class="el-dropdown-link">
                        {{requestBodyRowType}}<i class="el-icon-arrow-down el-icon--right"></i>
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
                      :autosize="{ minRows: 12}"
                      placeholder="请输入请求消息体"
                      v-model="api.requestBody"
                    >
                    </el-input>
                  </el-col>
                </el-row>
              </el-tab-pane>

              <!--Response-Headers-->
              <el-tab-pane label="Res Headers" name="ResHeaders">
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
                        <el-button @click.native.prevent="addHeadersRow(scope.$index, api.responseHead)" type="text" size="small"><i class="el-icon-plus"></i></el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>

              <el-tab-pane label="Res Body" name="ResType">
                <el-row>
                  <el-col :span="14">
                    <el-radio v-model="api.responseBodyType" label="0">json</el-radio>
                    <el-radio v-model="api.responseBodyType" label="1">text</el-radio>
                    <el-radio v-model="api.responseBodyType" label="2" disabled>html</el-radio>
                    <el-radio v-model="api.responseBodyType" label="3" disabled>xml</el-radio>
                  </el-col>
                  <el-col :span="4" style="text-align: right">
                    <el-button size="small" v-if="api.responseBodyType=='0' && isJson(api.responseBody)"
                               @click.native.prevent="api.responseBody = formatJson(api.responseBody)"
                               round
                    >格式化Json</el-button>
                    <el-button style="color: red"
                               v-show="api.responseBodyType=='0'"
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
                      :autosize="{ minRows: 12, maxRows: 12}"
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
        <el-row v-else>
          <el-row>
            <el-col :span="4">
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
            <el-col :span="20">
              <el-input
                type="textarea"
                :autosize="{ minRows: 12, maxRows: 12}"
                placeholder="请输入MQ消息体"
                v-model="api.requestBody"
              ></el-input>
            </el-col>
          </el-row>
        </el-row>
        </div>
      </el-main>
    <el-footer style="text-align: right;">
      <el-button type="primary" @click="saveApi">确认</el-button>
      <el-button>取消</el-button>
    </el-footer>
  </el-container>

</template>

<script>

  import {formatJson, isJson} from "../../../assets/js/formatJson.js";

  export default {
    name: 'ApiEdit',
    data () {
      return {
        labelPosition:"right",
        api: {
          requestHead:[{
            Key: '',
            Value: ''
          }],
          responseHead:[{
            Key: '',
            Value: ''
          }],
//          requestBodyType: '2',
          responseBodyType: '0'
        },
        apiSystems: [],
        activeName: 'ReqHeaders',
        apiBranchs: [],
        requestBodyRowType: 'Text',
        requestBodyType: '2',
        reqestContentType: {'Key':'Content-Type', 'Value':''}
      }
    },

    computed: {
      id: function () {
        return this.$route.params.id;
      },
      reqestContentTypeValue: function(){
          return this.reqestContentType.Value;
      }
    },

    created() {
      this.initSystems();
      this.init();
    },

    watch:{
      $route(){
        this.init();
      },

      'requestBodyType': function(){
        let ContentType = null;

        if(this.requestBodyType === '1'){
          this.reqestContentType.Value = 'application/x-www-form-urlencoded';
        }else if(this.requestBodyType === '2'){
          switch (this.requestBodyRowType){
            case "Text":
              this.reqestContentType.Value = '';
              break;
            case "Text(text/plain)":
              this.reqestContentType.Value = 'text/plain';
              break;
            case "Json(application/json)":
              this.reqestContentType.Value = 'application/json';
              break;
            case "Javascript(application/javascript)":
              this.reqestContentType.Value = 'application/javascript';
              break;
            case "XML(application/xml)":
              this.reqestContentType.Value = 'application/xml';
              break;
            case "XML(text/xml)":
              this.reqestContentType.Value = 'text/xml';
              break;
            case "HTML(text/html)":
              this.reqestContentType.Value = 'text/html';
              break;
          }
        }
      },

      'requestBodyRowType': function () {
        let ContentType = null;

        switch (this.requestBodyRowType){
          case "Text":
            this.reqestContentType.Value = '';
            break;
          case "Text(text/plain)":
            this.reqestContentType.Value = 'text/plain';
            break;
          case "Json(application/json)":
            this.reqestContentType.Value = 'application/json';
            break;
          case "Javascript(application/javascript)":
            this.reqestContentType.Value = 'application/javascript';
            break;
          case "XML(application/xml)":
            this.reqestContentType.Value = 'application/xml';
            break;
          case "XML(text/xml)":
            this.reqestContentType.Value = 'text/xml';
            break;
          case "HTML(text/html)":
            this.reqestContentType.Value = 'text/html';
            break;
        }

      },

      'reqestContentTypeValue': function (val, oldVal) {

        let contentTypeIndex = null;

        this.api.requestHead.forEach(function (e, index) {
          if(e.Key === 'Content-Type'){
            contentTypeIndex = index;
          }
        });

        if(val === '' && contentTypeIndex != null){//content-type=Text并且request head中之前有

          if(contentTypeIndex == 0 && this.api.requestHead.length == 1){
            this.api.requestHead[contentTypeIndex].Key = '';
            this.api.requestHead[contentTypeIndex].Value = '';
          }else {
            this.api.requestHead.splice(contentTypeIndex, 1);
          }
        }else if(val != null && contentTypeIndex != null){//content-type != Text,并且request head中之前有
          this.api.requestHead[contentTypeIndex].Value = val;
        }else if(val != null && contentTypeIndex === null){//content-type != Text,并且content-type不在request head中
          if(this.api.requestHead.length === 1 && this.api.requestHead[0].Key === '' && this.api.requestHead[0].Value === ''){
            this.api.requestHead[0].Key = 'Content-Type';
            this.api.requestHead[0].Value = val;
          }else{
            this.api.requestHead.push(this.reqestContentType);
          }
        }
      }
    },

    methods: {
      formatJson, isJson,

      handleClick(tab, event){

      },

      init(){

        var vueThis = this;

        this.apiAxios({
          method: 'get',
          url: 'api/getApi?id=' + this.$route.params.id
        }).then(function (res) {
          if(res.data.code === 10000){
            vueThis.api = res.data.data;

            if(vueThis.api.requestHead === null){
              vueThis.api.requestHead = [{Key: '', Value: ''}];
            }

            if(vueThis.api.responseHead === null){
              vueThis.api.responseHead = [{Key: '', Value: ''}];
            }

            if(isJson(vueThis.api.requestBody)){
              vueThis.api.requestBody = formatJson(vueThis.api.requestBody)
            }

            if(isJson(vueThis.api.responseBody)){
              vueThis.api.responseBody = formatJson(vueThis.api.responseBody)
            }

            vueThis.api.requestHead.forEach(function (e, index) {
              if(e.Key === 'Content-Type'){
                switch (e.Value){
                  case "application/x-www-form-urlencoded":
                    vueThis.requestBodyType = '1';
                    break;
                  case "text/plain":
                    vueThis.requestBodyType = '2';
                    vueThis.requestBodyRowType = 'Text(text/plain)';
                    break;
                  case "application/json":
                    vueThis.requestBodyType = '2';
                    vueThis.requestBodyRowType = 'Json(application/json)';
                    break;
                  case "application/javascript":
                    vueThis.requestBodyType = '2';
                    vueThis.requestBodyRowType = 'Javascript(application/javascript)';
                    break;
                  case "application/xml":
                    vueThis.requestBodyType = '2';
                    vueThis.requestBodyRowType = 'XML(application/xml)';
                    break;
                  case "text/xml":
                    vueThis.requestBodyType = '2';
                    vueThis.requestBodyRowType = 'XML(text/xml)';
                    break;
                  case "text/html":
                    vueThis.requestBodyType = '2';
                    vueThis.requestBodyRowType = 'HTML(text/html)';
                    break;
                }
              }
            });
          }else {
            vueThis.$message.error('抱歉，获取接口信息失败：' + res.data.msg);
          }
        }).catch(function (err) {
            console.log(err)
          vueThis.$message.error('抱歉，服务器异常！' );
        });

        /**
        this.$http.get(this.apiServer + "api/getApi?id=" + this.$route.params.id).then(function (res) {
          if(res.data.code == '10000'){
            this.api = res.data.data;

            if(this.api.requestHead === null){
              this.api.requestHead = [{Key: '', Value: ''}];
            }

            if(this.api.responseHead === null){
              this.api.responseHead = [{Key: '', Value: ''}];
            }

            if(isJson(this.api.requestBody)){
              this.api.requestBody = formatJson(this.api.requestBody)
            }


            if(isJson(this.api.responseBody)){
              this.api.responseBody = formatJson(this.api.responseBody)
            }
          }
        },function (res) {
        });
        **/
      },

      initSystems(){
//        this.$http.get(this.testCaseServer + "sysCfg/getAllAlias").then(function (res) {
//          if(res.data.code == '10000'){
//            let tempSystems = this.apiSystems;
//            res.data.data.forEach(function (e, index) {
//              tempSystems.push({value: e, label: e})
//            });
//          }
//        },function (res) {
//        });

        let vueThis = this;

        this.testCaseAxios({
          method: 'get',
          url: 'sysCfg/getAllAlias'
        }).then(function (res) {
          if(res.data.code === 10000){
            let tempSystems = vueThis.apiSystems;
            res.data.data.forEach(function (e, index) {
              tempSystems.push({value: e, label: e})
//              this.apiSystems.push({value: e, label: e})
            });
          }
        });
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
//        this.api.requestBodyRowType = command;
        this.requestBodyRowType = command;

//        if(command == 0){
//          this.requestBodyRowType = 'Text';
//        }
//        if(command == 1){
//          this.requestBodyRowType = 'Text(text/plain)';
//        }
//        if(command == 2){
//          this.requestBodyRowType = 'Json(application/json)';
//        }
//        if(command == 3){
//          this.requestBodyRowType = 'Javascript(application/javascript)';
//        }
//        if(command == 4){
//          this.requestBodyRowType = 'XML(application/xml)';
//        }
//        if(command == 5){
//          this.requestBodyRowType = 'XML(text/xml)';
//        }
//        if(command == 6){
//          this.requestBodyRowType = 'HTML(text/html)';
//        }
      },

      saveApi(){
        let validResult = this.validHeadersRow(this.api.requestHead);
        let tempApi = JSON.stringify(this.api);
        tempApi = JSON.parse(tempApi);

        if(validResult === 0){
          tempApi.requestHead = null;
        }else if(validResult === 1){
          this.$message.error('请求消息头字段不能为空！');
          return;
        }

        validResult = this.validHeadersRow(this.api.responseHead);

        if(validResult === 0){
          tempApi.responseHead = null;
        }else if(validResult === 1){
          this.$message.error('响应消息头字段不能为空！');
          return;
        }

        var vueThis = this;

        this.apiAxios.post('api/updateApi', tempApi).then(function (res) {
          if(res.data.code === 10000){
            vueThis.$message({
              message: '恭喜你，更新接口成功',
              type: 'success'
            });

            vueThis.$store.commit('changeApiStatus', 2);
            vueThis.api.id = res.data.data.id;
            vueThis.$store.commit('setNewApi', vueThis.api);

          }else {
            vueThis.$message.error('抱歉，更新接口失败：' + res.data.msg);
          }
        }).catch(function (err) {
          vueThis.$message.error('抱歉，服务器异常！' );
        });

//        this.apiAxios({
//          method: 'post',
//          data: tempApi,
//          url: 'api/addApi',
//          headers: {'Access-Control-Allow-Origin': '*'}
//        }).then(function (res) {
//          if(res.data.code === 10000){
//            vueThis.$message({
//              message: '恭喜你，更新接口成功',
//              type: 'success'
//            });
//
//            vueThis.$store.commit('changeApiStatus', 2);
//            vueThis.api.id = res.data.data.id;
//            vueThis.$store.commit('setNewApi', vueThis.api);
//
//          }else {
//            vueThis.$message.error('抱歉，更新接口失败：' + res.data.msg);
//          }
//        }).catch(function (err) {
//          vueThis.$message.error('抱歉，服务器异常！' );
//        });

        /**
        this.$http.post(this.apiServer + "api/addApi", tempApi).then(function (res) {
          if(res.data.code == '10000'){
            this.$message({
              message: '恭喜你，更新接口成功',
              type: 'success'
            });

            this.$store.commit('changeApiStatus', 2);
            this.api.id = res.data.data.id;
            this.$store.commit('setNewApi', this.api);
          }else{
            this.$message.error('抱歉，更新接口失败：' + res.data.msg);
          }
        }, function (res) {
          this.$message.error('服务器请求失败！');
        });
        **/
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
