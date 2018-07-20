<template>
  <el-container>
      <el-main>
      <div class="welcome">
        欢迎登陆
      </div>
        <el-dialog :title="dialog.title"
                   :visible.sync="dialog.visible"
                   :width="dialog.width"
                   :modal="dialog.modal"
                   :close-on-click-modal="dialog.closeOnClickModal"
                   :show-close="dialog.showClose"
        >
          <el-form :model="form"  ref="form">
            <el-form-item label="初始密码：" :label-width="formLabelWidth"  prop="passwd0" :rules="[{ required: true, message: '初始密码不能为空'} ]">
              <el-input v-model="form.passwd0" type="password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码：" :label-width="formLabelWidth" prop="passwd1"  :rules="[{ required: true, message: '新密码不能为空'} ]">
              <el-input v-model="form.passwd1" type="password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="再次输入：" :label-width="formLabelWidth" prop="passwd2"  :rules="[{ required: true, message: '新密码不能为空'} ]">
              <el-input v-model="form.passwd2" type="password" auto-complete="off" ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelDialog">取 消</el-button>
            <el-button type="primary" @click="submitDialog">确 定</el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>

</template>

<script>
  import  ElDialog from 'element-ui/packages/dialog/src/component'
  import md5 from 'js-md5'
  import store from '@/store';
export default {
  name: 'welcome',
  components:{ElDialog},
  data () {
    return {
      // dialogFormVisible: false,
      formLabelWidth: '100px',
      labelPosition: 'left',
      form: {
        passwd0: '',
        passwd1: '',
        passwd2: ''
      },
      dialog: {
        visible: false,
        title: '首次登陆，请重置密码：',
        width: '35%',
        modal: true,
        closeOnClickModal: false,
        showClose: false
      }
    }
  },

  mounted() {
    let vueThis = this;
    this.usrAxios({
      method: 'get',
      url: '/user/getUserBySession'
    }).then(function (res) {
      if(res.data.code === 10000){
        if( res.data.data.passwodChanged === false){
          vueThis.dialog.visible = true;
        }
      }
    })
  },

  methods: {
    cancelDialog(){
      var vueThis = this;
      vueThis.usrAxios({
        method: 'get',
        url: 'user/logout'
      }).then(function (res) {
        if(res.data.code === 10000){
          vueThis.$router.push({name:'Login'});

        }else {
          vueThis.$message.error('退出失败：' + res.data.msg);

        }
      }).catch(function (err) {
        vueThis.$message.error('抱歉，服务器异常！' );

      });
    },

    resetPasswd(userName, initPasswd, newPasswd){
      let vueThis = this;
      this.usrAxios({
        method: 'post',
        data: {
          'userName': userName,
          'initPasswd': md5(initPasswd),
          'newPasswd': md5(newPasswd)
        },
        url: 'user/resetPasswd'
      }).then(function (res) {
        if(res.data.code == 10000){
          vueThis.$message({
            message: '恭喜你，密码修改成功！',
            type: 'success'
          });
          vueThis.dialog.visible = false;
          if(res.data.data.roles.length == 0){
            vueThis.$message.error('请去联系管理员添加角色');
          }
        }else{
          vueThis.$message.error(res.data.msg);
          return;
        }
      }).catch(function (err) {
        vueThis.$message.error(err);
        return;
      });
    },

    checkInitPasswd(initPasswd){

    },
    submitDialog(){
      console.log(md5(this.form.passwd0))

      var  vueThis = this;
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return false;
        } else {
          if(vueThis.form.passwd1 === vueThis.form.passwd0){
            vueThis.$message.error('抱歉，新旧密码不能相同！');
            return false;
          }
          if(vueThis.form.passwd1 != vueThis.form.passwd2){
            vueThis.$message.error('抱歉，两次输入新密码不相同！');
            return false;
          }

          this.resetPasswd(this.$store.state.permission.userInfo.username, this.form.passwd0, this.form.passwd1)
        }
      })
    }
  }
}
</script>

<style scoped>
    .welcome{
        padding-top:30px;
        font-size:30px;
    }
</style>
