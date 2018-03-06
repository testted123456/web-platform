<template>
  <el-container  id="apiEdit">
    <el-container >
      <el-main >
        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="4" >
            <label>API名称:</label>
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
                    width="350">
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
                      :autosize="{ minRows: 12, maxRows: 12}"
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
                    width="350">
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
            Key: '',
            Value: ''
          }],
          responseHead:[{
            Key: '',
            Value: ''
          }],
          requestBodyType: '2',
          responseBodyType: '0'
        },
        apiSystems: [],
        activeName: 'ReqHeaders',
        apiBranchs: [],
        requestBodyRowType: 'Text'
      }
    },

    computed: {
      id: function () {
        return this.$route.params.id;
      }
    },

    created() {
      this.initSystems();
      this.init();
    },

    watch:{
      id: function () {
      this.init();
      }
    },

    methods: {
      formatJson, isJson,

      handleClick(tab, event){},

      init(){
        this.$http.get(this.apiServer + "api/getApi?id=" + this.$route.params.id).then(function (res) {
          if(res.data.code == '10000'){
            this.api = res.data.data;

            if(this.api.requestHead === null){
              this.api.requestHead = [{Key: '', Value: ''}];
            }

            if(this.api.responseHead === null){
              this.api.responseHead = [{Key: '', Value: ''}];
            }
          }
        },function (res) {
        });
      },

      initSystems(){
        this.$http.get(this.testCaseServer + "sysCfg/getAllAlias").then(function (res) {
          if(res.data.code == '10000'){
            let tempSystems = this.apiSystems;
            res.data.data.forEach(function (e, index) {
              tempSystems.push({value: e, label: e})
            });
          }
        },function (res) {
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
        let validResult = this.validHeadersRow(this.api.requestHead);

        if(validResult === 0){
          this.api.requestHead = null;
        }else if(validResult === 1){
          this.$message.error('请求消息头字段不能为空！');
          return;
        }

        validResult = this.validHeadersRow(this.api.responseHead);

        if(validResult === 0){
          this.api.responseHead = null;
        }else if(validResult === 1){
          if(this.api.requestHead === null){
            this.api.requestHead = [{Key:'', Value:''}];
          }
          this.$message.error('响应消息头字段不能为空！');
          return;
        }

        this.$http.post(this.apiServer + "api/addApi", this.api).then(function (res) {
          if(res.data.code == '10000'){
            this.$message({
              message: '恭喜你，更新接口成功',
              type: 'success'
            });

            this.api.id = res.data.data.id;
//            this.$router.push( { name: 'ApiMain'});
          }else{
            if(this.api.requestHead === null){
              this.api.requestHead = [{Key:'', Value:''}];
            }

            if(this.api.responseHead === null){
              this.api.responseHead = [{Key:'', Value:''}];
            }

            this.$message.error('抱歉，更新接口失败：' + res.data.msg);
          }
        }, function (res) {
          if(this.api.requestHead === null){
            this.api.requestHead = [{Key:'', Value:''}];
          }

          if(this.api.responseHead === null){
            this.api.responseHead = [{Key:'', Value:''}];
          }

          this.$message.error('服务器请求失败！');
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
