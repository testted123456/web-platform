<template>
  <el-container  style="font-size: 0.875em;">
    <el-main>
      <el-form   ref="mockDir"  :label-position="labelPosition"  label-width="150px" :model="mockDirInfo" style="width:78%;">
        <el-form-item label="用例目录名称" prop="pathName" :rules="[{ required: true, trigger: 'blur',message: '用例目录名称不能为空'} ]">
          <el-input v-model="mockDirInfo.pathName" placeholder="请输入用例目录名称"></el-input>
        </el-form-item>
        <el-form-item label="用例目录描述" prop="description" :rules="[{ required: false, trigger: 'blur',message: '用例目录描述不能为空'} ]">
          <el-input v-model="mockDirInfo.description" placeholder="请输入用例目录描述"></el-input>
        </el-form-item>
        <!--等待时长-->
        <el-form-item label="等待时长" prop="delayTime" :rules="[{ required: false, trigger: 'blur',message: '等待时长不能为空'} ]">
          <el-input v-model="mockDirInfo.delayTime" placeholder="请输入等待时长"></el-input>
        </el-form-item>
        <!--状态-->
        <el-form-item label="状态" prop="httpCode" :rules="[{ required: false, message: ''} ]">
          <el-col :span="8">
            <el-select v-model="mockDirInfo.httpCode" placeholder="请选择">
              <el-option
                v-for="item in responseState"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <!--转发-->
        <el-form-item label="转发" prop="isProxy" :rules="[{ required: false, message: ''} ]">
            <el-col :span="6">
              <el-radio v-model="mockDirInfo.isProxy" label="true">是</el-radio>
              <el-radio v-model="mockDirInfo.isProxy" label="false">否</el-radio>
            </el-col>
        </el-form-item>

        <!--ip-->
        <el-form-item label="" prop="" :rules="[{ required: false, message: ''} ]" v-if="mockDirInfo.isProxy == 'true' ">
          <el-col :span="24">
            <el-table :data="tempIpMap">
              <el-table-column label="name" class-name="cell-input">
                <template slot-scope="scope">
                  <el-input v-model.trim="tempIpMap[scope.$index].name"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="value" class-name="cell-input">
                <template slot-scope="scope">
                  <el-input v-model.trim="tempIpMap[scope.$index].value"></el-input>
                </template>
              </el-table-column>
              <el-table-column class-name="cell-input" label="操作" width="120px">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="addHeadersRow(scope.$index, tempIpMap)"
                    type="text" size="small"><i class="el-icon-plus"></i></el-button>
                  <el-button
                    @click.native.prevent="deleteHeadersRow(scope.$index, tempIpMap)"
                    type="text" size="small"><i class="el-icon-delete"></i></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-form-item>

      </el-form>
    </el-main>
    <el-footer style="text-align: right;">
      <el-button type="primary" @click="saveApi">确认</el-button>
      <!--<el-button>取消</el-button>-->
    </el-footer>
  </el-container>

</template>

