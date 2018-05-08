<template>
  <el-container>
    <el-main>
      <el-row style="text-align: left;padding-left: 7px">
        <el-button type="text" @click="add">新增</el-button>
      </el-row>

      <el-row>
        <el-table
          :data="appearCoverStatis" style="width: 100%"
        >
          <el-table-column
            label="服务器"
            prop="system" align="left"
            >
          </el-table-column>

          <el-table-column
          label="端口"
          prop="branch" align="left"
          >
         </el-table-column>

          <el-table-column
            label="系统"
            prop="branch" align="left"
          >
          </el-table-column>

          <el-table-column
            label="分支"
            prop="branch" align="left"
          >
          </el-table-column>

          <el-table-column
            label="操作" align="left">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="导入" placement="top">
                <el-button @click.native.prevent="syncGit(scope.$index, appearCoverStatis)" type="text" size="small">统计</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="查看HTML" placement="top" >
                <el-button @click.native.prevent="viewHTML(scope.$index, appearCoverStatis)"  type="text" size="small">重置</el-button>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="保存" placement="top">
                <el-button @click.native.prevent="save(scope.$index, appearCoverStatis)" type="text" size="small">查看</el-button>
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
          :total="coverageStatisData.length">
        </el-pagination>
      </el-row>




      <!--增加弹窗-->
      <el-dialog
        :visible.sync="DialogVisible"
        width="68%"
      >
        <el-table
          :data="addData" style="width: 100%"
        >
          <el-table-column
            label="服务器"
            prop="system" align="left"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.system"></el-input>
            </template>
          </el-table-column>

          <el-table-column
            label="端口"
            prop="branch" align="left"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.branch"></el-input>
            </template>
          </el-table-column>

          <el-table-column
            label="系统"
            prop="branch" align="left"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.branch"></el-input>
            </template>
          </el-table-column>

          <el-table-column
            label="分支"
            prop="branch" align="left"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.branch"></el-input>
            </template>
          </el-table-column>


        </el-table>

        <span slot="footer" class="dialog-footer">
                    <el-button @click="DialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addCoverageData">确 定</el-button>
                  </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
  export default{
      name: 'coverageStatistics',
      data() {
          return {
            coverageStatisData:[],
            currentPage: 1,
            pageSize: 10,
            DialogVisible: false,
            addData:[
              {
                'system':'1',
                'branch':'2'

              }
            ]
          }
      },

      computed:{
        appearCoverStatis(){
          var maxIndex = Math.min(this.pageSize *this.currentPage, this.coverageStatisData.length);
          var arr = this.coverageStatisData.slice(this.pageSize *(this.currentPage - 1), maxIndex)
          return arr;
        }
      },

      created(){
        this.getData();
      },

      methods: {
        getData(){
          var vueThis = this;

          this.testCaseAxios({
            method: 'get',
            url: 'sysCfg/getAll'
          }).then(function (res) {
            if(res.data.code === 10000){

            }else{
              vueThis.$message({
                message: '抱歉，获取失败' + res.data.msg,
                type: 'error'
              });
            }
          }).catch(function (err) {
            vueThis.$message.error('服务器请求失败！');
          });


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

        add(){
          this.DialogVisible = true;
        },

        addCoverageData(){
          this.DialogVisible = false;
          console.log(this.addData)
        }

      }
  }
</script>
