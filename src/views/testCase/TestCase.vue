<template>
  <el-container>
    <el-main>
      <div style="padding-bottom: 60px;">
        <div style="width:80%;text-align: left">
          <el-form   ref="testCase"  :label-position="labelPosition"  label-width="100px" :model="testCase">
            <!--用例名称-->
            <el-form-item label="用例名称" prop="name" :rules="[{ required: true, trigger: 'blur',message: '用例名称不能为空'} ]">
              <el-input v-model="testCase.name" placeholder="请输入用例名称"></el-input>
            </el-form-item>
            <!--用例描述-->
            <el-form-item label="用例描述" prop="description" :rules="[{ required: false, trigger: 'blur',message: '用例描述不能为空'} ]">
              <el-input v-model="testCase.description" placeholder="请输入用例描述"></el-input>
            </el-form-item>
            <!--项目名称-->
            <el-form-item label="项目名称" prop="projectName" :rules="[{ required: false, trigger: 'blur',message: '项目名称不能为空'} ]">
              <el-input v-model="testCase.projectName" placeholder="请输入项目名称"></el-input>
            </el-form-item>
            <!--流程用例-->
            <el-form-item label="流程用例" prop="caseType" :rules="[{ required: true, message: '流程用例不能为空'} ]">
              <el-radio v-model="testCase.caseType" label="true">是</el-radio>
              <el-radio v-model="testCase.caseType" label="false">否</el-radio>
            </el-form-item>
            <!--环境-->
            <el-form-item label="环境" prop="env" :rules="[{ required: true, message: '环境不能为空'} ]">
              <el-col :span="8">
                <el-select v-model="testCase.env" placeholder="请选择">
                  <el-option
                    v-for="item in enviornment"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="16">
                <div class="pd12">
                  <el-button type="text" @click="addApiClick">添加接口</el-button>
                </div>
                <!--<div class="pd12">-->
                <!--<el-button type="text" @click="intellQueryClick">动态库查询</el-button>-->
                <!--</div>-->
                <div class="pd12">
                  <el-button type="text" @click="apiInfoCheck" v-if="executeBtnShow">校验</el-button>
                </div>
                <div class="pd12">
                  <el-button  type="text" @click="pastApi">粘贴接口</el-button>
                </div>
              </el-col>
            </el-form-item>
          </el-form>
        </div>
        <!--用例列表-->
        <el-row style="padding-top:30px;">
          <el-table v-show="testCase.testCaseInterfaces.length>0"
                    :data="testCase.testCaseInterfaces"
                    style="width: 100%"
                    @select-all = "selectAll"
                    @select = "selectOne"
                    @selection-change="handleSelectionChange"
                    ref="multipleTable">
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
              align="center" width="280px">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :enterable="false"	:hide-after="500" content="搜索接口" placement="top">
                  <el-button  type="text" size="mini" @click="searchApi(scope.row,scope.$index)"><i class="el-icon-search"></i></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="编辑接口信息" placement="top">
                  <el-button  type="text" size="mini" @click="apiEdit(scope.row,scope.$index)"><i class="el-icon-edit"></i></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="复制接口信息" placement="top">
                  <el-button  type="text" size="mini" @click="copyApi(scope.row,scope.$index)"><i class="el-icon-tickets"></i></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="上移" placement="top">
                  <el-button  type="text" size="mini" @click.native.prevent="moveup(scope.$index, scope.row, testCase.testCaseInterfaces)"  ><i class="el-icon-arrow-up"></i></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="下移" placement="top">
                  <el-button  type="text" size="mini" @click.native.prevent="movedown(scope.$index, scope.row, testCase.testCaseInterfaces)" ><i class="el-icon-arrow-down"></i></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="删除接口" placement="top">
                  <el-button  type="text" size="mini" @click="removeApi(scope.$index)"><i class="el-icon-minus"></i></el-button>
                </el-tooltip>
              </template>
            </el-table-column>

          </el-table>
        </el-row>
      </div>

      <!-- 搜索 增加 删除 编辑 校验 动态库查询等弹框 -->
      <el-dialog
        v-if="dialog.visible"
        class="hd-dialog"
        :title="dialog.title"
        :visible.sync="dialog.visible"
        :width="dialog.width"
        :before-close="handleClose"

      >
        <!--搜索弹窗-->
        <search-api-dialog-component ref="searchApiDetailInfo" v-if="dialog.contentType === 5" :searchInfo="dialog.extend.data"></search-api-dialog-component>
        <!--添加接口弹窗-->
        <add-api-dialog-component ref="apiSelectView" v-if="dialog.contentType === 1"  :selectedApis="testCase.testCaseInterfaces"></add-api-dialog-component>
        <!--动态库查询弹窗-->
        <intell-check-dialog-component ref="intellCheck" v-if="dialog.contentType === 2" :intellQuery="intellCheckData" ></intell-check-dialog-component>
        <!--校验弹窗-->
        <apis-info-check-component ref="apisInfoCheck" v-if="dialog.contentType === 6" :apisInfoCheck="testCase.testCaseInterfaces" ></apis-info-check-component>
        <!--编辑接口弹窗-->
        <edit-api-dialog-component ref="editApiDetailInfo" v-if="dialog.contentType === 3" :testCaseInterface="dialog.extend.data"></edit-api-dialog-component>
        <!--删除接口弹窗-->
        <span v-if="dialog.contentType === 4" >是否删除这条接口？</span>
        <!--执行弹窗-->
        <div v-if="dialog.contentType === 7" ref="executeCase">
          <el-input
            type="textarea"
            :rows="1"
            v-model="excResult"
            v-show="false"
          >
          </el-input>
          <div v-html="compiledMarkdown" class="markDown"></div>
        </div>
        <!--弹窗footer-->
        <span v-if="dialog.footerVisible" slot="footer" class="dialog-footer">
                      <el-button @click="dialogCancel">取 消</el-button>
                      <el-button type="primary" @click="dialogDone">确 定</el-button>
        </span>
      </el-dialog>

    </el-main>
    <!--页面最底部 footer-->
    <el-footer style="text-align: right">
      <el-button type="primary" @click="saveCase">确认</el-button>
      <el-button type="success" @click="execCase()" v-if="executeBtnShow">执行</el-button>
    </el-footer>
  </el-container>
