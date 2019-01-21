<template>
  <el-container  id="appMockDirEdit">
    <el-main>
      <div style="padding-bottom: 60px;">
        <div style="width:80%;text-align: left">
          <el-form   ref="api"  :label-position="labelPosition"  label-width="100px" :model="api">
            <el-form-item label="目录名称:" prop="name" :rules="[{ required: true, trigger: 'blur',message: '目录名称不能为空'} ]">
              <el-input v-model="api.name" placeholder="请输入目录名称"></el-input>
            </el-form-item>

            <el-form-item label="目录描述:" prop="description" :rules="[{ required: false, trigger: 'blur'} ]">
              <el-input v-model="api.description" placeholder="请输入目录描述"></el-input>
            </el-form-item>

          </el-form>
        </div>
      </div>

    </el-main>
    <el-footer style="text-align: right;">
      <el-button type="primary" @click="saveApi">确认</el-button>
      <el-button>取消</el-button>
    </el-footer>
  </el-container>

</template>

<script>
  export default {
    name: 'AppMockDirEdit',
    data () {
      return {
        labelPosition:"right",
        api: {}
      }
    },

    computed: {
      id: function () {
        return this.$route.params.id;
      }
    },

    created() {
      this.init();
    },

    watch:{
      $route(){
        this.init();
      }
    },

    methods: {
      init(){
        var vueThis = this;

        this.appMockAxios({
          method: 'get',
          url: 'getById?id=' + this.$route.params.id
        }).then(function (res) {
          if(res.data.code === 10000){
            vueThis.api = res.data.data;
          }else {
            vueThis.$message.error('抱歉，获取接口信息失败：' + res.data.msg);
          }
        }).catch(function (err) {
          console.log(err)
          vueThis.$message.error('抱歉，服务器异常！' );
        });
      },

      saveApi(){
        var vueThis = this;

        this.appMockAxios({
          method: 'post',
          data: vueThis.api,
          url: 'update'
        }).then(function (res) {
          if(res.data.code === 10000){
            vueThis.$message({
              message: '恭喜你，更新目录成功',
              type: 'success'
            });

            vueThis.$store.commit('changeAppMockStatus', 2);
            vueThis.$store.commit('setNewAppMock', vueThis.api);
          }else {
            vueThis.$message.error('抱歉，更新目录失败：' + res.data.msg);
          }
        }).catch(function (err) {
            console.log(err)
            vueThis.$message.error('抱歉，服务器异常！' );
        });

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #apiEdit {
    font-size: 0.875em;
  }
  .el-row {
    width: 100%;
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  .el-col {
    text-align: left;
  }
  .el-main {
    padding-right: 20%;
    padding-top: 30px;
  }
  .el-container {
    margin-left: 30px;
    margin-top: 5px;
  }
</style>
