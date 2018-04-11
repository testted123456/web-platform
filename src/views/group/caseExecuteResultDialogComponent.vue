<template>
  <el-container style="height:600px;">
    <el-main>
      <el-row>
        <el-table v-show="apiResult.aa.length>0"
                  :data="apiResult.aa"
                  style="width: 100%"
                  ref="multipleTable">

          </el-table-column>

          <el-table-column
            prop="name"
            label="名称"
            align="left"
          >
          </el-table-column>

          <el-table-column
            prop="step"
            label="步骤名称"
            align="left"
          >
          </el-table-column>

          <el-table-column
            prop="system"
            label="执行时间"
            align="left"
          >
          </el-table-column>

          <el-table-column
            prop="branch"
            label="结果"
            align="left"
          >
          </el-table-column>



        </el-table>
      </el-row>
      <el-row class="hTitle">*请求为</el-row>
      <el-row>
        <div class="jsonContent" >
          {{formatJson(JSON.stringify(apiResult.dd))}}

        </div>
      </el-row>
      <el-row class="hTitle">*实际结果</el-row>
      <el-row>
        <div class="jsonContent" >
          {{formatJson(JSON.stringify(apiResult.dd))}}
          <!--<el-input-->
            <!--type="textarea"-->
            <!--autosize-->
            <!--v-model="apiResult.dd">-->
          <!--</el-input>-->
        </div>
      </el-row>
      <el-row class="hTitle">*预期结果</el-row>
      <el-row>
        <div class="jsonContent" >
          {{formatJson(JSON.stringify(apiResult.dd))}}

        </div>
      </el-row>
      <el-row class="hTitle">*断言结果</el-row>
      <el-row>
        <el-table v-show="apiResult.aa.length>0"
                  :data="apiResult.aa"
                  style="width: 100%"
                  ref="multipleTable">

          </el-table-column>



          <el-table-column
            prop="system"
            label="信息"
            align="left"
          >
          </el-table-column>

          <el-table-column
            prop="branch"
            label="结果"
            align="left"
          >
          </el-table-column>



        </el-table>
      </el-row>
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

        apiResult:{
          'aa':[

          ],
          'dd':{
            'a':1,
            'b':2
          },
          c:{
            "errorCode": "0000000",
            "errorMessage": "处理成功",
            "succeed": true,
            "data": null
          }
        }

      }
    },
    created(){
    },
    watch:{

    },
    mounted() {
      // this.getData()
    },
    methods: {
      formatJson,
      isJson,
      getData() {
        var vueThis = this;
        var caseID = this.$route.query.testCaseId;
        // 获取表格内容
        vueThis.testCaseAxios({
          method: 'get',
          data: {},
          url: "testCase/checkCase?testCaseId=" + caseID
        })
          .then(function (res) {
            if (res.data.code === 10000) {
              vueThis.apiResult = res.data.data;
            }
          })
          .catch(function (err) {
            vueThis.$message.error('抱歉，服务器异常！');
          });
      },
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
