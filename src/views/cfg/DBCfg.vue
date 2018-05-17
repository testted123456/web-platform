<template>
  <el-container id="dbCfg">
    <el-main>
      <div>
        <el-table
          :data="appearDBCfg" style="width: 100%"
        >
           <el-table-column
            label="数据库分组"
           >
            <template slot-scope="scope">
              <el-select v-model="appearDBCfg[scope.$index].dbGroup.id" placeholder="请选择">
                <el-option
                  v-for="item in dbGroups"
                  :key="item.id"
                  :label="item.groupName"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="名称"
            >
            <template slot-scope="scope">
              <el-input v-model="appearDBCfg[scope.$index].name"></el-input>
            </template>
          </el-table-column>

          <el-table-column
          label="ip"
        >
          <template slot-scope="scope">
            <el-input v-model="appearDBCfg[scope.$index].ip"></el-input>
          </template>
        </el-table-column>

          <el-table-column
            label="port"
          >
            <template slot-scope="scope">
              <el-input v-model="appearDBCfg[scope.$index].port"></el-input>
            </template>
          </el-table-column>

          <el-table-column
            label="数据库名称"
            >
            <template slot-scope="scope">
              <el-input v-model="appearDBCfg[scope.$index].dbName"></el-input>
            </template>
          </el-table-column>

          <el-table-column
            label="用户名"
            >
            <template slot-scope="scope">
              <el-input v-model="appearDBCfg[scope.$index].userName"></el-input>
            </template>
          </el-table-column>

          <el-table-column
            label="密码"
            >
            <template slot-scope="scope">
              <el-input v-model="appearDBCfg[scope.$index].password"></el-input>
            </template>
          </el-table-column>

          <el-table-column
            label="" >
            <template slot-scope="scope">
              <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="删除" placement="top">-->
                <el-button @click.native.prevent="del(scope.$index, appearDBCfg)" type="text" size="small" :disabled='!$store.state.permission.dbgroup.del'>删除</el-button>
              <!--</el-tooltip>-->
              <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="增加" placement="top" v-if="showAdd(scope.$index, appearDBCfg)">-->
                <el-button @click.native.prevent="addRow(scope.$index, appearDBCfg)"  type="text" size="small" v-if="showAdd(scope.$index, appearDBCfg)" :disabled='!$store.state.permission.dbgroup.add'>增加</el-button>
              <!--</el-tooltip>-->
              <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="保存" placement="top">-->
                <el-button @click.native.prevent="save(scope.$index, appearDBCfg)" type="text" size="small" :disabled='!$store.state.permission.dbgroup.save'>保存</el-button>
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
          :total="dbCfg.length">
        </el-pagination>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  export default{
      name: 'DBCfg',
      data() {
          return {
              dbCfg:[],
              dbGroups:[],
              currentPage: 1,
              pageSize: 10
          }
      },

      computed:{
        appearDBCfg(){
          var maxIndex = Math.min(this.pageSize *this.currentPage, this.dbCfg.length);
          var arr = this.dbCfg.slice(this.pageSize *(this.currentPage - 1), maxIndex);
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
            url: 'db/getAllDBCfg'
          }).then(function (res) {
            if(res.data.code === 10000){
              vueThis.dbCfg = res.data.data;

              if(vueThis.dbCfg === null || vueThis.dbCfg.length === 0){
                vueThis.dbCfg = [
                  {
                    id: null,
                    name: '',
                    ip: '',
                    port: '',
                    dbName: '',
                    userName: '',
                    password: '',
                    dbGroup: {}
                  }
                ]
              }
            }else{
              this.$message.error('抱歉，获取数据库分组失败：' + res.data.msg);
            }
          }).catch(function (res) {
            this.$message.error('抱歉，服务器异常！' );
          });

          this.testCaseAxios({
            method: 'get',
            url: 'db/getAllDBGroup'
          }).then(function (res) {
            if(res.data.code === 10000){
              vueThis.dbGroups = res.data.data;
            }
          });
        },

        showAdd(index, rows){
          if(rows.length == index + 1 && (
              rows[index].dbGroup.groupName != '' &&
              rows[index].name != '' && rows[index].ip != ''
              && rows[index].dbName != '' && rows[index].userName != '' && rows[index].password != ''
            )){
            return true;
          }else{
            return false;
          }
        },

        //新增消息头一行
        addRow(index, rows){
//          if(rows.length == index + 1 && (rows[index].name != '' || rows[index].value != '' )){
            rows.push({
              id: null,
              name: '',
              ip: '',
              port: '',
              dbName: '',
              userName: '',
              password: '',
              dbGroup: {}
            })
            this.dbCfg.push(rows[index+1]);

//          }
        },

        del(index, rows){
          this.$confirm('此操作将永久删除该接口, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteRow(index, rows);
          }).catch((err) => {
//            console.log(err)
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
              url: 'db/delDBCfg'
            }).then(function (res) {
              if(res.data.code === 10000){

                if(index == 0 && rows.length == 1 && vueThis.currentPage === 1 && vueThis.dbCfg.length <= vueThis.pageSize){
//                    rows[index].id = null
                    rows[index].name = ''
                    rows[index].ip = ''
                    rows[index].port = ''
                    rows[index].dbName = ''
                    rows[index].userName = ''
                    rows[index].password = ''
                    rows[index].dbGroup = {}
                }else {
                  let totalIndex = vueThis.pageSize *(vueThis.currentPage - 1) + index;
                  vueThis.dbCfg.splice(totalIndex, 1);
                }

                vueThis.$message({
                  message: '恭喜你，删除数据库分组配置成功',
                  type: 'success'
                });
              }else {
                vueThis.$message.error('抱歉，删除数据库分组失败：' + res.data.msg);
                return;
              }
            }).catch(function (err) {
              vueThis.$message.error('抱歉，服务器异常！' );
              return;
            });

          }else{
            if(index == 0 && rows.length == 1 && vueThis.currentPage === 1 && vueThis.dbCfg.length <= vueThis.pageSize){
              rows[index] = {
//                id: null,
                name: '',
                ip: '',
                port: '',
                dbName: '',
                userName: '',
                password: '',
                dbGroup: {}
              }
            }else {
              let totalIndex = vueThis.pageSize *(vueThis.currentPage - 1) + index;
              vueThis.dbCfg.splice(totalIndex, 1);
            }
            }
        },

        save(index, rows){
          let vueThis = this;

          this.testCaseAxios({
            method: 'post',
            data: rows[index],
            url: 'db/addDBCfg'
          }).then(function (res) {
            if(res.data.code === 10000){
//              rows[index] = res.data.data;

              vueThis.$message({
                message: '恭喜你，保存数据库分组配置成功',
                type: 'success'
              });
            }else{
              vueThis.$message({
                message: '抱歉，保存数据库分组配置失败' + res.data.msg,
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
