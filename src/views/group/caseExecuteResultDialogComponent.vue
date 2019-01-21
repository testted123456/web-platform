<template>
  <el-container style="height:600px;">
    <el-main>
      <el-tabs  type="card" @tab-click="handleClick">

        <el-tab-pane v-for="tab in records" :label="tab.createdTime" :key="tab.id"></el-tab-pane>

      </el-tabs>


      <!--执行详情-->
      <el-row style="margin-top:30px;">

        <el-table v-show="groupList.length>0"
                  :data="groupList"
                  style="width: 100%"
                  ref="multipleTable" border>

          <el-table-column
            prop="name"
            label="用例名称"
            align="left"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="getCase(scope.$index,scope.row.name)">{{ scope.row.name }}</el-button>
            </template>

          </el-table-column>

          <el-table-column
            prop="result"
            label="结果"
            align="left"
          >
            <template slot-scope="scope">
              <el-button type="text" v-bind:class="{ fontRed: !scope.row.result }">{{scope.row.result}}</el-button>
            </template>
          </el-table-column>


        </el-table>
      </el-row>

      <!--case详情-->
      <el-row style="margin-top:50px;" v-show="caseInfoShow">
        <div style="width:100%;padding:20px 0;text-align: left;font-size: 22px;">用例：{{caseName}}</div>

        <el-table v-show="apiResult.length>0"
                  :data="apiResult"
                  style="width: 100%"
                  ref="multipleTable" border>

          <el-table-column
            prop="apiName"
            label="接口名称"
            align="left"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="getDetail(scope.$index)">{{ scope.row.apiName }}</el-button>
            </template>

          </el-table-column>

          <el-table-column
            prop="apiStepName"
            label="步骤名称"
            align="left"
          >
          </el-table-column>

          <el-table-column
            prop="createdTime"
            label="执行时间"
            align="left"
          >
          </el-table-column>

          <el-table-column
            prop="result"
            label="结果"
            align="left"
          >
            <template slot-scope="scope">
              <el-button type="text" v-bind:class="{ fontRed: !scope.row.result }">{{ scope.row.result}}</el-button>
            </template>

          </el-table-column>
        </el-table>
      </el-row>

      <!--api详情-->
      <div ref = "separate">
        <div v-show="detailInfoShow"  style="padding-top:40px;">

          <div style="width:100%;padding:10px 0;text-align: left;font-size: 20px;">接口: {{apiDetail.apiName}} </div>

          <el-row class="hTitle">*接口url为</el-row>
          <el-row>
            <div class="jsonContent" >
              {{apiDetail.url}}
            </div>
          </el-row>

          <el-row class="hTitle">*自定义变量</el-row>
          <el-row>
            <!--<el-table v-show="apiDetail.variables !== null && apiDetail.variables.length>0"
                      :data="apiDetail.variables"
                      style="width: 100%"
                      ref="multipleTable" border>-->
            <el-table v-show="apiDetail.variables !== null && apiDetail.variables.length>0"
                      :data="apiVariables"
                      style="width: 100%"
                      ref="multipleTable" border>

              <el-table-column
                prop="Key"
                label="Key"
                align="left"
              >
              </el-table-column>

              <el-table-column
                prop="Value"
                label="Value"
                align="left"
              >
              </el-table-column>
            </el-table>

          </el-row>

          <el-row class="hTitle">*请求头</el-row>
          <el-row>
            <el-table v-show="apiDetail.headers !== null && apiDetail.headers.length>0"
                      :data="apiHeaders"
                      style="width: 100%"
                      ref="multipleTable" border>

              <el-table-column
                prop="Key"
                label="Key"
                align="left"
              >
              </el-table-column>

              <el-table-column
                prop="Value"
                label="Value"
                align="left"
              >
              </el-table-column>
            </el-table>
          </el-row>

          <el-row class="hTitle">*请求参数</el-row>
          <el-row v-show="apiDetail.requestBody !== null">
            <el-input
              type="textarea"
              autosize
              readonly
              resize="none"
              placeholder="请输入内容"
              v-model="requestBodyResult">
            </el-input>
          </el-row>


          <el-row class="hTitle">*实际响应</el-row>
          <el-row v-show="apiDetail.actualResponseBody !== null">
            <el-input
              type="textarea"
              autosize
              readonly
              resize="none"
              placeholder=""
              v-model="actualResponseBodyResult">
            </el-input>
          </el-row>

          <el-row class="hTitle" >*异常</el-row>
          <el-row v-show="apiDetail.exception !== null">
            <el-input
              type="textarea"
              autosize
              readonly
              resize="none"
              placeholder=""
              v-model="exceptionResult">
            </el-input>
          </el-row>

          <!--<el-row class="hTitle">*预期结果:{{ apiDetail.responseBody == null ? "" : (apiDetail.responseBody.staus?"成功":"失败") }}</el-row>-->
          <el-row class="hTitle">*预期结果:{{ apiDetail.responseBody == null ? "" : resultCompareResult }}</el-row>
          <el-row v-show="apiDetail.responseBody !== null">
            <el-input
              type="textarea"
              autosize
              readonly
              resize="none"
              placeholder=""
              v-model="responseBodyResult">
            </el-input>
          </el-row>

          <el-row class="hTitle">*断言结果</el-row>
          <el-row>
            <!--<el-table v-show="apiDetail.assertions !== null && apiDetail.assertions.length>0"
                      :data="apiDetail.assertions"
                      style="width: 100%"
                      ref="multipleTable" border>-->
            <el-table v-show="apiDetail.assertions !== null && apiDetail.assertions.length>0"
                      :data="apiAssertions"
                      style="width: 100%"
                      ref="multipleTable" border>

              <el-table-column
                prop="actualResult"
                label="预期结果"
                align="left"
              >
              </el-table-column>

              <el-table-column
                prop="comparator"
                label="比较符"
                align="left"
              >
              </el-table-column>

              <el-table-column
                prop="expectResult"
                label="实际结果"
                align="left"
              >
              </el-table-column>

              <el-table-column
                prop="result"
                label="结果"
                align="left"
              >
              </el-table-column>
            </el-table>
          </el-row>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import { formatJson, isJson } from "@/assets/js/formatJson.js";

  export default {
    props: [],
    components: {},
    name: 'caseExecuteResultDialogComponent',
    data(){
      return {
        requestBodyResult:null,
        responseBodyResult:null,
        exceptionResult:null,
        actualResponseBodyResult:null,
        isExceptionShow:true,
        detailInfoShow:false,
        caseInfoShow:false,
        groupList:[],
        records:[],
        apiResult:[],
        apiDetail:{
          url:'',
          variables:[],
          headers:[],
          requestBody:'',
          responseBody:'',
          exception:'',
          assertions:[],
          actualResponseBody:''
        },
        apiVariables: [],
        apiHeaders: [],
        apiAssertions: [],
        resultCompareResult: '成功',
        caseName: ''
      }
    },
    created(){

    },
    beforeMount(){
      this.getData()
    },
    watch:{

    },
    mounted() {
      // this.getData()
    },
    methods: {
      formatJson,
      isJson,
      handleClick(tab, event) {
        console.log(tab.index);
        this.detailInfoShow=false;
        this.caseInfoShow=false;

        var index = tab.index;

        var id = this.records[index].id

        var vueThis = this;
        vueThis.testCaseAxios({
          method: 'get',
          url: "report/getGroupReport?historyId=" + id
        })
          .then(function (res) {
            if (res.data.code === 10000) {
              vueThis.groupList = res.data.data;

            }else{
              vueThis.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
          })
          .catch(function (err) {
            vueThis.$message.error(err);
          });
      },
      getData() {
        var vueThis = this;
        var caseID = this.$route.query.id;
        // 获取表格内容
        vueThis.testCaseAxios({
          method: 'get',
          url: "report/getGroupRunHistory?id=" + caseID
        })
          .then(function (res) {
            if (res.data.code === 10000) {
              vueThis.records = res.data.data;
              if(vueThis.records.length > 0){
                //获取最近一次执行的 group信息
                var id = vueThis.records[0].id
                vueThis.testCaseAxios({
                  method: 'get',
                  url: "report/getGroupReport?historyId=" + id
                })
                  .then(function (res) {
                    if (res.data.code === 10000) {
                      vueThis.groupList = res.data.data;

                      vueThis.groupList.forEach(function(val,index,arr){
                        if(val.result){
                          val.result = true
                        }else{
                          val.result = false
                        }
                      })

                    }else{
                      vueThis.$message({
                        message: res.data.msg,
                        type: 'error'
                      });
                    }
                  })
                  .catch(function (err) {
                    vueThis.$message.error(err);
                  });
              }else{
                vueThis.$message.error('暂无执行信息！');
              }
            }else{
              vueThis.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
          })
          .catch(function (err) {
            vueThis.$message.error(err);
          });
      },
      getGroup(id){
        var vueThis = this;
        vueThis.testCaseAxios({
          method: 'get',
          url: "report/getGroupReport?historyId=" + id
        })
          .then(function (res) {
            if (res.data.code === 10000) {
              vueThis.groupList = res.data.data;

              vueThis.groupList.forEach(function(val,index,arr){
                if(val.result){
                  val.result = 'true'
                }else{
                  val.result = 'false'
                }
              })
            }else{
              vueThis.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
          })
          .catch(function (err) {
            vueThis.$message.error(err);
          });
      },
      getCase(index, name){
        this.apiResult = this.groupList[index].data;
        this.caseInfoShow = true;
        this.caseName = name;
      },

      getDetail(index){

        //详情数据对象
        this.apiDetail = this.apiResult[index]
        // console.log(JSON.stringify(this.apiDetail))
        // 显示详情页面
        this.detailInfoShow = true;
        var separate = this.$refs.separate;
        separate.scrollIntoView();

        try {
          //自定义变量
          if(typeof (this.apiDetail.variables) === 'string' && this.apiDetail.variables !== null){
            this.apiVariables = JSON.parse(this.apiDetail.variables)
          }

          //请求消息头
          if(typeof (this.apiDetail.headers) === 'string' && this.apiDetail.headers !== null){
            this.apiHeaders= JSON.parse(this.apiDetail.headers)
          }

          // *请求参数
          this.requestBodyResult = this.apiDetail.requestBody

          if(typeof(this.apiDetail.requestBody) === "string" && this.apiDetail.requestBody !== null){
            /*this.requestBodyResult = JSON.stringify(this.requestBodyResult)
            this.requestBodyResult = JSON.parse(this.requestBodyResult)*/
            this.requestBodyResult = formatJson(this.apiDetail.requestBody)
          }
          // console.log(this.requestBodyResult)

          //*实际响应
          this.actualResponseBodyResult = this.apiDetail.actualResponseBody

          if(typeof(this.apiDetail.actualResponseBody) === "string" && this.apiDetail.actualResponseBody !== null){
            /*this.actualResponseBodyResult = JSON.stringify(this.actualResponseBodyResult)
            this.actualResponseBodyResult = JSON.parse(this.actualResponseBodyResult)*/
            this.actualResponseBodyResult = formatJson(this.apiDetail.actualResponseBody)
          }
          // console.log(this.actualResponseBodyResult)

          //*异常
          this.exceptionResult = this.apiDetail.exception

          if(typeof(this.apiDetail.exception) === "object" && this.apiDetail.exception !== null){
            this.exceptionResult = JSON.stringify(this.exceptionResult)
            this.exceptionResult = JSON.parse(this.exceptionResult)
            this.exceptionResult = formatJson(this.exceptionResult)
          }
          // console.log(this.exceptionResult)

          // *预期结果
          if(typeof(this.apiDetail.responseBody) === "string" && this.apiDetail.responseBody !== null){
            let rbr = JSON.parse(this.apiDetail.responseBody);
            if(rbr.result !== null){
              this.responseBodyResult = formatJson(rbr.result);
            }
            if(rbr.staus !== true){
              this.resultCompareResult = '失败';
            }
            /*this.responseBodyResult = this.apiDetail.responseBody.result;
            this.responseBodyResult = JSON.stringify(this.responseBodyResult)
            this.responseBodyResult = JSON.parse(this.responseBodyResult)
            this.responseBodyResult = formatJson(this.responseBodyResult);*/
          }else{
            this.responseBodyResult = null;
          }

          //断言
          if(typeof (this.apiDetail.assertions) === 'string' && this.apiDetail.assertions !== null){
            this.apiAssertions= JSON.parse(this.apiDetail.assertions)
          }
          // console.log("responseBodyResult:" + this.responseBodyResult)
        } catch(err) {
        }
      }
    }
  }

</script>

<style scoped>
  .fontRed{
    color:red;
  }
  .jsonContent{
    border:1px solid #bcbec2;
    padding:8px;
    width:100%;
    background: #f5f5f5;
    border-radius:5px;
  }
  .hTitle{
    padding: 15px 0;
    font-size: 16px;
  }
  .textAreaStyle{
    outline: none !important;
    resize: none;
    display: block;
    padding: 5px 15px;
    line-height: 1.5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    font-size: inherit;
    color: #606266;
    background-color: #fff;
    background-image: none;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    text-indent: 0px;
  }



  .el-textarea.is-disabled .el-textarea__inner {
    background-color: #f5f5f5;
    border-color: #e4e7ed;
    color: #606266;
    cursor: not-allowed;
  }
</style>
