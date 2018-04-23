<template>
  <el-container>
    <el-aside width="240px"  class="leftAside">
      <div class="leftNavTree">
        <div class="menu">
          <el-input
            placeholder="输入用例流名称进行过滤"
            round
          >
          </el-input>
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
            @node-click="handleNodeClick" @node-right-click="handleRightClick"
          >
          </el-tree>
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
      <!--<div class="dragLine" id="groupdrag"></div>-->
    </el-aside>
    <router-view></router-view>
  </el-container>
</template>

<script>

  import VueContentMenu from '@/components/common/VueContentMenu.vue';
  import ElTree from '@/components/common/tree/src/tree.vue';

  export default {
    components: { VueContentMenu,ElTree},
    name: 'FlowCaseMain',
    data () {
      return {
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
      isNewFlowCaseSaved() {
        return this.$store.state.flowCase.isNewFlowCaseSaved;
      }
    },
    mounted(){
    },
    watch: {
      'isNewFlowCaseSaved': function (val, oldVal) { //新增FlowCase
        var node = this.$refs.tree.currentNode.node;

        if (val == 1) {

          if (!node.data.children) {
            this.$set(node.data, 'children', []);
            node.childNodes.forEach(function (vaule, index, array) {
              node.data.children.push(vaule.data);
            })
          }

          var newChild = this.$store.state.flowCase.newFlowCase;

          if(newChild.type === "undefined"){
            return;
          }else if(newChild.type === false){
            newChild.children = [];
          }

          node.data.children.push(newChild);
          this.$store.commit('changeFlowCaseStatus', 0);

          node.updateChildren()

          if (!node.expanded) {
            node.expand();
          }
        }else if(val == 2){
          var updatedFlowCase = this.$store.state.flowCase.newFlowCase;

          if(updatedFlowCase.id === node.data.id){
            node.data.name = updatedFlowCase.name;
          }else{
            let children = node.childNodes;

            children.forEach(function (e, index) {
              if(e.data.id === updatedFlowCase.id){
                e.data.name = updatedFlowCase.name;
                return;
              }
            });
          }

          this.$store.commit( 'changeFlowCaseStatus', 0);
        }
      }
    },
    methods: {

      handleNodeClick(data, node, instance){
        if (node.data.type) {
          this.$router.push({name: 'FlowCase', query: {id: node.data.id}});
        } else {
          this.$router.push({name: 'FlowCaseDir', query: {id: node.data.id}});
        }
      },
      loadNode(node, resolve) { //渲染树节点
        if (node.level === 0) {
          return resolve([{
              name: '用例流',
              id: 0,
              type: false
          }]);
        } else if (node.isLeaf === true) {
          return;
        } else {
            var vueThis = this;
            vueThis.testCaseAxios({
              method: 'get',
              url: 'flowCase/getTreeByPId?pId='+node.data.id
            })
            .then(function(res){
              if (res.data.code === 10000 ) {
                var tempApi = res.data.data;
                return resolve(res.data.data);
              }else{
                vueThis.$message.error('抱歉，获取信息失败：' + err.data.msg);
              }
            })
            .catch(function (err) {
              vueThis.$message.error('抱歉，服务器异常！' );
            });


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
        this.$router.push({name: 'FlowCaseDir', query: {id: 0,pId: node.data.id}});
        this.closeMenu();
      },
      addCase(){ //右键新增接口树节点
        var node = this.$refs.tree.currentNode.node;

        if (!node.expanded) {
          node.expand();
        }
        var pId = node.data.id;
        this.$router.push({name: 'FlowCase', query: {id: 0,pId: node.data.id}});
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
            url: "flowCase/delete?id=" + nodeId
          })
          .then(function (res) {
            if(res.data.code == '10000'){
              vueThis.delItemNode(node);
              vueThis.$message({
                message: '恭喜你，删除用例流目录成功！',
                type: 'success'
              });
            }else{
              vueThis.$message.error('抱歉，删除用例流目录失败：' + res.data.msg);
            }
          })
          .catch(function (err) {
            vueThis.$message.error('抱歉，服务器异常！' );
          });

        }else{ //删除某个case
          vueThis.testCaseAxios({
            method: 'get',
            url: "flowCase/delete?id=" + nodeId
          })
          .then(function (res) {
            if(res.data.code == '10000'){
              vueThis.delItemNode(node);
              vueThis.$message({
                message: '恭喜你，删除用例流成功！',
                type: 'success'
              });
            }else{
              vueThis.$message.error('抱歉，删除用例流失败：' + res.data.msg);
            }
          })
          .catch(function (err) {
            vueThis.$message.error('抱歉，服务器异常！' );
          });

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
        this.$router.push({name: 'FlowCaseMain'});
      },
      refreshApi(){
        var node = this.$refs.tree.currentNode.node;
        node.expand();
        this.closeMenu();
      }
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
    padding-left: 20px;
    padding-top: 20px;
    padding-right: 20px;
    width: 100%;
  }

</style>
