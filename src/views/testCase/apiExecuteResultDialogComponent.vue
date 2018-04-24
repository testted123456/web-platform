<template>
  <el-container style="height:600px;">
    <el-main>
      <el-row>
        <el-table v-show="apiResult.length>0"
                  :data="apiResult"
                  style="width: 100%"
                  ref="multipleTable" border>


          <el-table-column
            prop="apiName"
            label="名称"
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
              <el-button type="text" v-bind:class="{ fontRed: !isActive }">{{ scope.row.result }}</el-button>
            </template>

          </el-table-column>


        </el-table>
      </el-row>

      <div ref = "separate">
        <div v-show="detailInfoShow"  style="padding-top:40px;">
          <div style="width:100%;padding:10px 0;text-align: center;font-size: 24px;">接口: {{apiName}} 的执行信息</div>

          <el-row class="hTitle">*接口url为</el-row>
          <el-row>
            <div class="jsonContent" >
              {{apiDetail.url}}
            </div>
          </el-row>


          <el-row class="hTitle">*自定义变量</el-row>
          <el-row>

            <el-table v-show="apiDetail.variables.length>0"
                      :data="apiDetail.variables"
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

            <el-table v-show="apiDetail.headers.length>0"
                      :data="apiDetail.headers"
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
          <el-row v-show="isrequestBodyShow">
            <el-input
              type="textarea"
              autosize
              readonly
              resize="none"
              placeholder="请输入内容"
              v-model="apiDetail.requestBody">
            </el-input>
          </el-row>


          <el-row class="hTitle">*实际响应</el-row>
          <el-row v-show="isactualResponseBodyShow">
            <el-input
              type="textarea"
              autosize
              readonly
              resize="none"
              placeholder=""
              v-model="apiDetail.actualResponseBody">
            </el-input>
          </el-row>

          <el-row class="hTitle" >*异常</el-row>
          <el-row v-show="isExceptionShow">
            <el-input
              type="textarea"
              autosize
              readonly
              resize="none"
              placeholder=""
              v-model="apiDetail.exception">
            </el-input>
          </el-row>


          <el-row class="hTitle">*预期结果:{{exceptResult}}</el-row>
          <el-row v-show="isResponseBodyShow">
            <el-input
              type="textarea"
              autosize
              readonly
              resize="none"
              placeholder=""
              v-model="apiDetail.responseBody">
            </el-input>
          </el-row>

          <el-row class="hTitle">*断言结果</el-row>
          <el-row>
            <el-table v-show="apiDetail.assertions.length>0"
                      :data="apiDetail.assertions"
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
    name: 'apiExecuteResultDialogComponent',
    data(){
      return {
        apiName:'',
        isResponseBodyShow:true,
        isactualResponseBodyShow:true,
        exceptResult:'',
        isActive:true,
        isrequestBodyShow:true,
        isExceptionShow:true,
        detailInfoShow:false,
        apiResult:[],
        apiDetail:{
          url:'',
          variables:[],
          headers:[],
          requestBody:'',
          responseBody:'',
          exception:'',
          assertions:[],
          actualResponseBody:'',
        }

      }
    },
    created(){
    },
    watch:{

    },
    mounted() {
      this.getData()
    },
    methods: {
      formatJson,
      isJson,
      getData() {
        var vueThis = this;
        var caseID = this.$route.query.id;
        // 获取表格内容
        vueThis.testCaseAxios({
          method: 'get',
          url: "report/getCaseReport?id=" + caseID + '&type=0'
        })
        .then(function (res) {
          if (res.data.code === 10000) {
            vueThis.apiResult = res.data.data;
            console.log(JSON.stringify(vueThis.apiResult) )
            vueThis.apiResult.forEach(function(val,index,arr){

              if(val.result){
                val.result = 'true'
                vueThis.isActive = true;
              }else{
                vueThis.isActive = false;
                val.result = 'false'

              }
            })
          }
        })
        .catch(function (err) {
          vueThis.$message.error('抱歉，服务器异常！');
        });



      },
      getDetail(index){
        this.detailInfoShow = true;
        var that = this;
        var separate = this.$refs.separate;
        separate.scrollIntoView();

        that.apiDetail = that.apiResult[index]
        // console.log(JSON.stringify(that.apiDetail))


        try {

          this.apiName = that.apiDetail.apiName;

          if(that.apiDetail.requestBody == null){
            this.isrequestBodyShow = false
          }else{
            that.apiDetail.requestBody = formatJson(that.apiDetail.requestBody)
          }


          if(that.apiDetail.responseBody == null){
            this.exceptResult = '';
            this.isResponseBodyShow = false;
          }else{
            that.apiDetail.responseBody = formatJson(that.apiDetail.responseBody)
            that.apiDetail.responseBody = JSON.parse(that.apiDetail.responseBody)

            if(that.apiDetail.responseBody.staus){
              this.exceptResult = '成功'
            }else{
              this.exceptResult = '失败'
            }

            if(JSON.stringify(that.apiDetail.responseBody.result) == "{}"){
              this.isResponseBodyShow = false;
            }else{

              that.apiDetail.responseBody = formatJson(that.apiDetail.responseBody.result);
            }

          }


          if(that.apiDetail.actualResponseBody == null){
            this.isactualResponseBodyShow = false;
          }else{
            that.apiDetail.actualResponseBody = formatJson(that.apiDetail.actualResponseBody)
          }


          if(that.apiDetail.exception == null){
            this.isExceptionShow = false;
          }else{
            that.apiDetail.exception = formatJson(that.apiDetail.exception)
          }


          if(this.apiDetail.variables == null || this.apiDetail.variables == 'null' ){
            this.apiDetail.variables = [];
          }else if(this.apiDetail.variables.length == 0){
            this.apiDetail.variables = [];
          }else{
            if(typeof(this.apiDetail.variables) == "string"){
              this.apiDetail.variables = JSON.parse(this.apiDetail.variables)
            }
          }

          if(that.apiDetail.headers == null || that.apiDetail.headers == 'null' ){
            that.apiDetail.headers = [];
          }else if(this.apiDetail.headers.length == 0){
            this.apiDetail.headers = [];
          }else{
            if(typeof(that.apiDetail.headers) == "string"){
              that.apiDetail.headers = JSON.parse(that.apiDetail.headers)
            }
          }


          if(that.apiDetail.assertions == null || that.apiDetail.assertions == 'null' ){
            that.apiDetail.assertions = [];
          }else if(this.apiDetail.assertions.length == 0){
            this.apiDetail.assertions = [];
          }else{
            if(typeof(that.apiDetail.assertions) == "string"){
              that.apiDetail.assertions = JSON.parse(that.apiDetail.assertions)
            }
          }

        } catch(err) {
          // alert('error')
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
    font-size: 18px;
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
