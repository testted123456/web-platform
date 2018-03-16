<template>
  <el-container style="padding: 40px">
    <el-row :gutter="20">
      <el-col :span="9">
        <!--<p class="vue-transfer-label">接口</p>-->
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

              <div v-for="item in scope.row.lastBranch" ><a href="javascript:;" @click="getCheckInfo(item.id,item.branch)">{{item.system}}</a></div>

            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <!--<el-col :span="15">-->
        <!--<label class="vue-transfer-label">已选接口</label>-->
        <!--<div style="width:1500px;">-->
          <!--<el-row :gutter="20">-->
            <!--<el-col :span="3"><div class="grid-content font-blod"></div></el-col>-->
            <!--<el-col :span="7"><div class="grid-content font-blod font-center" @click="aa">最新分支</div></el-col>-->
            <!--<el-col :span="7"><div class="grid-content font-blod font-center">当前分支</div></el-col>-->
            <!--<el-col :span="7"><div class="grid-content font-blod font-center">对比结果</div></el-col>-->
          <!--</el-row>-->
          <!--<el-row :gutter="20">-->
            <!--<el-col :span="3"><div class="grid-content font-center">请求</div></el-col>-->
            <!--<el-col :span="7">-->
              <!--<div class="grid-content">-->
                <!--<textarea class="json-box"></textarea>-->
              <!--</div>-->
            <!--</el-col>-->
            <!--<el-col :span="7">-->
              <!--<div class="grid-content">-->
                <!--<textarea class="json-box"></textarea>-->
              <!--</div>-->
            <!--</el-col>-->
            <!--<el-col :span="7">-->
              <!--<div class="grid-content">-->
                <!--<textarea class="json-box"></textarea>-->
              <!--</div>-->
            <!--</el-col>-->
          <!--</el-row>-->
          <!--<el-row :gutter="20">-->
            <!--<el-col :span="3"><div class="grid-content font-center">响应</div></el-col>-->
            <!--<el-col :span="7">-->
              <!--<div class="grid-content">-->
                <!--<textarea class="json-box"></textarea>-->
              <!--</div>-->
            <!--</el-col>-->
            <!--<el-col :span="7">-->
              <!--<div class="grid-content">-->
                <!--<textarea class="json-box"></textarea>-->
              <!--</div>-->
            <!--</el-col>-->
            <!--<el-col :span="7">-->
              <!--<div class="grid-content">-->
                <!--<textarea class="json-box"></textarea>-->
              <!--</div>-->
            <!--</el-col>-->
          <!--</el-row>-->
        <!--</div>-->
      <!--</el-col>-->
    </el-row>
  </el-container>
</template>

<script>

  export default {
    props: [],
    components: {},
    name: 'apisInfoCheckComponent',
    data(){
        return {
          apisInfoCheck:[]
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

      getCheckInfo(){

        this.$http.get(this.testCaseServer + "testCaseInterface/checkApi?id="+ 5 +"&apiId="+ 5 + "&lastBranch="+ 8).then(function (res) {
          if(res.data.code === 10000){
            console.log(res.data.data)

          }
        },function (res) {

        });
      }



    }
  }

</script>

<style scoped>
    .el-row {
        width:100%;
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
    height:100px;
    border:1px solid #ccc;
    border-radius: 4px;
    resize: none;
    outline: none;
    overflow: scroll;
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
