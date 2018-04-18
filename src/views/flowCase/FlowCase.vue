<template>
  <el-container>
    <el-main>
      <div style="padding-bottom: 60px;">
        <div style="width:80%;text-align: left">
          <el-form   ref="flowCase"  :label-position="labelPosition"  label-width="100px" :model="flowCase">
            <!--测试集名称-->
            <el-form-item label="用例流名称" prop="name" :rules="[{ required: true, trigger: 'blur',message: '测试集名称不能为空'} ]">
              <el-input v-model="flowCase.name" placeholder="请输入用例流名称"></el-input>
            </el-form-item>
            <!--测试集描述-->
            <el-form-item label="用例流描述" prop="description" :rules="[{ required: false, trigger: 'blur',message: '测试集描述不能为空'} ]">
              <el-input v-model="flowCase.description" placeholder="请输入用例流描述"></el-input>
            </el-form-item>

            <!--环境-->
            <el-form-item label="环境" prop="env" :rules="[{ required: true, message: '环境不能为空'} ]">
              <el-col :span="8">
                <el-select v-model="flowCase.env" placeholder="请选择">
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
                  <el-button type="text" @click="addTestCaseClick">添加用例</el-button>
                </div>
                <div class="pd12">
                  <el-button type="text" @click="caseExecuteResult" v-if="executeBtnShow" >执行结果</el-button>
                </div>
              </el-col>
            </el-form-item>
          </el-form>
        </div>
        <!--用例列表-->
        <el-row style="padding-top:30px;">
          <el-table v-show="flowCase.testCases.length>0"
                    :data="flowCase.testCases"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    @select="selectOne"
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
              label="用例流名称"
              align="left"
              min-width="170"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="transToCase(scope.row.id)">{{ scope.row.name }}</el-button>
              </template>
            </el-table-column>

            <el-table-column
              prop="description"
              label="用例流描述"
              align="left"
            >
            </el-table-column>

            <el-table-column
              prop="createdBy"
              label="创建人"
              align="left"
            >
            </el-table-column>

            <el-table-column
              prop="action"
              label="操作"
              align="left" width="280px">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="上移" placement="top">
                  <el-button  type="text" size="mini" @click.native.prevent="moveup(scope.$index, scope.row, flowCase.testCases)"  ><i class="el-icon-arrow-up"></i></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="下移" placement="top">
                  <el-button  type="text" size="mini" @click.native.prevent="movedown(scope.$index, scope.row, flowCase.testCases)" ><i class="el-icon-arrow-down"></i></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="删除" placement="top">
                  <el-button  type="text" size="mini" @click="removeApi(scope.$index)"><i class="el-icon-minus"></i></el-button>
                </el-tooltip>
              </template>
            </el-table-column>

          </el-table>
        </el-row>
      </div>


      <!-- 增加 删除 等弹框 -->
      <el-dialog
        v-if="dialog.visible"
        class="hd-dialog"
        :title="dialog.title"
        :visible.sync="dialog.visible"
        :width="dialog.width"
        :before-close="handleClose"
      >
        <!--添加接口弹窗-->
        <add-flow-case-dialog-component ref="caseSelectView" v-if="dialog.contentType === 1"  :selectedCases="flowCase.testCases"></add-flow-case-dialog-component>
        <!--执行结果弹窗-->
        <flow-case-execute-result-dialog-component v-if="dialog.contentType === 4" ></flow-case-execute-result-dialog-component>
        <!--删除接口弹窗-->
        <span v-if="dialog.contentType === 2" >是否删除此用例？</span>
        <!--执行弹窗-->
        <div v-if="dialog.contentType === 3" ref="executeCase">
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
                      <el-button type="primary" @click="dialogDone" >确 定</el-button>
        </span>
      </el-dialog>

    </el-main>
    <!--页面最底部 footer-->
    <el-footer style="text-align: right">
      <el-button type="primary" @click="saveCase" >确认</el-button>
      <el-button type="success" @click="execCase()" v-if="executeBtnShow">执行</el-button>
    </el-footer>
  </el-container>
</template>

