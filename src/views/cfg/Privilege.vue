<template>
  <el-container id="privilege">
    <el-main>
      <el-row style="text-align: left;padding-left: 7px">
        <el-button type="text" @click="search">按URL查询</el-button>
        <el-button type="text" @click="refresh">刷新</el-button>
      </el-row>
      <el-row>
      <el-table
        :data="appearPrivileges"
        stripe
      >
        <el-table-column
          label="系统"
          >
          <template slot-scope="scope">
            <el-input v-model="appearPrivileges[scope.$index].system"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          label="URL"
        >
          <template slot-scope="scope">
            <el-input v-model="appearPrivileges[scope.$index].url"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          label="角色"
        >
          <template slot-scope="scope">

            <el-select v-model="appearPrivileges[scope.$index].roles" multiple placeholder="请选择">
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
            <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="删除" placement="top">-->
              <el-button @click.native.prevent="del(scope.$index, appearPrivileges)" type="text" size="small">删除</el-button>
            <!--</el-tooltip>-->
            <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="增加" placement="top" v-if="showAdd(scope.$index, appearPrivileges)">-->
              <el-button @click.native.prevent="addRow(scope.$index, appearPrivileges)" v-if="showAdd(scope.$index, appearPrivileges)" type="text" size="small">增加</el-button>
            <!--</el-tooltip>-->
            <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="保存" placement="top">-->
              <el-button @click.native.prevent="save(scope.$index, appearPrivileges)" type="text" size="small">保存</el-button>
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
        :total="privileges.length"
        >
      </el-pagination>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  import ElRow from "element-ui/packages/row/src/row";
  export default{
    components: {ElRow}, name: 'privilege',

      data() {
          return {
              privileges:[],
              roles: [],
              currentPage: 1,
              pageSize: 10,
              delDialogVisible: false,
              delIndex: '',
              delEnv: {},
              role:[]
          }
      },

      computed:{
        appearPrivileges(){
          var maxIndex = Math.min(this.pageSize *this.currentPage, this.privileges.length);
          var arr = this.privileges.slice(this.pageSize *(this.currentPage - 1), maxIndex)
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
            }else {
              this.$message.error('抱歉，获取角色失败：' + res.data.msg);
            }
          }).catch(function (err) {
            this.$message.error('抱歉，服务器异常！' );
          });

          this.usrAxios({
            method: 'get',
            url: 'user/getAllPrivileges'
          }).then(function (res) {
              if(res.data.code === 10000){
                vueThis.privileges = res.data.data;

                if(vueThis.privileges === null || vueThis.privileges.length === 0){
                    vueThis.privileges =[{
                      system: '',
                      url:'',
                      roles:[
                        {"id":'',
                          "roleName":''
                        }
                      ]
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
        },

        save(index, rows){
          let vueThis = this;

          this.testCaseAxios({
            method: 'post',
            data: rows[index],
            url: 'envs/add'
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
              system: '',
              url:'',
              roles:[
                  {"id":'',
                "roleName":''
              }]
            })
            this.privileges.push(rows[index+1]);
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

          console.log(this.privileges)

          if(typeof(rows[index].id) != 'undefined' ){
            this.testCaseAxios({
              method: 'post',
              data: rows[index],
              url: 'envs/delete'
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
        },

        search() {
          this.$prompt(null, '请输入用户名：', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(({ value }) => {

            let vueThis = this;

            this.usrAxios({
              method: 'get',
              url: 'user/searchByName?name=' + value
            }).then(function (res) {
              if(res.data.code === 10000){
                vueThis.privileges = res.data.data;
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
              vueThis.privileges = res.data.data;

              if(vueThis.privileges === null || vueThis.privileges.length === 0){
                vueThis.privileges =[{
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
