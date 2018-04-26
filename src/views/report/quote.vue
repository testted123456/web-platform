<template>
  <el-container>
    <el-main>
      <div>
        <chart :options="polar.option"></chart>
      </div>
    </el-main>
  </el-container>

</template>

<script>
  import ECharts from 'vue-echarts'

  export default {
    name: 'welcome',
    components: {'chart': ECharts},
    data() {
      let data = []
      for (let i = 0; i <= 360; i++) {
        let t = i / 180 * Math.PI
        let r = Math.sin(2 * t) * Math.cos(2 * t)
        data.push([r, i])
      }

      var option =  {
        color: ['#539970', '#ce52b0'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['引用', '未引用']
        },
        toolbox: {
          show: false,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            axisTick: {show: false},
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '引用',
            type: 'bar',
            barGap: 0,
            // label: labelOption,
            data: []
          },
          {
            name: '未引用',
            type: 'bar',
            // label: labelOption,
            data: []
          }

        ]
      }

      return {
        polar: {
          option
        }

      }
    },
    mounted(){
      this.getData();
    },
    methods: {


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
          vueThis.$message.error('抱歉，服务器异常！' );
        });
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
