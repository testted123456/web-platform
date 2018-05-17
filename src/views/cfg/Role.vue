<template>
  <el-container id="Role">
    <el-main>
      <div style="width: 60%;padding-left: 20%;border: 1px">
      <el-table
        :data="appearRoles"
        stripe
      >
        <el-table-column
          label="角色"
          >
          <template slot-scope="scope">
            <el-input v-model="appearRoles[scope.$index].roleName"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          label="" >
          <template slot-scope="scope">
            <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="删除" placement="top">-->
              <el-button @click.native.prevent="del(scope.$index, appearRoles)" type="text" size="small">删除</el-button>
            <!--</el-tooltip>-->

            <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="增加" placement="top" v-if="showAdd(scope.$index, appearRoles)">-->
              <el-button @click.native.prevent="addRow(scope.$index, appearRoles)" v-if="showAdd(scope.$index, appearRoles)" type="text" size="small">增加</el-button>
            <!--</el-tooltip>-->

            <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="保存" placement="top">-->
              <el-button @click.native.prevent="save(scope.$index, appearRoles)" type="text" size="small">保存</el-button>
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
        :total="roles.length"
        >
      </el-pagination>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import {formatJson, isJson} from "@/assets/js/formatJson.js";

  export default{
      name: 'Role',
      data() {
          return {
              roles:[],
              currentPage: 1,
              pageSize: 10
          }
      },

      computed:{
        appearRoles(){
          var maxIndex = Math.min(this.pageSize *this.currentPage, this.roles.length);
          var arr = this.roles.slice(this.pageSize *(this.currentPage - 1), maxIndex);
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

              if(vueThis.roles === null || vueThis.roles.length === 0){
                vueThis.roles = [{
                    id:'',
                    roleName: ''
                }];
              }
            }else {
              this.$message.error('抱歉，获取角色失败：' + res.data.msg);
            }
          }).catch(function (err) {
            this.$message.error('抱歉，服务器异常！' );
          });
        },

        showAdd(index, rows){
          if(rows.length == index + 1 && (rows[index].roleName != '')){
            return true;
          }else{
            return false;
          }
        },

        //新增消息头一行
        addRow(index, rows){
          if(rows.length == index + 1 && (rows[index].roleName != '' )){
            rows.push({
              roleName: ''
            })
          }
        },

        del(index, rows){
          this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteRow(index, rows);
          }).catch((err) => {
              console.log(err)
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },

        //删除消息头中的一行
        deleteRow(index, rows) {
          let vueThis = this;

          if(typeof(rows[index].id) != 'undefined'){

            this.usrAxios({
              method: 'post',
              data: rows[index],
              url: 'user/delRole'
            }).then(function (res) {
              if(res.data.code === 10000){

                if(index == 0 && rows.length == 1 && vueThis.currentPage === 1 && vueThis.roles.length <= vueThis.pageSize){
                  rows[index].roleName = '';
                }else {
                  let totalIndex = vueThis.pageSize *(vueThis.currentPage - 1) + index;
                  vueThis.roles.splice(totalIndex, 1);
                }

                vueThis.$message({
                  message: '恭喜你，删除角色成功',
                  type: 'success'
                });
              }else {
                vueThis.$message.error('抱歉，获取角色失败：' + res.data.msg);
                return;
              }
            }).catch(function (err) {
              vueThis.$message.error('抱歉，服务器异常！' );
              return;
            });
          }else{
            if(index == 0 && rows.length == 1 && vueThis.currentPage === 1 && vueThis.roles.length <= vueThis.pageSize){
              rows[index].roleName = '';
            }else {
              let totalIndex = vueThis.pageSize *(this.currentPage - 1) + index;
              vueThis.roles.splice(totalIndex, 1);
            }
          }
        },

        //保存role
        save(index, rows){
          let vueThis = this;

          this.usrAxios({
            method: 'post',
            data: rows[index],
            url: 'user/addRole'
          }).then(function (res) {
            if(res.data.code === 10000){
              rows[index] = res.data.data;

              vueThis.$message({
                message: '恭喜你，保存角色成功',
                type: 'success'
              });
            }else{
              vueThis.$message.error('抱歉，保存角色失败：' + res.data.msg);

            }
          }).catch(function (err) {
              console.log(err)
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
