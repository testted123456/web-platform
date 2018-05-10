<template>
  <el-container>
    <el-main>
      <div>
        <chart :options="sysBar" @click="sysBarClick"></chart>
      </div>
      <div>
        <chart :options="sysBarSystem" @click="sysBarSystemClick" v-if="ifsysBarSystemShow"></chart>
      </div>
      <div>
        <chart :options="lineModule" v-if="iflineModuleShow"></chart>
      </div>
    </el-main>
  </el-container>

</template>

<script>
  import ECharts from 'vue-echarts'
export default {
  name: 'apiSystem',
  components:{'chart': ECharts},
  data () {
    return {
      sysBar:{
        title : {
          text: '系统-接口数',
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
            end: 60         // 右边在 60% 的位置。
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
      //系统
      sysBarSystem:{
        title : {
          text: '模块-接口数',
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
        ],
        dataZoom: [
          {   // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 0,      // 左边在 10% 的位置。
            end: 60         // 右边在 60% 的位置。
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
      //系统 模块
      lineModule: {
        title : {
          text: '分支-接口数',
          subtext: ''
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLabel:{
            interval:0,
            rotate:45,
            margin:2

          }
        },
        yAxis: {
          type: 'value'
        },
        dataZoom: [
          {   // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 0,      // 左边在 10% 的位置。
            end: 60         // 右边在 60% 的位置。
          }
        ],
        series: [{
          name:'值为',
          data: [],
          type: 'line',
          smooth: true,

          itemStyle:{
            normal:{
              color: "#6eaaee", //图标颜色
              label:{
                show:true
              }
            }
          },
          lineStyle:{
            normal:{
              width:6,  //连线粗细
              color: "#6eaaee" , //连线颜色

            }
          },
        }],
        tooltip : {
          enterable:true,
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
      },

      system:[],
      module:[],
      ifsysBarSystemShow:false,
      iflineModuleShow:false
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
        url: 'statis/statisApiBySys'
      })
        .then(function (res) {
          if(res.data.code == '10000'){
            vueThis.sysBar.xAxis[0].data = res.data.data.data;
            vueThis.sysBar.series[0].data = res.data.data.series
          }else{
              vueThis.$message.error('抱歉，服务器异常！');
          }
        }).catch(function (err) {
        vueThis.$message.error('抱歉，服务器异常！' );
      });
    },



    sysBarClick(params){
      console.log(params)
      var index = params.dataIndex;
      this.system = this.sysBar.xAxis[0].data[index]
      console.log(this.system)


      var vueThis = this;
      vueThis.apiAxios({
        method: 'get',
        url: 'statis/statisApiByModule?system='+ vueThis.system
      })
        .then(function (res) {
          if(res.data.code == '10000'){
            vueThis.ifsysBarSystemShow = true;
            vueThis.iflineModuleShow = false;
            vueThis.sysBarSystem.xAxis[0].data = res.data.data.data;
            vueThis.sysBarSystem.series[0].data = res.data.data.series;
          }else{
            vueThis.$message.error('抱歉，服务器异常！');
          }
        }).catch(function (err) {
        vueThis.$message.error('抱歉，服务器异常！' );
      });

    },



    sysBarSystemClick(params){
      console.log(params)
      var index = params.dataIndex;
      this.module = this.sysBarSystem.xAxis[0].data[index]
      console.log(this.module)

      var vueThis = this;
      vueThis.apiAxios({
        method: 'get',
        url: 'statis/statisApiByModuleAndBranch?system='+ vueThis.system +'&module=' + vueThis.module
      })
        .then(function (res) {
          if(res.data.code == '10000'){
            vueThis.iflineModuleShow = true;
            vueThis.lineModule.xAxis.data = res.data.data.data;
            vueThis.lineModule.series[0].data = res.data.data.series;
          }else{
            vueThis.$message.error('抱歉，服务器异常！');
          }
        }).catch(function (err) {
        vueThis.$message.error('抱歉，服务器异常！' );
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
