<template>
  <el-container  id="unBindCallBack">
      <el-main >
        <div style="padding-bottom: 60px;">
          <div style="width:80%;text-align: left">
            <el-form    label-width="100px" >

              <el-form-item>
                <el-row>
                  <div style="text-align: center;font-size: large" >解绑通知回调</div>
                </el-row>
              </el-form-item>

              <el-form-item label="回调地址:" prop="name" :rules="[{ required: true, trigger: 'blur',message: '回调地址不能为空'} ]">
                <el-input v-model="callBackUrl" placeholder="请输入回调地址"></el-input>
              </el-form-item>

              <el-form-item label="手机号:" prop="phoneNo" >
                <el-input v-model="unBindOrder.phone" placeholder="请输入手机号"></el-input>
              </el-form-item>

              <el-form-item label="卡号:" prop="cardNo" >
                <el-input v-model="unBindOrder.card_no" placeholder="请输入卡号"></el-input>
              </el-form-item>

              <el-form-item label="姓名:" prop="cardName" >
                <el-input v-model="unBindOrder.card_name" placeholder="请输入姓名"></el-input>
              </el-form-item>

              <el-form-item label="证件号:" prop="certNo" >
              <el-input v-model="unBindOrder.cert_no" placeholder="请输入姓名"></el-input>
            </el-form-item>

              <el-form-item label="银行名称:" prop="bankName" >
                <el-input v-model="unBindOrder.bank_name" placeholder="请输入银行名称"></el-input>
              </el-form-item>

              <el-form-item label="解绑状态码:" prop="returnCode" >
                <el-input v-model="unBindOrder.return_code" placeholder="请输入解绑状态码"></el-input>
              </el-form-item>

              <el-form-item label="支付描述:" prop="returnMsg" >
                <el-input v-model="unBindOrder.return_msg" placeholder="请输入支付描述"></el-input>
              </el-form-item>

              <el-form-item label="机构号:" prop="merchId" >
                <el-input v-model="unBindOrder.mer_id" placeholder="请输入机构号"></el-input>
              </el-form-item>

              <el-form-item label="签名值:" prop="sign" >
                <el-input v-model="unBindOrder.sign" placeholder="请输入签名值, 不填则自动生成"></el-input>
              </el-form-item>

            </el-form>
          </div>
        </div>
      </el-main>
    <el-footer style="text-align: right;">
      <el-button type="primary" @click="save">确认并回调</el-button>
    </el-footer>
  </el-container>

</template>

<script>
  export default {
    name: 'UnBindCallBack',

    data () {
      return {

        callBackUrl: 'http://192.168.1.17:8282/PayServer/RyxQuickPayCallBack.do',
        unBindOrder: {
          phone: '',
          card_no: '',
          card_name: '',
          cert_no: '',
          bank_name: '',
          return_code: '0000',
          return_msg: '解约成功【通知】',
          mer_id: '1028',
          sign: '',
        }
      }
    },

    methods: {
      save(){
        let vueThis = this;
        this.mockAxios({
          method: 'post',
          url: 'fastPay/callBack',
          data: {
            "unBindOrder": JSON.stringify( vueThis.unBindOrder),
            'url': vueThis.callBackUrl,
            'name': 'unBindCallBack'
          }
        }).then(function (res) {
          if (res.data.code === 10000) {
            vueThis.$message({
              message: '恭喜你，更新Mock接口成功',
              type: 'success'
            });
          } else {
            vueThis.$message.error('抱歉，获取Mock信息失败：' + res.data.msg);
          }
        }).catch(function (err) {
          vueThis.$message.error('抱歉，服务器异常！');
          console.log(err)
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

  .el-table__header {
    width: 100%;
  }
  .el-aside{
    width: 280px !important;
    overflow-x: scroll;
  }
  .el-main {
    padding-right: 15%;
  }
</style>
