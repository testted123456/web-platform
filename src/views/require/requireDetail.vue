<template>
  <el-container>
    <el-main>
      <!--进度条-->
      <!--<div style="position: relative">-->
        <!--<div class="progressCon">-->
          <!--<div class="progressBar"></div>-->
          <!--<div class="progText">-->
            <!--<span class="state1">处理中</span>-->
            <!--<span class="state2">待评审</span>-->
            <!--<span class="state3">评审中</span>-->
            <!--<span class="state4">待排期</span>-->
            <!--<span class="state5">排期中</span>-->
            <!--<span class="state6">开发中</span>-->
            <!--<span class="state7">stb测试</span>-->
            <!--<span class="state8">sit测试</span>-->
            <!--<span class="state9">pre测试</span>-->
            <!--<span class="state10">产品验收</span>-->
            <!--<span class="state11">业务验收</span>-->
            <!--<span class="state12">已上线</span>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->

      <el-steps :active="active" finish-status="success" >
        <el-step title="处理中"></el-step>
        <el-step title="待评审"></el-step>
        <el-step title="评审中"></el-step>
        <el-step title="待排期"></el-step>
        <el-step title="排期中"></el-step>
        <el-step title="开发中"></el-step>
        <el-step title="stb测试"></el-step>
        <el-step title="sit测试"></el-step>
        <el-step title="pre测试"></el-step>
        <el-step title="产品验收"></el-step>
        <el-step title="业务验收"></el-step>
        <el-step title="已上线"></el-step>

      </el-steps>


      <el-row style="padding-top: 10px;padding-left: 0px;">
        <el-button type="primary" v-show="demandInfo.status == '处理中' " @click="submitReview">提交评审</el-button>
        <el-button type="primary" v-show="demandInfo.status == '待评审' ">开始评审</el-button>
        <el-button type="success" >暂停</el-button>
        <el-button type="info" >取消</el-button>
        <el-button type="warning">恢复</el-button>
      </el-row>

      <el-form   ref="demand"  :label-position="labelPosition"  label-width="150px" :model="demandInfo" style="padding-top: 10px;width:82%;">

        <el-row>
          <el-col :span="12">
            <el-form-item label="需求编号" prop="id" :rules="[{ required: true, trigger: 'blur',message: '需求编号不能为空'} ]">
              <el-input v-model="demandInfo.id" placeholder="请输入需求编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="需求名称" prop="name" :rules="[{ required: true, trigger: 'blur',message: '需求名称不能为空'} ]">
              <el-input v-model="demandInfo.name" placeholder="请输入需求名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目经理" prop="projectManager" :rules="[{ required: true, trigger: 'blur',message: '项目经理不能为空'} ]" style="text-align: left">
              <el-select filterable v-model="demandInfo.projectManager" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in projectManagerlist"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName" :rules="[{ required: false, trigger: 'blur',message: ''} ]">
              <el-input v-model="demandInfo.projectName" placeholder="请输入项目名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品线" prop="productLine" :rules="[{ required: true, trigger: 'blur',message: '产品线不能为空'} ]" style="text-align: left">
              <el-select filterable v-model="demandInfo.productLine" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in productLines"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品经理" prop="productManager" :rules="[{ required: true, trigger: 'blur',message: '产品经理不能为空'} ]" style="text-align: left">
              <el-select filterable v-model="demandInfo.productManager" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in productManagerlist"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="需求类型" prop="type" :rules="[{ required: true, trigger: 'blur',message: '需求类型不能为空'} ]" style="text-align: left">
              <el-select filterable v-model="demandInfo.type" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in requireTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级" prop="priority" :rules="[{ required: false, trigger: 'blur',message: ''} ]">
              <el-input v-model="demandInfo.priority" placeholder="请输入优先级"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品验收人员" prop="name" :rules="[{ required: true, trigger: 'blur',message: '用例名称不能为空'} ]" style="text-align: left">
              <el-select filterable v-model="demandInfo.productReceiver" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in productManagerlist"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务验收人员" prop="name" :rules="[{ required: true, trigger: 'blur',message: '用例名称不能为空'} ]" style="text-align: left">
              <el-select filterable v-model="demandInfo.projectReceiver" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in productManagerlist"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--<el-row>-->
          <!--<el-col :span="18">-->
            <!--<el-form-item label="需求状态" prop="status" :rules="[{ required: true, trigger: 'blur',message: ''} ]" style="text-align: left">-->
              <!--<el-select filterable v-model="demandInfo.status" placeholder="请选择">-->
                <!--<el-option-->
                  <!--v-for="item in responseState"-->
                  <!--:key="item.value"-->
                  <!--:label="item.label"-->
                  <!--:value="item.value">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
        <!--</el-row>-->
        <el-row>
          <el-col :span="18">
            <el-form-item label="需求描述" prop="context" :rules="[{ required: false, trigger: 'blur',message: ''} ]">
              <el-input type="textarea"  :autosize="{ minRows: 4}" resize="none" placeholder="请输入内容" v-model="demandInfo.context"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="18">
            <el-form-item label="收件人" prop="" :rules="[{ required: true, trigger: 'blur',message: '用例名称不能为空'} ]">
              <multiselect
                v-model="selectReceivePersons"
                tag-placeholder=""
                placeholder="请选择"
                label="nickname"
                track-by="nickname"
                :options="receivePersonOptions"
                :multiple="true"
                :taggable="false"
                @tag="addTag"
              >
              </multiselect>
            </el-form-item>
          </el-col>
        </el-row>
        <!--<el-row>-->
          <!--<el-col :span="18">-->
            <!--<el-form-item label="备注" prop="comment" :rules="[{ required: false, trigger: 'blur',message: ''} ]">-->
              <!--<el-input type="textarea"  :autosize="{ minRows: 4}" resize="none" placeholder="请输入内容" v-model="demandInfo.comment"></el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
        <!--</el-row>-->

      </el-form>
      <el-row style="width: 88%;">
        <span style="float: left;width: 138px;text-align: right;padding-right:12px;font-size: 14px;">活动</span>
        <el-col :span="18">
          <el-tabs v-model="activeTab" type="card" @tab-click="handleClick">
            <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
            <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
            <el-tab-pane label="活动" name="third">
              <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                  fixed
                  prop="time"
                  label="时间"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="人"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="status"
                  label="状态"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="assignee"
                  label="备注"
                  align="center"
                >
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  import Multiselect from 'vue-multiselect'

  export default{
      name: 'requireDetail',
      components: {Multiselect},
      data() {
          return {
            activeTab:'first',
            active: 0,
            activeNames: ['1'],
            labelPosition:'right',
            receivePersonOptions:[],
            demandInfo:{
              mailReceiver:''
            },
            responseState:[
              {
                value:'待排期',
                label: '待排期'
              },
              {
                value:'排期完成',
                label: '排期完成'
              },
              {
                value:'开发中',
                label: '开发中'
              },
              {
                value:'测试中',
                label: '测试中'
              },
              {
                value:'已上线',
                label: '已上线'
              },
              {
                value:'取消',
                label: '取消'
              },
              {
                value:'暂停',
                label: '暂停'
              },
              {
                value:'需求处理中',
                label: '需求处理中'
              },
              {
                value:'需求待评审',
                label: '需求待评审'
              },
              {
                value:'需求已评审',
                label: '需求已评审'
              },
              {
                value:'需求明确',
                label: '需求明确'
              }
            ],
            // 产品线
            productLines:[
              {
                value:'麦子借款',
                label: '麦子借款'
              },
              {
                value:'白领贷',
                label: '白领贷'
              },
              {
                value:'麦子金服财富',
                label: '麦子金服财富'
              }
            ],
            // 项目经理
            projectManagerlist:[],
            //产品经理
            productManagerlist:[],
            //需求类型
            requireTypes:[
              {
                value:'PRD',
                label: 'PRD'
              },
              {
                value:'ECR',
                label: 'ECR'
              },
              {
                value:'HotFix',
                label: 'HotFix'
              }
            ],
            selectReceivePersons: [],
            receivePersonOptions: [],
            //表格数据
            tableData:[]

          }
      },

      computed:{

      },

      created(){
        this.getData();
      },

      methods: {
        getData(){
          var ID = this.$route.query.id;

          var vueThis = this;
          //获取收件人list
          vueThis.usrAxios({
            method: 'get',
            url: "user/getUsersByRole?rolename=developer"
          })
          .then(function (res) {
            if(res.data.code === 10000){
              var tempEnviornment = [];
              res.data.data.forEach(function (e, index) {
                tempEnviornment.push({nickname: e.nickname+e.email, email: e.email})
              });
              vueThis.receivePersonOptions = tempEnviornment;

            }else{
              vueThis.$message.error(res.data.msg);
            }
          })
          .catch(function (err) {
            vueThis.$message.error(err);
          });


          //获取活动信息
          vueThis.requireAxios({
            method: 'get',
            url: "workflow/requriment/getHistory?id="+ID
          })
            .then(function (res) {
              if(res.data.code === 10000){
                vueThis.tableData = res.data.data;
              }else{
                vueThis.$message.error(res.data.msg);
              }
            })
            .catch(function (err) {
              vueThis.$message.error(err);
            });

          //获取项目经理list
          vueThis.usrAxios({
            method: 'get',
            url: "user/getUsersByRole?rolename=projectManager"
          })
            .then(function (res) {
              if(res.data.code === 10000){
                var tempEnviornment = [];
                res.data.data.forEach(function (e, index) {
                  tempEnviornment.push({value: e.nickname, lable: e.nickname})
                });
                vueThis.projectManagerlist = tempEnviornment;

              }else{
                vueThis.$message.error(res.data.msg);
              }
            })
            .catch(function (err) {
              vueThis.$message.error(err);
            });

          //获取产品经理list
          vueThis.usrAxios({
            method: 'get',
            url: "user/getUsersByRole?rolename=productManager"
          })
            .then(function (res) {
              if(res.data.code === 10000){
                var tempEnviornment = [];
                res.data.data.forEach(function (e, index) {
                  tempEnviornment.push({value: e.nickname, lable: e.nickname})
                });
                vueThis.productManagerlist = tempEnviornment;

              }else{
                vueThis.$message.error(res.data.msg);
              }
            })
            .catch(function (err) {
              vueThis.$message.error(err);
            });


          //获取页面详情
          vueThis.requireAxios({
            method: 'get',
            url: "workflow/requriment/getById?id="+ID
          })
          .then(function (res) {
            if(res.data.code === 10000){
                vueThis.demandInfo = res.data.data;

                if(vueThis.demandInfo.status == '处理中'){
                  vueThis.active = 0
                }else if(vueThis.demandInfo.status == '待评审'){
                  vueThis.active = 1
                }else if(vueThis.demandInfo.status == '评审中'){
                  vueThis.active = 2
                }
            }else{
              vueThis.$message.error(res.data.msg);
            }
          })
          .catch(function (err) {
            vueThis.$message.error(err);
          });
        },
        //多选收件人
        addTag (newTag) {
          const tag = {
            name: newTag,
            code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
          }
          this.receivePersonOptions.push(tag)
          this.value.push(tag)
        },
        // 保存按钮
        save(){
          var vueThis = this;
          this.$refs['demand'].validate((valid) => {
            if (valid) {
              var temp=[]
              vueThis.selectReceivePersons.forEach(function (e, index) {
                temp.push(e.email)
              });
              vueThis.demandInfo.mailReceiver = temp;
              console.log(vueThis.demandInfo)
            } else {
              return false;
            }
          });
        },
        //手风琴事件
        handleChange(val) {
          console.log(val);
        },
        submitReview(){
          var ID = this.$route.query.id;
          this.demandInfo.mailReceiver =  this.selectReceivePersons;
          this.demandInfo.mailReceiver = JSON.stringify(this.demandInfo.mailReceiver)
          var vueThis = this;
          //获取收件人list
          vueThis.requireAxios({
            method: 'post',
            data:vueThis.demandInfo,
            url: "workflow/requriment/submitReview"
          })
            .then(function (res) {
              if(res.data.code === 10000){
                vueThis.demandInfo = res.data.data;
                //修改收件人初始化
                var list = vueThis.demandInfo.mailReceiver;

                vueThis.selectReceivePersons = JSON.parse(list);
                // list.data.data.forEach(function (e, index) {
                //   vueThis.selectReceivePersons.push({nickname: e, email: e})
                // });

                if(vueThis.demandInfo.status == '处理中'){
                  vueThis.active = 0
                }else if(vueThis.demandInfo.status == '待评审'){
                  vueThis.active = 1
                }else if(vueThis.demandInfo.status == '评审中'){
                  vueThis.active = 2
                }
              }else{
                vueThis.$message.error(res.data.msg);
              }
            })
            .catch(function (err) {
              vueThis.$message.error(err);
            });
        }
      }
  }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
  .el-form-item {
    margin-bottom: 2px;
  }
  .el-row {
    width: 100%;
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  .progressCon{
    width:600px;
    position: absolute;
    height:76px;
    font-size: 14px;
    left:40px;
    top:10px;
  }
  .progressBar{
    width:100%;
    height:48px;
    border-radius:3px;
    /*background-color: #00B7FF;*/
    position: absolute;
  }
  .progText{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 25px;
  }
  .progText .state1{
    position: absolute;
    left:-9px;
    width:50px;
  }
  .progText .state2{
    position: absolute;
    left:85px;
    width:60px;
  }
  .progText .state3{
    position: absolute;
    left:200px;
    width:60px;
  }
  .progText .state4{
    position: absolute;
    left:324px;
    width:60px;
  }
  .progText .state5{
     position: absolute;
     left:392px;
     width:50px;
   }
  .progText .state6{
    position: absolute;
    left:456px;
    width:50px;
  }
  .progText .state7{
    position: absolute;
    left:550px;
    width:66px;
  }
  .progText .state8{
    position: absolute;
    left:640px;
    width:66px;
  }
  .progText .state9{
    position: absolute;
    left:720px;
    width:66px;
  }
  .progText .state10{
    position: absolute;
    left:788px;
    width:75px;
  }
  .progText .state11{
     position: absolute;
     left:860px;
     width:66px;
   }
  .progText .state12{
    position: absolute;
    left:920px;
    width:66px;
  }
  .progText .state13{
    position: absolute;
    left:1000px;
    width:66px;
  }


  .operate{
    position: absolute;
    right: 0;
    top: 10px;
    width: 400px;
    height: 76px;
  // background-color: pink;
  }
  .tagtip{
    color:#e80909;
    font-size: 18px;
    float: right;
    padding-top: 2px;
    padding-right:4px;
  }

  div[data-tree-model] li {
    padding: 0 0 0 10px !important;
  }
  .leftBar{
    text-align: left;
    float: left;
    width:170px;
    height:100%;
    /*background-color:#206096;*/
    position: absolute;
    top:0px;
    left:0px;
    z-index: 999;
  }


  .progressBar.state1{
    background-image: url(../../assets/logo.png);
    background-repeat:no-repeat;
  }
  .progressBar.state2{
    background-image: url(../../assets/logo.png);
    background-repeat:no-repeat;
  }
  .progressBar.state3{
    background-image: url(../../assets/logo.png);
    background-repeat:no-repeat;
  }
  .progressBar.state4{
    background-image: url(../../assets/logo.png);
    background-repeat:no-repeat;
  }
  .progressBar.state5{
    background-image: url(../../assets/logo.png);
    background-repeat:no-repeat;

  }
</style>
