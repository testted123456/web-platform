<template>
    <div style="height:100%;overflow-y: scroll">
        <chart  :options="option"></chart>
        <chart  @click="lineClick" :options="option1"></chart>
        <chart @click="barClick" :options="bar"></chart>
    </div>
</template>

<script>

    import ECharts from 'vue-echarts'

    // import ECharts modules manually to reduce bundle size
    //  import 'echarts/lib/chart/bar'
    //  import 'echarts/lib/component/tooltip'

    export default {
        name: 'welcome',
        components: {'chart': ECharts},
        data() {
            return {
                option: {
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [820, 932, 901, 934, 1290, 1330, 1320],
                        type: 'line',
                        smooth: true
                    }]
                },
                option1: {
                    xAxis: {
                        type: 'category',
                        data: ['Mon1', 'Tue2', 'Wed3', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [820, 932, 901, 934, 12312, 1330, 1320],
                        type: 'line',
                        smooth: true
                    }]
                },
                bar:{
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
                            data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'直接访问',
                            type:'bar',
                            barWidth: '20%',
                            data:[10, 52, 200, 334, 390, 330, 220]
                        }
                    ]
                }
            }
        },
        mounted() {
        },
        methods: {
            barClick(params){
                console.log(params.data)
            },
            lineClick(params){
                console.log(params.data)
            }
        }
    }
</script>


<style scoped>
    .echarts {
        height: 300px;
    }
</style>
