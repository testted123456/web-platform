<template>
  <el-container style="height:600px;">
    <el-main>
      <el-row>
        <el-col :span="6">
          <el-table v-show="records.length>0"
                    :data="records"
                    style="width: 100%"
                    ref="multipleTable" border>


            <el-table-column
              prop="createdTime"
              label="时间"
              align="left"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="getGroup(scope.row.id)">{{ scope.row.createdTime }}</el-button>
              </template>

            </el-table-column>



          </el-table>
        </el-col>
        <el-col :span="16" style="margin-left:40px;">
          <el-table v-show="groupList.length>0"
                    :data="groupList"
                    style="width: 100%"
                    ref="multipleTable" border>

            <el-table-column
              prop="name"
              label="名称"
              align="left"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="getCase(scope.$index)">{{ scope.row.name }}</el-button>
              </template>

            </el-table-column>

            <el-table-column
              prop="result"
              label="结果"
              align="left"
            >
            </el-table-column>


          </el-table>
        </el-col>
      </el-row>

      <el-row style="margin-top:50px;" v-show="caseInfoShow">
        <div style="width:100%;padding:10px 0;text-align: center;font-size: 24px;">case详情</div>

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
          </el-table-column>
        </el-table>
      </el-row>
      <div v-show="detailInfoShow" style="padding-top:60px;">
        <div style="width:100%;padding:10px 0;text-align: center;font-size: 24px;">接口执行信息</div>
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
        <el-row>
          <el-input
            type="textarea"
            autosize
            readonly
            resize="none"
            placeholder="请输入内容"
            v-model="apiDetail.requestBody">
          </el-input>
        </el-row>

        <!--<el-row class="hTitle">*响应</el-row>-->
        <!--<el-row>-->
        <!--<el-input-->
        <!--type="textarea"-->
        <!--autosize-->
        <!--readonly-->
        <!--resize="none"-->
        <!--placeholder=""-->
        <!--v-model="apiDetail.responseBody">-->
        <!--</el-input>-->
        <!--</el-row>-->

        <el-row class="hTitle">*实际响应</el-row>
        <el-row>
          <el-input
            type="textarea"
            autosize
            readonly
            resize="none"
            placeholder=""
            v-model="apiDetail.actualResponseBody">
          </el-input>
        </el-row>



        <el-row class="hTitle">*预期结果</el-row>
        <!--exception-->
        <el-row>
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
          url: "report/getGroupRunHistory?id=" + caseID
        })
          .then(function (res) {
            if (res.data.code === 10000) {
              vueThis.records = res.data.data;

            }
          })
          .catch(function (err) {
            vueThis.$message.error('抱歉，服务器异常！');
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

            }
          })
          .catch(function (err) {
            vueThis.$message.error('抱歉，服务器异常！');
          });
      },
      getCase(index){
        this.apiResult = this.groupList[index].data;
        this.caseInfoShow = true;
      },
      getDetail(index){
        this.detailInfoShow = true;
        this.apiDetail = this.apiResult[index]
        this.apiDetail.requestBody = formatJson(this.apiDetail.requestBody)
        this.apiDetail.responseBody = formatJson(this.apiDetail.responseBody)
        this.apiDetail.actualResponseBody = formatJson(this.apiDetail.actualResponseBody)

        if(this.apiDetail.variables == null || this.apiDetail.variables == 'null' || this.apiDetail.variables.length == 0){
          this.apiDetail.variables = [];
        }else{
          if(typeof(this.apiDetail.variables) == "string"){
            this.apiDetail.variables = JSON.parse(this.apiDetail.variables)
          }
        }

        if(this.apiDetail.headers == null || this.apiDetail.headers == 'null' || this.apiDetail.headers.length == 0){
          this.apiDetail.headers = [];
        }else{
          if(typeof(this.apiDetail.headers) == "string"){
            this.apiDetail.headers = JSON.parse(this.apiDetail.headers)
          }
        }


        if(this.apiDetail.assertions == null || this.apiDetail.assertions == 'null' || this.apiDetail.assertions.length == 0){
          this.apiDetail.assertions = [];
        }else{
          if(typeof(this.apiDetail.assertions) == "string"){
            this.apiDetail.assertions = JSON.parse(this.apiDetail.assertions)
          }
        }
      }
    }
  }

</script>

<style scoped>
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
