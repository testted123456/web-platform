<template>
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
        <el-col :span="6">
          <label>{{tempApiDetailInfo.apiType}}</label>
        </el-col>
        <el-col :span="6">
          <label>{{tempApiDetailInfo.postWay}}</label>
        </el-col>
      </el-row>
      <el-row>
        <template>
          <el-tabs v-model="apiInCaseTab" @tab-click="handleClick">
            <el-tab-pane label="自定义变量" name="variables">
              <el-table :data="tempApiDetailInfo.variables" style="width: 100%">

                <el-table-column label="Key" class-name="cell-input" width="150">
                  <template slot-scope="scope">
                    <el-input v-model="tempApiDetailInfo.variables[scope.$index].varName"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="Value" class-name="cell-input" width="300">
                  <template slot-scope="scope">
                    <el-input v-model="tempApiDetailInfo.variables[scope.$index].varValue"></el-input>
                  </template>
                </el-table-column>

                <el-table-column class-name="cell-input" width="120" label="" >
                  <template slot-scope="scope">
                    <el-button @click.native.prevent="addHeadersRow(scope.$index, tempApiDetailInfo.variables)" v-if="showAddHeader(scope.$index, tempApiDetailInfo.variables)" type="text" size="small"><i class="el-icon-plus"></i></el-button>
                    <el-button @click.native.prevent="deleteHeadersRow(scope.$index, tempApiDetailInfo.variables)" type="text" size="small"><i class="el-icon-delete"></i></el-button>
                    <el-button @click.native.prevent="moveup(scope.$index, scope.row, tempApiDetailInfo.variables)"  type="text" size="small"><i class="el-icon-arrow-up"></i></el-button>
                    <el-button @click.native.prevent="movedown(scope.$index, scope.row, tempApiDetailInfo.variables)" type="text" size="small"><i class="el-icon-arrow-down"></i></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="消息头" name="reqHeaders">
              <el-table
                :data="tempApiDetailInfo.requestHead" style="width: 100%"
              >
                <el-table-column
                  label="Key" class-name="cell-input" width="180"
                >
                  <template slot-scope="scope">
                    <el-input v-model="tempApiDetailInfo.requestHead[scope.$index].Key"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Value" class-name="cell-input" width="180"
                >
                  <template slot-scope="scope">
                    <el-input v-model="tempApiDetailInfo.requestHead[scope.$index].Value"></el-input>
                  </template>
                </el-table-column>

                <el-table-column class-name="cell-input" width="120"
                                 label="" >
                  <template slot-scope="scope">
                    <el-button @click.native.prevent="addHeadersRow(scope.$index, tempApiDetailInfo.requestHead)" v-if="showAddHeader(scope.$index, tempApiDetailInfo.requestHead)" type="text" size="small"><i class="el-icon-plus"></i></el-button>
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
                             round
                  >格式化Json</el-button>
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
              <el-table
                :data="tempApiDetailInfo.responseHead" style="width: 100%"
              >
                <el-table-column
                  label="Key" class-name="cell-input" width="180"
                >
                  <template slot-scope="scope">
                    <el-input v-model="tempApiDetailInfo.responseHead[scope.$index].Key"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Value" class-name="cell-input" width="180"
                >
                  <template slot-scope="scope">
                    <el-input v-model="tempApiDetailInfo.responseHead[scope.$index].Value"></el-input>
                  </template>
                </el-table-column>

                <el-table-column class-name="cell-input" width="120"
                                 label="" >
                  <template slot-scope="scope">
                    <el-button @click.native.prevent="addHeadersRow(scope.$index, tempApiDetailInfo.requestHead)" v-if="showAddHeader(scope.$index, tempApiDetailInfo.requestHead)" type="text" size="small"><i class="el-icon-plus"></i></el-button>
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
                             round
                  >格式化Json</el-button>
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
              <el-table
                :data="tempApiDetailInfo.assertions" style="width: 100%"
              >
                <el-table-column
                  label="预期结果" class-name="cell-input" width="150"
                >
                  <template slot-scope="scope">
                    <el-input v-model="tempApiDetailInfo.assertions[scope.$index].actualResult"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="比较符" class-name="cell-input" width="150"
                >
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
                <el-table-column
                  label="实际结果" class-name="cell-input" width="300"
                >
                  <template slot-scope="scope">
                    <el-input v-model="tempApiDetailInfo.assertions[scope.$index].expectResult"></el-input>
                  </template>
                </el-table-column>
                <el-table-column class-name="cell-input" width="120"
                                 label="" >
                  <template slot-scope="scope">
                    <el-button @click.native.prevent="addHeadersRow(scope.$index, tempApiDetailInfo.assertions)" v-if="showAddHeader(scope.$index, tempApiDetailInfo.assertions)" type="text" size="small"><i class="el-icon-plus"></i></el-button>
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
</template>


