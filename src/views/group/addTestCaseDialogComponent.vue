<template>
  <el-container >
    <el-row>
      <el-col :span="8" style="border:1px solid #ccc;border-radius:3px;">
        <div class="vue-transfer-tree">

          <el-tabs type="border-card">
            <el-tab-pane label="用例" >

              <!--<label class="vue-transfer-label">用例</label>-->
              <input class="vue-transfer-input" placeholder="输入用例名称搜索"/>
              <el-tree :load="loadNode"
                       lazy
                       ref="tree"
                       :props="defaultProps"
                       @node-click="handleNodeClick">
              </el-tree>
            </el-tab-pane>
            <el-tab-pane label="用例流">

              <!--<label class="vue-transfer-label" style="margin-top:18px;">用例流</label>-->
              <input class="vue-transfer-input" placeholder="输入用例流名称搜索"/>
              <el-tree :load="loadNode2"
                       lazy
                       ref="tree2"
                       :props="defaultProps2"
                       @node-click="handleNodeClick2">
              </el-tree>
            </el-tab-pane>

          </el-tabs>

        </div>
      </el-col>
      <el-col :span="2">
        <div style="text-align: center;margin-left: 2px;margin-top: 80%">
          <div><input type="button" value=">" @click="addCase" style="border-radius: 60px;height: 40px;width: 40px"/></div>
        </div>
      </el-col>
      <el-col :span="14" style="border:1px solid #ccc;border-radius:3px;">
        <div class="vue-transfer-tree">
          <label class="vue-transfer-label">已选用例</label>
          <el-table
            :show-header=true
            @row-click="rowClick"
            ref="singleTable"
            highlight-current-row
            :data="tempCases"
            style="width: 100%; margin-top: 2px">
            <el-table-column
              prop="name"
              label="名称" min-width="250">
              <template slot-scope="scope">
                <el-button type="text">{{ scope.row.name }}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="description"
              label="描述">
            </el-table-column>
            <el-table-column
              prop="createdBy"
              label="创建人">
            </el-table-column>
            <el-table-column
              prop="action"
              label="操作">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, tempCases)"
                  type="text" size="mini"
                  >
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
    props: ['selectedCases'],
    components: {},
    name: 'addTestCaseDialogComponent',
    data(){
      return {
        defaultProps:{
          label: 'name',
          isLeaf: 'type',
          children: 'children'
        },
        defaultProps2:{
          label: 'name',
          isLeaf: 'type',
          children: 'children'
        },
        case:{},
        tempCases:[],
        currentNode:{}
      }
    },

    created(){
      this.tempCases = this.selectedCases.concat()
    },

    methods: {
      handleNodeClick(data, node, instance) {
        this.currentNode =  this.$refs.tree.currentNode.node;
        this.currentNode.data.divisionType = true;
        console.log(this.currentNode.data)
      },
      handleNodeClick2(data, node, instance) {
        this.currentNode =  this.$refs.tree2.currentNode.node;
        this.currentNode.data.divisionType = false;

        console.log(this.currentNode.data)

      },
      loadNode(node, resolve) {
        if(node.level === 0){
          return resolve([{ name:  '测试用例', id: 0 , type: false}]);
        }else if(node.isLeaf === true){
          return;
        }else{

          var vueThis = this;
          vueThis.testCaseAxios({
            method: 'get',
            data: {
            },
            url: "testCase/getCaseTreeByPId?pId=" + node.data.id
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
        }
      },
      loadNode2(node, resolve) {
        if(node.level === 0){
          return resolve([{ name:  '测试用例流', id: 0 , type: false}]);
        }else if(node.isLeaf === true){
          return;
        }else{

          var vueThis = this;
          vueThis.testCaseAxios({
            method: 'get',
            data: {
            },
            url: "flowCase/getTreeByPId?pId=" + node.data.id
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
        }
      },
      addCase(){
        // var node = this.$refs.tree.currentNode.node;
        // this.case = node.data;

        this.case = this.currentNode.data;
        if(this.currentNode.data.type){
            var obj = JSON.stringify(this.case);
            obj = JSON.parse(obj)
          this.tempCases.push(obj);
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
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      getCases(){
        return this.tempCases.concat();
      },
      resetCases(){
        this.tempCases = this.selectedCases.concat()
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
    min-height: 500px;
    height: 500px;
    /*margin-left: 2px;*/
    /*margin-right: 2px;*/
    /*padding-right: 1px;*/
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
  .el-tabs{
    height: 100%;
  }

</style>
