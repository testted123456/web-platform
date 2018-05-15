<template>
  <el-container >
    <el-row :span="24">
      <el-col :span="6" style="border:1px solid #ccc">
        <div class="vue-transfer-tree">
          <label class="vue-transfer-label">接口</label>
          <input class="vue-transfer-input" placeholder="输入接口名称搜索"/>
          <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
      </el-col>

      <el-col :span="17" style="margin-left:18px;border:1px solid #ccc">
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
                    <el-tabs v-model="apiInCaseTab" @tab-click="handleClick">
                      <el-tab-pane label="自定义变量" name="variables">
                        <el-table :data="tempApiDetailInfo.variables" v-if="activeIndex == 0 ">
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
                        <el-table :data="tempApiDetailInfo.requestHead" v-if="activeIndex == 1 ">
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
                        <el-row v-if="activeIndex == 2 ">
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
                        <el-table :data="tempApiDetailInfo.responseHead" v-if="activeIndex == 3 ">
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
                        <el-row v-if="activeIndex == 4 ">
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
                        <el-table :data="tempApiDetailInfo.assertions" v-if="activeIndex == 5 ">
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
        activeIndex:0,
        temp:{},
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
        This.testCaseAxios({
          method: 'get',
          data: {
          },
          url: "testCaseInterface/getSameCasesByApiId?apiId=" + This.searchInfo.interfaceId
        })
        .then(function (res) {
          if(res.data.code === 10000){
            This.treeData = res.data.data;
            console.log(This.treeData)
          }
        })
        .catch(function (err) {
          This.$message.error('抱歉，服务器异常！' );
        });
      },
      handleNodeClick(data, node, instance) {
        console.log(data);
        if(node.childNodes.length === 0){
            console.log('leaf');
           // this.tempApiDetailInfo = data.api;

          this.temp = JSON.stringify(data.api);
          console.log(this.temp)
          this.temp = JSON.parse(this.temp);
          if (this.temp.apiType == 0) {
            this.temp.apiType = 'Http'
          } else if (this.temp.apiType == 1) {
            this.temp.apiType = 'Https'
          } else if (this.temp.apiType === 2) {
            this.temp.apiType = 'MQ'
          }

          if (this.temp.postWay == 0) {
            this.temp.postWay = 'get'
          } else if (this.temp.postWay == 1) {
            this.temp.postWay = 'post'
          }

          //消息体
          if (this.temp.requestBody) {
            console.log('消息体不为空',this.temp.requestBody)
            this.temp.requestBody = formatJson(this.temp.requestBody);
          }
          //预期结果
          if (this.temp.responseBody) {
            console.log('预期结果不为空',this.temp.requestBody)
            this.temp.responseBody = formatJson(this.temp.responseBody);
          }
          //自定义变量
          if (this.temp.variables === undefined || this.temp.variables === null || this.temp.variables == 'null') {
            console.log('自定义变量为空')
            this.temp.variables = [
              {
                "varName": "",
                "varValue": ""
              }
            ]
          }else{

            this.temp.variables = JSON.parse(this.temp.variables)
            console.log(this.temp.variables)
          }
          //消息头
          if (this.temp.requestHead === undefined || this.temp.requestHead == null || this.temp.requestHead == 'null') {
            console.log('消息头为空')
            this.temp.requestHead = [
              {
                "Key": "",
                "Value": ""
              }
            ];
          }else{

            this.temp.requestHead = JSON.parse(this.temp.requestHead)
          }
          //响应消息头
          if (this.temp.responseHead === undefined || this.temp.responseHead == null || this.temp.responseHead == 'null') {
            console.log('响应消息头为空')
            this.temp.responseHead = [
              {
                "Key": "",
                "Value": ""
              }
            ]
          }else{
            this.temp.responseHead = JSON.parse(this.temp.responseHead)
          }
          //断言
          if (this.temp.assertions === undefined || this.temp.assertions === null || this.temp.assertions == 'null') {
            console.log('断言为空')
            this.temp.assertions = [
              {
                "actualResult": "",
                "comparator": "",
                "expectResult": ""
              }
            ]
          }else{
            this.temp.assertions = JSON.parse(this.temp.assertions)
          }

          this.tempApiDetailInfo = JSON.stringify(this.temp)
          this.tempApiDetailInfo = JSON.parse(this.tempApiDetailInfo)

          console.log(this.temp)
          console.log(this.tempApiDetailInfo)

        }else{
          console.log('parent');
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
      },
      handleClick(tab, event){
        console.log(tab.index)
        this.activeIndex = tab.index;
      },


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
    /*border: 0.5px solid;*/
    border-radius: 5px;
    min-height: 500px;
    height: 500px;
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
