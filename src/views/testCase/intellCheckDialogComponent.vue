<template>
  <!--名称/参数/描述/实例-->

  <div>
        <el-table
            :data="appearData"
            stripe
            style="width: 100%">
            <el-table-column
                prop="name"
                label="函数名称"
                width="280">
            </el-table-column>

            <el-table-column
                prop="desc"
                label="函数描述">
            </el-table-column>

        </el-table>

        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="intellQuery.length">
        </el-pagination>
    </div>




</template>

<script>

  export default {
    props: ['intellQuery'],
    components: {},
    name: 'intellCheckDialogComponent',
    data(){
        return {
            pageSize:3,
            currentPage: 1
        }
    },
      computed:{
          appearData(){
            var maxIndex = Math.min(this.pageSize *this.currentPage,this.intellQuery.length);
            var arr = this.intellQuery.slice(this.pageSize *(this.currentPage - 1),maxIndex)
              return arr;
          }
    },
    updated(){
        console.log(this.currentPage)
    },
    methods: {
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
    },
      destroyed(){
      console.log("destroyed")
      }
  }

</script>

<style scoped>

</style>
