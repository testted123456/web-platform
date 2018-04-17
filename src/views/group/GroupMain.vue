<template>
  <el-container>
    <el-aside width="240px" id="groupdragAside" class="leftAside">
      <div class="leftNavTree">
        <div class="menu">
          <el-input
            placeholder="输入测试集名称进行过滤"
            round
          >
          </el-input>
          <vue-content-menu :contextMenuData="contextMenuData"
                            @addDir="addDir"
                            @addItem="addGroup"
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
                    <el-button type="primary" @click="delGroup">确 定</el-button>
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
    name: 'TestCaseMain',
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
      isNewGroupSaved() {
        return this.$store.state.group.isNewGroupSaved;
      }
    },
    mounted(){
      //this.dragF();
    },
    watch: {
      'isNewGroupSaved': function (val, oldVal) { //新增group
        var node = this.$refs.tree.currentNode.node;

        if (val == 1) {

          if (!node.data.children) {
            this.$set(node.data, 'children', []);
            node.childNodes.forEach(function (vaule, index, array) {
              node.data.children.push(vaule.data);
            })
          }

          var newChild = this.$store.state.group.newGroup;

          if(newChild.type === "undefined"){
            return;
          }else if(newChild.type === false){
            newChild.children = [];
          }

          node.data.children.push(newChild);
          this.$store.commit('changeGroupStatus', 0);

          node.updateChildren()

          if (!node.expanded) {
            node.expand();
          }
        }else if(val == 2){
          var updatedGroup = this.$store.state.group.newGroup;

          if(updatedGroup.id === node.data.id){
            node.data.name = updatedGroup.name;
          }else{
            let children = node.childNodes;

            children.forEach(function (e, index) {
              if(e.data.id === updatedGroup.id){
                e.data.name = updatedGroup.name;
                return;
              }
            });
          }

          this.$store.commit( 'changeGroupStatus', 0);
        }
      }
    },
    methods: {
      dragF(){
        var oBox = document.getElementById("groupdragAside");
        var oBar = document.getElementById("groupdrag");
        this.drag.getWidth(oBar, oBox);
      },
      handleNodeClick(data, node, instance){
        if (node.data.type) {
          this.$router.push({name: 'Group', query: {id: node.data.id}});
        } else {
          this.$router.push({name: 'GroupDir', query: {id: node.data.id}});
        }
      },
      loadNode(node, resolve) { //渲染树节点
        if (node.level === 0) {
          return resolve([{
              name: '测试集',
              id: 0,
              type: false
          }]);
        } else if (node.isLeaf === true) {
          return;
        } else {
            var vueThis = this;
            vueThis.groupAxios({
              method: 'get',
              data: {
              },
              url: 'getByPid?pid='+node.data.id
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
        this.$router.push({name: 'GroupDir', query: {id: 0,pId: node.data.id}});
        this.closeMenu();
      },
      addGroup(){ //右键新增接口树节点
        var node = this.$refs.tree.currentNode.node;

        if (!node.expanded) {
          node.expand();
        }
        var pId = node.data.id;
        this.$router.push({name: 'Group', query: {id: 0,pId: node.data.id}});
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
          this.delGroup();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      delGroup(){ //右键删除group
        this.delDialogVisible = false;
        const node = this.$refs.tree.currentNode.node;
        const nodeId = node.data.id;
        var vueThis = this;
        if(node.isLeaf === false){//删除case目录
          vueThis.groupAxios({
            method: 'get',
            data: {
            },
            url: "deleteGroup?id=" + nodeId
          })
          .then(function (res) {
            if(res.data.code == '10000'){
              vueThis.delItemNode(node);
              vueThis.$message({
                message: '恭喜你，删除测试集目录成功！',
                type: 'success'
              });
            }else{
              vueThis.$message.error('抱歉，删除测试集目录失败：' + res.data.msg);
            }
          })
          .catch(function (err) {
            vueThis.$message.error('抱歉，服务器异常！' );
          });

        }else{ //删除某个case
          vueThis.groupAxios({
            method: 'get',
            data: {
            },
            url: "deleteGroup?id=" + nodeId
          })
          .then(function (res) {
            if(res.data.code == '10000'){
              vueThis.delItemNode(node);
              vueThis.$message({
                message: '恭喜你，删除测试集成功！',
                type: 'success'
              });
            }else{
              vueThis.$message.error('抱歉，删除测试集失败：' + res.data.msg);
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
        this.$router.push({name: 'GroupMain'});
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
