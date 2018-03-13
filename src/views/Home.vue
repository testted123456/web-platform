<template>
  <el-container class="wrapper is-vertical">
    <Headernav class="Headernav"></Headernav>
    <router-view></router-view>
  </el-container>

</template>

<script>
    import Headernav from '../components/Headernav'
    export default {
        name: 'HelloWorld',
        components: {Headernav},
        data () {
            return {}
        },
        methods: {

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-container.is-vertical {
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
  }
  .wrapper {
    height: 100%;
  }
</style>
