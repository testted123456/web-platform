<template>
  <el-container id="envSys">
    <el-main>
      <div style="width: 80%;padding-left: 5%;border: 1px">
        <el-row style="text-align: left">
          <el-button type="text" @click="search">按系统查询</el-button>
        </el-row>
        <el-table
          :data="appearENVs"
          stripe
        >
          <el-table-column
            label="环境" align="center"
          >
            <template slot-scope="scope">
              <el-select v-model="appearENVs[scope.$index].env.id" placeholder="请选择">
                <el-option
                  v-for="item in envs"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column
            label="系统"
          >
            <template slot-scope="scope">
              <el-select v-model="appearENVs[scope.$index].systemCfg.id" placeholder="请选择">
                <el-option
                  v-for="item in systems"
                  :key="item.id"
                  :label="item.alias"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column
            label="域名"
          >
            <template slot-scope="scope">
              <el-input v-model="appearENVs[scope.$index].domain"></el-input>
            </template>
          </el-table-column>

          <el-table-column
            label="DNS"
          >
            <template slot-scope="scope">
              <el-input v-model="appearENVs[scope.$index].dns"></el-input>
            </template>
          </el-table-column>

          <el-table-column
            label="" >
            <template slot-scope="scope">
              <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="删除" placement="top">-->
                <el-button @click.native.prevent="del(scope.$index, appearENVs)" type="text" size="small" :disabled='!$store.state.permission.dbgroup.del'>删除</el-button>
              <!--</el-tooltip>-->
              <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="增加" placement="top" v-if="showAdd(scope.$index, appearENVs)">-->
                <el-button @click.native.prevent="addRow(scope.$index, appearENVs)"  type="text" size="small" v-if="showAdd(scope.$index, appearENVs)" :disabled='!$store.state.permission.dbgroup.add'>增加</el-button>
              <!--</el-tooltip>-->
              <!--<el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="保存" placement="top">-->
                <el-button @click.native.prevent="save(scope.$index, appearENVs)" type="text" size="small" :disabled='!$store.state.permission.dbgroup.save'>保存</el-button>
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
          :total="envSysems.length"
        >
        </el-pagination>
      </div>
      <el-dialog
        :visible.sync="delDialogVisible"
        width="420px"
      >
        <span>确认删除？</span>
        <span slot="footer" class="dialog-footer">
                    <el-button class="el-button el-button--default el-button--small" @click="delDialogVisible = false">取 消</el-button>
                    <el-button type="primary" class="el-button el-button--default el-button--small" @click="del">确 定</el-button>
                  </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
  export default{
    name: 'EnvSys',

    data() {
      return {
        envSysems: [],
        envs:[],
        systems:[],
        currentPage: 1,
        pageSize: 10,
        delDialogVisible: false,
        delIndex: '',
        delEnvSys: {}
      }
    },

    computed:{
      appearENVs(){
        var maxIndex = Math.min(this.pageSize *this.currentPage, this.envSysems.length);
        var arr = this.envSysems.slice(this.pageSize *(this.currentPage - 1), maxIndex)
        return arr;
      }
    },

    created(){
      this.init();
    },

    methods: {
      search(){
        this.$prompt(null, '请输入系统名：', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {

          console.log(value)

          this.currentPage = 1;


          let vueThis = this;

          this.testCaseAxios({
            method: 'get',
            url: 'sysEnv/findBySystem?system=' + value
          }).then(function (res) {
            if(res.data.code === 10000){
              vueThis.envSysems = res.data.data;

              if(vueThis.envSysems === null || vueThis.envSysems.length === 0){
                vueThis.envSysems =[{
                  env:{id:''},
                  systemCfg:{id:''},
                  domain: '',
                  dns:''
                }]
              }
            }else{
              vueThis.$message({
                message: '抱歉，获取失败' + res.data.msg,
                type: 'error'
              });
            }
          }).catch(function (err) {
            vueThis.$message.error('服务器请求失败！');
          })
        })},

      init(){
        var vueThis = this;

        this.testCaseAxios({
          method: 'get',
          url: 'sysEnv/getAll'
        }).then(function (res) {
          if(res.data.code === 10000){
            vueThis.envSysems = res.data.data;

            if(vueThis.envSysems === null || vueThis.envSysems.length === 0){
              vueThis.envSysems =[{
                env:{id:''},
                systemCfg:{id:''},
                domain: '',
                dns:''
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
          url: 'envs/getAllEnvs'
        }).then(function (res) {
          if(res.data.code === 10000){
            vueThis.envs = res.data.data;
          }
        });

        this.testCaseAxios({
          method: 'get',
          url: 'sysCfg/getAll'
        }).then(function (res) {
          if(res.data.code === 10000){
            vueThis.systems = res.data.data;
          }
        });
      },

      save(index, rows){
        let vueThis = this;

        this.testCaseAxios({
          method: 'post',
          data: rows[index],
          url: 'sysEnv/add'
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
        if(rows.length == index + 1 && (rows[index].systemCfg != null && rows[index].env != null && rows[index].domain != '' && rows[index].dns != null)){
          return true;
        }else{
          return false;
        }
      },

      //新增消息头一行
      addRow(index, rows){
        if(rows.length == index + 1 && rows[index].name != ''  ){
          rows.push({
            systemCfg : {},
            env : {},
            domain : '',
            dns : ''
          })
          this.envSysems.push(rows[index+1]);
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

        if(typeof(rows[index].id) != 'undefined' ){
          let vueThis = this;

          this.testCaseAxios({
            method: 'get',
            url: 'sysEnv/del?id=' + rows[index].id
          }).then(function (res) {
            if(res.data.code === 10000){

              if(index == 0 && rows.length == 1 && vueThis.currentPage === 1 && vueThis.envSysems.length <= vueThis.pageSize){
                rows[index].systemCfg = {};
                rows[index].env = {};
                rows[index].domain = '';
                rows[index].dns = '';
              }else {
                let totalIndex = vueThis.pageSize *(vueThis.currentPage - 1) + index;
                vueThis.envSysems.splice(totalIndex, 1);
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
          if(index == 0 && rows.length == 1 && this.currentPage === 1 && this.envSysems.length <= this.pageSize){
            rows[index].systemCfg = {};
            rows[index].env = {};
            rows[index].domain = '';
            rows[index].dns = '';
          }else {
            let totalIndex = this.pageSize *(this.currentPage - 1) + index;
            this.envSysems.splice(totalIndex, 1);
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

<style scoped>
  .el-table th{
    text-align: center !important;
  }

</style>
