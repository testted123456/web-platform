<template>
  <el-container id="gVar">
    <el-main>
      <div>
        <el-table
          :data="gVars" style="width: 100%"
        >
          <el-table-column
            label="变量名"
            >
            <template slot-scope="scope">
              <el-input v-model="gVars[scope.$index].name"></el-input>
            </template>
          </el-table-column>

          <el-table-column
          label="变量值"
          >
          <template slot-scope="scope">
            <el-input v-model="gVars[scope.$index].value"></el-input>
          </template>
         </el-table-column>

          <el-table-column
            label="描述"
            >
            <template slot-scope="scope">
              <el-input v-model="gVars[scope.$index].description"></el-input>
            </template>
          </el-table-column>

          <el-table-column
            fixed="right"
            label="">
            <template slot-scope="scope">
              <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="删除" placement="top">-->
                <el-button @click.native.prevent="del(scope.$index, gVars)" type="text" size="small">删除</el-button>
              <!--</el-tooltip>-->
                <el-button @click.native.prevent="addRow(scope.$index, gVars)" v-if="showAdd(scope.$index, gVars)" type="text" size="small">增加</el-button>
              <!--</el-tooltip>-->
              <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="保存" placement="top">-->
                <el-button @click.native.prevent="save(scope.$index, gVars)" type="text" size="small">保存</el-button>
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
      </div>

    </el-main>
  </el-container>
</template>

<script>
  import {formatJson, isJson} from "@/assets/js/formatJson.js";

  export default{
      name: 'GVar',
      data() {
          return {
              gVars:[{
                  name:'',
                  value:'',
                  description:''
              }],
              currentPage: 1,
              pageSize: 10,
              totalSize: 0
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
            method: 'get',
            url: 'gVar/getPage?pageIndex=' + pageIndex + '&pageSize=' + pageSize
          }).then(function (res) {
            if(res.data.code === 10000){
              vueThis.gVars = res.data.data.list;
              vueThis.totalSize = res.data.data.count;

              if(vueThis.gVars === null || vueThis.gVars.length === 0){
                vueThis.gVars = [{
                  name:'',
                  value:'',
                  description:''
                }]
              }
            }else{
              vueThis.$message({
                message: '抱歉，获取变量失败' + res.data.msg,
                type: 'error'
              });
            }
          }).catch(function (err) {
            console.log(err)
            vueThis.$message.error('服务器请求失败！');
          })
        },

        showAdd(index, rows){
          if(rows.length == index + 1 && (rows[index].name != '' && rows[index].value != '')){
            return true;
          }else{
            return false;
          }
        },

        //新增消息头一行
        addRow(index, rows){
          if(rows.length == index + 1 && (rows[index].name != '' || rows[index].value != '' )){
            rows.push({
              name: '',
              value: ''
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
            this.testCaseAxios({
              method: 'post',
              data: rows[index],
              url: 'gVar/delete'
            }).then(function (res) {
              if(res.data.code === 10000){
                vueThis.init(vueThis.currentPage-1, vueThis.pageSize);

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
            if(index == 0 && rows.length == 1 && vueThis.currentPage === 1 && vueThis.gVars.length <= vueThis.pageSize){
              rows[index].name = '';
              rows[index].value = '';
              rows[index].description = '';
            }else {
              let totalIndex = vueThis.pageSize *(this.currentPage - 1) + index;
              vueThis.gVars.splice(totalIndex, 1);
            }
          }

        },

        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },

        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
          this.currentPage = val;
          this.init(this.currentPage-1, this.pageSize);
        },

        setDefaultPage(){
          this.currentPage = 1;
        },

        save(index, rows){
          let vueThis = this;

          this.testCaseAxios({
            method: 'post',
            data: rows[index],
            url: 'gVar/addOrUpdate'
          }).then(function (res) {
            vueThis.init(vueThis.currentPage-1, vueThis.pageSize);

            if(res.data.code === 10000){
              vueThis.$message({
                message: '恭喜你，保存变量成功',
                type: 'success'
              });
            }else{
              vueThis.$message({
                message: '抱歉，保存变量失败:' + res.data.msg,
                type: 'error'
              });
            }
          }).catch(function (err) {
            vueThis.$message.error('服务器请求失败！');
          })
        },
      }
  }
</script>
