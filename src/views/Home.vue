<template>
  <div>
    <Headernav class="Headernav"></Headernav>
    <router-view></router-view>
  </div>
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

</style>
