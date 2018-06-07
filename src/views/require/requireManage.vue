<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :span="2" style="line-height: 40px;">需求编号:</el-col>
        <el-col :span="5">
          <el-input
          placeholder="请输入需求编号"
          v-model="searchInfo.jiraid">
          </el-input>
        </el-col>
        <el-col :span="2" style="line-height: 40px;">需求名称:</el-col>
        <el-col :span="6">
          <el-input
            placeholder="请输入需求名称"
            v-model="searchInfo.jiraSummary">
          </el-input>
        </el-col>
        <el-col :span="2" style="line-height: 40px;">开发人员:</el-col>
        <el-col :span="6">
          <multiselect v-model="selectDeveloper" :options="developerOptions" :custom-label="nameWithLang" placeholder="" label="nickname" track-by="nickname"></multiselect>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2" style="line-height: 40px;">需求状态:</el-col>
        <el-col :span="5" style="text-align: left">
          <el-select v-model="searchInfo.requirementStatus" multiple placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in requirementStatusLists"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2" style="line-height: 40px;">项目经理:</el-col>
        <el-col :span="6">
          <multiselect v-model="selectProjectManager" :options="projectManagerOptions" :custom-label="nameWithLang" placeholder="" label="nickname" track-by="nickname"></multiselect>
        </el-col>
        <el-col :span="2" style="line-height: 40px;">产品经理:</el-col>
        <el-col :span="6">
          <multiselect v-model="selectProductManager" :options="productManagerOptions" :custom-label="nameWithLang" placeholder="" label="nickname" track-by="nickname"></multiselect>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2" style="line-height: 40px;">上线时间:</el-col>
        <el-col :span="10" style="text-align: left">
          <el-date-picker
            v-model="searchInfo.queryStartdate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-col>
        <el-col :span="9" style="line-height: 40px;text-align: left">
          <el-button type="primary" @click="search"  >确认</el-button>
          <el-button type="primary" @click="clear"  >清空</el-button>
          <el-button type="primary">同步jira需求</el-button>
        </el-col>


      </el-row>
      <el-row style="padding-top: 40px">
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            fixed
            prop="id"
            label="需求编号"
            width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="goRequireDetail(scope.row.id)">{{ scope.row.id}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="需求名称"
            width="120">
            <template slot-scope="scope">
              <el-button type="text">{{ scope.row.name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="需求状态"
            width="120">
          </el-table-column>
          <el-table-column
            prop="productLine"
            label="产品线"
            width="120">
          </el-table-column>
          <el-table-column
            prop="projectManager"
            label="项目经理"
            width="120">
          </el-table-column>
          <el-table-column
            prop="productManager"
            label="产品经理"
            width="120">
          </el-table-column>
          <el-table-column
            prop="releaseTime"
            label="上线日期"
            width="120">
          </el-table-column>
          <el-table-column
            prop="devStartTime"
            label="开发开始时间"
            width="120">
          </el-table-column>
          <el-table-column
            prop="devEndTime"
            label="开发结束时间"
            width="120">
          </el-table-column>
          <el-table-column
            prop="testStartTime"
            label="测试开始时间"
            width="300">
          </el-table-column>
          <el-table-column
            prop="testEndTime"
            label="测试结束时间"
            width="120">
          </el-table-column>
          <el-table-column
            prop="developers"
            label="开发人员"
            width="120">
          </el-table-column>
          <el-table-column
            prop="testers"
            label="测试人员"
            width="120">
          </el-table-column>
          <el-table-column
            prop="priority"
            label="优先级"
            width="120">
          </el-table-column>
          <el-table-column
            prop="comment"
            label="备注"
            width="120">
          </el-table-column>
        </el-table>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  import Multiselect from 'vue-multiselect'
  export default{
      name: 'requireManage',
      components: {Multiselect},
      data() {
          return {
            selectProductManager: {nickname:'',email:''},
            selectProjectManager: {nickname:'',email:''},
            selectDeveloper: {nickname:'',email:''},
            //需求状态列表数据
            requirementStatusLists:[
              {
                value: '待排期',
                label: '待排期'
              },
              {
                value: '排期完成',
                label: '排期完成'
              },
              {
                value: '开发中',
                label: '开发中'
              },
              {
                value: '测试中',
                label: '测试中'
              },
              {
                value: '已上线',
                label: '已上线'
              },
              {
                value: '取消',
                label: '取消'
              },
              {
                value: '暂停',
                label: '暂停'
              },
              {
                value: '需求处理中',
                label: '需求处理中'
              },
              {
                value: '需求待评审',
                label: '需求待评审'
              },
              {
                value: '需求已评审',
                label: '需求已评审'
              },
              {
                value: '需求明确',
                label: '需求明确'
              }
            ],
            // 开发人员邮件列表
            developerOptions: [],
            // 项目人员邮件列表
            projectManagerOptions: [],
            // 产品人员邮件列表
            productManagerOptions: [],
            //日期选择的设置
            pickerOptions: {
              shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近一个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近三个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                  picker.$emit('pick', [start, end]);
                }
              }]
            },
            searchInfo:{
              jiraid:'',
              jiraSummary:'',
              developer:'',
              requirementStatus:'',
              projectManager:'',
              productManager:'',
              queryStartdate:'',
              queryEnddate:''
            },
            tableData: []
          }
      },

      computed:{

      },

      created(){
        this.getData();
      },

      methods: {
        getData(){
          var vueThis = this;
          //获取开发人员list
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
              vueThis.developerOptions = tempEnviornment;

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
                  tempEnviornment.push({nickname: e.nickname+e.email, email: e.email})
                });
                vueThis.projectManagerOptions = tempEnviornment;

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
                  tempEnviornment.push({nickname: e.nickname+e.email, email: e.email})
                });
                vueThis.productManagerOptions = tempEnviornment;

              }else{
                vueThis.$message.error(res.data.msg);
              }
            })
            .catch(function (err) {
              vueThis.$message.error(err);
            });

          //////////获取需求列表
          vueThis.requireAxios({
            method: 'get',
            url: "workflow/requriment/getAll"
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

        },
        search(){
          console.log(this.value)
        },
        clear(){

        },
        goRequireDetail(id){
          this.$router.push({name: 'RequireDetail', query: {id: id}});
        },

        nameWithLang ({ nickname }) {
          // return `${name} — [${language}]`
          return `${nickname}`
        }

      }
  }
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
  .el-row {
    width: 100%;
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
</style>
