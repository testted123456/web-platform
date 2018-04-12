<template>
  <el-container style="height:600px;">
    <el-main>
      <el-row>
        <el-table v-show="apiResult.length>0"
                  :data="apiResult"
                  style="width: 100%"
                  ref="multipleTable">


          <el-table-column
            prop="apiName"
            label="名称"
            align="left"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="getDetail(scope.row.id)">{{ scope.row.apiName }}</el-button>
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

      <div v-show="detailInfoShow">
        <el-row class="hTitle">*接口url为</el-row>
        <el-row>
          <div class="jsonContent" >
            {{apiDetail.url}}
          </div>
        </el-row>


        <el-row class="hTitle">*自定义变量</el-row>
        <el-row>
          <div class="jsonContent" >
            <el-input
              type="textarea"
              :rows="8"
              placeholder="请输入内容"
              v-model="apiDetail.variables">
            </el-input>
          </div>
        </el-row>

        <el-row class="hTitle">*头部</el-row>
        <el-row>
          <div class="jsonContent" >
            <el-input
              type="textarea"
              :rows="8"
              placeholder="请输入内容"
              v-model="apiDetail.headers">
            </el-input>
          </div>
        </el-row>

        <el-row class="hTitle">*请求参数</el-row>
        <el-row>
          <!--<div class="jsonContent" >-->
            <!--{{formatJson(apiDetail.requestBody)}}-->
          <!--</div>-->
          <el-input
            type="textarea"
            :rows="8"
            placeholder="请输入内容"
            v-model="apiDetail.requestBody">
          </el-input>
        </el-row>

        <el-row class="hTitle">*响应</el-row>
        <el-row>
          <div class="jsonContent" >
            <el-input
              type="textarea"
              :rows="8"
              placeholder="请输入内容"
              v-model="apiDetail.responseBody">
            </el-input>
          </div>
        </el-row>



        <el-row class="hTitle">*预期结果</el-row>
        <el-row>
          <div class="jsonContent" >
            <el-input
              type="textarea"
              :rows="8"
              placeholder="请输入内容"
              v-model="apiDetail.exception">
            </el-input>
          </div>
        </el-row>

        <el-row class="hTitle">*断言结果</el-row>
        <el-row>
          <div class="jsonContent" >
            <el-input
              type="textarea"
              :rows="8"
              placeholder="请输入内容"
              v-model="apiDetail.assertions">
            </el-input>
          </div>
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
    name: 'apiExecuteResultDialogComponent',
    data(){
      return {
        detailInfoShow:false,

        apiResult:[],
        apiDetail:{
          url:'',
          variables:'',
          headers:'',
          requestBody:'',
          responseBody:'',
          exception:'',
          assertions:''
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
          data: {},
          url: "report/getCaseReport?id=" + caseID
        })
          .then(function (res) {
            if (res.data.code === 10000) {
              vueThis.apiResult = res.data.data;
              console.log(vueThis.apiResult )
              vueThis.apiResult.forEach(function(val,index,arr){
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
      getDetail(id){
        this.detailInfoShow = true;
        var that = this;
        this.apiResult.forEach(function(val,index,arr){
          if(val.id === id){
            that.apiDetail = that.apiResult[index]
            console.log(that.apiDetail)
            that.apiDetail.requestBody = formatJson(that.apiDetail.requestBody)
            that.apiDetail.variables = formatJson(that.apiDetail.variables)
            that.apiDetail.headers = formatJson(that.apiDetail.headers)
            that.apiDetail.responseBody = formatJson(that.apiDetail.responseBody)
            that.apiDetail.assertions = formatJson(that.apiDetail.assertions)


          }
        })
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
  textarea{
    outline: none !important;
  }
</style>