<script>
  import {formatJson, isJson} from "@/assets/js/formatJson.js";


  export default {
    name: 'ApiInCase',
    props: ['testCaseInterface'],
    components: {},
    data(){
      return {
        'stepName': '',
        'apiUrl': '',
        'reqBody': '',
        'apiInCaseTab': 'variables',
        'comparisonOperator':[
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
          requestBody:'',
          responseHead:[
            {
              "Key": "",
              "Value": ""
            }
          ],
          responseBody:'',
          assertions:[
            {
              "actualResult": "",
              "comparator": "=",
              "expectResult":""
            }
          ]
        }
      }
    },
    created(){
      var json = JSON.stringify(this.testCaseInterface);
      var obj = JSON.parse(json);
      this.updateTempApiDetailInfo(obj)
      console.log(this.tempApiDetailInfo)
    },
    destroyed(){
      console.log('api edit dialog destroyed')
    },
    methods: {
      formatJson,
      isJson,
      handleClick(tab, event){

      },
      saveApiDetailInfo(){

        var json = JSON.stringify(this.tempApiDetailInfo);
        var obj = JSON.parse(json)
        return obj;
      },
      cancelSaveInfo(){
        var json = JSON.stringify(this.testCaseInterface);
        var obj = JSON.parse(json)
        this.apiInCaseTab = 'variables'
        this.updateTempApiDetailInfo(obj)
      },
      // tempApiDetailInfo 赋值
      updateTempApiDetailInfo(obj){
         // this.tempApiDetailInfo = obj;
        this.tempApiDetailInfo.step = obj.step;
        this.tempApiDetailInfo.urlAddress = obj.urlAddress;
        this.tempApiDetailInfo.apiType = obj.apiType;
        this.tempApiDetailInfo.postWay = obj.postWay;
        this.tempApiDetailInfo.requestBody = obj.requestBody;
        this.tempApiDetailInfo.responseBody = obj.responseBody;



        if (obj.variables === 'undefined' || obj.variables === null) {

        }
        if (obj.requestHead === null) {

        }
        if (obj.assertions === null) {   //断言
//          this.tempApiDetailInfo.assertions = [{
//            actualResult:"${term}",
//            comparator:"=",
//            expectResult:"19"
//          }];
        }
        if (obj.responseHead === null) {

        }
        console.log(this.tempApiDetailInfo)
      },



      showAddHeader(index, rows){
        if (rows.length == index + 1 && (rows[index].Key != '' || rows[index].Value != '' || rows[index].Description != '')) {
          return true;
        } else {
          return false;
        }
      },
      addHeadersRow(index, rows){
        if (rows.length == index + 1 && (rows[index].Key != '' || rows[index].Value != '' || rows[index].Description != '')) {
          rows.push({
            Key: '',
            Value: '',
            Description: ''
          })
        }
      },
      //删除消息头中的一行
      deleteHeadersRow(index, rows) {
        if (index == 0 && rows.length == 1) {
          rows[index].Key = '';
          rows[index].Value = '';
          rows[index].Description = '';
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
