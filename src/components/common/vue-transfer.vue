<template>
  <el-container>
    <el-row :span="22">
      <el-col :span="8">
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
      <el-col :span="4">
        <div style="text-align: center;margin-left: 2px;margin-top: 80%">
          <div><input type="button" value=">" @click="addApi" style="border-radius: 60px;height: 40px;width: 40px"/></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="vue-transfer-tree">
          <label class="vue-transfer-label">已选接口</label>
          <el-table
            :show-header=true
            @row-click="rowClick"
            ref="singleTable"
            highlight-current-row
            :data="selectedApis"
            style="width: 100%; margin-top: 2px">
            <el-table-column
              prop="name"
              label="接口名称">
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
                  @click.native.prevent="deleteRow(scope.$index, selectedApis)"
                  type="text"
                  size="small">
                  移除
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
    name: 'VueTransfer',
    data(){
        return {
          defaultProps:{
            label: 'name',
            isLeaf: 'type',
            children: 'children'
          }
        }
    },

    methods: {
      handleNodeClick(data, node, instance) {
//          console.log('xxx');
      },
      loadNode(node, resolve) {
        if(node.level === 0){
          return resolve([{ name:  'Root', id: 0 , type: false}]);
        }else if(node.isLeaf === true){
          return;
        }else{
            //先注释 用本地数据
//          this.$http.get("http://192.168.32.105:8082/inter/api/getApiTreeByPId?pId=" + node.data.id).then(function (res) {
//            if(res.data.succeed){
//              var tempApi = res.data.data;
//              return resolve(res.data.data);
//            }
//            return;
//          },function (res) {
//
//          });

            var apiTreeData =  [{
                "id": 1,
                "name": "1",
                "description": "",
                "pId": 0,
                "module": "1",
                "branch": "1",
                "urlAddress": "1",
                "apiType": "0",
                "type": true,
                "postWay": "1",
                "requestHead": "[{\"Key\":null,\"Value\":null,\"Description\":null}]",
                "requestBodyType": "2",
                "requestBodyRowType": "2",
                "requestBody": null,
                "responseHead": "[{\"Key\":null,\"Value\":null,\"Description\":null}]",
                "responseBodyType": "0",
                "responseBody": null,
                "createdBy": "",
                "createdTime": null,
                "updatedBy": "",
                "updatedTime": null,
                "optstatus": 0,
                "system": "usr"
            }, {
                "id": 2,
                "name": "2",
                "description": "",
                "pId": 0,
                "module": "2",
                "branch": "2",
                "urlAddress": "2",
                "apiType": "0",
                "type": true,
                "postWay": "1",
                "requestHead": "[{\"Key\":null,\"Value\":null,\"Description\":null}]",
                "requestBodyType": "2",
                "requestBodyRowType": "2",
                "requestBody": null,
                "responseHead": "[{\"Key\":null,\"Value\":null,\"Description\":null}]",
                "responseBodyType": "0",
                "responseBody": null,
                "createdBy": "",
                "createdTime": null,
                "updatedBy": "",
                "updatedTime": null,
                "optstatus": 0,
                "system": "trd"
            }, {
                "id": 3,
                "name": "3",
                "description": "",
                "pId": 0,
                "module": "3",
                "branch": "3",
                "urlAddress": "3",
                "apiType": "0",
                "type": true,
                "postWay": "1",
                "requestHead": "[{\"Key\":null,\"Value\":null,\"Description\":null}]",
                "requestBodyType": "2",
                "requestBodyRowType": "2",
                "requestBody": null,
                "responseHead": "[{\"Key\":null,\"Value\":null,\"Description\":null}]",
                "responseBodyType": "0",
                "responseBody": null,
                "createdBy": "",
                "createdTime": null,
                "updatedBy": "",
                "updatedTime": null,
                "optstatus": 0,
                "system": "trd"
            }, {
                "id": 4,
                "name": "4",
                "description": "",
                "pId": 0,
                "module": "4",
                "branch": "4",
                "urlAddress": "4",
                "apiType": "0",
                "type": true,
                "postWay": "1",
                "requestHead": "[{\"Key\":null,\"Value\":null,\"Description\":null}]",
                "requestBodyType": "2",
                "requestBodyRowType": "2",
                "requestBody": null,
                "responseHead": "[{\"Key\":null,\"Value\":null,\"Description\":null}]",
                "responseBodyType": "0",
                "responseBody": null,
                "createdBy": "",
                "createdTime": null,
                "updatedBy": "",
                "updatedTime": null,
                "optstatus": 0,
                "system": "usr"
            }, {
                "id": 5,
                "name": "5",
                "description": "",
                "pId": 0,
                "module": "5",
                "branch": "5",
                "urlAddress": "5",
                "apiType": "0",
                "type": true,
                "postWay": "1",
                "requestHead": "[{\"Key\":null,\"Value\":null,\"Description\":null}]",
                "requestBodyType": "2",
                "requestBodyRowType": "2",
                "requestBody": null,
                "responseHead": "[{\"Key\":null,\"Value\":null,\"Description\":null}]",
                "responseBodyType": "0",
                "responseBody": null,
                "createdBy": "",
                "createdTime": null,
                "updatedBy": "",
                "updatedTime": null,
                "optstatus": 0,
                "system": "trd"
            }]
            var tempApi = apiTreeData;
            return resolve(apiTreeData);
        }
      },
      addApi(){
        var node = this.$refs.tree.currentNode.node;
        var data = node.data;

        if(node.isLeaf){
          if(typeof  data.requestHead === 'string'){
              data.requestHead = JSON.parse(data.requestHead);
          }else if(typeof  data.requestHead === 'undefined'){
            data.requestHead = [{"Key":'',"Value":'',"Description":''}]
          }

          if(typeof  data.responseHead === 'string'){
            data.responseHead = JSON.parse(data.responseHead);
          }else if(typeof  data.responseHead === 'undefined'){
            data.responseHead = [{"Key":'',"Value":'',"Description":''}]
          }

          if(typeof data.variables === 'undefined'){
            data.variables = [{"Key": '', "Value": ''}];
          }

          if(typeof data.assertions === 'undefined'){
            data.assertions = [{"Key": '', "Value": ''}];
          }

          this.selectedApis.push(data);
        }
      },
      rowClick(row, event, column){
        this.$refs.singleTable.setCurrentRow(row);
//          console.log(column)
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      }
    }
  }

</script>

<style scoped>
  .el-row {
    width: 90%;

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
    border: 0.5px solid;
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
    width: 98%;
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
