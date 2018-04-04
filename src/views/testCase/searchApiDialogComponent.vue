<template>
  <el-container>
    <el-row :span="24">
      <el-col :span="6">
        <div class="vue-transfer-tree">
          <label class="vue-transfer-label">接口</label>
          <input class="vue-transfer-input" placeholder="输入接口名称搜索"/>
          <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
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
                    <!--:disabled="true"-->
                    <el-input  v-model="tempApiDetailInfo.step"  placeholder="请输入接口名称"></el-input>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">
                    <label>API url:</label>
                  </el-col>
                  <el-col :span="16">
                    <el-input  v-model="tempApiDetailInfo.urlAddress"  placeholder="请输入接口url"></el-input>
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
                        <el-table :data="tempApiDetailInfo.variables">
                          <el-table-column label="Key" class-name="cell-input">
                            <template slot-scope="scope">
                              <el-input  v-model="tempApiDetailInfo.variables[scope.$index].varName"></el-input>
                            </template>
                          </el-table-column>
                          <el-table-column label="Value" class-name="cell-input" >
                            <template slot-scope="scope">
                              <el-input  v-model="tempApiDetailInfo.variables[scope.$index].varValue"></el-input>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-tab-pane>

                      <el-tab-pane label="消息头" name="reqHeaders">
                        <el-table :data="tempApiDetailInfo.requestHead">
                          <el-table-column label="Key" class-name="cell-input" >
                            <template slot-scope="scope">
                              <el-input  v-model="tempApiDetailInfo.requestHead[scope.$index].Key"></el-input>
                            </template>
                          </el-table-column>
                          <el-table-column label="Value" class-name="cell-input">
                            <template slot-scope="scope">
                              <el-input  v-model="tempApiDetailInfo.requestHead[scope.$index].Value"></el-input>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-tab-pane>
                      <el-tab-pane label="消息体" name="reqBody">
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
                        <el-table :data="tempApiDetailInfo.responseHead">
                          <el-table-column label="Key" class-name="cell-input">
                            <template slot-scope="scope">
                              <el-input  v-model="tempApiDetailInfo.responseHead[scope.$index].Key"></el-input>
                            </template>
                          </el-table-column>
                          <el-table-column label="Value" class-name="cell-input">
                            <template slot-scope="scope">
                              <el-input  v-model="tempApiDetailInfo.responseHead[scope.$index].Value"></el-input>
                            </template>
                          </el-table-column>

                        </el-table>
                      </el-tab-pane>
                      <el-tab-pane label="预期结果" name="expectResults">
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
                        <el-table :data="tempApiDetailInfo.assertions">
                          <el-table-column label="预期结果" class-name="cell-input">
                            <template slot-scope="scope">
                              <el-input  v-model="tempApiDetailInfo.assertions[scope.$index].actualResult"></el-input>
                            </template>
                          </el-table-column>
                          <el-table-column label="比较符" class-name="cell-input">
                            <template slot-scope="scope">
                              <el-input  v-model="tempApiDetailInfo.assertions[scope.$index].comparator"></el-input>
                            </template>
                          </el-table-column>
                          <el-table-column label="Value" class-name="cell-input">
                            <template slot-scope="scope">
                              <el-input  v-model="tempApiDetailInfo.assertions[scope.$index].expectResult"></el-input>
                            </template>
                          </el-table-column>

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
    props: ['searchInfo'],
    components: {},
    name: 'searchApiDialogComponent',
    data(){
      return {
        treeData: [],
        defaultProps:{
          label: 'name',
          isLeaf: 'type',
          children: 'children'
        },
        tempApis:[],
        apiInCaseTab: 'variables',
        tempApiDetailInfo:{
          step: '',
          urlAddress: '',
          apiType: '',
          postWay: '',
          variables: [
            {
              "varName": "",
              "varValue": ""
            }
          ],
          requestHead: [
            {
              "Key": "",
              "Value": ""
            }
          ],
          requestBody: null,
          responseHead: [
            {
              "Key": "",
              "Value": ""
            }
          ],
          responseBody: null,
          assertions: [
            {
              "actualResult": "",
              "comparator": "",
              "expectResult": ""
            }
          ]
        }
      }
    },
    created(){
      this.getTreeData()
    },
    methods: {
      formatJson,
      isJson,
      getTreeData(){
        var This = this;
        this.axios.get(This.testCaseServer+"testCaseInterface/getSameCasesByApiId?apiId=" + This.searchInfo.interfaceId).then(function (res) {
          if(res.data.code === 10000){
            This.treeData = res.data.data;
            console.log(This.treeData)
          }
        });
      },
      handleNodeClick(data, node, instance) {
        if(node.childNodes.length === 0){
            console.log('leaf');
           // this.tempApiDetailInfo = data.api;

          this.tempApiDetailInfo = JSON.stringify(data.api);
          console.log(this.tempApiDetailInfo)
          this.tempApiDetailInfo = JSON.parse(this.tempApiDetailInfo);
          if (this.tempApiDetailInfo.apiType == 0) {
            this.tempApiDetailInfo.apiType = 'Http'
          } else if (this.tempApiDetailInfo.apiType == 1) {
            this.tempApiDetailInfo.apiType = 'Https'
          } else if (this.tempApiDetailInfo.apiType === 2) {
            this.tempApiDetailInfo.apiType = 'MQ'
          }

          if (this.tempApiDetailInfo.postWay == 0) {
            this.tempApiDetailInfo.postWay = 'get'
          } else if (this.tempApiDetailInfo.postWay == 1) {
            this.tempApiDetailInfo.postWay = 'post'
          }

          //消息体
          if (this.tempApiDetailInfo.requestBody) {
            console.log('消息体不为空',this.tempApiDetailInfo.requestBody)
            this.tempApiDetailInfo.requestBody = formatJson(this.tempApiDetailInfo.requestBody);
          }
          //预期结果
          if (this.tempApiDetailInfo.responseBody) {
            console.log('预期结果不为空',this.tempApiDetailInfo.requestBody)
            this.tempApiDetailInfo.responseBody = formatJson(this.tempApiDetailInfo.responseBody);
          }
          //自定义变量
          if (this.tempApiDetailInfo.variables === undefined || this.tempApiDetailInfo.variables === null) {
            console.log('自定义变量为空')
            this.tempApiDetailInfo.variables = [
              {
                "varName": "",
                "varValue": ""
              }
            ]
          }
          //消息头
          if (this.tempApiDetailInfo.requestHead === undefined || this.tempApiDetailInfo.requestHead === null) {
            console.log('消息头为空')
            this.tempApiDetailInfo.requestHead = [
              {
                "Key": "",
                "Value": ""
              }
            ]
          }
          //响应消息头
          if (this.tempApiDetailInfo.responseHead === undefined || this.tempApiDetailInfo.responseHead === null) {
            console.log('响应消息头为空')
            this.tempApiDetailInfo.responseHead = [
              {
                "Key": "",
                "Value": ""
              }
            ]
          }
          //断言
          if (this.tempApiDetailInfo.assertions === undefined || this.tempApiDetailInfo.assertions === null) {
            console.log('断言为空')
            this.tempApiDetailInfo.assertions = [
              {
                "actualResult": "",
                "comparator": "",
                "expectResult": ""
              }
            ]
          }

        }else{
          console.log('parent');
        }
      },
      loadNode(node, resolve) {
        if(node.level === 0){
          return resolve([{ name:  'Root', id: 0 , type: false}]);
        }else if(node.isLeaf === true){
          return;
        }else{
          //先注释 用本地数据
          this.$http.get(this.testCaseServer+"testCaseInterface/getSameCasesByApiId?apiId=" + node.data.id).then(function (res) {
            if(res.data.succeed){
              var apiTreeInfo = res.data.data;
              return resolve(res.data.data);
            }
            return;
          },function (res) {

          });


        }
      },
      addApi(){
        console.log(this)
        var node = this.$refs.tree.currentNode.node;
        var data = node.data;

        if(node.isLeaf){

        }
      },

      rewrite(){
        var reData = this.tempApiDetailInfo;
        console.log(reData);
        return reData;
      },
      reset(){
        this.tempApiDetailInfo = {
          step: '',
          urlAddress: '',
          apiType: '',
          postWay: '',
          variables: [
            {
              "varName": "",
              "varValue": ""
            }
          ],
          requestHead: [
            {
              "Key": "",
              "Value": ""
            }
          ],
          requestBody: null,
          responseHead: [
            {
              "Key": "",
              "Value": ""
            }
          ],
          responseBody: null,
          assertions: [
            {
              "actualResult": "",
              "comparator": "",
              "expectResult": ""
            }
          ]
        }
      }


    }
  }

</script>

<style scoped>
  .el-row {
    width: 100%;

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
    width: 100%;
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
