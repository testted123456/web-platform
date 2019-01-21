<template>
  <el-container id="sysBranch">
    <el-main v-loading="loading">
      <el-row style="text-align: left;padding-left: 7px">
        <el-button type="text" @click="search">按系统查询</el-button>
        <!--<el-button type="text" @click="refresh">刷新</el-button>-->
        <el-button type="text" @click="sync">按系统同步</el-button>
        <el-button type="text" @click="genDoc">生成接口文档</el-button>
        <el-button type="text" @click="viewDoc">查看接口文档</el-button>
      </el-row>
      <el-row>
        <el-table
          :data="sysBranch" style="width: 100%" :filter-changer="change"
        >
          <el-table-column
            label="系统名称"
            prop="system" align="left"
            >
            <!--<template slot-scope="scope">-->
              <!--<el-input v-model="sysBranch[scope.$index].system"></el-input>-->
            <!--</template>-->
          </el-table-column>

          <el-table-column
          label="分支"
          prop="branch" align="left"
          >
          <!--<template slot-scope="scope">-->
            <!--<el-input v-model="sysBranch[scope.$index].branch"></el-input>-->
          <!--</template>-->
         </el-table-column>

          <el-table-column
            label="状态" align="left"
            >
            <template slot-scope="scope">
              <!--<el-input v-model="showStatus(sysBranch[scope.$index].optstatus)"></el-input>-->
              <label >{{showStatus(sysBranch[scope.$index].optstatus)}}</label>
            </template>
          </el-table-column>

          <el-table-column
            label="最新？" align="left"
          >
            <template slot-scope="scope">
              <el-checkbox v-model="sysBranch[scope.$index].last"></el-checkbox>
            </template>
          </el-table-column>

          <el-table-column
            label="操作" align="left">
            <template slot-scope="scope">
              <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="导入" placement="top">-->
                <el-button @click.native.prevent="syncGit(scope.$index, sysBranch)" type="text" size="small">导入</el-button>
              <!--</el-tooltip>-->
              <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="查看HTML" placement="top" >-->
                <el-button @click.native.prevent="viewHTML(scope.$index, sysBranch)"  type="text" size="small">查看HTML</el-button>
              <!--</el-tooltip>-->

              <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="保存" placement="top">-->
                <!--<el-button @click.native.prevent="save(scope.$index, sysBranch)" type="text" size="small" :disabled='!$store.state.permission.dbgroup.save'>保存</el-button>-->
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
          :total="totalSize">
        </el-pagination>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  export default{
      name: 'SysGit',
      data() {
          return {
            sysBranch:[],
            currentPage: 1,
            pageSize: 10,
            totalSize: 0,
            delIndex: '',
            delSysBranch: {},
            systems:[],
            loading: false
          }
      },

      computed:{
      },

      created(){
        this.initSystem();
        this.init(0, this.pageSize);
      },

      methods: {
        initSystem(){
          var vueThis = this;

          this.testCaseAxios({
            method: 'get',
            url: 'sysCfg/getAll'
          }).then(function (res) {
            if(res.data.code === 10000){
              res.data.data.forEach(function (e, index) {
                vueThis.systems.push({value: e.system, text: e.system})
              });
            }else{
              vueThis.$message({
                message: '抱歉，获取系统失败' + res.data.msg,
                type: 'error'
              });
            }
          }).catch(function (err) {
            vueThis.$message.error('服务器请求失败！');
          });
        },

        init(pageIndex, pageSize){
          var vueThis = this;

          this.testCaseAxios({
            method: 'get',
            url: 'sysBranch/getPageByBranch?branch=master&pageIndex=' + pageIndex + '&pageSize=' + pageSize
          }).then(function (res) {
            if(res.data.code === 10000){
              vueThis.sysBranch = res.data.data.list;
              vueThis.totalSize = res.data.data.count;

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

        showAdd(index, rows){
          if(rows.length == index + 1 && (rows[index].system != '' && rows[index].branch != '' && rows[index].version != '' && rows[index].last != '')){
            return true;
          }else{
            return false;
          }
        },

        showStatus(status){
          switch (status){
            case 3:
                return '同步中';
                break;
            case 4:
              return '同步成功';
              break;
            case 5:
              return '同步失败';
              break;
            default:
              return '未同步'
          }
        },

        //新增消息头一行
        viewHTML(index, rows){
            let system = rows[index].system;
            let branch = rows[index].branch;
            window.open('http://'+this.apiServer +'/apidocs/' + system + '/' + branch + '/index.html')
        },

        //删除消息头中的一行
        syncGit(index, rows) {
          let alias = '';
          let gitAddress = '';
          let vueThis = this;

          this.testCaseAxios({
            method: 'get',
            url: 'sysCfg/getBySystem?system=' + rows[index].system
          }).then(function (res) {
            if(res.data.code === 10000){
              alias = res.data.data.alias;
              gitAddress = res.data.data.gitAddress;

              vueThis.apiAxios({
                method: 'post',
                data: {
                  'system': rows[index].system,
                  'alias': alias,
                  'gitAddress': gitAddress,
                  'branch': rows[index].branch,
                  'versionCode': rows[index].version
                },
                url: 'api/syncApidoc'
              }).then(function (res) {
                if(res.data.code === 10000){

                  vueThis.$message({
                    message: '开始同步',
                    type: 'success'
                  });
                }else{
                  vueThis.$message({
                    message: '抱歉，同步失败' + res.data.msg,
                    type: 'error'
                  });
                }
              }).catch(function (err) {
                vueThis.$message.error('服务器请求失败！'+ err.message);
              })
            }else{
              vueThis.$message({
                message: '抱歉，获取系统配置失败' + res.data.msg,
                type: 'error'
              });
            }
          }).catch(function (err) {
            vueThis.$message.error('服务器请求失败！');
          })
        },

       /* save(index, rows){
          let vueThis = this;

          this.testCaseAxios({
            method: 'post',
            data: rows[index],
            url: 'sysBranch/updateLast'
          }).then(function (res) {
            if(res.data.code === 10000){
              vueThis.$message({
                message: '恭喜你，保存系统配置成功',
                type: 'success'
              });
            }else{
              vueThis.$message({
                message: '抱歉，保存系统配置失败:' + res.data.msg,
                type: 'error'
              });
            }
          }).catch(function (err) {
            vueThis.$message.error('服务器请求失败！');
          })
        },*/

        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },

        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
          this.currentPage = val;
          this.tempCurrentPage = this.currentPage-1;
          this.init(this.tempCurrentPage, this.pageSize);
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
          })},

        sync(){
          this.$prompt(null, '请输入系统名：', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(({ value }) => {

            let vueThis = this;
            let system = value;

            this.testCaseAxios({
              method: 'get',
              url: 'sysBranch/syncBranches?system=' + system
            }).then(function (res) {
              if(res.data.code === 10000){

                res.data.data.forEach(function (e, index) {
                  vueThis.systems.push({value: e.system, text: e.system})
                });

                vueThis.$message({
                  message: '恭喜，同步git分支成功' + res.data.msg,
                  type: 'success'
                });
              }else{
                vueThis.$message({
                  message: '抱歉，同步git分支失败' + res.data.msg,
                  type: 'error'
                });
              }

            }).catch(function (err) {
              vueThis.$message.error('服务器请求失败！');
            });
          })
        },

        genDoc(){//生成汇总接口文档
          let vueThis = this;
          this.loading=true;
          this.apiAxios({
            method: 'get',
            url: 'api/genDoc'
          }).then(function (res) {
            if(res.data.code === 10000){
              vueThis.loading=false;
              vueThis.$message({
                message: '恭喜，生成接口文档成功！' ,
                type: 'success'
              });
            }else{
              vueThis.loading=false;
              vueThis.$message({
                message: '抱歉，生成接口文档失败，' + res.data.msg,
                type: 'error'
              });
            }
          }).catch(function (err) {
            vueThis.loading=false;
            vueThis.$message.error('服务器请求失败！');
          })
        },

        viewDoc(){//查看汇总接口文档
          window.open('http://'+this.apiServer +'/apidocs/Doc' + '/index.html')
        }
      }
  }
</script>
