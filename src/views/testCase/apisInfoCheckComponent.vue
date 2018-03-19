<template>
  <div style="padding:20px;">
    <el-row style="">
      <el-col :span="5" style="text-align: center">
        <div class="grid-content">
        </div>
      </el-col>
      <el-col :span="14" style="text-align: center">
        <div class="grid-content">
          <!--<p style="text-align: left">接口</p>-->
          <el-table
            border
            :show-header=true
            highlight-current-row
            :data="apisInfoCheck">
            <el-table-column
              prop="name"
              label="名称" align="center">
            </el-table-column>
            <el-table-column
              prop="currentBranch"
              label="当前分支" align="center">
            </el-table-column>
            <el-table-column
              prop="lastBranch"
              label="最新分支" align="center">
              <template slot-scope="scope">

                <div v-for="item in scope.row.lastBranch" ><a href="javascript:;" @click="getCheckInfo(scope.row,item.branch)">{{item.branch}}</a></div>

              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="5" style="text-align: center">
        <div class="grid-content">
        </div>
      </el-col>
    </el-row>
    <div ref = "separate">
        <el-row>
            <div  style="width:100%;height:1;border-bottom:1px solid #ccc;margin:40px 0;"></div>
            <p style="text-align: center;font-size:16px;font-weight:bolder;padding:10px 0;">已选接口对比信息<p/>
            <div style="">
                <el-row :gutter="20">
                    <el-col :span="3"><div class="grid-content font-blod"></div></el-col>
                    <el-col :span="7"><div class="grid-content font-blod font-center">最新分支</div></el-col>
                    <el-col :span="7"><div class="grid-content font-blod font-center">当前分支</div></el-col>
                    <el-col :span="7"><div class="grid-content font-blod font-center">对比结果</div></el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="3"><div class="grid-content font-center">接口请求</div></el-col>
                    <el-col :span="7">
                        <div class="grid-content">
                            <textarea class="json-box">{{jsonData.lastRequestBody}}</textarea>
                        </div>
                    </el-col>
                    <el-col :span="7">
                        <div class="grid-content">
                            <textarea class="json-box">{{jsonData.currentRequestBody}}</textarea>
                        </div>
                    </el-col>
                    <el-col :span="7">
                        <div class="grid-content">
                            <textarea class="json-box">{{jsonData.compareRequest}}</textarea>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="3"><div class="grid-content font-center">接口响应</div></el-col>
                    <el-col :span="7">
                        <div class="grid-content">
                            <textarea class="json-box">{{jsonData.lastResponseBody}}</textarea>
                        </div>
                    </el-col>
                    <el-col :span="7">
                        <div class="grid-content">
                            <textarea class="json-box">{{jsonData.currentResponseBody}}</textarea>
                        </div>
                    </el-col>
                    <el-col :span="7">
                        <div class="grid-content">
                            <textarea class="json-box">{{jsonData.compareApiResponse}}</textarea>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="3"><div class="grid-content font-center">实际请求</div></el-col>
                    <el-col :span="7">
                        <div class="grid-content">
                            <textarea class="json-box">{{jsonData.requestBody}}</textarea>
                        </div>
                    </el-col>
                    <el-col :span="7">
                        <div class="grid-content">

                        </div>
                    </el-col>
                    <el-col :span="7">
                        <div class="grid-content">
                            <textarea class="json-box">{{jsonData.compareRequest}}</textarea>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="3"><div class="grid-content font-center">预期结果</div></el-col>
                    <el-col :span="7">
                        <div class="grid-content">
                            <textarea class="json-box">{{jsonData.responseBody}}</textarea>
                        </div>
                    </el-col>
                    <el-col :span="7">
                        <div class="grid-content">

                        </div>
                    </el-col>
                    <el-col :span="7">
                        <div class="grid-content">
                            <textarea class="json-box">{{jsonData.compareResponse}}</textarea>
                        </div>
                    </el-col>

                </el-row>
            </div>
        </el-row>
    </div>
  </div>
</template>

<script>
  import ElRow from "element-ui/packages/row/src/row";

  export default {
    props: [],
    components: {ElRow},
    name: 'apisInfoCheckComponent',
    data(){
      return {
        apisInfoCheck:[
            {
                'name':'1',
                'currentBranch':'12',
                'lastBranch':[
                    {
                        'branch':'dev'
                    }
                ]
            }
        ],
        jsonData:{}
      }
    },
    created(){
    },
    watch:{
      $route(){
        this.getData();
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      getData(){
        var caseID = this.$route.query.testCaseId;
        // 获取表格内容
        this.$http.get(this.testCaseServer + "testCase/checkCase?testCaseId=" + caseID).then(function (res) {
          if(res.data.code === 10000){
            console.log(res.data.data)
            this.apisInfoCheck = res.data.data;
          }
        },function (res) {
        });
      },

      getCheckInfo(data,branch){
        var separate = this.$refs.separate;
          separate.scrollIntoView();
        this.$http.get(this.testCaseServer + "testCaseInterface/checkApi?id="+ data.id +"&apiId="+ data.apiId + "&lastBranch="+ branch).then(function (res) {
          if(res.data.code === 10000){
            console.log(res.data.data)
            this.jsonData = res.data.data;
          }else{

          }
        },function (res) {
        });
      }
    }
  }

</script>

<style scoped>
  .el-row {
    /*width:100%;*/
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    padding-top: 6px;
  }
  .font-center{
    text-align: center;
  }
  .font-blod{
    font-weight:bolder;
    color:#909399;
  }
  .json-box{
    display: block;
    margin:0;
    width:100%;
    height:200px;
    border:1px solid #ccc;
    border-radius: 4px;
    resize: none;
    outline: none;
    /*overflow: scroll;*/
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
