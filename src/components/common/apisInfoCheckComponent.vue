<template>
  <el-container>
    <el-row>
      <el-col :span="9">
        <div class="vue-transfer-tree">
          <label class="vue-transfer-label">接口</label>
            <el-table
                :show-header=true
                @row-click="rowClick"
                ref="singleTable"
                highlight-current-row
                :data="apisInfoCheck"
                style="width: 100%; margin-top: 2px">
                <el-table-column
                    prop="name"
                    label="接口名称">
                </el-table-column>
            </el-table>
        </div>
      </el-col>

      <el-col :span="15">
        <div class="vue-transfer-tree">
          <label class="vue-transfer-label">已选接口</label>

        </div>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>

  export default {
    props: ['apisInfoCheck'],
    components: {},
    name: 'apisInfoCheckComponent',
    data(){
        return {

        }
    },
    created(){
    },
    methods: {

      rowClick(row, event, column){
        this.$refs.singleTable.setCurrentRow(row);
          console.log(column)
      }

    }
  }

</script>

<style scoped>
  .el-row {
    width: 100%;

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
