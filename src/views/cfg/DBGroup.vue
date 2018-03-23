<template>
  <el-container id="gVar">
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
            <el-input v-model="dbGroups[scope.$index].name"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          label="" >
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="删除" placement="top">
              <el-button @click.native.prevent="deleteRow(scope.$index, dbGroups)" type="text" size="small"><i class="el-icon-delete"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="增加" placement="top" v-if="showAdd(scope.$index, dbGroups)">
              <el-button @click.native.prevent="addRow(scope.$index, dbGroups)"  type="text" size="small"><i class="el-icon-plus"></i></el-button>
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
              dbGroups:[{
                  name:''
              },
                {
                  name:''
                }],
              currentPage: 1,
              pageSize: 1
          }
      },

      computed:{
        appearDBGroups(){
          var maxIndex = Math.min(this.pageSize *this.currentPage, this.dbGroups.length);
          var arr = this.dbGroups.slice(this.pageSize *(this.currentPage - 1), maxIndex)
          return arr;
        }
      },

      methods: {
        showAdd(index, rows){
          if(rows.length == index + 1 && (rows[index].name != '')){
            return true;
          }else{
            return false;
          }
        },

        //新增消息头一行
        addRow(index, rows){
          if(rows.length == index + 1 && (rows[index].name != '' )){
            rows.push({
              name: ''
            })
          }
        },

        //删除消息头中的一行
        deleteRow(index, rows) {
          if(index == 0 && rows.length == 1){
            rows[index].name = '';
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
