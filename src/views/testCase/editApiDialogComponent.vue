<template>
  <div>
    <el-container style="height:400px;">
      <el-main>
        <el-row>
          <el-col :span="4">
            <label>步骤名称:</label>
          </el-col>
          <el-col :span="16">
            <el-input v-model.trim="tempApiDetailInfo.step" placeholder="请输入接口名称"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <label>API url:</label>
          </el-col>
          <el-col :span="16">
            <el-input v-model.trim="tempApiDetailInfo.urlAddress" placeholder="请输入接口url"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <label>API方法:</label>
          </el-col>
          <el-col :span="3">
            <label>{{tempApiDetailInfo.apiType}}</label>
          </el-col>
          <el-col :span="3" v-if="!ifMQ">
            <label>{{tempApiDetailInfo.postWay}}</label>
          </el-col>
          <el-col :span="3">
            <el-button type="text" @click="intellCheck">动态库查询</el-button>
          </el-col>
        </el-row>
        <el-row>
          <template>
            <el-tabs v-model="apiInCaseTab" @tab-click="handleClick" v-if="!ifMQ">
              <el-tab-pane label="自定义变量" name="variables" >
                <el-table :data="tempApiDetailInfo.variables" v-if="activeIndex == 0">
                  <el-table-column label="Key" class-name="cell-input">
                    <template slot-scope="scope">
                      <el-input
                        v-model.trim="tempApiDetailInfo.variables[scope.$index].varName" @blur="saveAceVarName"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="Value" class-name="cell-input">
                    <template slot-scope="scope">
                      <hd-input :editorID="'variables'+ scope.$index"
                                v-model.trim="tempApiDetailInfo.variables[scope.$index].varValue"></hd-input>

                      <!--<el-input v-model.trim="tempApiDetailInfo.variables[scope.$index].varValue"></el-input>-->
                    </template>
                  </el-table-column>
                  <el-table-column class-name="cell-input" label="" width="120px">
                    <template slot-scope="scope">
                      <el-button
                        @click.native.prevent="addHeadersRow(scope.$index, tempApiDetailInfo.variables, 1)"
                        type="text" size="small"><i class="el-icon-plus"></i></el-button>
                      <el-button
                        @click.native.prevent="deleteHeadersRow(scope.$index, tempApiDetailInfo.variables)"
                        type="text" size="small"><i class="el-icon-delete"></i></el-button>
                      <el-button
                        @click.native.prevent="moveup(scope.$index, scope.row, tempApiDetailInfo.variables)"
                        type="text" size="small"><i class="el-icon-arrow-up"></i></el-button>
                      <el-button
                        @click.native.prevent="movedown(scope.$index, scope.row, tempApiDetailInfo.variables)"
                        type="text" size="small"><i class="el-icon-arrow-down"></i></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="消息头" name="reqHeaders" >
                <el-table :data="tempApiDetailInfo.requestHead" v-if="activeIndex == 1 ">
                  <el-table-column label="Key" class-name="cell-input">
                    <template slot-scope="scope">
                      <el-input
                        v-model.trim="tempApiDetailInfo.requestHead[scope.$index].Key"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="Value" class-name="cell-input">
                    <template slot-scope="scope">
                      <el-input
                        v-model.trim="tempApiDetailInfo.requestHead[scope.$index].Value"></el-input>
                    </template>
                  </el-table-column>

                  <el-table-column class-name="cell-input" label="" width="120px">
                    <template slot-scope="scope">
                      <el-button
                        @click.native.prevent="addHeadersRow(scope.$index, tempApiDetailInfo.requestHead, 2)"
                        type="text" size="small"><i class="el-icon-plus"></i></el-button>
                      <el-button
                        @click.native.prevent="deleteHeadersRow(scope.$index, tempApiDetailInfo.requestHead)"
                        type="text" size="small"><i class="el-icon-delete"></i></el-button>
                      <el-button
                        @click.native.prevent="moveup(scope.$index, scope.row, tempApiDetailInfo.requestHead)"
                        type="text" size="small"><i class="el-icon-arrow-up"></i></el-button>
                      <el-button
                        @click.native.prevent="movedown(scope.$index, scope.row, tempApiDetailInfo.requestHead)"
                        type="text" size="small"><i class="el-icon-arrow-down"></i></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="消息体" name="reqBody">
                <el-row v-if="activeIndex == 2 ">
                  <el-col>
                    <el-button size="small" v-if="isJson(tempApiDetailInfo.requestBody)"
                               @click.native.prevent="formatRequsetJSON()"
                               round>格式化Json
                    </el-button>
                    <el-button style="color: red"
                               size="small" v-else
                               disabled
                               round
                    >不是Json格式
                    </el-button>

                    <el-button size="small" @click.native.prevent="resetReqBody()" round>清空value</el-button>
                    <el-button size="small" @click.native.prevent="changeReqBody()" round>参数化</el-button>


                  </el-col>
                </el-row>

                <el-row>
                  <el-col>
                    <!--<el-input-->
                    <!--type="textarea"-->
                    <!--:autosize="{ minRows: 8, maxRows: 20}"-->
                    <!--placeholder="请输入请求消息体"-->
                    <!--v-model="tempApiDetailInfo.requestBody"-->
                    <!--&gt;-->
                    <!--</el-input>-->
                    <div style="border: 1px solid #cccccc; padding-top: 10px">
                      <hd-ace ref="reqBody" style="width: 100%;height: 200px" editorID="reqBody" @aceTextChange="reqBodyTextChange" :value="tempApiDetailInfo.requestBody"></hd-ace>
                    </div>
                    <!--<div id="reqBody" style="width:96%;height:300px;border:1px solid #ccc;"></div>-->
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="响应消息头" name="responseHeaders" >
                <el-table :data="tempApiDetailInfo.responseHead" v-if="activeIndex == 3 ">
                  <el-table-column label="Key" class-name="cell-input">
                    <template slot-scope="scope">
                      <el-input
                        v-model.trim="tempApiDetailInfo.responseHead[scope.$index].Key"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="Value" class-name="cell-input">
                    <template slot-scope="scope">
                      <el-input
                        v-model.trim="tempApiDetailInfo.responseHead[scope.$index].Value"></el-input>
                    </template>
                  </el-table-column>

                  <el-table-column class-name="cell-input" label="" width="120px">
                    <template slot-scope="scope">
                      <el-button
                        @click.native.prevent="addHeadersRow(scope.$index, tempApiDetailInfo.responseHead, 3)"
                        type="text" size="small"><i class="el-icon-plus"></i></el-button>
                      <el-button
                        @click.native.prevent="deleteHeadersRow(scope.$index, tempApiDetailInfo.responseHead)"
                        type="text" size="small"><i class="el-icon-delete"></i></el-button>
                      <el-button
                        @click.native.prevent="moveup(scope.$index, scope.row, tempApiDetailInfo.responseHead)"
                        type="text" size="small"><i class="el-icon-arrow-up"></i></el-button>
                      <el-button
                        @click.native.prevent="movedown(scope.$index, scope.row, tempApiDetailInfo.responseHead)"
                        type="text" size="small"><i class="el-icon-arrow-down"></i></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="预期结果" name="expectResults"  >
                <el-row v-if="activeIndex == 4 ">
                  <el-col :span="4" style="text-align: right">
                    <el-button size="small" v-if="isJson(tempApiDetailInfo.responseBody)"
                               @click.native.prevent="formatResponseJSON()"
                               round>格式化Json
                    </el-button>
                    <el-button style="color: red"
                               size="small" v-else
                               disabled
                               round
                    >不是Json格式
                    </el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col>
                    <!--<div id="expectResults"-->
                    <!--style="width:96%;height:300px;border:1px solid #ccc;"></div>-->

                    <div style="border: 1px solid #cccccc; padding-top: 10px">
                      <hd-ace  ref="expectResults" style="width: 100%;height: 200px" editorID="expectResults" @aceTextChange="resBodyTextChange" :value="tempApiDetailInfo.responseBody"></hd-ace>
                    </div>
                    <!--<el-input-->
                    <!--type="textarea"-->
                    <!--:autosize="{ minRows: 8, maxRows: 20}"-->
                    <!--placeholder="请输入响应消息体"-->
                    <!--v-model="tempApiDetailInfo.responseBody"-->
                    <!--&gt;-->
                    <!--</el-input>-->
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="断言" name="assertions">
                <el-table :data="tempApiDetailInfo.assertions" v-if="activeIndex == 5 ">
                  <el-table-column label="预期结果" class-name="cell-input">
                    <template slot-scope="scope">
                      <hd-input editorID="actualResult"
                                v-model.trim="tempApiDetailInfo.assertions[scope.$index].actualResult"></hd-input>
                      <!--<el-input v-model="tempApiDetailInfo.assertions[scope.$index].actualResult"></el-input>-->
                    </template>
                  </el-table-column>
                  <el-table-column label="比较符" class-name="cell-input">
                    <template slot-scope="scope">
                      <!--<el-input v-model="tempApiDetailInfo.assertions[scope.$index].comparator"></el-input>-->
                      <el-select v-model.trim="tempApiDetailInfo.assertions[scope.$index].comparator"
                                 placeholder="请选择">
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
                      <hd-input editorID="expectResult"
                                v-model.trim="tempApiDetailInfo.assertions[scope.$index].expectResult"></hd-input>
                      <!--<el-input v-model="tempApiDetailInfo.assertions[scope.$index].expectResult"></el-input>-->
                    </template>
                  </el-table-column>
                  <el-table-column class-name="cell-input" label="" width="120px">
                    <template slot-scope="scope">
                      <el-button
                        @click.native.prevent="addHeadersRow(scope.$index, tempApiDetailInfo.assertions, 4)"
                        type="text" size="small"><i class="el-icon-plus"></i></el-button>
                      <el-button
                        @click.native.prevent="deleteHeadersRow(scope.$index, tempApiDetailInfo.assertions)"
                        type="text" size="small"><i class="el-icon-delete"></i></el-button>
                      <el-button
                        @click.native.prevent="moveup(scope.$index, scope.row, tempApiDetailInfo.assertions)"
                        type="text" size="small"><i class="el-icon-arrow-up"></i></el-button>
                      <el-button
                        @click.native.prevent="movedown(scope.$index, scope.row, tempApiDetailInfo.assertions)"
                        type="text" size="small"><i class="el-icon-arrow-down"></i></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>

            <div v-if="ifMQ">
              <el-row>
                <el-col>
                  <el-button size="small" v-if="isJson(tempApiDetailInfo.requestBody)"
                             @click.native.prevent="formatRequsetJSON()"
                             round>格式化Json
                  </el-button>
                  <el-button style="color: red"
                             size="small" v-else
                             disabled
                             round
                  >不是Json格式
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <div style="border: 1px solid #cccccc; padding-top: 10px">
                  <hd-ace ref="reqBody" style="width: 100%;height: 200px" editorID="reqBody" @aceTextChange="reqBodyTextChange" :value="tempApiDetailInfo.requestBody"></hd-ace>
                </div>
              </el-row>
            </div>

          </template>
        </el-row>
      </el-main>
    </el-container>
  </div>

