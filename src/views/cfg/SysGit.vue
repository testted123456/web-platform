<template>
  <el-container id="gVar">
    <el-main>

      <el-row>
        <el-table
          :data="sysGit" style="width: 100%"
        >
          <el-table-column
            label="系统名称"
            >
            <template slot-scope="scope">
              <el-input v-model="sysGit[scope.$index].system"></el-input>
            </template>
          </el-table-column>

          <el-table-column
          label="git地址"
          >
          <template slot-scope="scope">
            <el-input v-model="sysGit[scope.$index].gitAddress"></el-input>
          </template>
         </el-table-column>

          <el-table-column
            label="系统别名"
            >
            <template slot-scope="scope">
              <el-input v-model="sysGit[scope.$index].alias"></el-input>
            </template>
          </el-table-column>

          <el-table-column
            label="" >
            <template slot-scope="scope">
              <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="删除" placement="top">-->
                <el-button @click.native.prevent="del(scope.$index, sysGit)" type="text" size="small" :disabled='!$store.state.permission.dbgroup.del'>删除</el-button>
              <!--</el-tooltip>-->
              <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="增加" placement="top" v-if="showAdd(scope.$index, sysGit)">-->
                <el-button @click.native.prevent="addRow(scope.$index, sysGit)"  type="text" size="small" v-if="showAdd(scope.$index, sysGit)" :disabled='!$store.state.permission.dbgroup.add'>增加</el-button>
              <!--</el-tooltip>-->
              <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="保存" placement="top">-->
                <el-button @click.native.prevent="save(scope.$index, sysGit)" type="text" size="small" :disabled='!$store.state.permission.dbgroup.save'>保存</el-button>
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
      <el-dialog
        :visible.sync="delDialogVisible"
        width="25%"
      >
        <span>确认删除？</span>
        <span slot="footer" class="dialog-footer">
                    <el-button @click="delDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="del">确 定</el-button>
                  </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
  export default{
      name: 'SysGit',
      data() {
          return {
            sysGit:[],
              currentPage: 1,
              pageSize: 10,
              totalSize: 12,
              delIndex: '',
              delSysGit: {},
              delDialogVisible: false
          }
      },

      computed:{
      },

      created(){
        this.init(0, this.pageSize);
      },

      methods: {

        init(pageIndex, pageSize){
          var vueThis = this;

          this.testCaseAxios({
            method: 'post',
            url: 'sysCfg/getPage?pageIndex=' + pageIndex + '&pageSize=' + pageSize
          }).then(function (res) {
            if(res.data.code === 10000){
              vueThis.sysGit = res.data.data.list;
              vueThis.totalSize = res.data.data.count;

              if(vueThis.sysGit === null || vueThis.sysGit.length === 0){
                vueThis.sysGit =[{
                  system:'',
                  gitAddress:'',
                  alias:''
                }]
              }
            }else{
              vueThis.$message({
                message: '抱歉，获取git配置失败：' + res.data.msg,
                type: 'error'
              });
            }
          }).catch(function (err) {
            vueThis.$message.error('服务器请求失败！');
          })
        },

        showAdd(index, rows){
          if(rows.length == index + 1 && (rows[index].system != '' && rows[index].gitAddress != '' && rows[index].alias != '')){
            return true;
          }else{
            return false;
          }
        },

        //新增消息头一行
        addRow(index, rows){
          rows.push({
            system: '',
            gitAddress: '',
            alias: ''
          })
          // this.sysGit.push(rows[index+1])
        },

        del(index, rows){
          this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteRow(index, rows);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },

        //删除消息头中的一行
        deleteRow(index, rows) {
          let vueThis = this;

          if(typeof(rows[index].id) != 'undefined' ){
            this.testCaseAxios({
              method: 'post',
              data: rows[index],
              url: 'sysCfg/delete'
            }).then(function (res) {
              if(res.data.code === 10000){

                if(index == 0 && rows.length == 1 && vueThis.currentPage === 1 && vueThis.sysGit.length <= vueThis.pageSize){
                  rows[index].system = '';
                  rows[index].gitAddress = '';
                  rows[index].alias = '';
                }else {
                  let totalIndex = vueThis.pageSize *(vueThis.currentPage - 1) + index;
                  vueThis.sysGit.splice(totalIndex, 1);
                }

                vueThis.$message({
                  message: '恭喜你，删除系统配置成功',
                  type: 'success'
                });
              }else{
                vueThis.$message({
                  message: '抱歉，删除系统配置失败' + res.data.msg,
                  type: 'error'
                });
              }
            }).catch(function (err) {
              vueThis.$message.error('服务器请求失败！'+ err.message);
            })
          }else{
            if(index == 0 && rows.length == 1 && this.currentPage === 1 && this.sysGit.length <= this.pageSize){
              rows[index].system = '';
              rows[index].gitAddress = '';
              rows[index].alias = '';
            }else {
              let totalIndex = this.pageSize *(this.currentPage - 1) + index;
              this.sysGit.splice(totalIndex, 1);
            }
          }
        },

        save(index, rows){
          let vueThis = this;

          this.testCaseAxios({
            method: 'post',
            data: rows[index],
            url: 'sysCfg/add'
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
        },

        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },

        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
          var vueThis = this;
          this.currentPage = val;
          vueThis.tempCurrentPage = this.currentPage-1;

          this.init(vueThis.tempCurrentPage, vueThis.pageSize);
        },

        setDefaultPage(){
          this.currentPage = 1;
        }
      }
  }

</script>

<style>

  .el-dialog__body{
    font-size: 16px;
    padding-top: 20px;
    padding-bottom: 10px;
    text-align: left;
    padding-left: 30px;

  }


</style>
