<template>
  <el-container  id="apiEdit">
    <el-container >
      <el-main >
        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="4" >
            <el-tooltip class="item" effect="dark" :enterable="true" :hide-after="500" content="删除接口" placement="top">

            <label>API名称:</label>
            </el-tooltip>
          </el-col>
          <el-col :span="16">
            <el-input v-model="api.name"  placeholder="请输入接口名称"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="4">
            <label>API URL:</label>
          </el-col>
          <el-col :span="16">
            <el-input v-model="api.urlAddress" placeholder="请输入接口URL"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="4">
            <label>API分支:</label>
          </el-col>
          <el-col :span="16">
            <el-input v-model="api.branch" placeholder="请输入接口分支"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="4">
            <label>API模块:</label>
          </el-col>
          <el-col :span="16">
            <el-input v-model="api.module" placeholder="请输入接口模块"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="4">
            <label>系统:</label>
          </el-col>
          <el-col :span="16">
            <el-select v-model="api.system" placeholder="请选择">
              <el-option
                v-for="item in apiSystems"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="4" >
            <label>API协议:</label>
          </el-col>
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
        </el-row>

        <el-row v-if="api.apiType!=2">
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
                    width="180">
                    <template slot-scope="scope">
                      <el-input v-model="api.requestHead[scope.$index].Key"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="Value"
                    width="280">
                    <template slot-scope="scope">
                      <el-input v-model="api.requestHead[scope.$index].Value"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="Desription"
                    width="220">
                    <template slot-scope="scope">
                      <el-input v-model="api.requestHead[scope.$index].Description"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="" width="100">
                    <template slot-scope="scope">
                      <el-button @click.native.prevent="deleteHeadersRow(scope.$index, api.requestHead)" type="text" size="small">移除</el-button>
                      <el-button @click.native.prevent="addHeadersRow(scope.$index, api.requestHead)" v-if="showAddHeader(scope.$index, api.requestHead)" type="text" size="small">新增</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>

              <!--request body-->
              <el-tab-pane label="Req Body" name="ReqBody">
                <el-row>
                  <el-col :span="18">
                    <el-radio v-model="api.requestBodyType" label="0" disabled>form-data</el-radio>
                    <el-radio v-model="api.requestBodyType" label="1">x-www-form-urlencoded</el-radio>
                    <el-radio v-model="api.requestBodyType" label="2">row</el-radio>
                    <el-radio v-model="api.requestBodyType" label="3" disabled="">binary</el-radio>
                  </el-col>
                  <el-col :span="6" style="text-align: right">
                    <el-dropdown v-if="api.requestBodyType == 2" @command="selectRequestBodyRow">
                      <span class="el-dropdown-link">
                        {{requestBodyRowType}}<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="0">Text</el-dropdown-item>
                        <el-dropdown-item command="1">Text(text/plain)</el-dropdown-item>
                        <el-dropdown-item command="2">Json(application/json)</el-dropdown-item>
                        <el-dropdown-item command="3">Javascript(application/javascript)</el-dropdown-item>
                        <el-dropdown-item command="4">XML(application/xml)</el-dropdown-item>
                        <el-dropdown-item command="5">XML(text/xml)</el-dropdown-item>
                        <el-dropdown-item command="6">HTML(text/html)</el-dropdown-item>
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
                      :autosize="{ minRows: 8}"
                      placeholder="请输入请求消息体"
                      v-model="api.requestBody">
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
                    width="180">
                    <template slot-scope="scope">
                      <el-input v-model="api.responseHead[scope.$index].Key"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="Value"
                    width="280">
                    <template slot-scope="scope">
                      <el-input v-model="api.responseHead[scope.$index].Value"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="Desription"
                    width="220">
                    <template slot-scope="scope">
                      <el-input v-model="api.responseHead[scope.$index].Description"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="" width="100">
                    <template slot-scope="scope">
                      <el-button @click.native.prevent="deleteHeadersRow(scope.$index, api.responseHead)" type="text" size="small">移除</el-button>
                      <el-button @click.native.prevent="addHeadersRow(scope.$index, api.responseHead)" v-if="showAddHeader(scope.$index, api.responseHead)" type="text" size="small">新增</el-button>
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
                      :autosize="{ minRows: 8, maxRows: 20}"
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
                :autosize="{ minRows: 8, maxRows: 20}"
                placeholder="请输入MQ消息体"
                v-model="api.requestBody"
              ></el-input>
            </el-col>
          </el-row>
        </el-row>
      </el-main>

      <el-aside>
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="接口分支" name="branch">
            <el-table
              :data="apiBranchs"
              style="width: 100%">
              <el-table-column
                prop="version"
                label="分支"
              >
              </el-table-column>
              <el-table-column
                prop="normal"
                label="创建时间"
              >
              </el-table-column>
              <el-table-column
                prop="warning"
                label="最新版本？">
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-aside>
    </el-container>
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
        api: {
          requestHead:[{
            Key: null,
            Value: null,
            Description: null
          }],
          responseHead:[{
            Key: null,
            Value: null,
            Description: null
          }]
        },
        apiSystems: [{
          value: 'usr',
          label: '用户'
        }, {
          value: 'trd',
          label: '交易'
        }],
        activeName: 'ReqHeaders',
        apiBranchs: [],
        requestBodyRowType: 'Text'
      }
    },

    created() {

       this.$http.get("http://localhost:8082/inter/api/getApi?id=" + this.$route.params.id).then(function (res) {
       if(res.data.succeed){
       var tempApi = res.data.data;
       tempApi.requestHead = JSON.parse(tempApi.requestHead);
       tempApi.responseHead = JSON.parse(tempApi.responseHead);
       this.api = tempApi;
       }
       },function (res) {

       });
    },

    methods: {
      formatJson, isJson,
      handleClick(tab, event){},

      showAddHeader(index, rows){
        if(rows.length == index + 1 && (rows[index].Key != '' || rows[index].Value != '' || rows[index].Description != '')){
          return true;
        }else{
          return false;
        }
      },

      addHeadersRow(index, rows){
        if(rows.length == index + 1 && (rows[index].Key != '' || rows[index].Value != '' || rows[index].Description != '')){
          rows.push({
            Key: '',
            Value: '',
            Description: ''
          })
        }
      },

      //删除消息头中的一行
      deleteHeadersRow(index, rows) {
        if(index == 0 && rows.length == 1){
          rows[index].Key = '';
          rows[index].Value = '';
          rows[index].Description = '';
        }else {
          rows.splice(index, 1);
        }
      },

      selectRequestBodyRow(command){
        this.api.requestBodyRowType = command;

        if(command == 0){
          this.requestBodyRowType = 'Text';
        }
        if(command == 1){
          this.requestBodyRowType = 'Text(text/plain)';
        }
        if(command == 2){
          this.requestBodyRowType = 'Json(application/json)';
        }
        if(command == 3){
          this.requestBodyRowType = 'Javascript(application/javascript)';
        }
        if(command == 4){
          this.requestBodyRowType = 'XML(application/xml)';
        }
        if(command == 5){
          this.requestBodyRowType = 'XML(text/xml)';
        }
        if(command == 6){
          this.requestBodyRowType = 'HTML(text/html)';
        }
      },

      saveApi(){
//      this.api.pId = this.$route.query.pId;
      var tempApi = {};
      tempApi.id = this.api.pId;
      tempApi.name = this.api.name;
      tempApi.description = this.api.description;
      tempApi.pId = this.api.pId;
      tempApi.module = this.api.module;
      tempApi.branch = this.api.branch;
      tempApi.urlAddress = this.api.urlAddress;
      tempApi.apiType = this.api.apiType;
      tempApi.postWay = this.api.postWay;
      tempApi.type = this.api.type;
      tempApi.requestHead = JSON.stringify(this.api.requestHead);
      tempApi.requestBodyType = this.api.requestBodyType;
      tempApi.requestBodyRowType = this.api.requestBodyRowType;
      tempApi.requestBody = this.api.requestBody;
      tempApi.responseHead = JSON.stringify(this.api.responseHead);
      tempApi.responseBodyType = this.api.responseBodyType;
      tempApi.createdBy = this.api.createdBy;
      tempApi.createdTime = this.api.createdTime;
      tempApi.updatedBy = this.api.updatedBy;
      tempApi.responseBody = this.api.responseBody;
      tempApi.updatedTime = this.api.updatedTime;
      tempApi.system = this.api.system;

      this.$http.post("http://localhost:8082/inter/api/addApi", tempApi).then(function (res) {
        if(res.data.succeed){
//          this.showSuccessAlert = true;
          this.api.id = res.data.data.id;
          this.$router.push( { name: 'ApiMain'});
        }else{

          this.alertErrorTitle = res.data.errorMessage;
//              this.showErrorAlert = true;
          this.showSuccessAlert = true;
        }
      }, function (res) {
        this.alertErrorTitle = '服务器请求失败！';
        this.showErrorAlert = true;
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
  .el-aside{
    width: 280px !important;
  }
</style>
