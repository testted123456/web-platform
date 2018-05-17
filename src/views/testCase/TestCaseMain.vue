<template>
  <el-container>
    <el-aside width="280px" id="testCasedragAside" class="leftAside">
      <div class="leftNavTree">
        <div class="menu">

          <div style="text-align: left;">
            <el-button @click="show = !show" style="padding:12px 95px;">搜 索 <i class="el-icon-search"></i></el-button>

            <div style="display: flex; margin-top: 20px; height: 1px;width:100%;background-color: #fff;">
              <el-collapse-transition name="el-fade-in-linear">
                <div v-show="show" class="transition-box">

                  <el-row style="padding:4px 0">
                    <el-col :span="6" style="padding-top:8px;color:#999;font-size: 12px; ">名称</el-col>
                    <el-col :span="18">
                      <el-input v-model.trim="searchInfo.name" placeholder="请输入名称"></el-input>
                    </el-col>
                  </el-row>
                  <el-row style="padding:4px 0">
                    <el-col :span="6" style="padding-top:8px; color:#999;font-size: 12px;">创建人</el-col>
                    <el-col :span="18">
                      <el-input v-model.trim="searchInfo.createdBy" placeholder="请输入创建人"></el-input>
                    </el-col>
                  </el-row>
                  <el-row style="padding:4px 0">
                    <el-col :span="6" style="padding-top:8px; color:#999;font-size: 12px;">Api名称</el-col>
                    <el-col :span="18">
                      <el-input v-model.trim="searchInfo.apiName" placeholder="请输入Api名称"></el-input>
                    </el-col>
                  </el-row>
                  <el-row style="padding:4px 0">
                    <el-col :span="6" style="padding-top:8px; color:#999;font-size: 12px;">Api地址</el-col>
                    <el-col :span="18">
                      <el-input v-model.trim="searchInfo.urlAddress" placeholder="请输入Api地址"></el-input>
                    </el-col>
                  </el-row>

                  <el-row style="padding:4px 0">
                    <el-col :span="24">
                      <el-button @click="filterTreeData">确认</el-button>
                    </el-col>
                  </el-row>

                </div>
              </el-collapse-transition>

            </div>
          </div>


          <!--<el-input-->
            <!--placeholder="输入用例名称进行过滤"-->
            <!--round-->
          <!--&gt;-->
          <!--</el-input>-->

          <div style="padding-top:0px;">
            <vue-content-menu :contextMenuData="contextMenuData"
                              @addDir="addDir"
                              @addItem="addCase"
                              @delItem="showDelDialog"
                              @refreshApi="refreshApi"
            ></vue-content-menu>
            <el-tree
              :props="props"
              :load="loadNode"
              ref="tree"
              :expand-on-click-node=false
              lazy
              node-key="id"
              @node-click = "handleNodeClick"
              @node-right-click = "handleRightClick"
            >
            </el-tree>
          </div>

        </div>
        <el-dialog
          :visible.sync="delDialogVisible"
          width="20%"
        >
          <span>确认删除？</span>
          <span slot="footer" class="dialog-footer">
                    <el-button @click="delDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="delCase">确 定</el-button>
                  </span>
        </el-dialog>
      </div>
    </el-aside>
    <router-view></router-view>
  </el-container>
</template>

