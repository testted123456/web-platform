<template>

  <el-container id="testCaseEdit">
    <el-container >
    <el-main>
        <!--用例名称-->
      <el-row>
        <el-col :span="4" >
          <label>用例名称:</label>
        </el-col>
        <el-col :span="16">
          <el-input v-model="testCase.name" placeholder="请输入用例名称"></el-input>
        </el-col>
      </el-row>
        <!--用例描述-->
      <el-row>
        <el-col :span="4" >
          <label>用例描述:</label>
        </el-col>
        <el-col :span="16">
          <el-input v-model="testCase.description" placeholder="请输入用例描述"></el-input>
        </el-col>
      </el-row>
        <!--项目名称-->
      <el-row>
        <el-col :span="4" >
          <label>项目名称:</label>
        </el-col>
        <el-col :span="16">
          <el-input v-model="testCase.projectName" placeholder="请输入项目名称"></el-input>
        </el-col>
      </el-row>
        <!--环境-->
      <el-row>
        <el-col :span="4">
          <label>环境:</label>
        </el-col>
        <el-col :span="7">
          <el-select v-model="testCase.env" placeholder="请选择">
            <el-option
              v-for="item in envs"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
          <el-col :span="8">
              <div class="pd12">
                  <el-button type="text" @click="addApiClick">添加接口</el-button>
                  <!--<el-dialog-->
                      <!--title="接口选择"-->
                      <!--:visible.sync="addApiDialog"-->
                      <!--width="60%"-->
                      <!--:before-close="handleClose"-->
                  <!--&gt;-->
                      <!--<add-api-dialog-component ref="apiSelectView" :selectedApis="apisInCase"></add-api-dialog-component>-->
                      <!--<span slot="footer" class="dialog-footer">-->
                      <!--<el-button @click="apiBtnClick(0)">取 消</el-button>-->
                      <!--<el-button type="primary" @click="apiBtnClick(1)">确 定</el-button>-->
                    <!--</span>-->
                  <!--</el-dialog>-->
              </div>
              <div class="pd12">
                  <el-button type="text" @click="intellQueryClick">动态库查询</el-button>
              </div>
              <div class="pd12">
                  <el-button type="text">校验</el-button>
              </div>
              <div class="pd12">
                  <el-button  type="text" @click="pastApi">粘贴接口</el-button>
              </div>
          </el-col>

      </el-row>
        <!--用例列表-->
      <el-row style="padding-top:30px;">
        <el-table v-show="apisInCase.length>0"
          :data="apisInCase"
          style="width: 100%">
          <el-table-column
            prop="isCheck"
            label="批量执行/全选"
            type="selection"
            align="left"
          >
          </el-table-column>

          <el-table-column
            prop="name"
            label="接口名称"
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
            label="系统"
            align="left"
          >
          </el-table-column>

          <el-table-column
            prop="branch"
            label="分支"
            align="left"
          >
          </el-table-column>

          <el-table-column
            prop="action"
            label="操作"
            align="center" width="400px">
            <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :enterable="false"	:hide-after="500" content="搜索接口" placement="top">
                    <el-button  type="text" size="mini" ><i class="el-icon-search"></i></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="编辑接口信息" placement="top">
                    <el-button  type="text" size="mini" @click="apiEdit(scope.row,scope.$index)"><i class="el-icon-edit"></i></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="复制接口信息" placement="top">
                    <el-button  type="text" size="mini" @click="copyApi(scope.row)"><i class="el-icon-tickets"></i></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="上移" placement="top">
                    <el-button  type="text" size="mini" @click.native.prevent="moveup(scope.$index, scope.row, apisInCase)"  ><i class="el-icon-arrow-up"></i></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="下移" placement="top">
                    <el-button  type="text" size="mini" @click.native.prevent="movedown(scope.$index, scope.row, apisInCase)" ><i class="el-icon-arrow-down"></i></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="删除接口" placement="top">
                    <el-button  type="text" size="mini" @click="removeApi(scope.$index)"><i class="el-icon-minus"></i></el-button>
                </el-tooltip>
            </template>
          </el-table-column>

        </el-table>
      </el-row>

    </el-main>
    <el-aside width="50px">
    </el-aside>
    </el-container>
    <!--页面最底部 footer-->
    <el-footer style="text-align: right;">
      <el-button type="primary" @click="saveCase">确认</el-button>
      <el-button type="success">执行</el-button>
    </el-footer>


      <!-- 弹框 -->
    <el-dialog
          class="hd-dialog"
          :title="dialog.title"
          :visible.sync="dialog.visible"
          :width="dialog.width"
          :before-close="handleClose"
      >
        <!--添加接口-->
        <add-api-dialog-component ref="apiSelectView" v-if="dialog.contentType === 1"  :selectedApis="apisInCase"></add-api-dialog-component>
        <!--动态库查询-->
        <intell-check-dialog-component ref="intellCheck" v-if="dialog.contentType === 2" :intellQuery="intellCheckData" ></intell-check-dialog-component>
        <!--编辑接口-->
        <edit-api-dialog-component ref="editApiDetailInfo" v-if="dialog.contentType === 3" :testCaseInterface="dialog.extend.data"></edit-api-dialog-component>
        <!--删除接口-->
        <span v-if="dialog.contentType === 4" >是否删除这条接口？</span>

        <span v-if="dialog.footerVisible" slot="footer" class="dialog-footer">
                      <el-button @click="dialogCancel">取 消</el-button>
                      <el-button type="primary" @click="dialogDone">确 定</el-button>
        </span>
      </el-dialog>

  </el-container>

