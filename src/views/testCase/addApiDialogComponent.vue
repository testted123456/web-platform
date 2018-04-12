<template>
  <el-container>
    <el-row >
      <el-col :span="8" style="border:1px solid #ccc">
        <div class="vue-transfer-tree">
          <label class="vue-transfer-label">接口</label>
          <input class="vue-transfer-input" placeholder="输入接口名称搜索"/>
          <el-tree :load="loadNode"
                   lazy
                   ref="tree"
                   :props="defaultProps"
                   @node-click="handleNodeClick">
          </el-tree>
        </div>
      </el-col>
      <el-col :span="2">
        <div style="text-align: center;margin-left: 2px;margin-top: 80%">
          <div><input type="button" value=">" @click="addApi" style="border-radius: 60px;height: 40px;width: 40px"/></div>
        </div>
      </el-col>
      <el-col :span="14" style="border:1px solid #ccc">
        <div class="vue-transfer-tree">
          <label class="vue-transfer-label">已选接口</label>
          <el-table
            :show-header=true
            @row-click="rowClick"
            ref="singleTable"
            highlight-current-row
            :data="tempApis"
            style="width: 100%; margin-top: 2px">
            <el-table-column
              prop="name"
              label="接口名称" min-width="170">
            </el-table-column>
            <el-table-column
              prop="system"
              label="系统">
            </el-table-column>
            <el-table-column
              prop="branch"
              label="分支">
            </el-table-column>
            <el-table-column
              prop="action"
              label="操作">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, tempApis)"
                  type="text"
                  size="small">
                  <i class="el-icon-minus"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>

  export default {
    props: ['selectedApis'],
    components: {},
    name: 'addApiDialogComponent',
    data(){
      return {
        defaultProps:{
          label: 'name',
          isLeaf: 'type',
          children: 'children'
        },
        tempApis:[],
        submitApis:[]
      }
    },

    created(){
      //字符串截取显示
      // submitApis 需要提交的数据
      // tempApis   展示数据


    console.log(this.selectedApis)


      var hhhh = [
        {
        "id": 66,
        "testCase": {
          "id": 114,
          "pId": 113,
          "name": "1GV的水果豆腐干8888发鬼地方个梵蒂冈梵蒂冈的飞",
          "description": null,
          "type": true,
          "env": "SIT",
          "projectName": null,
          "createdBy": null,
          "createdTime": "2018-04-10 15:01:57",
          "updatedBy": null,
          "updatedTime": "2018-04-11 18:56:39",
          "caseType": false,
          "testCaseInterfaces": [{
            "id": 66,
            "interfaceId": 4,
            "interfaceName": "test",
            "apiType": "0",
            "postWay": "1",
            "branch": "dev",
            "system": "acc",
            "orderNo": 0,
            "step": "vccv",
            "urlAddress": "/acc-app/fundtrans/recharge",
            "variables": null,
            "requestHead": null,
            "requestBody": "{\n    \"trdNo\": \"${trdNo}\",\n    \"payNo\": \"${payNo}\",\n    \"amount\": \"${amount}\",\n    \"seqNo\": \"${seqNo}\",\n    \"providerFee\": \"${providerFee}\",\n    \"initiator\": \"05\",\n    \"accountNo\": \"${accountNo}\",\n    \"proofId\": \"${proofId}\",\n    \"userId\": \"${userId}\",\n    \"rechargeType\": \"0\",\n    \"tradeType\": \"recharge\",\n    \"bankCardId\": \"${bankCardId}\"\n}",
            "responseHead": null,
            "responseBody": "{\n    \"errorCode\": \"0000000\",\n    \"errorMessage\": \"处理成功\",\n    \"succeed\": true,\n    \"data\": null\n}",
            "assertions": null,
            "createdBy": null,
            "createdTime": null,
            "updatedBy": null,
            "updatedTime": "2018-04-11 18:56:39",
            "optstatus": 0
          }, {
            "id": 69,
            "interfaceId": 1,
            "interfaceName": "2341",
            "apiType": "0",
            "postWay": "1",
            "branch": "dev1",
            "system": "acc",
            "orderNo": 1,
            "step": "777",
            "urlAddress": "234",
            "variables": null,
            "requestHead": "[{\"Value\":\"sdf\",\"Key\":\"sdf\"}]",
            "requestBody": "{\n    \"a1\": 1\n}",
            "responseHead": "[{\"Value\":\"sd\",\"Key\":\"sd\"}]",
            "responseBody": "{\n    \"ad\": 1\n}",
            "assertions": null,
            "createdBy": null,
            "createdTime": null,
            "updatedBy": null,
            "updatedTime": "2018-04-11 18:56:39",
            "optstatus": 0
          }],
          "optstatus": 0
        },
        "interfaceId": 4,
        "orderNo": 0,
        "step": "vccv",
        "name": "test",
        "apiType": "0",
        "postWay": "1",
        "branch": "dev",
        "system": "acc",
        "urlAddress": "/acc-app/fundtrans/recharge",
        "variables": null,
        "requestHead": null,
        "requestBody": "{\n    \"trdNo\": \"${trdNo}\",\n    \"payNo\": \"${payNo}\",\n    \"amount\": \"${amount}\",\n    \"seqNo\": \"${seqNo}\",\n    \"providerFee\": \"${providerFee}\",\n    \"initiator\": \"05\",\n    \"accountNo\": \"${accountNo}\",\n    \"proofId\": \"${proofId}\",\n    \"userId\": \"${userId}\",\n    \"rechargeType\": \"0\",\n    \"tradeType\": \"recharge\",\n    \"bankCardId\": \"${bankCardId}\"\n}",
        "responseHead": null,
        "responseBody": "{\n    \"errorCode\": \"0000000\",\n    \"errorMessage\": \"处理成功\",\n    \"succeed\": true,\n    \"data\": null\n}",
        "assertions": null,
        "createdBy": null,
        "createdTime": null,
        "updatedBy": null,
        "updatedTime": "2018-04-11 06:56:39",
        "optstatus": 0,
        "checked": true
      },
        {
        "id": 69,
        "testCase": {
          "id": 114,
          "pId": 113,
          "name": "1GV的水果豆腐干8888发鬼地方个梵蒂冈梵蒂冈的飞",
          "description": null,
          "type": true,
          "env": "SIT",
          "projectName": null,
          "createdBy": null,
          "createdTime": "2018-04-10 15:01:57",
          "updatedBy": null,
          "updatedTime": "2018-04-11 18:56:39",
          "caseType": false,
          "testCaseInterfaces": [{
            "id": 66,
            "interfaceId": 4,
            "interfaceName": "test",
            "apiType": "0",
            "postWay": "1",
            "branch": "dev",
            "system": "acc",
            "orderNo": 0,
            "step": "vccv",
            "urlAddress": "/acc-app/fundtrans/recharge",
            "variables": null,
            "requestHead": null,
            "requestBody": "{\n    \"trdNo\": \"${trdNo}\",\n    \"payNo\": \"${payNo}\",\n    \"amount\": \"${amount}\",\n    \"seqNo\": \"${seqNo}\",\n    \"providerFee\": \"${providerFee}\",\n    \"initiator\": \"05\",\n    \"accountNo\": \"${accountNo}\",\n    \"proofId\": \"${proofId}\",\n    \"userId\": \"${userId}\",\n    \"rechargeType\": \"0\",\n    \"tradeType\": \"recharge\",\n    \"bankCardId\": \"${bankCardId}\"\n}",
            "responseHead": null,
            "responseBody": "{\n    \"errorCode\": \"0000000\",\n    \"errorMessage\": \"处理成功\",\n    \"succeed\": true,\n    \"data\": null\n}",
            "assertions": null,
            "createdBy": null,
            "createdTime": null,
            "updatedBy": null,
            "updatedTime": "2018-04-11 18:56:39",
            "optstatus": 0
          }, {
            "id": 69,
            "interfaceId": 1,
            "interfaceName": "2341",
            "apiType": "0",
            "postWay": "1",
            "branch": "dev1",
            "system": "acc",
            "orderNo": 1,
            "step": "777",
            "urlAddress": "234",
            "variables": null,
            "requestHead": "[{\"Value\":\"sdf\",\"Key\":\"sdf\"}]",
            "requestBody": "{\n    \"a1\": 1\n}",
            "responseHead": "[{\"Value\":\"sd\",\"Key\":\"sd\"}]",
            "responseBody": "{\n    \"ad\": 1\n}",
            "assertions": null,
            "createdBy": null,
            "createdTime": null,
            "updatedBy": null,
            "updatedTime": "2018-04-11 18:56:39",
            "optstatus": 0
          }],
          "optstatus": 0
        },
        "interfaceId": 1,
        "orderNo": 1,
        "step": "777",
        "name": "2341",
        "apiType": "0",
        "postWay": "1",
        "branch": "dev1",
        "system": "acc",
        "urlAddress": "234",
        "variables": null,
        "requestHead": [{
          "Value": "sdf",
          "Key": "sdf"
        }],
        "requestBody": "{\n    \"a1\": 1\n}",
        "responseHead": [{
          "Value": "sd",
          "Key": "sd"
        }],
        "responseBody": "{\n    \"ad\": 1\n}",
        "assertions": null,
        "createdBy": null,
        "createdTime": null,
        "updatedBy": null,
        "updatedTime": "2018-04-11 06:56:39",
        "optstatus": 0,
        "checked": true
      }
      ];




      var a = this.selectedApis;
      a = JSON.stringify(a)
      a = JSON.parse(a);

      var b = this.selectedApis;
      b = JSON.stringify(b)
      b = JSON.parse(b);

      this.submitApis= a;
      this.tempApis = b;

      var that = this;
      this.tempApis.forEach(function(val,index,arr){
        if(that.getString(val.name) > 41){
          val.name = val.name.substring(0,20) + '...';
        }
      })



      // console.log(this.getString('测试测试eshi'))

    },

    methods: {
      getString(str){
        return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  //先把中文替换成两个字节的英文，在计算长度
      },
      handleNodeClick(data, node, instance) {
//          console.log('xxx');
      },
      loadNode(node, resolve) {
        if(node.level === 0){
          return resolve([{ name:  'Root', id: 0 , type: false}]);
        }else if(node.isLeaf === true){
          return;
        }else{

          var vueThis = this;
          vueThis.apiAxios({
            method: 'get',
            data: {
            },
            url: "api/getApiTreeByPId?pId=" + node.data.id
          })
          .then(function (res) {
            if(res.data.code === 10000){
              var apiTreeInfo = res.data.data;
              return resolve(res.data.data);
            }
            return;
          })
          .catch(function (err) {
            vueThis.$message.error('抱歉，服务器异常！' );
          });

         // var apiTreeData =  [
//            {
//              "id": 1,
//              "name": "1",
//              "description": "",
//              "pId": 0,
//              "module": "1",
//              "branch": "1",
//              "urlAddress": "1",
//              "apiType": "0",
//              "type": true,
//              "postWay": "1",
//              "requestHead":null,
//              "requestBodyType": "2",
//              "requestBodyRowType": "2",
//              "requestBody": null,
//              "responseHead": null,
//              "responseBodyType": "0",
//              "responseBody": null,
//              "createdBy": "",
//              "createdTime": null,
//              "updatedBy": "",
//              "updatedTime": null,
//              "optstatus": 0,
//              "system": "usr",
//              "variables":[{"varName":'ddd',"varValue":'dsfdsf'}],
//              "assertions":[{actualResult:"${term}",comparator:"=",expectResult:"19"}],
//              "step":'1'
//            }, {
//              "id": 2,
//              "interfaceName": "2",
//              "description": "",
//              "pId": 0,
//              "module": "2",
//              "branch": "2",
//              "urlAddress": "2",
//              "apiType": "0",
//              "type": true,
//              "postWay": "1",
//              "requestHead": null,
//              "requestBodyType": "2",
//              "requestBodyRowType": "2",
//              "requestBody": null,
//              "responseHead": null,
//              "responseBodyType": "0",
//              "responseBody": null,
//              "createdBy": "",
//              "createdTime": null,
//              "updatedBy": "",
//              "updatedTime": null,
//              "optstatus": 0,
//              "system": "trd",
//              "variables":[{"varName":'ddd',"varValue":'dsfdsf'}],
//              "assertions":null,
//              "step":'1'
//            }]
//          var apiTreeInfo = apiTreeData;
//          return resolve(apiTreeInfo);


        }
      },
      addApi(){
        var node = this.$refs.tree.currentNode.node;
        var data = node.data;

        if(node.data.type){

          var newApiData = {
            checked:false,
            id:'',
            testCase:data.testCase,
            interfaceId: data.id,
            apiType: data.apiType,
            postWay: data.postWay,
            orderNo:'',
            step:'',
            name:data.name,
            branch:data.branch,
            system:data.system,
            urlAddress:data.urlAddress,
            variables:null,
            requestHead:data.requestHead,
            requestBody:data.requestBody,
            responseHead:data.responseHead,
            responseBody:data.responseBody,
            assertions:null
          }

          this.submitApis.push(newApiData);

          newApiData = JSON.stringify(newApiData);
          newApiData = JSON.parse(newApiData);

          console.log(this.getString(newApiData.name))

          if(this.getString(newApiData.name) > 41){
            newApiData.name = newApiData.name.substring(0,20) + '...';
          }

          console.log(newApiData.name)

          this.tempApis.push(newApiData);


        }else{
          this.$message({
            message: '文件夹不能添加',
            type: 'error',
            duration:1500
          });

        }
      },
      rowClick(row, event, column){
        this.$refs.singleTable.setCurrentRow(row);
        //  console.log(column)
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
        this.submitApis.splice(index, 1);
      },
      getApis(){
        return this.submitApis.concat();
      },
      resetApis(){
        this.tempApis = this.selectedApis.concat()
      }
    }
  }

</script>

<style scoped>

  .el-row {
    width:100%;
  }
  .el-tree {
    margin-right: 2px;
  }
  .el-input--small{
    margin-left: 2px;
    margin-right:10px;
  }
  .el-input__inner{
    width: 80%;
    padding-right: 0px;
    overflow-x: hidden;
  }
  .vue-transfer-tree {
    /*border: 0.5px solid;*/
    border-radius: 5px;
    min-height: 300px;
    height: 300px;
    margin-left: 2px;
    margin-right: 2px;
    padding-right: 1px;
    overflow-y: auto;
    overflow-x: auto;
  }
  .vue-transfer-label{
    width: 100%;
    background:#f5f7fa;
    display: inline-block;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    min-height: 30px;
    margin-top:1px;
    padding-left: 3px;
    padding-top: 10px;
    font-weight: 500;
  }
  .vue-transfer-input{
    border-radius: 15px;
    margin-left:10%;
    margin-right: 10%;
    width: 80%;
    margin-top: 10px;
    min-height: 32px;
    border-width: 0.5px;
  }

</style>
