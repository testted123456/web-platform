<template>

  <el-container id="testCaseEdit">
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
        <el-col :span="8">
          <el-select v-model="testCase.env" placeholder="请选择">
            <el-option
              v-for="item in envs"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row style="padding-top:30px;">

            <el-col :span="4">
                <el-button type="primary" @click="dialogVisible = true">添加接口</el-button>
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
                <el-button type="primary" @click="dialogVisible = true">动态库查询</el-button>
                <el-dialog
                    title="动态库查询"
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
            <el-col :span="4">
                <el-button  type="primary" @click="pastApi">粘贴接口</el-button>
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
            align="center" width="400px">
            <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :enterable="false"	:hide-after="500" content="搜索接口" placement="top">
                    <el-button  type="primary" size="mini"><i class="el-icon-search"></i></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="上移" placement="top">
                    <el-button  type="primary" size="mini" @click.native.prevent="moveup(scope.$index, scope.row, apisInCase)"  ><i class="el-icon-arrow-up"></i></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="下移" placement="top">
                    <el-button  type="primary" size="mini" @click.native.prevent="movedown(scope.$index, scope.row, apisInCase)" ><i class="el-icon-arrow-down"></i></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="复制接口信息" placement="top">
                    <el-button  type="primary" size="mini" @click="copyApi(scope.row)"><i class="el-icon-tickets"></i></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="编辑接口信息" placement="top">
                    <el-button  type="primary" size="mini" @click="apiEdit(scope.row.id)"><i class="el-icon-edit"></i></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :enterable="false" :hide-after="500" content="删除接口" placement="top">
                    <el-button  type="primary" size="mini" @click="removeApi(scope.row.id)"><i class="el-icon-remove"></i></el-button>
                </el-tooltip>
            </template>
          </el-table-column>
          <!--<el-table-column-->
            <!--align="left">-->
            <!--<template slot-scope="props">-->

            <!--</template>-->
          <!--</el-table-column>-->

        </el-table>
      </el-row>
        <el-dialog
            title="编辑接口"
            :visible.sync="apiInfodialogVisible"
            width="60%"
            :before-close="handleClose">
            <api-in-case :apiID="editApiID"></api-in-case>
            <span slot="footer" class="dialog-footer">
                      <el-button @click="apiInfodialogVisible = false">取 消</el-button>
                      <el-button type="primary" @click="apiInfodialogVisible = false">确 定</el-button>
                    </span>
        </el-dialog>
    </el-main>
    <el-aside width="50px">
    </el-aside>
    </el-container>
    <el-footer style="text-align: right;">
      <el-button type="primary" @click="saveCase">确认</el-button>
      <el-button type="success">执行</el-button>
    </el-footer>
  </el-container>

</template>

<script>
  import ElContainer from "../../../../node_modules/element-ui/packages/container/src/main";
  import ElMain from "../../../../node_modules/element-ui/packages/main/src/main";
  import ElRow from "element-ui/packages/row/src/row";
  import ElAside from "../../../../node_modules/element-ui/packages/aside/src/main";
  import ElInput from "../../../../node_modules/element-ui/packages/input/src/input";
  import ElCol from "element-ui/packages/col/src/col";
  import VueTransfer from '@/components/common/vue-transfer.vue';
  import ApiInCase from './ApiInCase1.vue';
  import {moveup, movedown} from  "../../../assets/js/tableRowMove.js";