</template>

<script>

  import addApiDialogComponent from '@/components/common/addApiDialogComponent.vue';
  import intellCheckDialogComponent from '@/components/common/intellCheckDialogComponent.vue';
  import editApiDialogComponent from './editApiDialogComponent.vue';
  import {moveup, movedown} from  "../../../assets/js/tableRowMove.js";

export default {
  components: {editApiDialogComponent, addApiDialogComponent, intellCheckDialogComponent},

  name: 'TestCaseEdit',

    data () {
        return {
            testCase: {},
            apisInCase: [],
            intellCheckData:[],
            envs: [],
            system: '',
            systems: [],
            addApiDialog: false,
            apiInfodialogVisible: false,
          //  editApiInfo: 0,
            intellCheckDialog:false,
            dialog: {
                title: '',
                visible:false,
                footerVisible:true,
                contentType:0, // 1=添加接口，2=动态库查询，3=编辑接口,4=删除接口
                width:'60%',
                extend:{}   // 扩展字段
            },
            removeApiIndex:0


        }
    },

  computed: {

  },
    watch:{
        $route(){
            console.log(this.$route.params.id);
            this.getData();
        }
    },

  created() {
      this.getData();
  },


    methods: {
        moveup, movedown,
        copyApi(data){

            this.ApiCopyId = data.id;
            console.log(this.ApiCopyId);
        },
        getData(){
            //先注释 用本地数据
//      this.$http.get("http://192.168.32.105:8083/case/testCase/getCase?id=" + this.$route.params.id).then(function (res) {
//        if(res.data.succeed){
//          this.testCase = res.data.data;
//        }
//      },function (res) {
//
//      });

//      this.$http.get("http://192.168.32.105:8083/case/testCaseInterface/getByTestCaseId?testCaseId=" + this.$route.params.id).then(function (res) {
//        if(res.data.succeed){
//          this.apisInCase = res.data.data;
//        }
//      },function (res) {
//
//      });

            this.testCase = {
                "id": 1,
                "pId": 0,
                "name": "test",
                "description": "xxx",
                "type": true,
                "env": "xx",
                "projectName": "",
                "createdBy": null,
                "createdTime": null,
                "updatedBy": null,
                "updatedTime": null,
                "optstatus": 0
            }

            this.apisInCase = [
                {
                "id": 1,
                "name": "1",
                step:"step1",
                "description": "",
                "pId": 0,
                "module": "1",
                "branch": "1",
                "urlAddress": "1",
                "apiType": "0",
                "type": true,
                "postWay": "1",
                "requestHead": [{
                    "Key": null,
                    "Value": null,
                    "Description": null
                }],
                "requestBodyType": "2",
                "requestBodyRowType": "2",
                "requestBody": null,
                "responseHead": [{
                    "Key": null,
                    "Value": null,
                    "Description": null
                }],
                "responseBodyType": "0",
                "responseBody": null,
                "createdBy": "",
                "createdTime": null,
                "updatedBy": "",
                "updatedTime": null,
                "optstatus": 0,
                "system": "usr",
                "variables": [{
                    "Key": "",
                    "Value": ""
                }],
                "assertions": [{
                    "Key": "",
                    "Value": ""
                }]
            }]
            this.intellCheckData = [
              {
                  name:'abc',
                desc:'sdfaf'
            },{
                name:'abc1',
                desc:'sdfaf1'
            },{
                name:'abc2',
                desc:'sdfaf2'
            },{
                name:'ab3c',
                desc:'sdfaf3'
            },{
                name:'abc4',
                desc:'sdfaf4'
            },{
                name:'abc5',
                desc:'sdfaf5'
            },{
                name:'abc6',
                desc:'sdfaf6'
            },{
                name:'abc7',
                desc:'sdfaf7'
            },]
         },
        pastApi(){

        },

       // ------- 按钮事件  -------
        /*弹框确定*/
        dialogDone(){
            this.dialog.visible = false;
            switch (this.dialog.contentType){
                case 1:{
                    this.apisInCase =  this.$refs.apiSelectView.getApis();

                }
                    break;
                case 3:{
                    var data = this.$refs.editApiDetailInfo.saveApiDetailInfo()
                    var index = this.dialog.extend.index;
                    this.$set(this.apisInCase, index, data)

                }
                    break;
                case 4:{
                    this.apisInCase.splice(this.removeApiIndex,1)

                }
                    break;
                default:
                    break;
            }

        },
        /*弹框取消*/
        dialogCancel(){
            this.dialog.visible = false;
            switch (this.dialog.contentType){
                case 1:{
                    this.$refs.apiSelectView.resetApis();
                }
                    break;
                case 3:{
                  this.$refs.editApiDetailInfo.cancelSaveInfo()
                }
                    break;
                default:
                  break;
            }
        },
        /*添加接口*/
        addApiClick(){

            this.dialog = {
                title:'添加接口',
                visible:true,   //整个弹窗显示与否
                footerVisible:true,
                contentType:1,  //弹窗内容显示什么
                width:'60%',
                extend:{}
            }
        },
        /*动态库查询*/
        intellQueryClick(){
            this.dialog = {
                title:'动态库查询',
                visible:true,
                footerVisible:false,
                contentType:2,
                width:'60%',
                extend:{}
            }
           if(this.$refs.intellCheck !== undefined){
               this.$refs.intellCheck.setDefaultPage();
           }
        },
        /*接口编辑*/
        apiEdit(data,index){
            this.dialog = {
                title:'编辑接口',
                visible:true,
                footerVisible:true,
                contentType:3,
                width:'60%',
                extend:{
                    data:data,
                    index:index
                }
            }
        },
        // 删除接口
        removeApi(index){
            //this.apisInCase.splice(index,1)
            this.dialog = {
                title:'删除接口',
                visible:true,   //整个弹窗显示与否
                footerVisible:true,
                contentType:4,  //弹窗内容显示什么
                width:'30%',
                extend:{}
            }
            this.removeApiIndex = index;
        },

        //弹窗 右上角关闭事件
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    // 确定
                    done();
                    this.dialogCancel()
                })
                .catch(_ => {
                    // 取消

                });
        },

        saveCase(){

        }
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #testCaseEdit {
    font-size: 0.875em;
  }
  .el-row {
    width: 100%;
    margin-bottom: 20px;
    &:last-child {
     margin-bottom: 0;
   }
  }
  .el-col {
    text-align: left;
  }
  .hd-dialog{
      text-align: left;
  }
  .el-table__header {
    width: 100%;
  }
  .el-row {
      margin-bottom: 20px;
  &:last-child {
       margin-bottom: 0;
   }
  }
  .el-col {
      border-radius: 4px;
  }
  .bg-purple-dark {
      background: #99a9bf;
  }
  .bg-purple {
      background: #d3dce6;
  }
  .bg-purple-light {
      background: #e5e9f2;
  }
  .grid-content {
      border-radius: 4px;
      min-height: 36px;
  }
  .row-bg {
      padding: 10px 0;
      background-color: #f9fafc;
  }
    .pd12{
        float: left;
        padding:0 12px;
    }
</style>
