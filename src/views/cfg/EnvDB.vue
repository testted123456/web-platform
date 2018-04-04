<template>
  <el-container id="envDB">
    <el-main>
      <div style="width: 60%;padding-left: 20%;border: 1px">
      <el-table
        :data="appearENVs"
        stripe
      >
        <el-table-column
          label="环境"
          >
          <template slot-scope="scope">
            <el-input v-model="appearENVs[scope.$index].name"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          label="数据库分组"
        >
          <template slot-scope="scope">
            <el-select v-model="appearENVs[scope.$index].dbGroup.id" placeholder="请选择">
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
          label="" >
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="删除" placement="top">
              <el-button @click.native.prevent="deleteRow(scope.$index, appearENVs)" type="text" size="small"><i class="el-icon-delete"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="增加" placement="top" v-if="showAdd(scope.$index, appearENVs)">
              <el-button @click.native.prevent="addRow(scope.$index, appearENVs)"  type="text" size="small"><i class="el-icon-plus"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="保存" placement="top">
              <el-button @click.native.prevent="save(scope.$index, appearENVs)" type="text" size="small"><i class="el-icon-location-outline"></i></el-button>
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
        :total="envs.length"
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
              envs:[
              ],
              dbGroups:[
              ],
              currentPage: 1,
              pageSize: 1,
              delDialogVisible: false,
              delIndex: '',
              delEnv: {}
          }
      },

      computed:{
        appearENVs(){
          var maxIndex = Math.min(this.pageSize *this.currentPage, this.envs.length);
          var arr = this.envs.slice(this.pageSize *(this.currentPage - 1), maxIndex)
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
            url: 'env/getAllEnvs'
          }).then(function (res) {
              if(res.data.code === 10000){
                vueThis.envs = res.data.data;

                if(vueThis.envs === null || vueThis.envs.length === 0){
                    vueThis.envs =[{
                      name: '',
                      dbGroup:{}
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

        del(){

        },

        //删除消息头中的一行
        deleteRow(index, rows) {
          if(typeof(rows[index].id) != 'undefined' ){
            let vueThis = this;

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
            if(index == 0 && rows.length == 1 && this.currentPage === 1 && this.envs.length <= this.pageSize){
              rows[index].name = '';
              rows[index].dbGroup = {};
            }else {
              let totalIndex = this.pageSize *(this.currentPage - 1) + index;
              this.envs.splice(totalIndex, 1);
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
