<template>
  <el-container id="dbGroup">
    <el-main>
      <div style="width: 60%;padding-left: 20%;border: 1px">
      <el-table
        :data="appearDBGroups"
        stripe
      >
        <el-table-column
          label="数据库组"
          >
          <template slot-scope="scope">
            <el-input v-model="appearDBGroups[scope.$index].groupName"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          label="" >
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="删除" placement="top">
              <el-button @click.native.prevent="del(scope.$index, appearDBGroups)" type="text" size="small"><i class="el-icon-delete"></i></el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="增加" placement="top" v-if="showAdd(scope.$index, appearDBGroups)">
              <el-button @click.native.prevent="addRow(scope.$index, appearDBGroups)"  type="text" size="small"><i class="el-icon-plus"></i></el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="保存" placement="top">
              <el-button @click.native.prevent="save(scope.$index, appearDBGroups)" type="text" size="small"><i class="el-icon-location-outline"></i></el-button>
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
        :total="dbGroups.length"
        >
      </el-pagination>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import {formatJson, isJson} from "@/assets/js/formatJson.js";

  export default{
      name: 'DBGroup',
      data() {
          return {
              dbGroups:[],
              currentPage: 1,
              pageSize: 10
          }
      },

      computed:{
        appearDBGroups(){
          var maxIndex = Math.min(this.pageSize *this.currentPage, this.dbGroups.length);
          var arr = this.dbGroups.slice(this.pageSize *(this.currentPage - 1), maxIndex);
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
            url: 'db/getAllDBGroup'
          }).then(function (res) {
            if(res.data.code === 10000){
              vueThis.dbGroups = res.data.data;

              if(vueThis.dbGroups === null || vueThis.dbGroups.length === 0){
                vueThis.dbGroups = [{
                    groupName: ''
                }];
              }
            }else {
              this.$message.error('抱歉，获取数据库分组失败：' + res.data.msg);
            }
          }).catch(function (err) {
            this.$message.error('抱歉，服务器异常！' );
          });
        },

        showAdd(index, rows){
          if(rows.length == index + 1 && (rows[index].groupName != '')){
            return true;
          }else{
            return false;
          }
        },

        //新增消息头一行
        addRow(index, rows){
          if(rows.length == index + 1 && (rows[index].groupName != '' )){
            rows.push({
              groupName: ''
            })
          }
        },

        del(index, rows){
          this.$confirm('此操作将永久删除该接口, 是否继续?', '提示', {
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

            this.testCaseAxios({
              method: 'post',
              data: rows[index],
              url: 'db/delDBGroup'
            }).then(function (res) {
              if(res.data.code === 10000){

                if(index == 0 && rows.length == 1 && vueThis.currentPage === 1 && vueThis.dbGroups.length <= vueThis.pageSize){
                  rows[index].groupName = '';
                }else {
                  let totalIndex = vueThis.pageSize *(vueThis.currentPage - 1) + index;
                  vueThis.dbGroups.splice(totalIndex, 1);
                }

                vueThis.$message({
                  message: '恭喜你，删除数据库分组成功',
                  type: 'success'
                });
              }else {
                vueThis.$message.error('抱歉，获取数据库分组失败：' + res.data.msg);
                return;
              }
            }).catch(function (err) {
              vueThis.$message.error('抱歉，服务器异常！' );
              return;
            });
          }else{
            if(index == 0 && rows.length == 1 && vueThis.currentPage === 1 && vueThis.dbGroups.length <= vueThis.pageSize){
              rows[index].groupName = '';
            }else {
              let totalIndex = vueThis.pageSize *(this.currentPage - 1) + index;
              vueThis.dbGroups.splice(totalIndex, 1);
            }
          }
        },

        //保存dbgroup
        save(index, rows){
          let vueThis = this;

          this.testCaseAxios({
            method: 'post',
            data: rows[index],
            url: 'db/addDBGroup'
          }).then(function (res) {
            if(res.data.code === 10000){
              rows[index] = res.data.data;
//              vueThis.dbGroups.push(rows[index]);

              vueThis.$message({
                message: '恭喜你，保存数据库分组成功',
                type: 'success'
              });
            }else{
              vueThis.$message({
                message: '抱歉，保存数据库分组失败' + res.data.msg,
                type: 'success'
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
