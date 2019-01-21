<template>
  <el-container>
    <el-main>
      <el-table
        :data="resultDetail"
        style="width: 100%"
        v-loading="loading"
        :default-sort = "{prop: 'env', order: 'descending'}">
        <el-table-column
          prop="env"
          label="环境"
          align="left"
          width="180"
          sortable
          :filters="[{text: 'test', value: 'test'},{text:'dev', value: 'dev'}]"
          :filter-method="filterHandler"
        >

        </el-table-column>
        <el-table-column
          prop="name"
          label="任务"
          align="left"
          width="180"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="navigateToJenkins(scope.row.name)" v-bind:class="{ fontRed: scope.row.result=='FAILURE', fontYellow: scope.row.result=='UNSTABLE' }">{{scope.row.name}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="time"
          align="left"
          label="最近执行时间">

        </el-table-column>
        <el-table-column
          prop="result"
          align="left"
          label="结果"
          sortable
        >
          <template slot-scope="scope">
            <el-button type="text" @click="navigateToJenkins(scope.row.name)" v-bind:class="{ fontRed: scope.row.result=='FAILURE', fontYellow: scope.row.result=='UNSTABLE' }">{{scope.row.result}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="resultDetail.length"
      >
      </el-pagination>-->
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
      loading: true
    }
  },

  computed: {
  },

  mounted(){
    this.init()
  },
  methods: {
    init(){
      let vueThis = this;
      this.apiAxios({
        method: 'get',
        url: 'jenkins/getPackageResult'
      }).then(function (res) {
        if(res.data.code === 10000){
          vueThis.resultDetail = res.data.data;
        }
        vueThis.loading = false;
      })
    },

    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },

    navigateToJenkins(name){
      window.open("http://192.168.1.122:8081/jenkins/job/" + name);
    }
  }

}
</script>

<style scoped>
  .fontRed{
    color:red;
  }
  .fontYellow{
    color: yellowgreen;
  }
  .echarts {
    height: 400px;
    width:100%;
  }
</style>
