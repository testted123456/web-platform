<template>

  <el-container id="testCaseNew">
    <el-container >
      <el-main>
        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="4" >
            <label>用例名称:</label>
          </el-col>
          <el-col :span="16">
            <el-input v-model="testCase.name" placeholder="请输入用例名称"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="4" >
            <label>用例描述:</label>
          </el-col>
          <el-col :span="16">
            <el-input v-model="testCase.description" placeholder="请输入用例描述"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="4" >
            <label>项目名称:</label>
          </el-col>
          <el-col :span="16">
            <el-input v-model="testCase.projectName" placeholder="请输入项目名称"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="4">
            <label>环境:</label>
          </el-col>
          <el-col :span="10">
            <el-select v-model="testCase.env" placeholder="请选择">
              <el-option
                v-for="item in envs"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-button type="text" @click="dialogVisible = true">添加接口</el-button>
            <el-dialog
              title="接口选择"
              :visible.sync="dialogVisible"
              width="60%"
              :before-close="handleClose">
              <vue-transfer :selectedApis="apisInCase"></vue-transfer>
              <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
            </el-dialog>
          </el-col>
          <el-col :span="4">
            <el-button type="text" @click="dialogVisible = true">动态库查询</el-button>
            <el-dialog
              title="接口选择"
              :visible.sync="dialogVisible"
              width="60%"
              :before-close="handleClose">
              <vue-transfer :selectedApis="apisInCase" ></vue-transfer>
              <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
            </el-dialog>
          </el-col>
        </el-row>

        <el-row>
          <el-table v-show="apisInCase.length>0"
                    :data="apisInCase"
                    style="width: 100%">
            <el-table-column
              prop="isCheck"
              label="批量执行/全选"
              type="selection"
              align="left"
            >
            </el-table-column>

            <el-table-column
              prop="name"
              label="接口名称"
              align="left"
            >
            </el-table-column>

            <el-table-column
              prop="step"
              label="步骤名称"
              align="left"
            >
            </el-table-column>

            <el-table-column
              prop="system"
              label="系统"
              align="left"
            >
            </el-table-column>

            <el-table-column
              prop="branch"
              label="分支"
              align="left"
            >
            </el-table-column>

            <el-table-column
              prop="action"
              label="操作"
              align="left">
              <template slot-scope="scope">
                <el-button  type="text" size="small"><i class="el-icon-search"></i></el-button>
                <el-button @click.native.prevent="moveup(scope.$index, scope.row, apisInCase)"  type="text" size="small"><i class="el-icon-arrow-up"></i></el-button>
                <el-button @click.native.prevent="movedown(scope.$index, scope.row, apisInCase)" type="text" size="small"><i class="el-icon-arrow-down"></i></el-button>
              </template>
            </el-table-column>

            <el-table-column
              align="left"
              type="expand"
            >
              <template slot-scope="props">
                <api-in-case :testCaseInterface="props.row"></api-in-case>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-main>
      <el-aside>
      </el-aside>
    </el-container>
    <el-footer style="text-align: right;">
      <el-button type="primary"  @click="saveCase">确认</el-button>
    </el-footer>
  </el-container>

</template>

<script>

  import VueTransfer from '@/components/common/vue-transfer.vue';
  import ApiInCase from './ApiInCase.vue';
  import {moveup, movedown} from  "../../../assets/js/tableRowMove.js";

  export default {
    components: {ApiInCase,VueTransfer},

    name: 'TestCaseNew',

    data () {
      return {
        testCase: {},
        apisInCase: [],
        envs: [],
        system: '',
        systems: [],
        dialogVisible: false,
      }
    },

    methods: {
      moveup, movedown,

      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },

      saveCase(){
        this.testCase.pId = this.$route.query.pId;

        this.$http.post("http://192.168.32.105:8083/case/testCase/addCase", this.testCase).then(function (res) {
          if(res.data.succeed){
            this.$store.commit('changeTestCaseStatus', 1);
            this.testCase.id = res.data.data.id;
            this.$store.commit('setNewTestCase', this.testCase);
//          this.$router.push({ name: 'ApiEdit', params: { id: this.api.id }})

            if(this.apisInCase.length > 0 && typeof this.testCase.id != 'undefined'){
              let tc = this.testCase;
              this.apisInCase.forEach(function (value, index, array) {
                value.testCase = tc;
              });

              let tempApisInCase = [];
              let tempApiInCase = {
                'id': null,
                'name': null,
                'description': null,
                'module': null,
                'branch': null,
                'urlAddress': null,
                'apiType': null,
                'type': null,
                'requestHead': null,
                'requestBodyType': null,
                'requestBodyRowType': null,
                'requestBody': null,
                'responseHead': null,
                'responseBodyType': null,
                'responseBody': null,
                'createdBy': null,
                'createdTime': null,
                'updatedBy': null,
                'updatedTime': null,
                'optstatus': null,
                'system': null,
                'variables': null,
                'assertions': null,
                'testCase': null,
              };

              this.apisInCase.forEach(function (value, index, array) {
                tempApiInCase.id = value.id;
                tempApiInCase.name = value.name;
                tempApiInCase.step = value.step;
                tempApiInCase.module = value.module;
                tempApiInCase.branch = value.branch;
                tempApiInCase.urlAddress = value.urlAddress;
                tempApiInCase.apiType = value.apiType;
                tempApiInCase.type = value.type;
                tempApiInCase.requestHead = JSON.stringify(value.requestHead);
                tempApiInCase.requestBodyType = value.requestBodyType;
                tempApiInCase.requestBodyRowType = value.requestBodyRowType;
                tempApiInCase.requestBody = value.requestBody;
                tempApiInCase.responseHead = JSON.stringify(value.responseHead);
                tempApiInCase.responseBodyType = value.responseBodyType;
                tempApiInCase.responseBody = value.responseBody;
                tempApiInCase.createdBy = value.createdBy;
                tempApiInCase.createdTime = value.createdTime;
                tempApiInCase.updatedBy = value.updatedBy;
                tempApiInCase.updatedTime = value.updatedTime;
                tempApiInCase.optstatus = value.optstatus;
                tempApiInCase.system = value.system;
                tempApiInCase.variables = JSON.stringify(value.variables);
                tempApiInCase.assertions = JSON.stringify(value.assertions);
                tempApiInCase.testCase = value.testCase;
                tempApisInCase[index] = tempApiInCase;
              });

              this.$http.post("http://192.168.32.105:8083/case/testCaseInterface/addCaseInterfaces", tempApisInCase).then(function (res) {
                if(res.data.succeed){
                  this.$router.push({name: 'TestCaseEdit', params: {id: this.testCase.id}});
                  this.$message({
                    message: '恭喜，新增用例成功！',
                    type: 'success'
                  });
                }else{
                  this.$message.error('抱歉，新增用例失败！');
                }
              }, function (res) {

              });
            }
          }else{

          }
        }, function (res) {

        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #testCaseNew {
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
</style>
