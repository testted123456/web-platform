<template>
  <el-container>
    <el-row >
      <el-col :span="8" style="border:1px solid #ccc;border-radius:3px;">
        <div class="vue-transfer-tree">
          <label class="vue-transfer-label">用例</label>
          <input class="vue-transfer-input" placeholder="输入用例名称搜索"/>
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
        case:{},
        tempCases:[],
        submitCases:[]
      }
    },

    created(){
      // this.tempCases = this.selectedCases.concat()
      var a = this.selectedCases;
      a = JSON.stringify(a)
      a = JSON.parse(a);

      var b = this.selectedCases;
      b = JSON.stringify(b)
      b = JSON.parse(b);

      this.submitCases= a;
      this.tempCases = b;

      var that = this;
      this.tempCases.forEach(function(val,index,arr){
        if(that.getString(val.name) > 50){
          val.name = that.cutstr(val.name , 50)
        }
      })
    },

    methods: {
      getString(str){
        // return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  //先把中文替换成两个字节的英文，在计算长度
        var realLength = 0, len = str.length, charCode = -1;
        for (var i = 0; i < len; i++) {
          charCode = str.charCodeAt(i);
          if (charCode >= 0 && charCode <= 128) realLength += 1;
          else realLength += 2;
        }
        return realLength;
      },
      cutstr(str, len) {
        var str_length = 0;
        var str_len = 0;
        var str_cut = new String();
        str_len = str.length;
        for (var i = 0; i < str_len; i++) {
          var a = str.charAt(i);
          str_length++;
          if (escape(a).length > 4) {
            //中文字符的长度经编码之后大于4
            str_length++;
          }
          str_cut = str_cut.concat(a);
          if (str_length >= len) {
            str_cut = str_cut.concat("...");
            return str_cut;
          }
        }
        //如果给定字符串小于指定长度，则返回源字符串；
        if (str_length < len) {
          return str;
        }
      },
      handleNodeClick(data, node, instance) {
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
            }else{
              vueThis.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
            return;
          })
          .catch(function (err) {
            vueThis.$message.error(err);
          });
        }
      },
      addCase(){
        var node = this.$refs.tree.currentNode.node;
        this.case = node.data;

        if(node.data.type){
            var obj = JSON.stringify(this.case);
            obj = JSON.parse(obj)
            this.submitCases.push(obj);

          this.case = JSON.stringify(this.case);
          this.case = JSON.parse(this.case);

          console.log(this.getString(this.case.name))

          if(this.getString(this.case.name) > 50){
            this.case.name = this.cutstr(this.case.name , 50)
          }

          console.log(this.case.name)

          this.tempCases.push(this.case);



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
        this.submitCases.splice(index, 1);

      },
      getCases(){
        return this.submitCases.concat();

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
