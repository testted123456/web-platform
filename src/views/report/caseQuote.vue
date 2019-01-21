<template>
  <el-container>
    <el-main>
      <div>
        <chart :options="sysBar"></chart>
      </div>

    </el-main>
  </el-container>

</template>

<script>
  import ECharts from 'vue-echarts'
  export default {
    name: 'caseQuote',
    components:{'chart': ECharts},
    data () {
      return {
        sysBar:{
          title : {
            text: '用例-测试集引用次数',
            subtext: ''
          },
          color: ['#3398DB'],
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              data : [],
              axisTick: {
                alignWithLabel: true
              },
              axisLabel:{
                interval:0,
                rotate:45,
                margin:2
              }
            }
          ],
          yAxis : [
            {
              type : 'value'
            }
          ]
          ,
          dataZoom: [
            {   // 这个dataZoom组件，默认控制x轴。
              type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
              start: 0,      // 左边在 10% 的位置。
              end: 80         // 右边在 60% 的位置。
            }
          ],
          series : [
            {
              name:'值为',
              type:'bar',
              barWidth: '90%',
              data:[],
              itemStyle:{
                normal:{
                  label:{
                    show:true
                  }
                }
              }
            }
          ]
        },

      }
    },
    mounted(){
      this.getData();
    },
    methods: {


      getData(){ //
        var vueThis = this;
        vueThis.apiAxios({
          method: 'get',
          url: 'statis/caseStatisGroupByRef'
        })
          .then(function (res) {
            if(res.data.code == '10000'){
              vueThis.sysBar.xAxis[0].data = res.data.data.data;
              vueThis.sysBar.series[0].data = res.data.data.series
            }else{
              vueThis.$message.error('抱歉，服务器异常！');
            }
          }).catch(function (err) {
          vueThis.$message.error(err);
        });
      },


    }

  }
</script>


<style scoped>
  .echarts {
    height: 400px;
    width:100%;
  }
</style>
