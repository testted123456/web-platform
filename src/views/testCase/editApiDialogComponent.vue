<template>
  <div>
    <el-container style="height:400px;">
      <el-main>
        <el-row>
          <el-col :span="4">
            <label>步骤名称:</label>
          </el-col>
          <el-col :span="16">
            <el-input v-model="tempApiDetailInfo.step"  placeholder="请输入接口名称"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <label>API url:</label>
          </el-col>
          <el-col :span="16">
            <el-input v-model="tempApiDetailInfo.urlAddress"  placeholder="请输入接口url"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <label>API方法:</label>
          </el-col>
          <el-col :span="3">
            <label>{{tempApiDetailInfo.apiType}}</label>
          </el-col>
          <el-col :span="3">
            <label>{{tempApiDetailInfo.postWay}}</label>
          </el-col>
          <el-col :span="3">
            <el-button type="text" @click="intellCheck">动态库查询</el-button>
          </el-col>
        </el-row>
        <el-row>
          <template>
            <el-tabs v-model="apiInCaseTab" @tab-click="handleClick">
              <el-tab-pane label="自定义变量" name="variables">
                <el-table :data="tempApiDetailInfo.variables" >
                  <el-table-column label="Key" class-name="cell-input" >
                    <template slot-scope="scope">
                      <el-input v-model.trim="tempApiDetailInfo.variables[scope.$index].varName"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="Value" class-name="cell-input" >
                    <template slot-scope="scope">
                        <hd-input editorID="variables" v-model = "tempApiDetailInfo.variables[scope.$index].varValue"></hd-input>

                        <!--<el-input v-model.trim="tempApiDetailInfo.variables[scope.$index].varValue"></el-input>-->
                    </template>
                  </el-table-column>

                  <el-table-column class-name="cell-input"  label="" width="120px">
                    <template slot-scope="scope">
                      <el-button @click.native.prevent="addHeadersRow(scope.$index, tempApiDetailInfo.variables, 1)" type="text" size="small"><i class="el-icon-plus"></i></el-button>
                      <el-button @click.native.prevent="deleteHeadersRow(scope.$index, tempApiDetailInfo.variables)" type="text" size="small"><i class="el-icon-delete"></i></el-button>
                      <el-button @click.native.prevent="moveup(scope.$index, scope.row, tempApiDetailInfo.variables)"  type="text" size="small"><i class="el-icon-arrow-up"></i></el-button>
                      <el-button @click.native.prevent="movedown(scope.$index, scope.row, tempApiDetailInfo.variables)" type="text" size="small"><i class="el-icon-arrow-down"></i></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>

              <el-tab-pane label="消息头" name="reqHeaders">
                <el-table :data="tempApiDetailInfo.requestHead">
                  <el-table-column label="Key" class-name="cell-input">
                    <template slot-scope="scope">
                      <el-input v-model="tempApiDetailInfo.requestHead[scope.$index].Key"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="Value" class-name="cell-input">
                    <template slot-scope="scope">
                      <hd-input editorID="reqHeaders" v-model = "tempApiDetailInfo.requestHead[scope.$index].Value"></hd-input>
                      <!--<el-input v-model="tempApiDetailInfo.requestHead[scope.$index].Value"></el-input>-->
                    </template>
                  </el-table-column>

                  <el-table-column class-name="cell-input" label="" width="120px">
                    <template slot-scope="scope">
                      <el-button @click.native.prevent="addHeadersRow(scope.$index, tempApiDetailInfo.requestHead, 2)" type="text" size="small"><i class="el-icon-plus"></i></el-button>
                      <el-button @click.native.prevent="deleteHeadersRow(scope.$index, tempApiDetailInfo.requestHead)" type="text" size="small"><i class="el-icon-delete"></i></el-button>
                      <el-button @click.native.prevent="moveup(scope.$index, scope.row, tempApiDetailInfo.requestHead)"  type="text" size="small"><i class="el-icon-arrow-up"></i></el-button>
                      <el-button @click.native.prevent="movedown(scope.$index, scope.row, tempApiDetailInfo.requestHead)" type="text" size="small"><i class="el-icon-arrow-down"></i></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="消息体" name="reqBody">
                <el-row>
                  <el-col :span="4" style="text-align: right">
                    <el-button size="small" v-if="isJson(tempApiDetailInfo.requestBody)"
                               @click.native.prevent="tempApiDetailInfo.requestBody = formatJson(tempApiDetailInfo.requestBody)"
                               round>格式化Json
                    </el-button>
                    <el-button style="color: red"
                               size="small" v-else
                               disabled
                               round
                    >不是Json格式</el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col>
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 8, maxRows: 20}"
                      placeholder="请输入请求消息体"
                      v-model="tempApiDetailInfo.requestBody"
                    >
                    </el-input>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="响应消息头" name="responseHeaders">
                <el-table :data="tempApiDetailInfo.responseHead">
                  <el-table-column label="Key" class-name="cell-input">
                    <template slot-scope="scope">
                      <el-input v-model="tempApiDetailInfo.responseHead[scope.$index].Key"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="Value" class-name="cell-input">
                    <template slot-scope="scope">
                      <el-input v-model="tempApiDetailInfo.responseHead[scope.$index].Value"></el-input>
                    </template>
                  </el-table-column>

                  <el-table-column class-name="cell-input" label="" width="120px">
                    <template slot-scope="scope">
                      <el-button @click.native.prevent="addHeadersRow(scope.$index, tempApiDetailInfo.requestHead, 3)" type="text" size="small"><i class="el-icon-plus"></i></el-button>
                      <el-button @click.native.prevent="deleteHeadersRow(scope.$index, tempApiDetailInfo.requestHead)" type="text" size="small"><i class="el-icon-delete"></i></el-button>
                      <el-button @click.native.prevent="moveup(scope.$index, scope.row, tempApiDetailInfo.requestHead)"  type="text" size="small"><i class="el-icon-arrow-up"></i></el-button>
                      <el-button @click.native.prevent="movedown(scope.$index, scope.row, tempApiDetailInfo.requestHead)" type="text" size="small"><i class="el-icon-arrow-down"></i></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="预期结果" name="expectResults">
                <el-row>
                  <el-col :span="4" style="text-align: right">
                    <el-button size="small" v-if="isJson(tempApiDetailInfo.responseBody)"
                               @click.native.prevent="tempApiDetailInfo.responseBody = formatJson(tempApiDetailInfo.responseBody)"
                               round>格式化Json
                    </el-button>
                    <el-button style="color: red"
                               size="small" v-else
                               disabled
                               round
                    >不是Json格式</el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col>
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 8, maxRows: 20}"
                      placeholder="请输入响应消息体"
                      v-model="tempApiDetailInfo.responseBody"
                    >
                    </el-input>
                  </el-col>
                </el-row>
              </el-tab-pane>

              <el-tab-pane label="断言" name="assertions">
                <el-table :data="tempApiDetailInfo.assertions">
                  <el-table-column label="预期结果" class-name="cell-input">
                    <template slot-scope="scope">
                      <el-input v-model="tempApiDetailInfo.assertions[scope.$index].actualResult"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="比较符" class-name="cell-input">
                    <template slot-scope="scope">
                      <!--<el-input v-model="tempApiDetailInfo.assertions[scope.$index].comparator"></el-input>-->
                      <el-select v-model="tempApiDetailInfo.assertions[scope.$index].comparator" placeholder="请选择">
                        <el-option
                          v-for="item in comparisonOperator"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="实际结果" class-name="cell-input">
                    <template slot-scope="scope">
                      <el-input v-model="tempApiDetailInfo.assertions[scope.$index].expectResult"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column class-name="cell-input" label="" width="120px">
                    <template slot-scope="scope">
                      <el-button @click.native.prevent="addHeadersRow(scope.$index, tempApiDetailInfo.assertions, 4)" type="text" size="small"><i class="el-icon-plus"></i></el-button>
                      <el-button @click.native.prevent="deleteHeadersRow(scope.$index, tempApiDetailInfo.assertions)" type="text" size="small"><i class="el-icon-delete"></i></el-button>
                      <el-button @click.native.prevent="moveup(scope.$index, scope.row, tempApiDetailInfo.assertions)"  type="text" size="small"><i class="el-icon-arrow-up"></i></el-button>
                      <el-button @click.native.prevent="movedown(scope.$index, scope.row, tempApiDetailInfo.assertions)" type="text" size="small"><i class="el-icon-arrow-down"></i></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </template>
        </el-row>
      </el-main>
    </el-container>
  </div>

