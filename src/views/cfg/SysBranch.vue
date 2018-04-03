<template>
  <el-container id="sysBranch">
    <el-main>
      <div>
        <el-table
          :data="appearSysBranch" style="width: 100%"
        >
          <el-table-column
            label="系统名称"
            >
            <template slot-scope="scope">
              <el-input v-model="appearSysBranch[scope.$index].system"></el-input>
            </template>
          </el-table-column>

          <el-table-column
          label="分支"
          >
          <template slot-scope="scope">
            <el-input v-model="appearSysBranch[scope.$index].branch"></el-input>
          </template>
         </el-table-column>

          <el-table-column
            label="版本"
            >
            <template slot-scope="scope">
              <el-input v-model="appearSysBranch[scope.$index].version"></el-input>
            </template>
          </el-table-column>

          <el-table-column
            label="最新？" align="center"
          >
            <template slot-scope="scope">
              <el-checkbox v-model="appearSysBranch[scope.$index].last"></el-checkbox>
            </template>
          </el-table-column>

          <el-table-column
            label="" >
            <template slot-scope="scope">
              <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="删除" placement="top">-->
                <!--<el-button @click.native.prevent="deleteRow(scope.$index, appearSysBranch)" type="text" size="small"><i class="el-icon-delete"></i></el-button>-->
              <!--</el-tooltip>-->
              <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="增加" placement="top" v-if="showAdd(scope.$index, appearSysBranch)">-->
                <!--<el-button @click.native.prevent="addRow(scope.$index, appearSysBranch)"  type="text" size="small"><i class="el-icon-plus"></i></el-button>-->
              <!--</el-tooltip>-->

              <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="保存" placement="top">
                <el-button @click.native.prevent="save(scope.$index, appearSysBranch)" type="text" size="small"><i class="el-icon-location-outline"></i></el-button>
              </el-tooltip>

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
      </div>
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
            sysBranch:[],
            currentPage: 1,
            pageSize: 1,
            delIndex: '',
            delSysBranch: {},
            delDialogVisible: false
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

          this.testCaseAxios({
            method: 'get',
            url: 'sysBranch/getAll'
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
        },

        showAdd(index, rows){
          if(rows.length == index + 1 && (rows[index].system != '' && rows[index].branch != '' && rows[index].version != '' && rows[index].last != '')){
            return true;
          }else{
            return false;
          }
        },

        //新增消息头一行
        addRow(index, rows){
          rows.push({
            system:'',
            branch:'',
            version:'',
            last:''
          })
          this.sysBranch.push(rows[index+1])
        },

        //删除消息头中的一行
        deleteRow(index, rows) {
          this.delDialogVisible = true;
          this.delIndex = index;
          this.delSysBranch = rows;
        },

        del(){
          this.delDialogVisible = false;
          let index = this.delIndex;
          let rows = this.delSysBranch;

          if(typeof(rows[index].id) != 'undefined' ){
            let vueThis = this;

            this.testCaseAxios({
              method: 'post',
              data: rows[index],
              url: 'sysBranch/delete'
            }).then(function (res) {
              if(res.data.code === 10000){

                if(index == 0 && rows.length == 1 && vueThis.currentPage === 1 && vueThis.sysBranch.length <= vueThis.pageSize){
                  rows[index].system = '';
                  rows[index].branch = '';
                  rows[index].version = '';
                  rows[index].last = '';
                }else {
                  let totalIndex = vueThis.pageSize *(vueThis.currentPage - 1) + index;
                  vueThis.sysBranch.splice(totalIndex, 1);
                }

                vueThis.$message({
                  message: '恭喜你，删除系统分支成功',
                  type: 'success'
                });
              }else{
                vueThis.$message({
                  message: '抱歉，删除系统分支失败' + res.data.msg,
                  type: 'error'
                });
              }
            }).catch(function (err) {
              vueThis.$message.error('服务器请求失败！'+ err.message);
            })
          }else{
            if(index == 0 && rows.length == 1 && this.currentPage === 1 && this.sysBranch.length <= this.pageSize){
              rows[index].system = '';
              rows[index].branch = '';
              rows[index].version = '';
              rows[index].last = '';
            }else {
              let totalIndex = this.pageSize *(this.currentPage - 1) + index;
              this.sysBranch.splice(totalIndex, 1);
            }
          }
        },

        save(index, rows){
          let vueThis = this;

          this.testCaseAxios({
            method: 'post',
            data: rows[index],
            url: 'sysBranch/updateBranch'
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
          this.currentPage = val;
        },

        setDefaultPage(){
          this.currentPage = 1;
        }
      }
  }
</script>
