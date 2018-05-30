<template>
  <el-container>
    <el-main>
      <div>
        <chart :options="polar.option" @click="quoteClick"></chart>
      </div>
    </el-main>
  </el-container>

</template>

<script>
  import ECharts from 'vue-echarts'

  export default {
    name: 'apiQuote',
    components: {'chart': ECharts},
    data() {

      var option =  {
        title : {
          text: '系统-接口被引用统计',
          x:'center'
        },
        color: ['#539970', '#ff43c5'],

        xAxis: {
          type: "time",  // x轴时间类型<br>        position: "top" // x轴位于上方
        },
        yAxis: {
          type: "category",
          data: ["项目总周期", "阶段一", "阶段二", "阶段三"].reverse()
        },
        series: [
          {
            type: 'bar',
            barWidth: '30',
            barGap: "-10%", // 计划和进度重叠
            stack: "计划",  // 占位条和着色条合并
            itemStyle: {
              normal: {
                opacity: 0 // 不绘制，仅作为占位条
              },
              emphasis: {
                opacity: 0
              }
            },
            data: [
              [new Date(2016,3,1), "项目总周期"],
              [new Date(2016,3,1), "阶段一"],
              [new Date(2016,3,29), "阶段二"],
              [new Date(2016,5,10), "阶段三"]
            ]
          },
          {
            type: 'bar',
            barWidth: '30',
            stack: "计划",
            itemStyle: {
              normal: {
                color: 'red'
              }
            },
            data: [
              [new Date(2016,6,30), "项目总周期"],
              [new Date(2016,3,29), "阶段一"],
              [new Date(2016,5,10), "阶段二"],
              [new Date(2016,6,30), "阶段三"]
            ]
          },
          {
            type: 'bar',
            barWidth: '30',
            stack: "进度",
            itemStyle: {
              normal: {
                opacity: 0
              },
              emphasis: {
                opacity: 0
              }
            },
            data: [
              [new Date(2016,3,1), "项目总周期"],
              [new Date(2016,3,1), "阶段一"],
              [new Date(2016,3,29), "阶段二"],
              [new Date(2016,5,10), "阶段三"]
            ]
          },
          {
            type: 'bar',
            barWidth: '30',
            stack: "进度",
            itemStyle: {
              normal: {
                color: 'green'
              }
            },
            data: [
              [new Date(2016,4,30), "项目总周期"],
              [new Date(2016,3,29), "阶段一"],
              [new Date(2016,4,30), "阶段二"],
              [new Date(2016,5,10), "阶段三"]
            ]
          }
        ]





      }

      return {
        polar: {
          option
        },

      }
    },
    mounted(){
      // this.getData();
      this.sinit()
    },
    methods: {
      sinit(){
        this.polar.option.series[6].data = [0,0,0,0,0,1,0];
        this.polar.option.series[7].data = [0,0,0,0,0,0,2];
      },

      getData(){
        var vueThis = this;
        vueThis.apiAxios({
          method: 'get',
          url: 'statis/statisGroupBySystemRef'
        })
          .then(function (res) {
            if(res.data.code == '10000'){
              vueThis.polar.option.xAxis[0].data = res.data.data.data;
              vueThis.polar.option.series[0].data = res.data.data.refs;
              vueThis.polar.option.series[1].data = res.data.data.unRefs
            }else{
              vueThis.$message.error('抱歉，服务器异常！');
            }
          }).catch(function (err) {
          vueThis.$message.error(err);
        });
      },

      quoteClick(params){
        console.log(params)
        var index = params.dataIndex;
        var type = params.seriesIndex
        console.log(index)
        console.log(type)

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