</template>


<script>
  import {formatJson, isJson} from "@/assets/js/formatJson.js";
  import hdInput from '@/components/ele-extend/hd-input'

  export default {
    name: 'ApiInCase',
    props: ['testCaseInterface'],
    components: {hdInput},
    data(){
      return {
        'stepName': '',
        'apiUrl': '',
        'reqBody': '',
        'apiInCaseTab': 'variables',
        'comparisonOperator':[
          {
            'label':'请选择',
            'value':''
          },
          {
            'label':'=',
            'value':'='
          },
          {
            'label':'>',
            'value':'>'
          },
          {
            'label':'>=',
            'value':'>='
          },
          {
            'label':'<',
            'value':'<'
          },
          {
            'label':'<=',
            'value':'<='
          },
          {
            'label':'equals',
            'value':'equals'
          },
          {
            'label':'contains',
            'value':'contains'
          },
          {
            'label':'match',
            'value':'match'
          },
          {
            'label':'ignore',
            'value':'ignore'
          }
        ],
        tempApiDetailInfo: {

          step:'',
          urlAddress:'',
          apiType:'',
          postWay:'',
          variables:[
            {
              "varName": "",
              "varValue": ""
            }
          ],
          requestHead:[
            {
              "Key": "",
              "Value": ""
            }
          ],
          requestBody:null,
          responseHead:[
            {
              "Key": "",
              "Value": ""
            }
          ],
          responseBody:null,
          assertions:[
            {
              "actualResult": "",
              "comparator": "",
              "expectResult":""
            }
          ]
        }
      }
    },
    created(){
      var json = JSON.stringify(this.testCaseInterface);
      console.log(json)
      var obj = JSON.parse(json);
      this.updateTempApiDetailInfo(obj)
    },
    destroyed(){
      console.log('api edit dialog destroyed')
    },
    methods: {
      formatJson,
      isJson,
      handleClick(tab, event){
      },
      //动态库查询 点击跳转新页面
      intellCheck(){
        window.open('https://www.baidu.com')
      },

      // tempApiDetailInfo 页面赋值
      updateTempApiDetailInfo(obj){
          this.tempApiDetailInfo = JSON.stringify(obj);
          this.tempApiDetailInfo = JSON.parse(this.tempApiDetailInfo);
          if(this.tempApiDetailInfo.apiType == 0){
            this.tempApiDetailInfo.apiType = 'Http'
          }else if(this.tempApiDetailInfo.apiType == 1){
            this.tempApiDetailInfo.apiType = 'Https'
          }else if(this.tempApiDetailInfo.apiType === 2){
            this.tempApiDetailInfo.apiType = 'MQ'
          }

        if(this.tempApiDetailInfo.postWay == 0){
          this.tempApiDetailInfo.postWay = 'get'
        }else if(this.tempApiDetailInfo.postWay == 1){
          this.tempApiDetailInfo.postWay = 'post'
        }
//        this.tempApiDetailInfo.step = obj.step;
//        this.tempApiDetailInfo.urlAddress = obj.urlAddress;
//        this.tempApiDetailInfo.apiType = obj.apiType;
//        this.tempApiDetailInfo.postWay = obj.postWay;

        //消息体
        if(this.tempApiDetailInfo.requestBody){
            console.log('消息体不为空')
          this.tempApiDetailInfo.requestBody = formatJson(this.tempApiDetailInfo.requestBody);
        }
        //预期结果
        if(this.tempApiDetailInfo.responseBody){
          console.log('预期结果不为空')
          this.tempApiDetailInfo.responseBody = formatJson(this.tempApiDetailInfo.responseBody);
        }
        //自定义变量
        if (this.tempApiDetailInfo.variables === undefined  ||this.tempApiDetailInfo.variables === null) {
          console.log('自定义变量为空')
          this.tempApiDetailInfo.variables = [
              {
                  "varName": "",
                  "varValue":""
              }
          ]
        }
        //消息头
        if (this.tempApiDetailInfo.requestHead === undefined || this.tempApiDetailInfo.requestHead === null) {
          console.log('消息头为空')
            this.tempApiDetailInfo.requestHead = [
              {
                  "Key": "",
                  "Value": ""
              }
          ]
        }
        //响应消息头
        if (this.tempApiDetailInfo.responseHead === undefined || this.tempApiDetailInfo.responseHead === null) {
          console.log('响应消息头为空')
            this.tempApiDetailInfo.responseHead = [
              {
                  "Key": "",
                  "Value": ""
              }
          ]
        }
        //断言
        if (this.tempApiDetailInfo.assertions === undefined || this.tempApiDetailInfo.assertions === null) {
          console.log('断言为空')
            this.tempApiDetailInfo.assertions = [
              {
                  "actualResult": "",
                  "comparator": "",
                  "expectResult":""
              }
          ]
        }
        console.log(JSON.stringify(this.tempApiDetailInfo))
      },

      //确定按钮
      saveApiDetailInfo(){
        var tempThis = this;
        var ifFill = true;

        var ifVariablesNull = false;
        var ifRequestHeadNull = false;
        var ifResponseHeadNull = false;
        var ifAssertionsNull = false;
        var ifResponseBodyNull = false;
        var ifRequestBodyNull = false;

        //判断步骤名称是否为空
        if(this.tempApiDetailInfo.step.trim() === ''){
          ifFill = false;
        }
        //判断API URL是否为空
        if(this.tempApiDetailInfo.urlAddress.trim() === ''){
          ifFill = false;
        }
        //判断消息体是否为空
        if(this.tempApiDetailInfo.requestBody === null){
          ifRequestBodyNull = true;
        }else if(this.tempApiDetailInfo.requestBody.trim() === ''){
          ifRequestBodyNull = true;
        }
        //判断预期结果是否为空
        if(this.tempApiDetailInfo.responseBody === null){
          ifResponseBodyNull = true;
        }else if(this.tempApiDetailInfo.responseBody.trim() === ''){
          ifResponseBodyNull = true;
        }

        //判断 自定义变量 是否为空
        if(this.tempApiDetailInfo.variables.length>1){
          for(var i =0;i<this.tempApiDetailInfo.variables.length;i++){
              if(this.tempApiDetailInfo.variables[i].varName.trim() === '' || this.tempApiDetailInfo.variables[i].varValue.trim() === ''){
              ifFill = false;
            }
          }

        }else if(this.tempApiDetailInfo.variables[0].varName.trim() === '' && this.tempApiDetailInfo.variables[0].varValue.trim() === ''){
          ifVariablesNull = true;
          console.log("自定义变量为空")
        }else if(this.tempApiDetailInfo.variables[0].varName.trim() === '' || this.tempApiDetailInfo.variables[0].varValue.trim() === ''){
          ifFill = false;
        }
          console.log("消息头为空",this.tempApiDetailInfo.requestHead)

        //判断 消息头 是否为空
        if(this.tempApiDetailInfo.requestHead.length>1){
            for(var i =0;i<this.tempApiDetailInfo.requestHead.length;i++){
              if( this.tempApiDetailInfo.requestHead[i].Key.trim() === '' || this.tempApiDetailInfo.requestHead[i].Value.trim() === ''){
              ifFill = false;
            }
          }
        }else if(this.tempApiDetailInfo.requestHead[0].Key.trim() === '' && this.tempApiDetailInfo.requestHead[0].Value.trim() === ''){
          ifRequestHeadNull = true;
          console.log("消息头为空")
        }else if(this.tempApiDetailInfo.requestHead[0].Key.trim() === '' || this.tempApiDetailInfo.requestHead[0].Value.trim() === ''){
            console.log("11")
            ifFill = false;
        }

        //判断 响应消息头 是否为空
        if(this.tempApiDetailInfo.responseHead.length>1){
          for(var i =0;i<this.tempApiDetailInfo.responseHead.length;i++){
            if(this.tempApiDetailInfo.responseHead[i].Key.trim() === '' || this.tempApiDetailInfo.responseHead[i].Value.trim() === ''){
              ifFill = false;
            }
          }
        }else if(this.tempApiDetailInfo.responseHead[0].Key.trim() === '' && this.tempApiDetailInfo.responseHead[0].Value.trim() === ''){
          ifResponseHeadNull = true;
          console.log("响应消息头为空")
        }else if(this.tempApiDetailInfo.responseHead[0].Key.trim() === '' || this.tempApiDetailInfo.responseHead[0].Value.trim() === ''){
          ifFill = false;
        }


        //判断 断言 是否为空
        if(this.tempApiDetailInfo.assertions.length>1){
          for(var i =0;i<this.tempApiDetailInfo.assertions.length;i++){
            if( this.tempApiDetailInfo.assertions[i].actualResult.trim() === '' || this.tempApiDetailInfo.assertions[i].comparator.trim() === '' || this.tempApiDetailInfo.assertions[0].expectResult.trim() === ''){
              ifFill = false;
            }
          }
        }else if(this.tempApiDetailInfo.assertions[0].actualResult.trim() === '' && this.tempApiDetailInfo.assertions[0].comparator.trim() === '' && this.tempApiDetailInfo.assertions[0].expectResult.trim() === ''){
          console.log("断言为空")
          ifAssertionsNull = true;
        }else if(this.tempApiDetailInfo.assertions[0].actualResult.trim() === '' || this.tempApiDetailInfo.assertions[0].comparator.trim() === '' || this.tempApiDetailInfo.assertions[0].expectResult.trim() === ''){
          ifFill = false;
        }


        if(ifFill){
          var json = JSON.stringify(this.tempApiDetailInfo);
          var obj = JSON.parse(json)

          if(ifVariablesNull){
            obj.variables = null
          }
          if(ifRequestHeadNull){
            obj.requestHead = null
          }
          if(ifResponseHeadNull){
            obj.responseHead = null
          }
          if(ifAssertionsNull){
            obj.assertions = null
          }
          if(ifRequestBodyNull){
            obj.requestBody = null
          }
          if(ifResponseBodyNull){
            obj.responseBody = null
          }
          console.log(obj)
          return obj;
        }else{
          this.$message.error('接口信息漏填');
          return false;
        }
      },
      //取消按钮
      cancelSaveInfo(){
//                var json = JSON.stringify(this.testCaseInterface);
//                var obj = JSON.parse(json)
//                this.apiInCaseTab = 'variables'
//                this.updateTempApiDetailInfo(obj)
      },

      //增加
      addHeadersRow(index, rows,type){
        var obj1 = {
          varValue:'',
          varName:''
        }
        var obj2 = {
          Key:'',
          Value:''
        }
        var obj3 = {
          actualResult:'',
          comparator:'',
          expectResult:''
        }
        if(type === 1) {
          this.tempApiDetailInfo.variables.splice(index+1, 0, obj1);
        }else if(type === 2){
          this.tempApiDetailInfo.requestHead.splice(index+1, 0, obj2);
        }else if(type === 3){
          this.tempApiDetailInfo.responseHead.splice(index+1, 0, obj2);
        }else if(type === 4){
          this.tempApiDetailInfo.assertions.splice(index+1, 0, obj3);
        }
      },
      //删除消息头中的一行
      deleteHeadersRow(index, rows) {
        if (index == 0 && rows.length == 1) {
          return;
        } else {
          rows.splice(index, 1);
        }
      },
      //上移
      moveup(index, row, rows){
        if (index > 0) {
          let upRow = rows[index - 1]
          rows.splice(index - 1, 1);
          rows.splice(index, 0, upRow);
        }
      },
      //下移
      movedown(index, row, rows){
        if ((index + 1) != rows.length) {
          let downRow = rows[index + 1]
          rows.splice(index + 1, 1);
          rows.splice(index, 0, downRow);
        }
      }

    }
  }

</script>

<style scoped>

  .el-col {
    text-align: left;
  }
  .el-row {
    margin-top: 10px;
  }
</style>
