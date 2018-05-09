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
            prop="ip" align="left"
            >
          </el-table-column>

          <el-table-column
          label="端口"
          prop="port" align="left"
          >
         </el-table-column>

          <el-table-column
            label="系统"
            prop="system" align="left"
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
              <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="统计" placement="top">
                <el-button @click.native.prevent="count(scope.$index, scope.row)" type="text" size="small">统计</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="重置" placement="top" >
                <el-button @click.native.prevent="reset(scope.$index, scope.row)"  type="text" size="small">重置</el-button>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="查看" placement="top">
                <el-button @click.native.prevent="view(scope.$index, scope.row)" type="text" size="small">查看</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="删除" placement="top">
                <el-button @click.native.prevent="del(scope.$index, scope.row)" type="text" size="small">删除</el-button>
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
            prop="ip" align="left"
          >
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.ip"></el-input>
            </template>
          </el-table-column>

          <el-table-column
            label="端口"
            prop="port" align="left"
          >
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.port"></el-input>
            </template>
          </el-table-column>

          <el-table-column
            label="系统"
            prop="system" align="left"
          >
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.system"></el-input>
            </template>
          </el-table-column>

          <el-table-column
            label="分支"
            prop="branch" align="left"
          >
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.branch"></el-input>
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
            pageSize: 2,
            DialogVisible: false,
            addData:[
              {
                'ip':'',
                'port':'',
                'system':'',
                'branch':''
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
        // 初始化数据
        getData(){
          var vueThis = this;

          this.testCaseAxios({
            method: 'get',
            url: 'codeCover/getAll'
          }).then(function (res) {
            if(res.data.code === 10000){
              vueThis.coverageStatisData = res.data.data;

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
        // 新增
        addCoverageData(){
          var vueThis = this;
          console.log(this.addData[0].ip)

          if(this.addData[0].ip == "" || this.addData[0].system == "" || this.addData[0].port == "" || this.addData[0].branch == ""){
            vueThis.$message({
              message: '需要全部填写完整',
              type: 'error'
            });
          }else{
            this.testCaseAxios({
              method: 'post',
              data: vueThis.addData[0],
              url: 'codeCover/add'
            }).then(function (res) {
              if(res.data.code === 10000){
                vueThis.DialogVisible = false;
                vueThis.$message.success('添加成功！');
                vueThis.coverageStatisData.push(res.data.data);

              }else{
                vueThis.$message({
                  message: '抱歉，获取失败' + res.data.msg,
                  type: 'error'
                });
              }
            }).catch(function (err) {
              vueThis.$message.error('服务器请求失败！');
            });
          }

        },
        // 删除
        del(index,data){
          var vueThis = this;
          this.testCaseAxios({
            method: 'post',
            data: data,
            url: 'codeCover/delete'
          }).then(function (res) {
            if(res.data.code === 10000){
              vueThis.$message.success('删除成功！');
              // vueThis.appearCoverStatis.splice(index,1);

              for(var i=0;i<vueThis.coverageStatisData.length;i++){
                if(data.id === vueThis.coverageStatisData[i].id){
                  vueThis.coverageStatisData.splice(i,1);
                  console.log(vueThis.coverageStatisData)
               }
              }
            }else{
              vueThis.$message({
                message: '抱歉，删除失败' + res.data.msg,
                type: 'error'
              });
            }
          }).catch(function (err) {
            vueThis.$message.error('服务器请求失败！');
          });
        },
        // 重置
        reset(index,data){

        },
        // 查看
        view(index,data){
          window.open(this.apiServer+'jacocoReport/index.html')
        },
        //统计
        count(index,data){
          var vueThis = this;
          this.apiAxios({
            method: 'get',
            url: 'codeCover/generateReport?system='+data.system+'&branch='+data.branch+'&ip='+data.ip+'&port='+data.port
          }).then(function (res) {
            if(res.data.code === 10000){
              vueThis.$message.success('发送成功！');

            }else{
              vueThis.$message({
                message: '抱歉，删除失败' + res.data.msg,
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
          this.addData=[
            {
              'ip':'',
              'port':'',
              'system':'',
              'branch':''
            }
          ]
        },



      }
  }
</script>
