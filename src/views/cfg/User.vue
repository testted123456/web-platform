<template>
  <el-container id="user">
    <el-main>
      <el-row style="text-align: left;padding-left: 7px">
        <el-button type="text" @click="search">按姓名查询</el-button>
        <el-button type="text" @click="refresh">刷新</el-button>
      </el-row>
      <el-row>
      <el-table
        :data="users"
        stripe
      >
        <el-table-column
          label="姓名"
          >
          <template slot-scope="scope">
            <el-input v-model="users[scope.$index].username"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          label="中文名"
        >
          <template slot-scope="scope">
            <el-input v-model="users[scope.$index].nickname"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          label="备份人"
        >
          <template slot-scope="scope">
            <el-input v-model="users[scope.$index].backUp"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          label="上级"
        >
          <template slot-scope="scope">
            <el-input v-model="users[scope.$index].superior"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          label="角色"
        >
          <template slot-scope="scope">

            <el-select v-model="users[scope.$index].role" placeholder="请选择">
              <el-option
                v-for="item in roles"
                :key="item.roleName"
                :label="item.roleName"
                :value="item.roleName">
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column
          label="" >
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="删除" placement="top">
              <el-button @click.native.prevent="del(scope.$index, users)" type="text" size="small">删除</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="增加" placement="top" v-if="showAdd(scope.$index, users)">
              <el-button @click.native.prevent="addRow(scope.$index, users)"  type="text" size="small">新增</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="保存" placement="top">
              <el-button @click.native.prevent="save(scope.$index, users)" type="text" size="small">保存</el-button>
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
        :total="totalSize"
        >
      </el-pagination>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  import ElRow from "element-ui/packages/row/src/row";
  export default{
    components: {ElRow}, name: 'User',

      data() {
          return {
              users:[],
              roles: [],
              currentPage: 1,
              pageSize: 10,
              totalSize: 0,
              delDialogVisible: false,
              delIndex: '',
              delEnv: {}
          }
      },

      computed:{
      },

      created(){
        this.initRoles();
        this.initUsers(0, this.pageSize);
      },

      methods: {
        initRoles(){
          var vueThis = this;

          this.usrAxios({
            method: 'get',
            url: 'role/getAllRoles'
          }).then(function (res) {
            if(res.data.code === 10000){
              vueThis.roles = res.data.data;
            }else {
              this.$message.error('抱歉，获取角色失败：' + res.data.msg);
            }
          }).catch(function (err) {
            console.log(err);
            this.$message.error('抱歉，服务器异常！' );
          });
        },

        //获取当前页面用户
        initUsers(pageIndex, pageSize){
          var vueThis = this;

          this.usrAxios({
            method: 'get',
            url: 'user/getPageUsers?pageIndex=' + pageIndex + '&pageSize=' + pageSize
          }).then(function (res) {
              if(res.data.code === 10000){
                vueThis.totalSize = res.data.data.count;
                vueThis.users = res.data.data.list;

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
                  message: '抱歉，获取用户失败' + res.data.msg,
                  type: 'error'
                });
              }
          }).catch(function (err) {
            console.log(err)
            vueThis.$message.error('服务器请求失败！');
          })
        },

        //保存用户
        save(index, rows){
          let vueThis = this;

          this.usrAxios({
            method: 'post',
            data: rows[index],
            url: 'user/grantRole'
          }).then(function (res) {
            if(res.data.code === 10000){
              vueThis.$message({
                message: '恭喜你，保存用户成功',
                type: 'success'
              });

              //刷新当前页面
              vueThis.initUsers(vueThis.currentPage-1, vueThis.pageSize);
            }else{
              vueThis.$message({
                message: '抱歉，保存用户失败:' + res.data.msg,
                type: 'error'
              });
            }
          }).catch(function () {
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

        //新增一行
        addRow(index, rows){
          if(rows.length == index + 1 && rows[index].name != ''  ){
            rows.push({
              username: '',
              nickname: '',
              role: ''
            })
          }
        },

        //删除确认框
        del(index, rows){
          let vueThis = this;
          this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            vueThis.deleteRow(index, rows);
          }).catch((err) => {
            console.log(err)
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },

        //删除一条记录
        deleteRow(index, rows) {
          let vueThis = this;

          if(typeof(rows[index].id) != 'undefined' ){
            this.usrAxios({
              method: 'get',
              url: 'user/delUser?id=' + rows[index].id
            }).then(function (res) {
              if(res.data.code === 10000){
                vueThis.$message({
                  message: '恭喜你，删除用户成功',
                  type: 'success'
                });

                //刷新当前页
                vueThis.initUsers(vueThis.currentPage-1, vueThis.pageSize);
              }else{
                vueThis.$message({
                  message: '抱歉，删除用例失败' + res.data.msg,
                  type: 'error'
                });
              }
            }).catch(function (err) {
              console.log(err);
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
          this.tempCurrentPage = this.currentPage-1;
          this.initUsers(this.tempCurrentPage, this.pageSize);
        },

        setDefaultPage(){
          this.currentPage = 1;
        },

        search() {
          this.$prompt(null, '请输入用户名：', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(({ value }) => {
            let vueThis = this;

            if(value === null || value ===''){
                this.refresh();
                return;
            }

            this.usrAxios({
              method: 'get',
              url: 'user/searchByName?name=' + value
            }).then(function (res) {
              if(res.data.code === 10000){
                vueThis.users = res.data.data;
              }else{
                vueThis.$message({
                  message: '抱歉，获取用户信息失败' + res.data.msg,
                  type: 'error'
                });
              }
            }).catch(function (err) {
              vueThis.$message.error('服务器请求失败！');
            })

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });

        },

        refresh(){
          var vueThis = this;

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
        }
      }
  }
</script>