<script>

  import addFlowCaseDialogComponent from '@/views/flowCase/addFlowCaseDialogComponent.vue';
  import flowCaseExecuteResultDialogComponent from '@/views/flowCase/FlowCaseExecuteResultDialogComponent.vue';
  import {moveup, movedown} from  "@/assets/js/tableRowMove.js";
  import marked from 'marked';
  import {lodash} from 'lodash';
  import ElRow from "element-ui/packages/row/src/row";


  export default {
    components: {ElRow, addFlowCaseDialogComponent,flowCaseExecuteResultDialogComponent},
    name: 'FlowCase',
    data () {
      return {
        ws:null,
        changeState:false,
        serverSendMsg:null,
        percentageNum:0,
        checkboxExecutable:true,
        multipleSelection:[],
        selectedCaseArr:[],
        labelPosition:"right",
        executeDialogVisible: false,
        executeBtnShow:false,
        excResult: '',
        enviornment:[],
        flowCase: {
          type:true,
          createdBy:null,
          createdTime:null,
          description:null,
          env:'',
          id:null,
          name:'',
          optstatus:0,
          pId:0,
          updatedBy:null,
          updatedTime:null,
          testCases:[]
        },
        envs: [],
        system: '',
        systems: [],
        dialog: {
          title: '',
          visible:false,
          footerVisible:true,
          contentType:0,
          width:'80%',
          extend:{}   // 扩展字段
        },
        removeApiIndex:0
      }
    },

    watch:{
      $route(){
        this.getData();
      }
    },
    mounted() {
      this.getData()
    },
    computed:{
      compiledMarkdown: function () {
        // return this.excResult
        return marked(this.excResult, {sanitize: true})
      }
    },
    methods: {
      moveup,
      movedown,
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
          this.selectedCaseArr = tempArr.concat();
        }
        console.log(this.selectedCaseArr)
      },
      // 跳转到case页面
      transToCase(id){
        this.$router.push({name: 'TestCase', query: {id: id}});
      },
      //因存储地址变了  复选之前已经选中的复选框
      reCheck(){
        console.log('multipleSelection='+this.multipleSelection.length);
        var that = this;
        this.flowCase.testCases.forEach(function(e,index){
          if(e.checked){
            that.$refs.multipleTable.toggleRowSelection(e,true);
          }
        });
      },
      getData() {
        this.executeBtnShow = false;//执行按钮隐藏
        var flowCaseID = this.$route.query.id;
        var vueThis = this;
        //获取环境列表select
          vueThis.testCaseAxios({
            method: 'get',
            data: {
            },
            url: 'env/getAllEnvs'
          })
          .then(function(res){
            if (res.data.code === 10000 ) {
              var tempEnviornment = [];
              res.data.data.forEach(function (e, index) {
                tempEnviornment.push({value: e.name, label: e.name})
              });
              vueThis.enviornment = tempEnviornment;
              ///////////////////////获取环境信息成功之后 再去获取页面其他信息
              if (flowCaseID == 0){   //新增flowCase页面
                vueThis.flowCase ={
                  type:true,
                  createdBy:null,
                  createdTime:null,
                  description:null,
                  env:vueThis.enviornment[0].value,
                  id:null,
                  name:'',
                  optstatus:0,
                  pId:vueThis.$route.query.pId,
                  updatedBy:null,
                  updatedTime:null,
                  testCases:[]
                }
                console.log(vueThis.flowCase.env)
              }else{ // flowCase编辑页面
                // 获取flowCase详情信息内容
                vueThis.executeBtnShow = true;//执行按钮显示
                  vueThis.testCaseAxios({
                    method: 'get',
                    data: {
                    },
                    url:'flowCase/getById?id='+flowCaseID
                  })
                  .then(function(res){
                    if (res.data.code === 10000 ) {
                      vueThis.flowCase = res.data.data;
                      vueThis.$nextTick(()=>{
                        var that = vueThis;
                        vueThis.flowCase.testCases.forEach(function(e,index){
                          e.checked = true;
                          that.$refs.multipleTable.toggleRowSelection(e,true);

                        })
                        vueThis.filterExecteId();
                      })
                    }else{
                      vueThis.$message.error('抱歉，获取信息失败：' + res.data.msg);
                    }
                  })
                  .catch(function (err) {
                    vueThis.$message.error('抱歉，服务器异常！' );
                  });
              }
            }else{
              vueThis.$message.error('抱歉，获取信息失败：' + res.data.msg);
            }
          })
//          .catch(function (err) {
//            vueThis.$message.error('抱歉，服务器异常！' );
//          });
      },


      // ------- 按钮事件  -------
      /*弹框确定*/
      dialogDone() {
        switch (this.dialog.contentType) {
          case 1: {   //1=添加接口
            this.flowCase.testCases = this.$refs.caseSelectView.getCases();
            this.dialog.visible = false;
            this.changeState = true;
          }
            break;
          case 2: { //2=删除用例
            this.dialog.visible = false;
            this.flowCase.testCases.splice(this.removeApiIndex, 1)
          }
            break;
          case 3: { //3=执行
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
            this.$refs.caseSelectView.resetCases();
          }
            break;
          case 3: {
            this.closeWebSocket()
          }
            break;
          default:
            break;
        }
      },

      /*添加接口*/
      addTestCaseClick() {
        this.dialog = {
          title: '添加用例',
          visible: true,   //整个弹窗显示与否
          footerVisible: true,
          contentType: 1,  //弹窗内容显示什么
          width: '80%',
          extend: {}
        }
      },
      /*执行结果*/
      caseExecuteResult(){
        this.dialog = {
          title: '执行结果',
          visible: true,   //整个弹窗显示与否
          footerVisible: false,
          contentType: 4,  //弹窗内容显示什么
          width: '80%',
          extend: {}
        }
      },

      // 删除接口
      removeApi(index) {
        this.dialog = {
          title: '删除用例',
          visible: true,   //整个弹窗显示与否
          footerVisible: true,
          contentType: 2,  //弹窗内容显示什么
          width: '30%',
          extend: {}
        }
        this.removeApiIndex = index;
      },

      //执行弹窗方法
      execCase() {

        if(this.checkboxExecutable){
          if(this.selectedCaseArr.length > 0){
            this.dialog = {
              title: '执行结果',
              visible: true,
              footerVisible: false,
              contentType: 3,
              width: '60%',
              extend: {
              }
            }

            this.excResult = '';
            var textArea_this = this;
            var exectData = {
              apiIds:this.selectedCaseArr,
              tcId:this.flowCase.id
            }
            if ("WebSocket" in window) {
              this.ws = new WebSocket("ws://"+ this.wsServer +"/case/webSocket/123");
              //this.ws = new Object();
              this.ws.onopen = function () {
                textArea_this.testCaseAxios({
                  method: 'post',
                  data: textArea_this.flowCase,
                  url: "flowCase/execute"
                })
                  .then(function (res) {
                    if(res.data.code === 10000){
                      console.log("传送caseId成功")
                    }
                  })
                  .catch(function (err) {
                    textArea_this.$message.error('抱歉，服务器异常！' );
                  });

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
      },


      //新增，编辑 确认按钮事件
      saveCase() {
        var caseID = this.$route.query.id;
        this.$refs['flowCase'].validate((valid) => {
          if (valid) {
            if(caseID == 0){    /////////////////////////////////新增界面 确认按钮事件
              this.flowCase.pId = this.$route.query.pId;
              this.submitGetData()
            }else{     /////////////////////////编辑界面 确认按钮事件
              this.submitGetData()
            }
          } else {
            return false;
          }
        });
      },

      //确认按钮  请求ajax
      submitGetData(){
        var vueThis = this;
          vueThis.testCaseAxios({
            method: 'post',
            data: vueThis.flowCase,
            url: 'flowCase/addOrUpdate'
          })
          .then(function (res) {
            if(res.data.code === 10000){
              vueThis.$message({
                message: '恭喜你，保存成功',
                type: 'success'
              });


              if(vueThis.$route.query.id == 0){
                //存数据  树节点刷新
                vueThis.$store.commit('changeFlowCaseStatus', 1);
                vueThis.flowCase = res.data.data;
                vueThis.$store.commit('setNewFlowCase', vueThis.flowCase);
                vueThis.$router.push({name: 'FlowCase', query: {id: res.data.data.id}});
              }else{
                //存数据  树节点刷新
                vueThis.$store.commit('changeFlowCaseStatus', 2);
                vueThis.flowCase = res.data.data;
                vueThis.$nextTick(()=>{
                  var that = vueThis;
                  vueThis.flowCase.testCases.forEach(function(e,index){
                    e.checked = true;
                    that.$refs.multipleTable.toggleRowSelection(e,true);

                  })
                  vueThis.filterExecteId();
                })

                vueThis.$store.commit('setNewFlowCase', vueThis.flowCase);
              }

            }else{
              vueThis.$message.error('抱歉，获取信息失败：' + res.data.msg);
            }
          })
          .catch(function (err) {
            vueThis.$message.error('抱歉，服务器异常！' );
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
