<template>
  <el-container  style="font-size: 0.875em;">
      <el-main v-loading="loading">
        <el-form   ref="groupDir"  :label-position="labelPosition"  label-width="150px" :model="groupDirInfo" style="width:78%;">
          <el-form-item label="测试集目录名称" prop="name" :rules="[{ required: true, trigger: 'blur',message: '测试集目录名称不能为空'} ]">
            <el-input v-model="groupDirInfo.name" placeholder="请输入测试集目录名称"></el-input>
          </el-form-item>
          <el-form-item label="测试集目录描述" prop="description" :rules="[{ required: false, trigger: 'blur',message: '测试集目录描述不能为空'} ]">
            <el-input v-model="groupDirInfo.description" placeholder="请输入测试集目录描述"></el-input>
          </el-form-item>
        </el-form>
      </el-main>
      <el-footer style="text-align: right;">
        <el-button type="primary" @click="saveGroup">确认</el-button>
        <!--<el-button>取消</el-button>-->
      </el-footer>
  </el-container>

</template>

<script>
  export default {
    components: {},
    name: 'GroupDir',
    data () {
      return {
        labelPosition:'right',
        groupDirInfo: {
          id: '',
          name: '',
          description: '',
          pId: '',
          type:0
        },
        loading: true
      }
    },
    watch:{
      $route(){
        this.getData();
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      getData(){
        var groupDirID = this.$route.query.id;
        var vueThis = this;
        if(groupDirID == 0){
            this.groupDirInfo= {
                id: '',
                name: '',
                description: '',
                pId: '',
                type:0
            }
            this.loading=false;
        }else{
          vueThis.groupAxios({
            method: 'get',
            url: 'getById?id='+ groupDirID
          }).then(function (res) {
            if(res.data.code === 10000){
              vueThis.groupDirInfo= {
                id: res.data.data.id,
                name: res.data.data.name,
                description: res.data.data.description,
                pId: res.data.data.pId,
                type:res.data.data.type
              }
            }else{
              vueThis.$message.error('抱歉，获取信息失败：' + res.data.msg);
            }
            vueThis.loading=false
          }).catch(function (err) {
            vueThis.$message.error(err);
            vueThis.loading=false
          });
        }
      },
      saveGroup(){
        var groupDirID = this.$route.query.id;
        this.$refs['groupDir'].validate((valid) => {
          if (valid) {
            if(groupDirID == 0){    /////////////////////////////////新增界面 确认按钮事件
              this.groupDirInfo.pId = this.$route.query.pId;
              this.submitAjax();
            }else{     /////////////////////////编辑界面 确认按钮事件
              this.submitAjax();
            }
          } else {
            return false;
          }
        });
      },
      //确认按钮ajax事件
      submitAjax(){
        var groupDirThis = this;
          groupDirThis.groupAxios({
            method: 'post',
            data: groupDirThis.groupDirInfo,
            url: 'save'
          })
          .then(function (res) {
            if(res.data.code === 10000){
              groupDirThis.$message({
                message: '恭喜你，更新测试集目录成功',
                type: 'success'
              });
              //存数据  树节点刷新
              if(groupDirThis.$route.query.id == 0){
                groupDirThis.$store.commit('changeGroupStatus', 1);
                groupDirThis.groupDirInfo.id = res.data.data.id;
                groupDirThis.$store.commit('setNewGroup', groupDirThis.groupDirInfo);
                groupDirThis.$router.push({name: 'GroupDir', query: {id: res.data.data.id}});
              }else{
                groupDirThis.$store.commit('changeGroupStatus', 2);
                groupDirThis.groupDirInfo = res.data.data;
                groupDirThis.$store.commit('setNewGroup', groupDirThis.groupDirInfo);
              }

            }else{
              groupDirThis.$message.error('抱歉，新增测试集目录失败：' + res.data.msg);
            }
          })
          .catch(function (err) {
            groupDirThis.$message.error(err);
          });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

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
