<template>
  <el-container  id="apiEdit">
      <el-main>
        <div style="padding-bottom: 60px;">
          <div style="width:80%;text-align: left">
            <el-form   ref="api"  :label-position="labelPosition"  label-width="100px" :model="api">
              <el-form-item label="目录名称:" prop="name" :rules="[{ required: true, trigger: 'blur',message: 'API名称不能为空'} ]">
                <el-input v-model="api.name" placeholder="请输入接口目录名称"></el-input>
              </el-form-item>

              <el-form-item label="目录描述:" prop="description" :rules="[{ required: false, trigger: 'blur'} ]">
                <el-input v-model="api.description" placeholder="请输入接口目录描述"></el-input>
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
    name: 'ApiDirNew',
    data () {
      return {
        labelPosition:"right",
        api: {
          id: '',
          name: '',
          description: '',
          pId: '',
          type: true
        }
      }
    },
    methods: {
      saveApi(){
        this.api.pId = this.$route.query.pId;

        let vueThis = this;

        this.apiAxios({
          method: 'post',
          data: api,
          url: "api/addApiDir"
        })
//        this.$http.post(this.apiServer+"api/addApiDir", this.api)
          .then(function (res) {

          if(res.data.code == '10000') {
            vueThis.$message({
              message: '恭喜你，新增接口成功',
              type: 'success'
            });

            vueThis.api.id = res.data.data.id;
            vueThis.api.type = false;
            vueThis.$store.commit('changeApiStatus', 1);
            vueThis.$store.commit('setNewApi', vueThis.api);
            vueThis.$router.push({ name: 'ApiDirEdit', params: { id: vueThis.api.id }});
          }else{
            vueThis.$message.error('抱歉，新增接口失败：' + res.data.msg);
          }
        },function (res) {
            vueThis.$message.error('服务器请求失败！');
        })
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
