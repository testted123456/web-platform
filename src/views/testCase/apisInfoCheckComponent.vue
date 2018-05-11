<template>
  <div style="padding:20px;">
    <el-row style="">

      <el-col :span="24" style="text-align: center">
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

    </el-row>
    <div ref = "separate">
        <el-row v-show="ifShow">
            <p style="text-align: center;font-size:16px;font-weight:bolder;padding:10px 0;">已选接口对比信息<p/>

          <div class="block" >
            <el-carousel trigger="click" :autoplay="ifAutoPlay" >

              <el-carousel-item>
                <div style="padding:10px;">
                  <div style="text-align: center;padding:6px;">最新分支</div>
                  <el-input
                    type="textarea"
                    autosize
                    readonly
                    resize="none"
                    placeholder=""
                    v-model="jsonData.lastRequestBody" style="border:none;">
                  </el-input>
                </div>
              </el-carousel-item>
              <el-carousel-item>
                <div style="padding:10px;">
                  <div style="text-align: center;padding:6px;">当前分支</div>
                  <el-input
                    type="textarea"
                    autosize
                    readonly
                    resize="none"
                    placeholder=""
                    v-model="jsonData.currentRequestBody" style="border:none;">
                  </el-input>
                </div>

              </el-carousel-item>
              <el-carousel-item>
                <div style="padding:10px;">
                  <div style="text-align: center;padding:6px;">对比结果</div>
                  <el-input
                    type="textarea"
                    autosize
                    readonly
                    resize="none"
                    placeholder=""
                    v-model="jsonData.comprareApiRequest" style="border:none;">
                  </el-input>
                </div>

              </el-carousel-item>
            </el-carousel>
            </div>

          </el-row>
      </div>
    </div>
  </template>

  <script>
    import ElRow from "element-ui/packages/row/src/row";
    import { formatJson, isJson } from "@/assets/js/formatJson.js";

    export default {
      props: [],
      components: {ElRow},
      name: 'apisInfoCheckComponent',
      data(){
        return {
          ifShow:false,
          ifAutoPlay:false,
          apisInfoCheck:[
              {
                  'name':'',
                  'currentBranch':'',
                  'lastBranch':[
                      {
                          'branch':''
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
        formatJson,
        isJson,
        getData(){
          var vueThis = this;
          var caseID = this.$route.query.id;
          // 获取表格内容
          vueThis.testCaseAxios({
            method: 'get',
            url: "testCase/checkCase?testCaseId=" + caseID
          })
          .then(function (res) {
            if(res.data.code === 10000){
              vueThis.apisInfoCheck = res.data.data;
            }
          })
          .catch(function (err) {
            vueThis.$message.error('抱歉，服务器异常！' );
          });
        },

        getCheckInfo(data,branch){
          this.ifShow = true;
          var separate = this.$refs.separate;
          var vueThis = this;
            separate.scrollIntoView();
          vueThis.testCaseAxios({
            method: 'get',
            url: "testCaseInterface/checkApi?id="+ data.id +"&apiId="+ data.apiId + "&lastBranch="+ branch
          })
          .then(function (res) {
            if(res.data.code === 10000){
              vueThis.jsonData = res.data.data;

              vueThis.jsonData.lastRequestBody = formatJson(vueThis.jsonData.lastRequestBody)
              vueThis.jsonData.currentRequestBody = formatJson(vueThis.jsonData.currentRequestBody)
              vueThis.jsonData.comprareApiRequest = formatJson(vueThis.jsonData.comprareApiRequest)


            }else{

            }
          })
          .catch(function (err) {
            vueThis.$message.error('抱歉，服务器异常！' );
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

    .el-carousel__item h3 {
      color: #475669;
      font-size: 14px;
      opacity: 0.75;
      line-height: 150px;
      margin: 0;
    }


    /*.el-carousel__item:nth-child(2n) {*/
      /*background-color: #99a9bf;*/
    /*}*/

    /*.el-carousel__item:nth-child(2n+1) {*/
      /*background-color: #d3dce6;*/
    /*}*/

  </style>
