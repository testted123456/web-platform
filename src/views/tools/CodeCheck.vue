<template>
  <el-container id="sysBranch">
    <el-main>
      <el-row style="text-align: left;padding-left: 7px">
        <el-button type="text" @click="search">按系统查询</el-button>
      </el-row>
      <el-row>
        <el-table
          :data="appearSysBranch" style="width: 100%" :filter-changer="change"
        >
          <el-table-column
            label="系统名称"
            prop="system" align="left"
            >
          </el-table-column>

          <el-table-column
          label="分支"
          prop="branch" align="left"
          >
         </el-table-column>

          <el-table-column
            label="状态" align="left"
            >
            <template slot-scope="scope">
              <label >{{showStatus(appearSysBranch[scope.$index].codeChecked)}}</label>
            </template>
          </el-table-column>


          <el-table-column
            label="操作" align="left">
            <template slot-scope="scope">
              <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="检测" placement="top">-->
              <el-button @click.native.prevent="checkCode(scope.$index, appearSysBranch)" type="text" size="small">检测</el-button>
              <!--</el-tooltip>-->
              <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="查看HTML" placement="top" >-->
              <el-button @click.native.prevent="viewHTML(scope.$index, appearSysBranch)"  type="text" size="small">查看</el-button>
              <!--</el-tooltip>-->

            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="sysBranch.length">
        </el-pagination>
      </el-row>

    </el-main>
  </el-container>
</template>

<script>
  export default{
      name: 'CodeCheck',
      data() {
          return {
            sysBranch:[],
            currentPage: 1,
            pageSize: 10,
            delIndex: '',
            delSysBranch: {},
            delDialogVisible: false,
            systems:[]
          }
      },

      computed:{
        appearSysBranch(){
          var maxIndex = Math.min(this.pageSize *this.currentPage, this.sysBranch.length);
          var arr = this.sysBranch.slice(this.pageSize *(this.currentPage - 1), maxIndex)
          return arr;
        }
      },

      created(){
        this.init();
      },

      methods: {
        init(){
          var vueThis = this;

//          this.testCaseAxios({
//            method: 'get',
//            url: 'sysCfg/getAll'
//          }).then(function (res) {
//            if(res.data.code === 10000){
//                res.data.data.forEach(function (e, index) {
//                  vueThis.systems.push({value: e.system, text: e.system})
//                });
//            }else{
//              vueThis.$message({
//                message: '抱歉，获取系统失败' + res.data.msg,
//                type: 'error'
//              });
//            }
//          }).catch(function (err) {
//            vueThis.$message.error('服务器请求失败！');
//          });

          this.testCaseAxios({
            method: 'get',
            url: 'sysBranch/getByBranch?branch=master'
          }).then(function (res) {
            if(res.data.code === 10000){
              vueThis.sysBranch = res.data.data;

              if(vueThis.sysBranch === null || vueThis.sysBranch.length === 0){
                vueThis.sysBranch =[{
                  system:'',
                  branch:'',
                  version:'',
                  last:'',
                  optstatus: 0
                }]
              }
            }else{
              vueThis.$message({
                message: '抱歉，获取系统分支失败' + res.data.msg,
                type: 'error'
              });
            }
          }).catch(function (err) {
            vueThis.$message.error('服务器请求失败！');
          })
        },

        showStatus(codeChecked){
            // console.log(codeChecked)
          switch (codeChecked){
            case null:
                return '未检测';
                break;
            case false:
              return '未检测';
              break;
            case true:
              return '已检测';
              break;
            default:
              return '未检测'

          }
        },

        checkCode(index, rows){
          let vueThis = this;

          this.apiAxios({
            method: 'get',
            url: 'codeCheck/check?system=' + rows[index].system + '&branch=' + rows[index].branch
          }).then(function (res) {
            if(res.data.code === 10000){
              vueThis.$message({
                message: '开始代码检测',
                type: 'success'
              });
            }else{
              vueThis.$message({
                message: '抱歉，代码检测失败' + res.data.msg,
                type: 'error'
              });
            }
          }).catch(function (err) {
            vueThis.$message.error('服务器请求失败！');
          })
        },

        //查看报告
        viewHTML(index, rows){
          if(rows[index].codeChecked != true){
            this.$message({
              message: '代码还未检测!',
              type: 'warn'
            });

          }else{
            let system = rows[index].system;
            let branch = rows[index].branch;
            window.open('http://' + this.apiServer +'/checkReport/' + system + '/' + branch + '/testReport.html')
          }

        },

        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },

        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
          this.currentPage = val;
        },

        setDefaultPage(){
          this.currentPage = 1;
        },

        change(){
            console.log('change')
        },

        search(){
          this.$prompt(null, '请输入系统名：', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(({ value }) => {

            let vueThis = this;

            this.testCaseAxios({
              method: 'get',
              url: 'sysBranch/getBySystem?system=' + value
            }).then(function (res) {
              if(res.data.code === 10000){
                vueThis.sysBranch = res.data.data;

                if(vueThis.sysBranch === null || vueThis.sysBranch.length === 0){
                  vueThis.sysBranch =[{
                    system:'',
                    branch:'',
                    version:'',
                    last:''
                  }]
                }
              }else{
                vueThis.$message({
                  message: '抱歉，获取系统分支失败' + res.data.msg,
                  type: 'error'
                });
              }
            }).catch(function (err) {
              vueThis.$message.error('服务器请求失败！');
            })
          })}
      }
  }
</script>
