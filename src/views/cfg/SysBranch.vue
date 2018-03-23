<template>
  <el-container id="gVar">
    <el-main>
      <div>
        <el-table
          :data="appearSysBranch" style="width: 100%"
        >
          <el-table-column
            label="系统名称"
            >
            <template slot-scope="scope">
              <el-input v-model="appearSysBranch[scope.$index].system"></el-input>
            </template>
          </el-table-column>

          <el-table-column
          label="分支"
          >
          <template slot-scope="scope">
            <el-input v-model="appearSysBranch[scope.$index].branch"></el-input>
          </template>
         </el-table-column>

          <el-table-column
            label="版本"
            >
            <template slot-scope="scope">
              <el-input v-model="appearSysBranch[scope.$index].version"></el-input>
            </template>
          </el-table-column>

          <el-table-column
            label="最新？" align="center"
          >
            <template slot-scope="scope">
              <el-checkbox v-model="appearSysBranch[scope.$index].last"></el-checkbox>
            </template>
          </el-table-column>

          <el-table-column
            label="" >
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="删除" placement="top">
                <el-button @click.native.prevent="deleteRow(scope.$index, appearSysBranch)" type="text" size="small"><i class="el-icon-delete"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="增加" placement="top" v-if="showAdd(scope.$index, appearSysBranch)">
                <el-button @click.native.prevent="addRow(scope.$index, appearSysBranch)"  type="text" size="small"><i class="el-icon-plus"></i></el-button>
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
          :total="sysBranch.length">
        </el-pagination>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  export default{
      name: 'SysGit',
      data() {
          return {
            sysBranch:[
                {
                  system:'',
                  branch:'',
                  version:'',
                  last: true
                },
                {
                  system:'',
                  branch:'',
                  version:'',
                  last: true
                }
              ],
              currentPage: 1,
              pageSize: 1
          }
      },

      computed:{
        appearSysBranch(){
          var maxIndex = Math.min(this.pageSize *this.currentPage, this.sysBranch.length);
          var arr = this.sysBranch.slice(this.pageSize *(this.currentPage - 1), maxIndex)
          return arr;
        }
      },

      methods: {
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

        //删除消息头中的一行
        deleteRow(index, rows) {
          if(index == 0 && rows.length == 1){
            rows[index].name = '';
            rows[index].value = '';
            rows[index].description = '';
          }else {
            rows.splice(index, 1);
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
