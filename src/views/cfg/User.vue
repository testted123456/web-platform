<template>
  <el-container id="user">
    <el-main>
      <div style="width: 100%;border: 1px">
      <el-table
        :data="appearUsers"
        stripe
      >
        <el-table-column
          label="姓名"
          >
          <template slot-scope="scope">
            <el-input v-model="appearUsers[scope.$index].username"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          label="中文名"
        >
          <template slot-scope="scope">
            <el-input v-model="appearUsers[scope.$index].nickname"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          label="备份人"
        >
          <template slot-scope="scope">
            <el-input v-model="appearUsers[scope.$index].backUp"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          label="上级"
        >
          <template slot-scope="scope">
            <el-input v-model="appearUsers[scope.$index].superior"></el-input>
          </template>
        </el-table-column>



        <el-table-column
          label="角色"
        >
          <template slot-scope="scope">

            <!--<el-select v-model="appearUsers[scope.$index].dbGroup.id" placeholder="请选择">-->
              <!--<el-option-->
                <!--v-for="item in dbGroups"-->
                <!--:key="item.id"-->
                <!--:label="item.groupName"-->
                <!--:value="item.id">-->
              <!--</el-option>-->
            <!--</el-select>-->

            <el-select v-model="appearUsers[scope.$index].roles" multiple placeholder="请选择">
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column
          label="" >
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="删除" placement="top">
              <el-button @click.native.prevent="del(scope.$index, appearUsers)" type="text" size="small"><i class="el-icon-delete"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="增加" placement="top" v-if="showAdd(scope.$index, appearUsers)">
              <el-button @click.native.prevent="addRow(scope.$index, appearUsers)"  type="text" size="small"><i class="el-icon-plus"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="保存" placement="top">
              <el-button @click.native.prevent="save(scope.$index, appearUsers)" type="text" size="small"><i class="el-icon-location-outline"></i></el-button>
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
        :total="users.length"
        >
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
      name: 'EnvDB',

      data() {
          return {
              users:[],
              roles: [],
              currentPage: 1,
              pageSize: 10,
              delDialogVisible: false,
              delIndex: '',
              delEnv: {}
          }
      },

      computed:{
        appearUsers(){
          var maxIndex = Math.min(this.pageSize *this.currentPage, this.users.length);
          var arr = this.users.slice(this.pageSize *(this.currentPage - 1), maxIndex)
          return arr;
        }
      },

      created(){
        this.init();
      },

      methods: {
        init(){
          var vueThis = this;

          this.usrAxios({
            method: 'get',
            url: 'user/getAllRoles'
          }).then(function (res) {
            if(res.data.code === 10000){
              vueThis.roles = res.data.data;

//              if(vueThis.roles === null || vueThis.roles.length === 0){
//                vueThis.roles = [{
//                  id:'',
//                  roleName: ''
//                }];
//              }
            }else {
              this.$message.error('抱歉，获取角色失败：' + res.data.msg);
            }
          }).catch(function (err) {
            this.$message.error('抱歉，服务器异常！' );
          });

          this.usrAxios({
            method: 'get',
            url: 'user/getAllUsers'
          }).then(function (res) {
              if(res.data.code === 10000){
                vueThis.users = res.data.data;

                if(vueThis.users === null || vueThis.users.length === 0){
                    vueThis.users =[{
                      userName: '',
                      nickName:'',
                      backUp: '',
                      superior:'',
                      roles:[]
                    }]
                }
              }else{
                vueThis.$message({
                  message: '抱歉，获取环境失败' + res.data.msg,
                  type: 'error'
                });
              }
          }).catch(function (err) {
            vueThis.$message.error('服务器请求失败！');
          })

          this.testCaseAxios({
            method: 'get',
            url: 'db/getAllDBGroup'
          }).then(function (res) {
            if(res.data.code === 10000){
              vueThis.dbGroups = res.data.data;
            }
          });
        },

        save(index, rows){
          let vueThis = this;

          this.testCaseAxios({
            method: 'post',
            data: rows[index],
            url: 'env/add'
          }).then(function (res) {
            if(res.data.code === 10000){
              vueThis.$message({
                message: '恭喜你，保存环境成功',
                type: 'success'
              });
            }else{
              vueThis.$message({
                message: '抱歉，保存环境失败:' + res.data.msg,
                type: 'error'
              });
            }
          }).catch(function (err) {
            vueThis.$message.error('服务器请求失败！');
          })
        },

        showAdd(index, rows){
          if(rows.length == index + 1 && (rows[index].name != '')){
            return true;
          }else{
            return false;
          }
        },

        //新增消息头一行
        addRow(index, rows){
          if(rows.length == index + 1 && rows[index].name != ''  ){
            rows.push({
              name: '',
              dbGroup:{}
            })
            this.envs.push(rows[index+1]);
          }
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
              url: 'env/delete'
            }).then(function (res) {
              if(res.data.code === 10000){

                if(index == 0 && rows.length == 1 && vueThis.currentPage === 1 && vueThis.envs.length <= vueThis.pageSize){
                  rows[index].name = '';
                  rows[index].dbGroup = {};
                }else {
                  let totalIndex = vueThis.pageSize *(vueThis.currentPage - 1) + index;
                  vueThis.envs.splice(totalIndex, 1);
                }

                vueThis.$message({
                  message: '恭喜你，删除环境成功',
                  type: 'success'
                });
              }else{
                vueThis.$message({
                  message: '抱歉，删除环境失败' + res.data.msg,
                  type: 'error'
                });
              }
            }).catch(function (err) {
              vueThis.$message.error('服务器请求失败！');
            })
          }else{
            if(index == 0 && rows.length == 1 && vueThis.currentPage === 1 && vueThis.envs.length <= vueThis.pageSize){
              rows[index].name = '';
              rows[index].dbGroup = {};
            }else {
              let totalIndex = vueThis.pageSize *(vueThis.currentPage - 1) + index;
              vueThis.envs.splice(totalIndex, 1);
            }
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
        }
      }
  }
</script>