<script>


  export default {
    components: {},
    name: 'TestCaseDir',
    data () {
      return {
        // "config":[{"delayTime":30},{"httpCode":404}]   //目录配置信息，可选

        labelPosition:'right',
        mockDirInfo: {
          id: '',
          pathName: '',    //目录名称  必选
          description: '',
          pId: '',
          type:false,
          delayTime:'',
          httpCode:'',
          config:[],   //目录配置信息，可选
          isProxy:'false',   //是否需mock转发，默认false
          ipMap:null,   //当isProxy为true时，必填
        },
        //响应转态码
        responseState:[
          {
            value:'404'
          },
          {
            value:'500'
          }
        ],
        // ip
        tempIpMap:[
          {
            name:'',
            value:''
          }
        ]
      }
    },
    watch:{
      $route(){
        this.getData();
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      //获取初始化值
      getData(){
        var id = this.$route.query.id;
        if(id == 0){
          this.mockDirInfo= {
            id: '',
            pathName: '',    //目录名称  必选
            description: '',
            pId: '',
            type:false,
            delayTime:'',
            httpCode:'',
            config:[],   //目录配置信息，可选
            isProxy:'false',   //是否需mock转发，默认false
            ipMap:null,   //当isProxy为true时，必填
          }
          this.tempIpMap = [{name:'',value:''}];

        }else{
          var vueThis = this;
          vueThis.mockAxios({
            method: 'get',
            data: {
            },
            url: "testCase/getCaseById?id="+ id
          })
            .then(function (res) {
              if(res.data.code === 10000){
                vueThis.mockDirInfo= {
                  id: res.data.data.id,
                  pathName: res.data.data.name,    //目录名称  必选
                  description: res.data.data.description,
                  pId: res.data.data.pId,
                  type:false,
                  delayTime:res.data.data.delayTime,
                  httpCode:res.data.data.httpCode,
                  config:[],   //目录配置信息，可选
                  isProxy:res.data.data.isProxy,   //是否需mock转发，默认false
                  ipMap:null,   //当isProxy为true时，必填
                }

                if(vueThis.mockDirInfo.isProxy){
                  vueThis.tempIpMap = res.data.data.ipMap;
                  vueThis.mockDirInfo.isProxy = 'true'
                }else{
                  vueThis.tempIpMap = [{name:'',value:''}];
                  vueThis.mockDirInfo.isProxy = 'false'
                }

              }else{
                vueThis.$message.error('抱歉，获取信息失败：' + res.data.msg);
              }
            })
            .catch(function (err) {
              vueThis.$message.error(err);
            });
        }
      },
      //提交保存数据
      saveApi(){
        var id = this.$route.query.id;
        var vueThis = this;
        this.$refs['mockDir'].validate((valid) => {
          if (valid) {
            //转换数据格式
            var submitinfo = JSON.stringify(vueThis.mockDirInfo);
            submitinfo = JSON.parse(submitinfo);
            submitinfo.config = [
              {"delayTime":vueThis.mockDirInfo.delayTime},
              {"httpCode":vueThis.mockDirInfo.httpCode}
            ];

            if(vueThis.mockDirInfo.isProxy == 'true' ){
              submitinfo.ipMap = vueThis.tempIpMap;
              submitinfo.isProxy = true;
            }else{
              submitinfo.isProxy = false;
              submitinfo.ipMap = null;
            }

            delete submitinfo.delayTime;
            delete submitinfo.httpCode;
            console.log(submitinfo)

            /////////////////////////////////新增界面 确认按钮事件

            if(id == 0){
              this.mockDirInfo.pId = this.$route.query.pId;
              vueThis.mockAxios({
                method: 'post',
                data: submitinfo,
                url: "web-mock/mock/setPathInfo"
              })
                .then(function (res) {
                  if(res.data.code === 10000){
                    vueThis.$message({
                      message: '恭喜你，新增用例目录成功',
                      type: 'success'
                    });
                    // 跳转到当且mockDir的详情页
                    //存数据  树节点刷新
                    vueThis.$store.commit('changeMockStatus', 1);
                    vueThis.mockDirInfo.id = res.data.data.id;
                    vueThis.$store.commit('setNewMock', submitinfo);
                    vueThis.$router.push({name: 'MockDir', query: {id: res.data.data.id}});
                  }else{
                    vueThis.$message.error('抱歉，新增目录失败：' + res.data.msg);
                  }
                })
                .catch(function (err) {
                  vueThis.$message.error(err);
                });
            }else{     /////////////////////////编辑界面 确认按钮事件
              vueThis.mockAxios({
                method: 'post',
                data: submitinfo,
                url: "web-mock/mock/setPathInfo"
              })
                .then(function (res) {
                  if(res.data.code === 10000){
                    vueThis.$message({
                      message: '恭喜你，更新用例目录成功',
                      type: 'success'
                    });
                    //存数据  树节点刷新
                    vueThis.$store.commit('changeMockStatus', 2);
                    vueThis.mockDirInfo.id = res.data.data.id;
                    vueThis.$store.commit('setNewMock', submitinfo);
                  }else{
                    vueThis.$message.error('抱歉，新增用例目录失败：' + res.data.msg);
                  }
                })
                .catch(function (err) {
                  vueThis.$message.error(err);
                });
            }
          } else {
            return false;
          }
        });
      },
      //增加
      addHeadersRow(index, rows){
        var obj = {
          name: '',
          value: ''
        }
        rows.splice(index + 1, 0, obj);
      },
      //删除消息头中的一行
      deleteHeadersRow(index, rows) {
        if (index == 0 && rows.length == 1) {
          return;
        } else {
          rows.splice(index, 1);
        }
      },
    }
  }
</script>

<style scoped>

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
  .el-main {
    padding-right: 20%;
    padding-top: 30px;
  }
  .el-container {
    margin-left: 30px;
    margin-top: 5px;
  }
</style>
