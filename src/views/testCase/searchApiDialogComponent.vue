<template>
  <el-container>
    <el-row :span="22">
      <el-col :span="5">
        <div class="vue-transfer-tree">
          <label class="vue-transfer-label">接口</label>
          <input class="vue-transfer-input" placeholder="输入接口名称搜索"/>
          <el-tree :load="loadNode"
                   lazy
                   ref="tree"
                   :props="defaultProps"
                   @node-click="handleNodeClick">
          </el-tree>
        </div>
      </el-col>
      <el-col :span="1">
        <div style="text-align: center;margin-left: 2px;margin-top: 80%">
          <div><input type="button" value=">" @click="addApi" style="border-radius: 60px;height: 40px;width: 40px"/></div>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="vue-transfer-tree">
          <label class="vue-transfer-label">已选接口</label>
          <div>
            <el-container>
              <el-main>
                <el-row>
                  <el-col :span="4">
                    <label>步骤名称:</label>
                  </el-col>
                  <el-col :span="16">
                    <el-input v-model="tempApiDetailInfo.step"  placeholder="请输入接口名称"></el-input>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">
                    <label>API url:</label>
                  </el-col>
                  <el-col :span="16">
                    <el-input v-model="tempApiDetailInfo.urlAddress"  placeholder="请输入接口url"></el-input>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">
                    <label>API方法:</label>
                  </el-col>
                  <el-col :span="6">
                    <label>{{tempApiDetailInfo.apiType}}</label>
                  </el-col>
                  <el-col :span="6">
                    <label>{{tempApiDetailInfo.postWay}}</label>
                  </el-col>
                </el-row>
                <el-row>
                  <template>
                    <el-tabs v-model="apiInCaseTab">
                      <el-tab-pane label="自定义变量" name="variables">
                        <el-table
                          :data="tempApiDetailInfo.variables" style="width: 100%"
                        >
                          <el-table-column
                            label="Key" class-name="cell-input" width="150"
                          >
                            <template slot-scope="scope">
                              <el-input v-model="tempApiDetailInfo.variables[scope.$index].Key"></el-input>
                            </template>
                          </el-table-column>
                          <el-table-column
                            label="Value" class-name="cell-input" width="300"
                          >
                            <template slot-scope="scope">
                              <el-input v-model="tempApiDetailInfo.variables[scope.$index].Value"></el-input>
                            </template>
                          </el-table-column>

                          <!--<el-table-column class-name="cell-input" width="120"-->
                          <!--label="" >-->
                          <!--<template slot-scope="scope">-->
                          <!--<el-button @click.native.prevent="addHeadersRow(scope.$index, tempApiDetailInfo.variables)" v-if="showAddHeader(scope.$index, tempApiDetailInfo.variables)" type="text" size="small"><i class="el-icon-plus"></i></el-button>-->
                          <!--<el-button @click.native.prevent="deleteHeadersRow(scope.$index, tempApiDetailInfo.variables)" type="text" size="small"><i class="el-icon-delete"></i></el-button>-->
                          <!--<el-button @click.native.prevent="moveup(scope.$index, scope.row, tempApiDetailInfo.variables)"  type="text" size="small"><i class="el-icon-arrow-up"></i></el-button>-->
                          <!--<el-button @click.native.prevent="movedown(scope.$index, scope.row, tempApiDetailInfo.variables)" type="text" size="small"><i class="el-icon-arrow-down"></i></el-button>-->
                          <!--</template>-->
                          <!--</el-table-column>-->
                        </el-table>
                      </el-tab-pane>

                      <el-tab-pane label="消息头" name="reqHeaders">
                        <el-table
                          :data="tempApiDetailInfo.requestHead" style="width: 100%"
                        >
                          <el-table-column
                            label="Key" class-name="cell-input" width="180"
                          >
                            <template slot-scope="scope">
                              <el-input v-model="tempApiDetailInfo.requestHead[scope.$index].Key"></el-input>
                            </template>
                          </el-table-column>
                          <el-table-column
                            label="Value" class-name="cell-input" width="180"
                          >
                            <template slot-scope="scope">
                              <el-input v-model="tempApiDetailInfo.requestHead[scope.$index].Value"></el-input>
                            </template>
                          </el-table-column>
                          <el-table-column
                            label="Desription" class-name="cell-input" width="180"
                          >
                            <template slot-scope="scope">
                              <el-input v-model="tempApiDetailInfo.requestHead[scope.$index].Description"></el-input>
                            </template>
                          </el-table-column>
                          <!--<el-table-column class-name="cell-input" width="120"-->
                          <!--label="" >-->
                          <!--<template slot-scope="scope">-->
                          <!--<el-button @click.native.prevent="addHeadersRow(scope.$index, tempApiDetailInfo.requestHead)" v-if="showAddHeader(scope.$index, tempApiDetailInfo.requestHead)" type="text" size="small"><i class="el-icon-plus"></i></el-button>-->
                          <!--<el-button @click.native.prevent="deleteHeadersRow(scope.$index, tempApiDetailInfo.requestHead)" type="text" size="small"><i class="el-icon-delete"></i></el-button>-->
                          <!--<el-button @click.native.prevent="moveup(scope.$index, scope.row, tempApiDetailInfo.requestHead)"  type="text" size="small"><i class="el-icon-arrow-up"></i></el-button>-->
                          <!--<el-button @click.native.prevent="movedown(scope.$index, scope.row, tempApiDetailInfo.requestHead)" type="text" size="small"><i class="el-icon-arrow-down"></i></el-button>-->
                          <!--</template>-->
                          <!--</el-table-column>-->
                        </el-table>
                      </el-tab-pane>
                      <el-tab-pane label="消息体" name="reqBody">
                        <el-row>
                          <el-col :span="4" style="text-align: right">
                            <el-button size="small" v-if="isJson(tempApiDetailInfo.requestBody)"
                                       @click.native.prevent="tempApiDetailInfo.requestBody = formatJson(tempApiDetailInfo.requestBody)"
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
                              :autosize="{ minRows: 8, maxRows: 20}"
                              placeholder="请输入请求消息体"
                              v-model="tempApiDetailInfo.requestBody"
                            >
                            </el-input>
                          </el-col>
                        </el-row>
                      </el-tab-pane>
                      <el-tab-pane label="响应消息头" name="responseHeaders">
                        <el-table
                          :data="tempApiDetailInfo.responseHead" style="width: 100%"
                        >
                          <el-table-column
                            label="Key" class-name="cell-input" width="180"
                          >
                            <template slot-scope="scope">
                              <el-input v-model="tempApiDetailInfo.responseHead[scope.$index].Key"></el-input>
                            </template>
                          </el-table-column>
                          <el-table-column
                            label="Value" class-name="cell-input" width="180"
                          >
                            <template slot-scope="scope">
                              <el-input v-model="tempApiDetailInfo.responseHead[scope.$index].Value"></el-input>
                            </template>
                          </el-table-column>

                        </el-table>
                      </el-tab-pane>
                      <el-tab-pane label="预期结果" name="expectResults">
                        <el-row>
                          <el-col :span="4" style="text-align: right">
                            <el-button size="small" v-if="isJson(tempApiDetailInfo.responseBody)"
                                       @click.native.prevent="tempApiDetailInfo.responseBody = formatJson(tempApiDetailInfo.responseBody)"
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
                              :autosize="{ minRows: 8, maxRows: 20}"
                              placeholder="请输入响应消息体"
                              v-model="tempApiDetailInfo.responseBody"
                            >
                            </el-input>
                          </el-col>
                        </el-row>
                      </el-tab-pane>

                      <el-tab-pane label="断言" name="assertions">
                        <el-table
                          :data="tempApiDetailInfo.assertions" style="width: 100%"
                        >
                          <el-table-column
                            label="Key" class-name="cell-input" width="150"
                          >
                            <template slot-scope="scope">
                              <el-input v-model="tempApiDetailInfo.assertions[scope.$index].Key"></el-input>
                            </template>
                          </el-table-column>
                          <el-table-column
                            label="Value" class-name="cell-input" width="300"
                          >
                            <template slot-scope="scope">
                              <el-input v-model="tempApiDetailInfo.assertions[scope.$index].Value"></el-input>
                            </template>
                          </el-table-column>
                          <!--<el-table-column class-name="cell-input" width="120"-->
                          <!--label="" >-->
                          <!--<template slot-scope="scope">-->
                          <!--<el-button @click.native.prevent="addHeadersRow(scope.$index, tempApiDetailInfo.assertions)" v-if="showAddHeader(scope.$index, tempApiDetailInfo.assertions)" type="text" size="small"><i class="el-icon-plus"></i></el-button>-->
                          <!--<el-button @click.native.prevent="deleteHeadersRow(scope.$index, tempApiDetailInfo.assertions)" type="text" size="small"><i class="el-icon-delete"></i></el-button>-->
                          <!--<el-button @click.native.prevent="moveup(scope.$index, scope.row, tempApiDetailInfo.assertions)"  type="text" size="small"><i class="el-icon-arrow-up"></i></el-button>-->
                          <!--<el-button @click.native.prevent="movedown(scope.$index, scope.row, tempApiDetailInfo.assertions)" type="text" size="small"><i class="el-icon-arrow-down"></i></el-button>-->
                          <!--</template>-->
                          <!--</el-table-column>-->
                        </el-table>
                      </el-tab-pane>
                    </el-tabs>
                  </template>
                </el-row>
              </el-main>
            </el-container>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
  import {formatJson, isJson} from "../../assets/js/formatJson.js";
  export default {
    props: [],
    components: {},
    name: 'searchApiDialogComponent',
    data(){
      return {
        defaultProps:{
          label: 'name',
          isLeaf: 'type',
          children: 'children'
        },
        tempApis:[],
        apiInCaseTab: 'variables',
        tempApiDetailInfo:{
          "step":"step1",
          "urlAddress": "1",
          "apiType":"",
          "postWay":"",
          "variables": [{
            "Key": "111",
            "Value": "111"
          }],
          "requestHead": [{
            "Key": "222",
            "Value": null,
            "Description": null
          }],
          "requestBody": "333",
          "responseHead":[{
            "Key": "444",
            "Value": ""
          }],
          "responseBody": "555",
          "assertions": [{
            "Key": "666",
            "Value": ""
          }]
        }
      }
    },
    created(){

    },
    methods: {
      formatJson,
      isJson,
      handleNodeClick(data, node, instance) {
        console.log('树节点点击');
        console.log(node.id);
      },
      loadNode(node, resolve) {
        if(node.level === 0){
          return resolve([{ name:  'Root', id: 0 , type: false}]);
        }else if(node.isLeaf === true){
          return;
        }else{
          //先注释 用本地数据
//          this.$http.get("http://192.168.32.105:8082/inter/api/getApiTreeByPId?pId=" + node.data.id).then(function (res) {
//            if(res.data.succeed){
//              var apiTreeInfo = res.data.data;
//              return resolve(res.data.data);
//            }
//            return;
//          },function (res) {
//
//          });

          var apiTreeData =  [
            {
              "id": 1,
              "name": "1",
              "description": "",
              "pId": 0,
              "module": "1",
              "branch": "1",
              "urlAddress": "1",
              "apiType": "0",
              "type": true,
              "postWay": "1",
              "requestHead": "[{\"Key\":null,\"Value\":null,\"Description\":null}]",
              "requestBodyType": "2",
              "requestBodyRowType": "2",
              "requestBody": null,
              "responseHead": "[{\"Key\":null,\"Value\":null,\"Description\":null}]",
              "responseBodyType": "0",
              "responseBody": null,
              "createdBy": "",
              "createdTime": null,
              "updatedBy": "",
              "updatedTime": null,
              "optstatus": 0,
              "system": "usr"
            }, {
              "id": 2,
              "name": "2",
              "description": "",
              "pId": 0,
              "module": "2",
              "branch": "2",
              "urlAddress": "2",
              "apiType": "0",
              "type": true,
              "postWay": "1",
              "requestHead": "[{\"Key\":null,\"Value\":null,\"Description\":null}]",
              "requestBodyType": "2",
              "requestBodyRowType": "2",
              "requestBody": null,
              "responseHead": "[{\"Key\":null,\"Value\":null,\"Description\":null}]",
              "responseBodyType": "0",
              "responseBody": null,
              "createdBy": "",
              "createdTime": null,
              "updatedBy": "",
              "updatedTime": null,
              "optstatus": 0,
              "system": "trd"
            }, {
              "id": 3,
              "name": "3",
              "description": "",
              "pId": 0,
              "module": "3",
              "branch": "3",
              "urlAddress": "3",
              "apiType": "0",
              "type": true,
              "postWay": "1",
              "requestHead": "[{\"Key\":null,\"Value\":null,\"Description\":null}]",
              "requestBodyType": "2",
              "requestBodyRowType": "2",
              "requestBody": null,
              "responseHead": "[{\"Key\":null,\"Value\":null,\"Description\":null}]",
              "responseBodyType": "0",
              "responseBody": null,
              "createdBy": "",
              "createdTime": null,
              "updatedBy": "",
              "updatedTime": null,
              "optstatus": 0,
              "system": "trd"
            }, {
              "id": 4,
              "name": "4",
              "description": "",
              "pId": 0,
              "module": "4",
              "branch": "4",
              "urlAddress": "4",
              "apiType": "0",
              "type": true,
              "postWay": "1",
              "requestHead": "[{\"Key\":null,\"Value\":null,\"Description\":null}]",
              "requestBodyType": "2",
              "requestBodyRowType": "2",
              "requestBody": null,
              "responseHead": "[{\"Key\":null,\"Value\":null,\"Description\":null}]",
              "responseBodyType": "0",
              "responseBody": null,
              "createdBy": "",
              "createdTime": null,
              "updatedBy": "",
              "updatedTime": null,
              "optstatus": 0,
              "system": "usr"
            }, {
              "id": 5,
              "name": "5",
              "description": "",
              "pId": 0,
              "module": "5",
              "branch": "5",
              "urlAddress": "5",
              "apiType": "0",
              "type": true,
              "postWay": "1",
              "requestHead": "[{\"Key\":null,\"Value\":null,\"Description\":null}]",
              "requestBodyType": "2",
              "requestBodyRowType": "2",
              "requestBody": null,
              "responseHead": "[{\"Key\":null,\"Value\":null,\"Description\":null}]",
              "responseBodyType": "0",
              "responseBody": null,
              "createdBy": "",
              "createdTime": null,
              "updatedBy": "",
              "updatedTime": null,
              "optstatus": 0,
              "system": "trd"
            }]
          var apiTreeInfo = apiTreeData;
          return resolve(apiTreeInfo);
        }
      },
      addApi(){
        console.log(this)
        var node = this.$refs.tree.currentNode.node;
        var data = node.data;

        if(node.isLeaf){

          if(typeof  data.requestHead === 'string'){
            data.requestHead = JSON.parse(data.requestHead);
          }else if(typeof  data.requestHead === 'undefined'){
            data.requestHead = [{"Key":'',"Value":'',"Description":''}]
          }

          if(typeof  data.responseHead === 'string'){
            data.responseHead = JSON.parse(data.responseHead);
          }else if(typeof  data.responseHead === 'undefined'){
            data.responseHead = [{"Key":'',"Value":'',"Description":''}]
          }

          if(typeof data.variables === 'undefined'){
            data.variables = [{"Key": '', "Value": ''}];
          }

          if(typeof data.assertions === 'undefined'){
            data.assertions = [{"Key": '', "Value": ''}];
          }

          if(typeof data.step === 'undefined'){
            data.step = '';
          }


          var ifRepeat = false
          for(var i=0;i<this.tempApis.length;i++){
            if(data.id === this.tempApis[i].id){
              ifRepeat = true
            }
          }
          if(!ifRepeat){
            console.log(data);
            this.tempApis.push(data);
          }
        }
      },

      rewrite(){
//            var reData = {
//                step:this.tempApiDetailInfo.step,
//                urlAddress:this.tempApiDetailInfo.urlAddress,
//                variables:this.tempApiDetailInfo.variables,
//                requestHead:this.tempApiDetailInfo.requestHead,
//                requestBody:this.tempApiDetailInfo.requestBody,
//                responseBody:this.tempApiDetailInfo.responseBody,
//                assertions:this.tempApiDetailInfo.assertions
//            }
        var reData = this.tempApiDetailInfo;
        console.log(reData);
        return reData;
      },
      reset(){
        this.tempApiDetailInfo = {
          "step":"",
          "urlAddress": "",
          "apiType":"",
          "postWay":"",
          "variables": [{
            "Key": "",
            "Value": ""
          }],
          "requestHead": [{
            "Key": "",
            "Value": "",
            "Description": ""
          }],
          "requestBody": "",
          "responseBody": "",
          "assertions": [{
            "Key": "",
            "Value": ""
          }],
          "responseHead":[{
            "Key": "",
            "Value": ""
          }]
        }
      }


    }
  }

</script>

<style scoped>
  .el-row {
    width: 90%;

  }
  .el-tree {
    margin-right: 2px;
  }
  .el-input--small{
    margin-left: 2px;
    margin-right:10px;
  }
  .el-input__inner{
    width: 80%;
    padding-right: 0px;
    overflow-x: hidden;
  }
  .vue-transfer-tree {
    border: 0.5px solid;
    border-radius: 5px;
    min-height: 300px;
    height: 300px;
    margin-left: 2px;
    margin-right: 2px;
    padding-right: 1px;
    overflow-y: auto;
    overflow-x: auto;
  }
  .vue-transfer-label{
    width: 98%;
    background:#f5f7fa;
    display: inline-block;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    min-height: 30px;
    margin-top:1px;
    padding-left: 3px;
    padding-top: 10px;
    font-weight: 500;
  }
  .vue-transfer-input{
    border-radius: 15px;
    margin-left:10%;
    margin-right: 10%;
    width: 80%;
    margin-top: 10px;
    min-height: 32px;
    border-width: 0.5px;
  }

</style>