<script>

  import VueContentMenu from '@/components/common/VueContentMenu.vue';
  import ElTree from '@/components/common/tree/src/tree.vue';

  export default {
    components: { VueContentMenu,ElTree},
    name: 'TestCaseMain',
    data () {
      return {
        show:false,
        searchInfo:{
          name:'',
          createdBy:'',
          urlAddress:'',
          apiName:''
        },
        data: [

        ],
        props: {
          label: 'name',
          isLeaf: 'type',
          children: 'children'
        },
        contextMenuData: {
          isDisplay: 'none',
          axios: {
            x: null,
            y: null
          },
          showAddDir: false,
          showAddItem: false,
          showDel: false
        },
        delDialogVisible: false
      }
    },
    computed: {
      isNewTestCaseSaved() {
        return this.$store.state.testCase.isNewTestCaseSaved;
      }
    },
    watch: {
      'isNewTestCaseSaved': function (val, oldVal) { //新增testCase
        if(this.$refs.tree.currentNode == null){
         // this.refreshApi();
          console.log('refresh')
        }else{
          var node = this.$refs.tree.currentNode.node;
          if (val == 1) {
            if (!node.data.children) {
              this.$set(node.data, 'children', []);
              node.childNodes.forEach(function (vaule, index, array) {
                node.data.children.push(vaule.data);
              })
            }

            var newChild = this.$store.state.testCase.newTestCase;
            if(newChild.type === "undefined"){
              return;
            }else if(newChild.type === false){
              newChild.children = [];
            }
            node.data.children.push(newChild);
            this.$store.commit('changeTestCaseStatus', 0);

            node.updateChildren()

            if (!node.expanded) {
              node.expand();
            }
          }else if(val == 2){

            var updatedCase = this.$store.state.testCase.newTestCase;

            if(updatedCase.id === node.data.id){
              node.data.name = updatedCase.name;
            }else{
              let children = node.childNodes;

              children.forEach(function (e, index) {
                if(e.data.id === updatedCase.id){
                  e.data.name = updatedCase.name;
                  return;
                }
              });
            }

            this.$store.commit( 'changeTestCaseStatus', 0);

          }
        }

      }
    },
    mounted(){
    },
    methods: {
      //过滤搜索树的内容
      filterTreeData(){


        if(this.searchInfo.createdBy == '' && this.searchInfo.name == '' && this.searchInfo.apiName == '' && this.searchInfo.urlAddress == ''){
          this.$message.error('请输入要筛选的条件！' );
        }else{


          var vueThis = this;
          vueThis.testCaseAxios({
            method: 'get',
            url: "testCase/searchCase?name="+ vueThis.searchInfo.name +"&createdBy="+ vueThis.searchInfo.createdBy +"&apiName="+ vueThis.searchInfo.apiName +"&urlAddress="+ vueThis.searchInfo.urlAddress
          })
          .then(function (res) {
            if (res.data.code === 10000 ) {
              if(res.data.data.length === 0){
                vueThis.$message.error('搜索出的信息为空！' );
              }
              vueThis.show = false;
              var  node = vueThis.$refs.tree.root.childNodes[0];
              node.loaded = true;
              node.data.children = res.data.data;
              node.updateChildren();
              node.expand();
            }else{
              vueThis.$message.error('抱歉，服务器异常！' );
            }

          })
          .catch(function (err) {
            vueThis.$message.error(err);
          });
        }
      },
      // 懒加载树内容
      loadNode(node, resolve) { //渲染树节点

        if (node.level === 0) {
          return resolve([{name: '测试用例', id: 0, type: false}]);
        } else if (node.isLeaf === true) {
          return;
        } else {
          var vueThis = this;

          if(node.data.children){
            return resolve(node.data.children);
          }else{
            vueThis.testCaseAxios({
              method: 'get',
              url: "testCase/getCaseTreeByPId?pId=" + node.data.id
            })
              .then(function (res) {
                if (res.data.code === 10000 ) {
                  var tempApi = res.data.data;
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



        }
      },
      //刷新
      refreshApi(){

        var node = this.$refs.tree.currentNode.node;
        var vueThis = this;
        node.expand();

        this.testCaseAxios({
          method: 'get',
          url: "testCase/getCaseTreeByPId?pId=" + node.data.id
        }).then(function (res) {
          if(res.data.code === 10000){
            node.data.children = res.data.data;
          }else{
            vueThis.$message({
              message: '刷新失败' + res.data.msg,
              type: 'error'
            });
          }
        }).catch(function (err) {
          vueThis.$message.error(err);
        })

        node.data.type = false;

        node.updateChildren();
        node.expand();

        this.closeMenu();
      },

      handleNodeClick(data, node, instance){
        if (node.data.type) {
          this.$router.push({name: 'TestCase', query: {id: node.data.id}});
        } else {
          this.$router.push({name: 'TestCaseDir', query: {id: node.data.id}});
        }
      },

      handleRightClick(data, node, instance, x, y){ //右键接口树
        if (node.data.type) {
          this.contextMenuData.showAddDir = false;
          this.contextMenuData.showAddItem = false;
          this.contextMenuData.showDel = true;
        } else {
          this.contextMenuData.showAddDir = true;
          this.contextMenuData.showAddItem = true;
          this.contextMenuData.showDel = true;
        }

        this.contextMenuData.axios.x = x;
        this.contextMenuData.axios.y = y;
        this.contextMenuData.isDisplay = 'block';
        this.currentTreeNode = node;
      },
      closeMenu(){ //关闭右键菜单
        this.contextMenuData.isDisplay = 'none';
      },
      addDir(){ //新增接口树目录节点
        var node = this.$refs.tree.currentNode.node;

        if (!node.expanded) {
          node.expand();
        }

        var pId = node.data.id;
        this.$router.push({name: 'TestCaseDir', query: {id: 0,pId: node.data.id}});
        this.closeMenu();
      },
      addCase(){ //右键新增接口树节点
        var node = this.$refs.tree.currentNode.node;

        if (!node.expanded) {
          node.expand();
        }
        var pId = node.data.id;
        this.$router.push({name: 'TestCase', query: {id: 0,pId: node.data.id}});
        this.closeMenu();
      },
      showDelDialog(){
        this.closeMenu();
        // this.delDialogVisible = true;

        this.$confirm('此操作将永久删除该接口, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delCase();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      delCase(){ //右键删除case
        this.delDialogVisible = false;
        const node = this.$refs.tree.currentNode.node;
        const nodeId = node.data.id;
        var vueThis = this;
        if(node.isLeaf === false){//删除case目录
          vueThis.testCaseAxios({
            method: 'get',
            url: 'testCase/deleteTestCaseDir?id='+nodeId
          })
            .then(function (res) {
              if(res.data.code == '10000'){
                vueThis.delItemNode(node);
                vueThis.$message({
                  message: '恭喜你，删除用例目录成功！',
                  type: 'success'
                });
              }else{
                vueThis.$message.error('抱歉，删除用例目录失败：' + res.data.msg);
              }
            }).catch(function (err) {
            vueThis.$message.error(err);
          });
        }else{ //删除某个case
          vueThis.testCaseAxios({
            method: 'get',
            url: "testCase/deleteCase?id=" + nodeId
          })
            .then(function (res) {
              if(res.data.code == '10000'){
                vueThis.delItemNode(node);
                vueThis.$message({
                  message: '恭喜你，删除用例成功！',
                  type: 'success'
                });
              }else{
                vueThis.$message.error('抱歉，删除用例失败：' + res.data.msg);
              }
            }).catch(function (err) {
            vueThis.$message.error(err);
          });;
        }
      },
      delItemNode(node){
        const data = node.data;
        const parent = node.parent;
        const children = parent.childNodes;
        let i;
        children.forEach(function (e, index) {
          if(e.data.id === node.data.id){
            i = index;
            return;
          }
        });
        children.splice(i, 1);
        this.$router.push({name: 'TestCaseMain'});
      },

    }
  }
</script>

<style scoped>
@import "../../assets/css/common.css";
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
  .el-aside{
    -webkit-box-sizing: border-box;
  }
  aside {
    padding-left: 10px;
    padding-top: 20px;
    padding-right: 10px;
    width: 100%;
  }

.transition-box {
  margin-bottom: 10px;
  width: 100%;
  height: 260px;
  border-radius: 4px;
  background-color: rgb(236, 243, 250);
  text-align: center;
  color: #fff;
  padding: 2px;
  box-sizing: border-box;
  /*margin-right: 20px;*/
  z-index: 2;
}


</style>
