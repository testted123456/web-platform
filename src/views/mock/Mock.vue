<template>
  <el-container>
    <el-main>
      <div style="padding-bottom: 60px;">
        <div style="width:80%;text-align: left">
          <el-form   ref="mock"  :label-position="labelPosition"  label-width="100px" :model="mockInfo">
            <!--名称-->
            <el-form-item label="名称" prop="name" :rules="[{ required: true, trigger: 'blur',message: '名称不能为空'} ]">
              <el-input v-model="mockInfo.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <!--url-->
            <el-form-item label="url" prop="url" :rules="[{ required: true, trigger: 'blur',message: 'url不能为空'} ]">
              <el-input v-model="mockInfo.url" placeholder="请输入url"></el-input>
            </el-form-item>
            <!--等待时长-->
            <el-form-item label="等待时长" prop="name" :rules="[{ required: true, trigger: 'blur',message: '等待时长不能为空'} ]">
              <el-input v-model="mockInfo.name" placeholder="请输入等待时长"></el-input>
            </el-form-item>
            <!--环境-->
            <el-form-item label="postWay" prop="postWay" :rules="[{ required: true, message: 'http方式不能为空'} ]">
              <el-col :span="8">
                <el-select v-model="mockInfo.postWay" placeholder="请选择">
                  <el-option
                    v-for="item in httpWay"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-form>
          <el-row>
            <el-tabs v-model="mockTab" @tab-click="handleClick" >
              <el-tab-pane label="request" name="request">
                <div v-if="activeIndex == 0 ">
                  <el-row>
                    <el-col>
                      <el-button size="small" v-if="isJson(mockInfo.request)"
                                 @click.native.prevent="formatJSON(1)"
                                 round>格式化Json
                      </el-button>
                      <el-button style="color: red"
                                 size="small" v-else
                                 disabled
                                 round
                      >不是Json格式
                      </el-button>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col>
                      <el-input type="textarea"  :autosize="{ minRows: 9}" resize="none" placeholder="请输入内容" v-model="mockInfo.request"></el-input>
                    </el-col>
                  </el-row>
                </div>
              </el-tab-pane>
              <el-tab-pane label="response" name="response">
                <div v-if="activeIndex == 1 ">
                  <el-row>
                    <el-col>
                      <el-button size="small" v-if="isJson(mockInfo.response)"
                                 @click.native.prevent="formatJSON(2)"
                                 round>格式化Json
                      </el-button>
                      <el-button style="color: red"
                                 size="small" v-else
                                 disabled
                                 round
                      >不是Json格式
                      </el-button>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col>
                      <el-input type="textarea"  :autosize="{ minRows: 9}" resize="none" placeholder="请输入内容" v-model="mockInfo.response"></el-input>
                    </el-col>
                  </el-row>
                </div>
              </el-tab-pane>
              <el-tab-pane label="规则" name="rule">
                <div v-if="activeIndex == 2 ">
                  <el-row>
                    <el-col>
                      <div style="border: 1px solid #cccccc; padding-top: 10px">
                        <hd-ace-rule ref="rule" style="width: 100%;height: 200px" editorID="rule" @aceTextChange="ruleTextChange" :value="mockInfo.rule"></hd-ace-rule>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-row>
        </div>

      </div>




    </el-main>
    <!--页面最底部 footer-->
    <el-footer style="text-align: right">
      <el-button type="primary" @click="saveCase" >确认</el-button>
    </el-footer>
  </el-container>
</template>

<script>
  import { formatJson, isJson } from "@/assets/js/formatJson.js";
  import hdAceRule from '@/components/hd-ace-rule'


  export default {
    components: {hdAceRule},
    name: 'Mock',
    data () {
      return {
        labelPosition:'left',
        mockTab:'request',
        activeIndex:0,
        mockInfo: {
          name:'',
          url:'',
          postWay:'get',
          request:'',
          response:'',
          rule:''
        },
        httpWay:[
          {
            value:'get'
          },
          {
            value:'post'
          }
        ]

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
    methods: {
      formatJson,
      isJson,
      getData() {
        this.executeBtnShow = false;//执行按钮隐藏
        var groupID = this.$route.query.id;
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
              if (groupID == 0){   //新增group页面
                vueThis.group ={
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
                  jobTime:'',
                  testCaseList:[]
                }
                vueThis.copyGroupShow = true;
                console.log(vueThis.group.env)
              }else{ // group编辑页面
                // 获取group详情信息内容
                vueThis.executeBtnShow = true;//执行按钮显示
                vueThis.groupAxios({
                  method: 'get',
                  data: {
                  },
                  url:'getById?id='+groupID
                })
                  .then(function(res){
                    if (res.data.code === 10000 ) {
                      vueThis.group = res.data.data;
                      vueThis.$nextTick(()=>{
                        var that = vueThis;
                        vueThis.group.testCaseList.forEach(function(e,index){
                          // e.checked = true;
                          // that.$refs.multipleTable.toggleRowSelection(e,true);
                          if(e.checked){
                            that.$refs.multipleTable.toggleRowSelection(e,true);
                          }
                        })
                        vueThis.filterExecteId();
                      })
                    }else{
                      vueThis.$message.error('抱歉，获取信息失败：' + res.data.msg);
                    }
                  })
                  .catch(function (err) {
                    vueThis.$message.error(err);
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

      //tab 切换
      handleClick(tab, event){
        console.log(tab.index)
        this.activeIndex = tab.index;
      },
      //新增，编辑 确认按钮事件
      saveCase() {
        var caseID = this.$route.query.id;
        this.$refs['group'].validate((valid) => {
          if (valid) {
            if(caseID == 0){    /////////////////////////////////新增界面 确认按钮事件
              this.group.pId = this.$route.query.pId;
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
        vueThis.groupAxios({
          method: 'post',
          data: vueThis.group,
          url: 'save'
        })
          .then(function (res) {
            if(res.data.code === 10000){
              vueThis.$message({
                message: '恭喜你，保存测试集成功',
                type: 'success'
              });


              if(vueThis.$route.query.id == 0){
                //存数据  树节点刷新
                vueThis.$store.commit('changeGroupStatus', 1);
                vueThis.group = res.data.data;
                vueThis.$store.commit('setNewGroup', vueThis.group);
                vueThis.$router.push({name: 'Group', query: {id: res.data.data.id}});
              }else{
                //存数据  树节点刷新
                vueThis.$store.commit('changeGroupStatus', 2);
                vueThis.group = res.data.data;
                vueThis.$nextTick(()=>{
                  var that = vueThis;
                  vueThis.group.testCaseList.forEach(function(e,index){
                    // e.checked = true;
                    // that.$refs.multipleTable.toggleRowSelection(e,true);
                    if(e.checked){
                      that.$refs.multipleTable.toggleRowSelection(e,true);
                    }
                  })
                  vueThis.filterExecteId();
                })

                vueThis.$store.commit('setNewGroup', vueThis.group);
              }

            }else{
              vueThis.$message.error('抱歉，获取信息失败：' + res.data.msg);
            }
          })
          .catch(function (err) {
            vueThis.$message.error(err);
          });
      },

      ruleTextChange(text){
        this.mockInfo.rule = text;
      },
      formatJSON(text){
        if(text == 1){
          this.mockInfo.request = formatJson(this.mockInfo.request)
        }else if(text == 2){
          this.mockInfo.response= formatJson(this.mockInfo.response)
        }
      }

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-row {
    margin-top: 10px;
  }

  .ace-clouds .ace_constant.ace_numeric {
    color: #000;
  }

</style>