</template>


<script>
  import { formatJson, isJson } from "@/assets/js/formatJson.js";
  import hdInput from '@/components/ele-extend/hd-input'
  import hdAce from '@/components/hd-ace'

  export default {
    name: 'ApiInCase',
    props: ['testCaseInterface'],
    components: {hdInput,hdAce},
    data(){
      return {
        ifMQ:false,
        activeIndex:0,
        'stepName': '',
        'apiUrl': '',
        'reqBody': '',
        'apiInCaseTab': 'variables',
        'comparisonOperator': [
          {
            'label': '请选择',
            'value': ''
          },
          {
            'label': '=',
            'value': '='
          },
          {
            'label': '>',
            'value': '>'
          },
          {
            'label': '>=',
            'value': '>='
          },
          {
            'label': '<',
            'value': '<'
          },
          {
            'label': '<=',
            'value': '<='
          },
          {
            'label': 'equals',
            'value': 'equals'
          },
          {
            'label': 'contains',
            'value': 'contains'
          },
          {
            'label': 'match',
            'value': 'match'
          },
          {
            'label': 'ignore',
            'value': 'ignore'
          }
        ],
        tempApiDetailInfo: {

          step: '',
          urlAddress: '',
          apiType: '',
          postWay: '',
          variables: [
            {
              "varName": "",
              "varValue": ""
            }
          ],
          requestHead: [
            {
              "Key": "",
              "Value": ""
            }
          ],
          requestBody: null,
          responseHead: [
            {
              "Key": "",
              "Value": ""
            }
          ],
          responseBody: null,
          assertions: [
            {
              "actualResult": "",
              "comparator": "",
              "expectResult": ""
            }
          ]
        },
        reqBodyEditor: null,
        expectResultsEditor: null,
        ifFill:true,
        ifVariablesNull:false,
        ifRequestHeadNull:false,
        ifResponseHeadNull:false,
        ifAssertionsNull:false,
        ifResponseBodyNull:false,
        ifRequestBodyNull:false
      }
    },
    created(){
      var json = JSON.stringify(this.testCaseInterface);
      console.log(json)
      var obj = JSON.parse(json);
      this.updateTempApiDetailInfo(obj)
    },
    mounted(){

    },
    destroyed(){
    },
    methods: {
      formatJson,
      isJson,
      //动态库查询 点击跳转新页面
      intellCheck(){
        window.open('http://'+this.testCaseServer +'/func/index.html')
      },
      // tempApiDetailInfo 页面赋值
      updateTempApiDetailInfo(obj){
        this.tempApiDetailInfo = JSON.stringify(obj);
        this.tempApiDetailInfo = JSON.parse(this.tempApiDetailInfo);
        if (this.tempApiDetailInfo.apiType == 0) {
          this.tempApiDetailInfo.apiType = 'Http';
          this.ifMQ = false;
        } else if (this.tempApiDetailInfo.apiType == 1) {
          this.tempApiDetailInfo.apiType = 'Https';
          this.ifMQ = false;
        } else if (this.tempApiDetailInfo.apiType == 2) {
          this.tempApiDetailInfo.apiType = 'MQ';
          this.ifMQ = true;
        }


        if (this.tempApiDetailInfo.postWay == 0) {
          this.tempApiDetailInfo.postWay = 'get'
        } else if (this.tempApiDetailInfo.postWay == 1) {
          this.tempApiDetailInfo.postWay = 'post'
        }

        //消息体
        if (this.tempApiDetailInfo.requestBody) {
          console.log('消息体不为空',this.tempApiDetailInfo.requestBody)
          this.tempApiDetailInfo.requestBody = formatJson(this.tempApiDetailInfo.requestBody);
        }
        //预期结果
        if (this.tempApiDetailInfo.responseBody) {
          console.log('预期结果不为空',this.tempApiDetailInfo.requestBody)
          this.tempApiDetailInfo.responseBody = formatJson(this.tempApiDetailInfo.responseBody);
        }
        //自定义变量
        if (this.tempApiDetailInfo.variables === undefined || this.tempApiDetailInfo.variables === null) {
          console.log('自定义变量为空')
          this.tempApiDetailInfo.variables = [
            {
              "varName": "",
              "varValue": ""
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
              "expectResult": ""
            }
          ]
        }
      },
      //判断接口信息填写是否有空
      checkEmpty(){
        this.ifFill = true;
        this.ifVariablesNull=false;
        this.ifRequestHeadNull=false;
        this.ifResponseHeadNull=false;
        this.ifAssertionsNull=false;
        this.ifResponseBodyNull=false;
        this.ifRequestBodyNull=false;
        var tip = '';
        //判断步骤名称是否为空
        if (this.tempApiDetailInfo.step === '') {
          this.ifFill = false;
          tip = '必填项 步骤名称为空';
          return tip;
        }
        //判断API URL是否为空
        if (this.tempApiDetailInfo.urlAddress === '') {
          this.ifFill = false;
          tip = '必填项 API URL为空';
          return tip;
        }
        //判断消息体是否为空
        if (this.tempApiDetailInfo.requestBody === null) {
          this.ifRequestBodyNull = true;
        } else if (this.tempApiDetailInfo.requestBody === '') {
          this.ifRequestBodyNull = true;
        }else if(!isJson(this.tempApiDetailInfo.requestBody)){
          this.ifFill = false;
          tip = '消息体不是json格式 请修改';
          return tip;
        }
        //判断预期结果是否为空
        if (this.tempApiDetailInfo.responseBody === null) {
          this.ifResponseBodyNull = true;
        } else if (this.tempApiDetailInfo.responseBody === '') {
          this.ifResponseBodyNull = true;
        }else if (!isJson(this.tempApiDetailInfo.responseBody)) {
          this.ifFill = false;
          tip = '预期结果不是json格式 请修改';
          return tip;
        }

        //判断 自定义变量 是否为空
        if (this.tempApiDetailInfo.variables.length > 1) {
          for (var i = 0; i < this.tempApiDetailInfo.variables.length; i++) {
            if (this.tempApiDetailInfo.variables[i].varName === '' || this.tempApiDetailInfo.variables[i].varValue === '') {
              this.ifFill = false;
              tip = '自定义变量某个选项为空 需要填写';
              return tip;
            }
          }

        } else if (this.tempApiDetailInfo.variables[0].varName === '' && this.tempApiDetailInfo.variables[0].varValue === '') {
          this.ifVariablesNull = true;
          console.log("自定义变量为空")
        } else if (this.tempApiDetailInfo.variables[0].varName === '' || this.tempApiDetailInfo.variables[0].varValue === '') {
          this.ifFill = false;
          tip = '自定义变量某个选项为空 需要填写';
          return tip;
        }

        //判断 消息头 是否为空
        if (this.tempApiDetailInfo.requestHead.length > 1) {
          for (var i = 0; i < this.tempApiDetailInfo.requestHead.length; i++) {
            if (this.tempApiDetailInfo.requestHead[i].Key === '' || this.tempApiDetailInfo.requestHead[i].Value === '') {
              this.ifFill = false;
              tip = '消息头某个选项为空 需要填写';
              return tip;
            }
          }
        } else if (this.tempApiDetailInfo.requestHead[0].Key === '' && this.tempApiDetailInfo.requestHead[0].Value === '') {
          this.ifRequestHeadNull = true;
          console.log("消息头为空")
        } else if (this.tempApiDetailInfo.requestHead[0].Key === '' || this.tempApiDetailInfo.requestHead[0].Value === '') {
          this.ifFill = false;
          tip = '消息头某个选项为空 需要填写';
          return tip;
        }

        //判断 响应消息头 是否为空
        if (this.tempApiDetailInfo.responseHead.length > 1) {
          for (var i = 0; i < this.tempApiDetailInfo.responseHead.length; i++) {
            if (this.tempApiDetailInfo.responseHead[i].Key === '' || this.tempApiDetailInfo.responseHead[i].Value === '') {
              this.ifFill = false;
              tip = '响应消息头 某个选项为空 需要填写';
              return tip;
            }
          }
        } else if (this.tempApiDetailInfo.responseHead[0].Key === '' && this.tempApiDetailInfo.responseHead[0].Value === '') {
          this.ifResponseHeadNull = true;
          console.log("响应消息头为空")
        } else if (this.tempApiDetailInfo.responseHead[0].Key === '' || this.tempApiDetailInfo.responseHead[0].Value === '') {
          this.ifFill = false;
          tip = '响应消息头 某个选项为空 需要填写';
          return tip;
        }

        //判断 断言 是否为空
        if (this.tempApiDetailInfo.assertions.length > 1) {
          for (var i = 0; i < this.tempApiDetailInfo.assertions.length; i++) {
            if (this.tempApiDetailInfo.assertions[i].actualResult === '' || this.tempApiDetailInfo.assertions[i].comparator === '' || this.tempApiDetailInfo.assertions[0].expectResult === '') {
              this.ifFill = false;
              tip = '断言 某个选项为空 需要填写';
              return tip;
            }
          }
        } else if (this.tempApiDetailInfo.assertions[0].actualResult === '' && this.tempApiDetailInfo.assertions[0].comparator === '' && this.tempApiDetailInfo.assertions[0].expectResult === '') {
          console.log("断言为空")
          this.ifAssertionsNull = true;
        } else if (this.tempApiDetailInfo.assertions[0].actualResult === '' || this.tempApiDetailInfo.assertions[0].comparator === '' || this.tempApiDetailInfo.assertions[0].expectResult === '') {
          this.ifFill = false;
          tip = '断言 某个选项为空 需要填写';
          return tip;
        }
      },
      //确定按钮
      saveApiDetailInfo(){

        var tip = this.checkEmpty();
        console.log(this.ifFill);
        if(!this.ifFill){
          this.$message.error(tip);
        }else if (this.ifFill) {
          var json = JSON.stringify(this.tempApiDetailInfo);
          var obj = JSON.parse(json);

          if (this.ifVariablesNull) {
            obj.variables = null
          }
          if (this.ifRequestHeadNull) {
            obj.requestHead = null
          }
          if (this.ifResponseHeadNull) {
            obj.responseHead = null
          }
          if (this.ifAssertionsNull) {
            obj.assertions = null
          }
          if (this.ifRequestBodyNull) {
            obj.requestBody = null
          }
          if (this.ifResponseBodyNull) {
            obj.responseBody = null
          }
          console.log(obj)

          if (obj.apiType == 'Http') {
            obj.apiType = '0';
          } else if (obj.apiType == 'Https') {
            obj.apiType = '1';
          } else if (obj.apiType == 'MQ') {
            obj.apiType = '2';
          }


          if (obj.postWay == 'get') {
              obj.postWay = '0';
          } else if (obj.postWay == 'post') {
            obj.postWay = '1';
          }

          return obj;
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
      addHeadersRow(index, rows, type){
        var obj1 = {
          varValue: '',
          varName: ''
        }
        var obj2 = {
          Key: '',
          Value: ''
        }
        var obj3 = {
          actualResult: '',
          comparator: '',
          expectResult: ''
        }
        if (type === 1) {
          this.tempApiDetailInfo.variables.splice(index + 1, 0, obj1);
        } else if (type === 2) {
          this.tempApiDetailInfo.requestHead.splice(index + 1, 0, obj2);
        } else if (type === 3) {
          this.tempApiDetailInfo.responseHead.splice(index + 1, 0, obj2);
        } else if (type === 4) {
          this.tempApiDetailInfo.assertions.splice(index + 1, 0, obj3);
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
      },
      //消息体内容改变事件
      reqBodyTextChange(text){
        console.log('消息体内容：',text)
        this.tempApiDetailInfo.requestBody = text;
      },
      //预期结果改变事件
      resBodyTextChange(text){
        console.log('预期结果：',text)
        this.tempApiDetailInfo.responseBody = text;
      },
      //保存自定义变量
      saveAceVarName(event){
        var value = event.target.value;
        value = '${'+value+'}';
        var keyWord = {
          name: value,
          value: value,
          caption: value,
          meta: value,
          type: '',
          score: 1000 + this.aceManager.completions.length

        }
        this.aceManager.getCompletions(1).push(keyWord)
      },
      // 重置Requset ace参数
      formatRequsetJSON(){
          this.tempApiDetailInfo.requestBody = formatJson(this.tempApiDetailInfo.requestBody)
          this.$refs.reqBody.resetAceContent(this.tempApiDetailInfo.requestBody)
      },
      // 重置Response ace参数
      formatResponseJSON(){
          this.tempApiDetailInfo.responseBody = formatJson(this.tempApiDetailInfo.responseBody)
          //expectResults
          this.$refs.expectResults.resetAceContent(this.tempApiDetailInfo.responseBody)
      },
      // 清空requestBody value参数
      resetReqBody(){
        var vueThis = this;
        var obj = JSON.parse(this.tempApiDetailInfo.requestBody);

        vueThis.testCaseAxios({
          method: 'post',
          data:obj,
          url: "testCase/clearJsonValue"
        })
          .then(function (res) {
            if(res.data.code === 10000){
              vueThis.tempApiDetailInfo.requestBody = res.data.data;
              vueThis.formatRequsetJSON();
            }else{
              vueThis.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
          })
          .catch(function (err) {
            vueThis.$message.error(err);
          });

      },
      // 参数化requestBody value参数
      changeReqBody(){

        var vueThis = this;
        var obj = JSON.parse(this.tempApiDetailInfo.requestBody);

        vueThis.testCaseAxios({
          method: 'post',
          data:obj,
          url: "testCase/setJsonValue"
        })
        .then(function (res) {
          if(res.data.code === 10000){
            vueThis.tempApiDetailInfo.requestBody = res.data.data.json;
            vueThis.formatRequsetJSON();

            // 接口传回的变量  如果之前自定义变量数组不存在  则push到自定义变量数组
            var names = res.data.data.variables;
            for(var i=0; i<names.length; i++){
              var num = 0;
              for(var j=0; j<vueThis.tempApiDetailInfo.variables.length;j++){
                if(names[i] === vueThis.tempApiDetailInfo.variables[j].varName){
                  num+=1;
                }
              }
              if(num === 0){
                if(vueThis.tempApiDetailInfo.variables.length === 1){
                  if(vueThis.tempApiDetailInfo.variables[0].varName == '' && vueThis.tempApiDetailInfo.variables[0].varValue == ''){
                    vueThis.tempApiDetailInfo.variables = [];
                  }
                }
                vueThis.tempApiDetailInfo.variables.push({
                  'varName':names[i],
                  'varValue':''
                })

              }
            }

          }else{
            vueThis.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        })
        .catch(function (err) {
          vueThis.$message.error(err);
        });


      },
      //tab 切换
      handleClick(tab, event){
        console.log(tab.index)
        this.activeIndex = tab.index;
      },
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
