<template>
  <el-container id="apiInCase">
    <el-main>
      <el-row>
        <el-col :span="4">
          <label>步骤名称:</label>
        </el-col>
        <el-col :span="16">
          <el-input v-model="testCaseInterface.step"  placeholder="请输入接口名称"></el-input>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">
          <label>API url:</label>
        </el-col>
        <el-col :span="16">
          <el-input v-model="testCaseInterface.urlAddress"  placeholder="请输入接口url"></el-input>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">
          <label>API方法:</label>
        </el-col>
        <el-col :span="6">
          <label>Http</label>
        </el-col>
        <el-col :span="6">
          <label>Post</label>
        </el-col>
      </el-row>
      <el-row>
        <template>
          <el-tabs v-model="apiInCaseTab" @tab-click="handleClick">
            <el-tab-pane label="自定义变量" name="variables">
              <el-table
                :data="testCaseInterface.variables" style="width: 100%"
              >
                <el-table-column
                  label="Key" class-name="cell-input" width="150"
                  >
                  <template slot-scope="scope">
                    <el-input v-model="testCaseInterface.variables[scope.$index].Key"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Value" class-name="cell-input" width="300"
                  >
                  <template slot-scope="scope">
                    <el-input v-model="testCaseInterface.variables[scope.$index].Value"></el-input>
                  </template>
                </el-table-column>

                <el-table-column class-name="cell-input" width="120"
                  label="" >
                  <template slot-scope="scope">
                    <el-button @click.native.prevent="addHeadersRow(scope.$index, testCaseInterface.variables)" v-if="showAddHeader(scope.$index, testCaseInterface.variables)" type="text" size="small"><i class="el-icon-plus"></i></el-button>
                    <el-button @click.native.prevent="deleteHeadersRow(scope.$index, testCaseInterface.variables)" type="text" size="small"><i class="el-icon-delete"></i></el-button>
                    <el-button @click.native.prevent="moveup(scope.$index, scope.row, testCaseInterface.variables)"  type="text" size="small"><i class="el-icon-arrow-up"></i></el-button>
                    <el-button @click.native.prevent="movedown(scope.$index, scope.row, testCaseInterface.variables)" type="text" size="small"><i class="el-icon-arrow-down"></i></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="消息头" name="reqHeaders">
              <el-table
                :data="testCaseInterface.requestHead" style="width: 100%"
              >
                <el-table-column
                  label="Key" class-name="cell-input" width="180"
                >
                  <template slot-scope="scope">
                    <el-input v-model="testCaseInterface.requestHead[scope.$index].Key"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Value" class-name="cell-input" width="180"
                >
                  <template slot-scope="scope">
                    <el-input v-model="testCaseInterface.requestHead[scope.$index].Value"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Desription" class-name="cell-input" width="180"
                >
                  <template slot-scope="scope">
                    <el-input v-model="testCaseInterface.requestHead[scope.$index].Description"></el-input>
                  </template>
                </el-table-column>
                <el-table-column class-name="cell-input" width="120"
                                 label="" >
                  <template slot-scope="scope">
                    <el-button @click.native.prevent="addHeadersRow(scope.$index, testCaseInterface.requestHead)" v-if="showAddHeader(scope.$index, testCaseInterface.requestHead)" type="text" size="small"><i class="el-icon-plus"></i></el-button>
                    <el-button @click.native.prevent="deleteHeadersRow(scope.$index, testCaseInterface.requestHead)" type="text" size="small"><i class="el-icon-delete"></i></el-button>
                    <el-button @click.native.prevent="moveup(scope.$index, scope.row, testCaseInterface.requestHead)"  type="text" size="small"><i class="el-icon-arrow-up"></i></el-button>
                    <el-button @click.native.prevent="movedown(scope.$index, scope.row, testCaseInterface.requestHead)" type="text" size="small"><i class="el-icon-arrow-down"></i></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="消息体" name="reqBody">
              <el-row>
                <el-col :span="4" style="text-align: right">
                  <el-button size="small" v-if="isJson(testCaseInterface.requestBody)"
                             @click.native.prevent="testCaseInterface.requestBody = formatJson(testCaseInterface.requestBody)"
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
                    v-model="testCaseInterface.requestBody"
                  >
                  </el-input>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="预期结果" name="expectResults">
              <el-row>
                <el-col :span="4" style="text-align: right">
                  <el-button size="small" v-if="isJson(testCaseInterface.responseBody)"
                             @click.native.prevent="testCaseInterface.responseBody = formatJson(testCaseInterface.responseBody)"
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
                    v-model="testCaseInterface.responseBody"
                  >
                  </el-input>
                </el-col>
              </el-row>
            </el-tab-pane>

            <el-tab-pane label="断言" name="assertions">
              <el-table
                :data="testCaseInterface.assertions" style="width: 100%"
              >
                <el-table-column
                  label="Key" class-name="cell-input" width="150"
                >
                  <template slot-scope="scope">
                    <el-input v-model="testCaseInterface.assertions[scope.$index].Key"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Value" class-name="cell-input" width="300"
                >
                  <template slot-scope="scope">
                    <el-input v-model="testCaseInterface.assertions[scope.$index].Value"></el-input>
                  </template>
                </el-table-column>
                <el-table-column class-name="cell-input" width="120"
                                 label="" >
                  <template slot-scope="scope">
                    <el-button @click.native.prevent="addHeadersRow(scope.$index, testCaseInterface.assertions)" v-if="showAddHeader(scope.$index, testCaseInterface.assertions)" type="text" size="small"><i class="el-icon-plus"></i></el-button>
                    <el-button @click.native.prevent="deleteHeadersRow(scope.$index, testCaseInterface.assertions)" type="text" size="small"><i class="el-icon-delete"></i></el-button>
                    <el-button @click.native.prevent="moveup(scope.$index, scope.row, testCaseInterface.assertions)"  type="text" size="small"><i class="el-icon-arrow-up"></i></el-button>
                    <el-button @click.native.prevent="movedown(scope.$index, scope.row, testCaseInterface.assertions)" type="text" size="small"><i class="el-icon-arrow-down"></i></el-button>
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
  import {formatJson, isJson} from "../../../assets/js/formatJson.js";
  import ElInput from "../../../../node_modules/element-ui/packages/input/src/input";

  export default {
    props: ['testCaseInterface'],

    components: {ElInput},

    name: 'ApiInCase',

    data(){
        return {
            'stepName': '',
            'apiUrl': '',
            'apiInCaseTab': 'variables',
            'reqBody': ''
        }
    },

    methods: {
      formatJson,
      isJson,
      handleClick(){

      },
      showAddHeader(index, rows){
        if(rows.length == index + 1 && (rows[index].Key != '' || rows[index].Value != '' || rows[index].Description != '')){
          return true;
        }else{
          return false;
        }
      },
      addHeadersRow(index, rows){
        if(rows.length == index + 1 && (rows[index].Key != '' || rows[index].Value != '' || rows[index].Description != '')){
          rows.push({
            Key: '',
            Value: '',
            Description: ''
          })
        }
      },
      //删除消息头中的一行
      deleteHeadersRow(index, rows) {
        if(index == 0 && rows.length == 1){
          rows[index].Key = '';
          rows[index].Value = '';
          rows[index].Description = '';
        }else {
          rows.splice(index, 1);
        }
      },
      //上移
      moveup(index, row, rows){
        if (index > 0) {
          let upRow = rows[index - 1]
          rows.splice(index - 1, 1);
          rows.splice(index,0, upRow);
        }
      },
      //下移
      movedown(index, row, rows){
        if ((index + 1) != rows.length){
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