export default {
  components: {ApiInCase, ElCol, ElInput, ElAside, ElRow, ElMain, ElContainer,VueTransfer},

  name: 'TestCaseEdit',

    data () {
        return {
            testCase: {},
            apisInCase: [],
            envs: [],
            system: '',
            systems: [],
            dialogVisible: false,
            apiInfodialogVisible: false,
            editApiID: 0,
            filterMethod(query, item) {
                return item.pinyin.indexOf(query) > -1;
            }
        }
    },

  computed: {
    id: function () {
      return this.$route.params.id;
    }
  },

  created() {
    this.init();
  },

    methods: {
        moveup, movedown,
        copyApi(data){

            this.ApiCopyId = data.id;
            console.log(this.ApiCopyId);
        },
        pastApi(){

        },
        apiEdit(apiId){
          this.editApiID = apiId;
          this.apiInfodialogVisible = true;
        },
        removeApi(apiId){

        },
        init(){
            //先注释 用本地数据
//      this.$http.get("http://192.168.32.105:8083/case/testCase/getCase?id=" + this.$route.params.id).then(function (res) {
//        if(res.data.succeed){
//          this.testCase = res.data.data;
//        }
//      },function (res) {
//
//      });

//      this.$http.get("http://192.168.32.105:8083/case/testCaseInterface/getByTestCaseId?testCaseId=" + this.$route.params.id).then(function (res) {
//        if(res.data.succeed){
//          this.apisInCase = res.data.data;
//        }
//      },function (res) {
//
//      });

            this.testCase = {
                "id": 1,
                "pId": 0,
                "name": "test",
                "description": "xxx",
                "type": true,
                "env": "xx",
                "projectName": "",
                "createdBy": null,
                "createdTime": null,
                "updatedBy": null,
                "updatedTime": null,
                "optstatus": 0
            }

            this.apisInCase = [{
                "id": 1,
                "testCase": {
                    "id": 1,
                    "pId": 0,
                    "name": "test",
                    "description": "xxx",
                    "type": true,
                    "env": "xx",
                    "projectName": "",
                    "createdBy": null,
                    "createdTime": null,
                    "updatedBy": null,
                    "updatedTime": null,
                    "optstatus": 0
                },
                "interfaceid": 1,
                "orderNo": 1,
                "step": "",
                "urlAddress": "http://usr.stb.com/usr-app/usr/register/doRegister",
                "variables": "[{\"varName\":\"mobile\",\"varValue\":\"${generateRandomValue(\\\"10\\\")}\"}]",
                "requestHead": "{\"Content-Type\": \"application/json\"}",
                "requestBody": "{\"passWord\":\"d051d170235c6682e334e6a5abd8ebdb\",\"imgKey\":\"\",\"adPlan\":\"\",\"referer\":\"\",\"bizCode\":\"mxd\",\"openId\":\"\",\"registerType\":\"MP\",\"registerApproach\":\"\",\"deviceId\":\"\",\"channelDetail\":\"\",\"advisor\":\"\",\"inviteMobile\":\"\",\"clientType\":\"ios\",\"pcId\":\"23\",\"channelId\":\"\",\"mobileCode\":\"888888\",\"tokenId\":\"ios\",\"landingPage\":\"\",\"ip\":\"192.168.1.1\",\"mobile\":\"${mobile}\",\"adUnit\":\"\",\"csUserType\":\"\",\"imgCode\":\"\",\"mobileKey\":\"${mobile}\",\"userName\":\"\",\"approach9\":\"\",\"approach8\":\"\",\"approach5\":\"\",\"approach4\":\"\",\"approach7\":\"\",\"blackBox\":\"ios\",\"approach6\":\"\",\"inviteCode\":\"\",\"approach10\":\"\",\"userType\":\"1\",\"operation\":\"\"}",
                "responseHead": null,
                "responseBody": "{\"errorMessage\":\"\",\"errorCode\":\"\",\"data\":{\"customerServicer\":\"\",\"csyyUserId\":\"\",\"gender\":\"\",\"isCheat\":\"\",\"isPayPassword\":\"\",\"nonoIdChecked\":\"\",\"isSync\":\"\",\"cardNeedcheck\":\"\",\"isSpecial\":\"\",\"pcId\":\"\",\"isMobile\":\"\",\"id\":\"&{id}\",\"recommender\":\"\",\"idNum\":\"\",\"email\":\"\",\"isStudent\":\"\",\"financeAdvisorManager\":\"\",\"isNono\":\"\",\"isPhoto\":\"\",\"userName\":\"\",\"userKey\":\"\",\"isDunning\":\"\",\"isBbsSync\":\"\",\"realName\":\"\",\"mobileNum\":\"\",\"isEducation\":\"\",\"financeAdvisor\":\"\",\"isEmail\":\"\",\"userType\":\"\",\"isCard\":\"\",\"age\":\"\",\"status\":\"\"},\"succeed\":\"\"}",
                "assertions": null,
                "createdBy": null,
                "createdTime": null,
                "updatedBy": null,
                "updatedTime": null,
                "optstatus": 0
            }]

        },


        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {
                });
        },

        saveCase(){

        }
    },

  watch: {
      id: function (val, oldVal) {
          this.init();
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #testCaseEdit {
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
  .el-row {
      margin-bottom: 20px;
  &:last-child {
       margin-bottom: 0;
   }
  }
  .el-col {
      border-radius: 4px;
  }
  .bg-purple-dark {
      background: #99a9bf;
  }
  .bg-purple {
      background: #d3dce6;
  }
  .bg-purple-light {
      background: #e5e9f2;
  }
  .grid-content {
      border-radius: 4px;
      min-height: 36px;
  }
  .row-bg {
      padding: 10px 0;
      background-color: #f9fafc;
  }
</style>
