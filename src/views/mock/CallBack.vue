<template>
  <el-container  id="callBack">
      <el-main >
        <div style="padding-bottom: 60px;">
          <div style="width:80%;text-align: left">
            <el-form    label-width="100px" >

              <el-form-item>
                <el-row>
                  <div style="text-align: center;font-size: large" >{{this.name}}</div>
                </el-row>
              </el-form-item>

              <el-form-item label="回调地址:" prop="name" :rules="[{ required: true, trigger: 'blur',message: '回调地址不能为空'} ]">
                <el-input v-model="callBackUrl" placeholder="请输入回调地址"></el-input>
              </el-form-item>

              <el-form-item label="卡号:" prop="cardNo" v-show="name === '支付回调'">
                <el-select v-model="fastPayOrder.cardNo" placeholder="请选择">
                  <el-option
                    v-for="item in cardNos"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="渠道流水号:" prop="orderNo" v-show="name === '支付回调'">
                <el-select v-model="fastPayOrder.orderNo" placeholder="请选择">
                  <el-option
                    v-for="item in orderNos"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="清算日期:" prop="settleDate" >
                <el-input v-model="fastPayOrder.settleDate" placeholder="请输入清算日期"></el-input>
              </el-form-item>

              <el-form-item label="支付状态码:" prop="returnCode" >
                <el-input v-model="fastPayOrder.returnCode" placeholder="请输入支付状态码"></el-input>
              </el-form-item>

              <el-form-item label="支付描述:" prop="returnMsg" >
                <el-input v-model="fastPayOrder.returnMsg" placeholder="请输入支付描述"></el-input>
              </el-form-item>

              <el-form-item label="支付结果类型:" prop="respType" >
                <el-input v-model="fastPayOrder.respType" placeholder="请输入支付结果类型"></el-input>
              </el-form-item>

              <el-form-item label="支付金额:" prop="tranAmt" >
                <el-input v-model="fastPayOrder.tranAmt" placeholder="请输入支付金额"></el-input>
              </el-form-item>

              <el-form-item label="机构号:" prop="merchId" >
                <el-input v-model="fastPayOrder.merchId" placeholder="请输入机构号"></el-input>
              </el-form-item>

              <el-form-item label="签名值:" prop="sign" >
                <el-input v-model="fastPayOrder.sign" placeholder="请输入签名值, 不填则自动生成"></el-input>
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
  import hdAceRule from '@/components/hd-ace-rule'
  import hdInput from '@/components/ele-extend/hd-input'
  import hdAce from '@/components/hd-ace'
  export default {
    name: 'CallBack',

    data () {
      return {
        cardNos: [],
        orderNos: [],
        orders: {},
        callBackUrl: 'http://192.168.1.17:8282/PayServer/RyxQuickPayCallBack.do',
        fastPayOrder: {
          cardNo: '',
          orderNo: '',
          settleDate: '',
          returnCode: '0000',
          returnMsg: '支付成功',
          respType: 'S',
          tranAmt: '',
          merchId: '1028',
          sign: '',
          tranAmt: ''
        }
      }
    },

    watch:{
      // $route(){
      //   this.getData();
      // },
      'fastPayOrder.cardNo': function (val, oldVal) {
        // this.orderNos = this.orders[val];
        var vueThis = this;
        vueThis.fastPayOrder.orderNo = '';
        vueThis.orders[val].forEach(function (e, index) {
          vueThis.orderNos.push(e['orderNo'])
        })
      },
      'fastPayOrder.orderNo': function (val, oldVal) {
        var vueThis = this;
        if(val != ''){
          vueThis.orders[vueThis.fastPayOrder.cardNo].forEach(function (e, index) {
            if(e['orderNo'] === val){
              vueThis.fastPayOrder.tranAmt = e['tranAmt'];
            }
          });
        }
      }
    },

    mounted() {
      this.getData();
    },

    computed: {
      name: function () {
        if(this.$route.query.name === 'fastPayCallBack'){
          return '支付回调'
        }else{
          return '解绑通知回调'
        }
      }
    },

    methods: {
      getData(){
        let vueThis = this;
        let url = '';

        if(this.name === '支付回调'){
          url = 'fastPay/getCallBack?name=' + 'fastPayCallBack';
        }else{
          url = 'fastPay/getCallBack?name=' + 'unBindCallBack'
        }

        this.fastPayOrder.settleDate = this.getNowFormatDate();

        this.mockAxios({
          method: 'get',
          url: url
        }).then(function (res) {
          if (res.data.code === 10000) {
            vueThis.orders = res.data.data;

            for(var p in vueThis.orders){
              vueThis.cardNos.push(p)
            }

            // vueThis.cardNos =  JSON.parse(res.data.data.cardNos);
          } else {
            vueThis.$message.error('抱歉，获取Mock信息失败：' + res.data.msg);
          }
        }).catch(function (err) {
          vueThis.$message.error('抱歉，服务器异常！');
          console.log(err)
        });
      },

      save(){
        if(this.fastPayOrder.cardNo === ''){
          this.$message.error('请选择银行卡号！');
        }

        let vueThis = this;
        this.mockAxios({
          method: 'post',
          url: 'fastPay/callBack',
          data: {
            "fastPayOrder": JSON.stringify( vueThis.fastPayOrder),
            'url': vueThis.callBackUrl,
            'name': 'fastPayCallBack'
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
      },

       getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = year + month  + strDate;
        return currentdate;
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
