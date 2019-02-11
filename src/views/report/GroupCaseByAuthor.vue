<template>
  <el-container>
    <el-main>
      <el-table
        :data="appearResultDetail"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="测试集"
          align="left"
          width="180"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="transToCase(scope.row.id)">{{ scope.row.name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdBy"
          label="创建人"
          align="left"
          width="180">
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="left"
          label="最近执行时间">
        </el-table-column>
        <el-table-column
          prop="successSize"
          align="left"
          label="成功">
        </el-table-column>
        <el-table-column
          prop="failSize"
          align="left"
          label="失败">
        </el-table-column>
        <el-table-column
          prop="skipSize"
          align="left"
          label="未执行">
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="resultDetail.length"
      >
      </el-pagination>
    </el-main>
  </el-container>

</template>

<script>
  import ECharts from 'vue-echarts'
export default {
  name: 'groupDetail',
  components:{'chart': ECharts},
  data () {
    return{
      resultDetail: [],
      currentPage: 1,
      pageSize: 10,
    }
  },

  computed: {
    appearResultDetail(){
      var maxIndex = Math.min(this.pageSize * this.currentPage, this.resultDetail.length);
      var arr = this.resultDetail.slice(this.pageSize * (this.currentPage - 1), maxIndex);
      return arr;
    }
  },

  mounted(){
    this.init()
  },
  methods: {
    init(){
      let vueThis = this;
      this.apiAxios({
        method: 'get',
        url: 'statis/groupStatisDetail'
      }).then(function (res) {
        if(res.data.code === 10000){
          vueThis.resultDetail = res.data.data;
        }
      })
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
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

    // 跳转到case页面
    transToCase(id){
      this.$router.push({name: 'Group', query: {id: id}});
    }
  }

}
</script>


<style scoped>
  .echarts {
    height: 400px;
    width:100%;
  }
</style>
