<template>
        <el-container>
            <el-aside :width=asideWidth id="dragAside" class="leftAside">
              <div class="leftNavTree">
                <el-input
                  placeholder="输入接口名称进行过滤"
                >
                </el-input>
                <vue-content-menu :contextMenuData="contextMenuData"
                                  @addDir="addDir"
                                  @addItem="addApi"
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
                <el-dialog
                  :visible.sync="delDialogVisible"
                  width="420px"
                >
                  <span>确认删除？</span>
                  <span slot="footer" class="dialog-footer">
                      <el-button size="small" @click="delDialogVisible = false">取 消</el-button>
                      <el-button size="small" type="primary" @click="delApi">确 定</el-button>
                    </span>
                </el-dialog>
              </div>
              <!--<div class="dragLine"  id="drag"></div>-->
            </el-aside>
          <router-view></router-view>
        </el-container>
</template>

<script>

  /*import Router from 'vue-router';
  import store from '@/store';*/
  import VueContentMenu from '@/components/common/VueContentMenu.vue';
  import ElTree from '@/components/common/tree/src/tree.vue'

  export default {

  components: {  VueContentMenu, ElTree},

  name: 'AppMockMain',
  data () {
    return {
      asideWidth: '240px',
      isMouseDown: false,
      data: [],
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
      currentTreeNode: {},
      delDialogVisible: false
    }
  },

  computed: {
    isNewApiSaved() {
        return this.$store.state.appMock.isNewAppMockSaved;
    }
  },

  watch:{
      'isNewApiSaved': function (val, oldVal) { //新增api
        var node = this.$refs.tree.currentNode.node;
        console.log(node);
        if(val == 1){
          var newChild = this.$store.state.appMock.newAppMock;

          if (!node.data.children) {
            this.$set(node.data, 'children', []);
            node.childNodes.forEach(function (vaule, index, array) {
              node.data.children.push(vaule.data);
            })
          }

          if(newChild.type === false){
            newChild.children = [];
          }

          node.data.children.push(newChild);
          this.$store.commit( 'changeAppMockStatus', 0);
          node.updateChildren()

          if(!node.expanded){
              node.expand();
          }
        }else if(val == 2){
          var updatedApi = this.$store.state.appMock.newAppMock;

          if(updatedApi.id === node.data.id){
            node.data.name = updatedApi.name;
          }else{
            let children = node.childNodes;

            children.forEach(function (e, index) {
              if(e.data.id === updatedApi.id){
                e.data.name = updatedApi.name;
                return;
              }
            });
          }

          this.$store.commit( 'changeAppMockStatus', 0);
        }
      },

      'isMouseDown': function (val, oldVal) {
        console.log('isMouseDown:' + val)
      }
  },
  mounted(){
      //this.dragF();
  },
  methods: {
      dragF(){
        var oBox = document.getElementById("dragAside");
        var oBar = document.getElementById("drag");
        this.drag.getWidth(oBar, oBox);
      },
    handleNodeClick(data, node, instance){
      if(node.data.id === 0){
        this.$router.push({path: '/home/appMock'});
      }else if (node.data.type === true) {
        this.$router.push({name: 'AppMockEdit', params: {id: node.data.id}});
      } else {
        this.$router.push({name: 'AppMockDirEdit', params: {id: node.data.id}});
      }
    },

    loadNode(node, resolve) { //渲染树节点
      if(node.level === 0){
        return resolve([{ name:  'App测试桩', id: 0 , type: false}]);
      }else if(node.isLeaf === true){
          return;
      }else{
        var vueThis = this;
        this.appMockAxios({
          method: 'get',
          url: 'getByPId?pId=' + node.data.id
        }).then(function (res) {
          if(res.data.code === 10000){
            var tempApi = res.data.data;
            return resolve(res.data.data);
          }else {
            vueThis.$message.error('抱歉，获取接口信息失败：' + res.data.msg);
          }
        }).catch(function (err) {
            console.log('api:' + err)
          vueThis.$message.error('抱歉，服务器异常！' );
          vueThis.$message.error(err );
        });

      }
    },

    handleRightClick(data, node, instance, x, y){ //右键接口树
      if(node.data.type){
        this.contextMenuData.showAddDir = false;
        this.contextMenuData.showAddItem = false;
        this.contextMenuData.showDel = true;
      }else{
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

      if(!node.expanded){
        node.expand();
      }

      node.isLeaf = false;

      var pId = node.data.id;
      this.$router.push({name: 'AppMockDirNew', query: {pId: pId}});
      this.closeMenu();
    },

    addApi(){ //右键新增接口树节点
      var node = this.$refs.tree.currentNode.node;

      if(!node.expanded){
        node.expand();
      }

      node.isLeaf = false;

      var pId = node.data.id;
      this.$router.push({name: 'AppMockNew', query: {pId: pId}});
      this.closeMenu();
    },

    delItem(node){
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
    },

    delApi(){//删除树节点
      this.delDialogVisible = false;
      const node = this.$refs.tree.currentNode.node;
      const nodeId = node.data.id;

      var vueThis = this;

      if(node.isLeaf === false) {//删除目录

        this.appMockAxios({
          method: 'get',
          url: 'delDirById?id=' + nodeId
        }).then(function (res) {
          if (res.data.code === 10000) {
            this.delItem(node);

            vueThis.$message({
              message: '恭喜你，删除接口目录成功！',
              type: 'success'
            });

            vueThis.$router.push({path: '/home/appMock'});
          } else {
            vueThis.$message.error('抱歉，删除接口信息失败：' + res.data.msg);
          }
        }).catch(function (err) {
            console.log(err)
          vueThis.$message.error('抱歉，服务器异常！');
        });
      }else {//删除非目录
        this.appMockAxios({
          method: 'get',
          url: 'delById?id=' + nodeId
        }).then(function (res) {
          if (res.data.code === 10000) {
            vueThis.delItem(node);

            vueThis.$message({
              message: '恭喜你，删除接口目录成功！',
              type: 'success'
            });

            vueThis.$router.push({path: '/home/appMock'});
          } else {
            vueThis.$message.error('抱歉，删除接口信息失败：' + res.data.msg);
          }
        }).catch(function (err) {
          console.log(err)
          vueThis.$message.error('抱歉，服务器异常！');
        });
      }
    },

    showDelDialog(){
      this.closeMenu();
//      this.delDialogVisible = true;

      this.$confirm('此操作将永久删除该接口, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
//        confirmButtonClass: 'delApi',
        type: 'warning'
      }).then(() => {
        this.delApi();
//        this.$message({
//          type: 'success',
//          message: '删除成功!'
//        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    refreshApi(){//刷新节点
      var node = this.$refs.tree.currentNode.node;
      var vueThis = this;
      node.expand();

      this.appMockAxios({
        method: 'get',
        url: 'getByPId?pId=' + node.data.id
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
        vueThis.$message.error('服务器请求失败！');
      })

      node.data.type = false;

      node.updateChildren();
      node.expand();
      this.closeMenu();
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
aside {
  padding-left: 20px;
  padding-top: 20px;
  width: 100%;

}
.el-aside{
  -webkit-box-sizing: border-box;
  float:right;
}

.el-dialog__body{
  padding-left: 10px;
  text-align: left!important;
}
  .el-dialog__header{
    display: none;
    height: 100px;
  }

</style>