</template>

<script>

  import addApiDialogComponent from '@/views/testCase/addApiDialogComponent.vue';
  import intellCheckDialogComponent from '@/views/testCase/intellCheckDialogComponent.vue';
  import editApiDialogComponent from '@/views/testCase/editApiDialogComponent.vue';
  import searchApiDialogComponent from '@/views/testCase/searchApiDialogComponent.vue';
  import {moveup, movedown} from  "@/assets/js/tableRowMove.js";
  import marked from 'marked';
  import {lodash} from 'lodash';

  export default {
    components: {editApiDialogComponent, addApiDialogComponent, intellCheckDialogComponent,searchApiDialogComponent},

    name: 'TestCase',

    data () {
      return {
        changeState:false,
        checkboxExecutable:true,
        multipleSelection:[],
        selectedApiArr:[],
        copyAddIndex:0,
        labelPosition:"right",
        executeDialogVisible: false,
        executeBtnShow:false,
        excResult: '',
        enviornment:[],
        testCase: {
          caseType:false,
          createdBy:null,
          createdTime:null,
          description:null,
          env:'',
          id:0,
          name:'',
          optstatus:0,
          pId:0,
          projectName:null,
          updatedBy:null,
          updatedTime:null,
          type:true,
          testCaseInterfaces:[]
        },
        copyIndex:0,
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
          contentType:0, // 1=添加接口，2=动态库查询，3=编辑接口,4=删除接口,5=搜索接口,6=校验接口,7=执行
          width:'60%',
          extend:{}   // 扩展字段
        },
        removeApiIndex:0,
        ws: null // websocket
      }
    },

    computed: {
      compiledMarkdown: function () {
        // return this.excResult
        return marked(this.excResult, {sanitize: true})
      }
    },
    watch:{
      $route(){
        this.getData();
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      moveup,
      movedown,
      selectAll(selection){
          console.log(selection)
      },
      selectOne(selection, row){
          if(row.checked){
            row.checked = false;
          }else{
            row.checked = true;
          }
      },
      handleSelectionChange(val) {
        console.log("选择发生改变")
        this.multipleSelection = val;
        if(this.changeState){
          this.reCheck();
          this.changeState = false;
        }
        this.filterExecteId();
      },
      //得到选中的有id的 接口数据并且过滤出id数组
      filterExecteId(){
        this.checkboxExecutable = true;
        var tempArr=[];
        var tempThis = this;
        this.multipleSelection.forEach(function(val,index,arr){
          tempArr.push(val.id);
          if(val.id === '' || val.id === null){
            console.log('某个选择的id为空或者null');
            tempThis.checkboxExecutable = false;
          }
        })
        if(this.checkboxExecutable){
          this.selectedApiArr = tempArr.concat();
        }
      },
      //因存储地址变了  复选之前已经选中的复选框
      reCheck(){
        console.log('multipleSelection='+this.multipleSelection.length);
        var that = this;
        this.testCase.testCaseInterfaces.forEach(function(e,index){
          if(e.checked){
            that.$refs.multipleTable.toggleRowSelection(e,true);
          }
        });
      },
      //////////复制接口
      copyApi(data, Index) {
        this.ApiCopyId = data.id;
        this.ApiCopyData = data;
        this.copyIndex = Index;
      },
      ////////粘贴复制的接口
      pastApi() {
        if(this.ApiCopyId === 0){
          this.$message.error('请先点击复制按钮');
        }else{
          this.copyAddIndex++;
          var temp = JSON.stringify(this.ApiCopyData);
          this.ApiCopyData = JSON.parse(temp);
          this.ApiCopyData.id = null;
//          this.ApiCopyData.name = this.ApiCopyData.name+'_copy'+this.copyAddIndex;
          this.testCase.testCaseInterfaces.splice(this.copyIndex+1,0,this.ApiCopyData);
        }
      },
      //获取数据
      getData() {
        this.executeBtnShow = false;//执行按钮隐藏
        var caseID = this.$route.query.id;
        this.intellCheckData = [];
        //获取环境列表select
        this.$http.get(this.testCaseServer+"env/getAllEnvs").then(function (res) {
          if(res.data.code === 10000){
            var tempEnviornment = [];
            res.data.data.forEach(function (e, index) {
              tempEnviornment.push({value: e.name, label: e.name})
            });
            this.enviornment = tempEnviornment;
            ///////////////////////获取环境信息成功之后 再去获取页面其他信息

            if (caseID == 0){   //新增case页面
              this.testCase = {
                caseType:'false',
                env:this.enviornment[0].value,
                type:true
              }
              this.testCase.testCaseInterfaces = [];
            }else{
              // case编辑页面
              // 获取测试用例详情信息内容
              this.executeBtnShow = true;//执行按钮显示
              this.$http.get(this.testCaseServer+"testCase/getCaseById?id=" + caseID).then(function (res) {
                if(res.data.code === 10000){
                  this.testCase = res.data.data;
                  if(this.testCase.caseType){
                    this.testCase.caseType = "true"
                  }else{
                    this.testCase.caseType = "false"
                  }
                  this.$nextTick(()=>{
                      var that = this;
                      this.testCase.testCaseInterfaces.forEach(function(e,index){
                          e.checked = true;
                          that.$refs.multipleTable.toggleRowSelection(e,true);
                      });
                      this.filterExecteId();
                  })
                }
              },function (res) {
              });
            }
          }else{
            this.$message.error('抱歉，获取环境信息失败：' + res.data.msg);
          }
        },function (res) {
          this.$message.error('抱歉，获取环境信息失败：' + res.data.msg);
        });

      },
      //新增，编辑 确认按钮事件
      saveCase() {
        var caseID = this.$route.query.id;

        this.$refs['testCase'].validate((valid) => {
          if (valid) {
            var ifQualified = true;
            if(this.testCase.testCaseInterfaces.length>0){
              for(var i=0;i<this.testCase.testCaseInterfaces.length;i++){
                if(this.testCase.testCaseInterfaces[i].step.trim() === ''){
                  ifQualified = false;
                }
                if(this.testCase.testCaseInterfaces[i].apiType == 'Http'){
                  this.testCase.testCaseInterfaces[i].apiType = '0';
                }else if(this.testCase.testCaseInterfaces[i].apiType == 'Https'){
                  this.testCase.testCaseInterfaces[i].apiType = '1';
                }else if(this.testCase.testCaseInterfaces[i].apiType == 'MQ'){
                  this.testCase.testCaseInterfaces[i].apiType = '2';
                }

                if(this.testCase.testCaseInterfaces[i].postWay == 'get'){
                  this.testCase.testCaseInterfaces[i].postWay = '0';
                }else if(this.testCase.testCaseInterfaces[i].postWay == 'post') {
                  this.testCase.testCaseInterfaces[i].postWay = '1';
                }
              }
            }
            if(ifQualified){//必填信息全部填写完整了 再请求保存接口
              if(caseID == 0){    /////////////////////////////////新增界面 确认按钮事件
                this.testCase.pId = this.$route.query.pId;
                this.$http.post(this.testCaseServer+"testCase/addCase",this.testCase).then(function (res) {
                  if(res.data.code === 10000){
                    var receiveCase = res.data.data;
                    this.$message({
                      message: '恭喜你，新增用例成功',
                      type: 'success'
                    });
                    // 跳转到当且case的详情页
                    //存数据  树节点刷新
                    this.$store.commit('changeTestCaseStatus', 1);
                    this.testCase.id = res.data.data.id;
                    this.$store.commit('setNewTestCase', this.testCase);
                    this.$router.push({name: 'TestCase', query: {id: res.data.data.id}});
                  }else{
                    this.$message.error('抱歉，新增用例失败：' + res.data.msg);
                  }
                },function (res) {
                  this.$message.error('服务器请求失败！');
                });

              }else{     /////////////////////////编辑界面 确认按钮事件
                this.$http.post(this.testCaseServer+"testCase/updateCase",this.testCase).then(function (res) {
                  console.log(res.data.data);
                  if(res.data.code === 10000){
                    var receiveCase = res.data.data;
                    this.$message({
                      message: '恭喜你，更新用例成功',
                      type: 'success'
                    });

                    this.testCase = res.data.data;
                    this.$store.commit('changeTestCaseStatus', 1);
                    this.$store.commit('setNewTestCase', this.testCase);

                  }else{
                    this.$message.error('抱歉，更新用例失败：' + res.data.msg);
                  }
                },function (res) {
                  this.$message.error('服务器请求失败！');
                });
              }
            }else{
              this.$message.error('请填写完整api内容');
            }

          } else {
            return false;
          }
        });
      },
      // ------- 按钮事件  -------
      /*弹框确定*/
      dialogDone() {

        switch (this.dialog.contentType) {
          case 1: {   //1=添加接口
            this.testCase.testCaseInterfaces = this.$refs.apiSelectView.getApis();
            this.dialog.visible = false;
            this.changeState = true;
          }
            break;
          case 2: { //2=动态库查询
            this.dialog.visible = false;
          }
            break;
          case 3: { //3=编辑接口
            var data = this.$refs.editApiDetailInfo.saveApiDetailInfo()
            var index = this.dialog.extend.index;
            if(data){  // 编辑窗口必填参数合格之后 进行的操作
//                var oldValue =  this.testCase.testCaseInterfaces[index]
//                for (var i=0; i<this.multipleSelection.length ;i++){
//                    var value =  this.multipleSelection[i]
//                    if(oldValue === value){
//                        this.multipleSelection[i] = data;
//                      break;
//                    }
//                }
              this.$set(this.testCase.testCaseInterfaces, index, data)
              this.dialog.visible = false;
              this.changeState = true;
            }
          }
            break;
          case 4: { //4=删除接口
            this.dialog.visible = false;
            this.testCase.testCaseInterfaces.splice(this.removeApiIndex, 1)

          }
            break;
          case 5: { //5=搜索接口
            this.dialog.visible = false;
            var data = this.dialog.extend.data;
            var index = this.dialog.extend.index;
            var partData = this.$refs.searchApiDetailInfo.rewrite();
            console.log(partData);

            data.step = partData.step;
            data.urlAddress = partData.urlAddress;
            data.variables = partData.variables;
            data.requestHead = partData.requestHead;
            data.requestBody = partData.requestBody;
            data.responseBody = partData.responseBody;
            data.assertions = partData.assertions;

            this.$set(this.testCase.testCaseInterfaces, index, data)

          }
            break;
          case 6: { //6=校验接口
            this.dialog.visible = false;
          }
            break;
          case 7: { //7=执行
            this.dialog.visible = false;
          }
            break;
          default:
            break;
        }

      },
      /*弹框取消*/
      dialogCancel() {
        this.dialog.visible = false;
        switch (this.dialog.contentType) {
          case 1: {
            this.$refs.apiSelectView.resetApis();
          }
            break;
          case 3: {
            this.$refs.editApiDetailInfo.cancelSaveInfo()
          }
            break;
          case 5: {
            this.$refs.searchApiDetailInfo.reset()
          }
            break;
          case 7:{
            console.log("closexxxxx")
            this.closeWebSocket()
          }
          default:
            break;
        }
      },
      /*搜索接口*/
      searchApi(data, index) {
        this.dialog = {
          title: '搜索接口',
          visible: true,
          footerVisible: false,
          contentType: 5,
          width: '80%',
          extend: {
            data: data,
            index: index
          }
        }
      },
      /*添加接口*/
      addApiClick() {

        this.dialog = {
          title: '添加接口',
          visible: true,   //整个弹窗显示与否
          footerVisible: true,
          contentType: 1,  //弹窗内容显示什么
          width: '60%',
          extend: {}
        }
      },
      /*动态库查询*/
      intellQueryClick() {
        this.dialog = {
          title: '动态库查询',
          visible: true,
          footerVisible: false,
          contentType: 2,
          width: '60%',
          extend: {}
        }
        if (this.$refs.intellCheck !== undefined) {
          this.$refs.intellCheck.setDefaultPage();
        }
      },
      /*校验*/
      apiInfoCheck() {
        window.open(this.address+'apisInfoCheck?testCaseId='+this.$route.query.id)
        //   this.dialog = {
//          title: '校验接口',
//          visible: true,
//          footerVisible: false,
//          contentType: 6,
//          width: '90%',
//          extend: {}
//        }
      },
      /*接口编辑*/
      apiEdit(data, index) {
        this.dialog = {
          title: '编辑接口',
          visible: true,
          footerVisible: true,
          contentType: 3,
          width: '60%',
          extend: {
            data: data,
            index: index
          }
        }
      },
      // 删除接口
      removeApi(index) {
        //this.testCase.testCaseInterfaces.splice(index,1)
        this.dialog = {
          title: '删除接口',
          visible: true,   //整个弹窗显示与否
          footerVisible: true,
          contentType: 4,  //弹窗内容显示什么
          width: '30%',
          extend: {}
        }
        this.removeApiIndex = index;
      },
      //执行弹窗方法
      execCase: function () {

        if(this.checkboxExecutable){
          if(this.selectedApiArr.length > 0){
            this.dialog = {
              title: '执行结果',
              visible: true,
              footerVisible: false,
              contentType: 7,
              width: '60%',
              extend: {
              }
            }

            this.excResult = '';
            var textArea_this = this;
            var exectData = {
              apiIds:this.selectedApiArr,
              tcId:this.testCase.id
            }
            if ("WebSocket" in window) {
              this.ws = new WebSocket("ws://"+ this.wsServer +"/case/webSocket/123");
              //this.ws = new Object();
              this.ws.onopen = function () {
                textArea_this.$http.post(textArea_this.testCaseServer+"testCase/executeApis",exectData).then(function (res) {
                  if(res.data.code === 10000){
                    console.log("传送caseId成功")
                  }
                },function (res) {});

                textArea_this.ws.send("");
              };

              // 接收数据
              this.ws.onmessage = function (evt) {
                // 注意evt的数据类型
                console.log('接收到的数据：', evt)
                textArea_this.excResult =  textArea_this.excResult +  '\n' + evt.data;
                // ws.broadcast('resultChanged', evt.data)
              };

              this.ws.onclose = function(){
                console.log("close")
              };

            } else {
              this.excResult = '浏览器不支持websocket，无法显示case执行结果。';
              //  模拟socket推送
//        var msgNumber = 0;
//        var serverSendMsg = function () {
//          msgNumber ++;
//          var newMsg = 'msg' + msgNumber;
//          textArea_this.ws.onmessage(newMsg);
//        }
//        setInterval(serverSendMsg, 1000);
            }

          }else{
            this.$message.error('请先选择要执行的接口');
          }
        }else{
          this.$message.error('抱歉，选中的某些接口是新增的，请先清除新增的接口');
        }
      },
      // 关闭webscoket
      closeWebSocket(){
        this.ws.onclose();
        this.ws = null;
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
      }

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .markDown{
    text-align: left;
    height:400px;
    overflow-y: scroll;
  }
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
  .footer-fix{
    height: 60px;
    text-align: right;
    position: fixed;
    bottom: 0;
    right: 0;
    background-color: white;
    z-index: 99;
    width: 100%;
    padding-top: 10px;
  }
</style>
