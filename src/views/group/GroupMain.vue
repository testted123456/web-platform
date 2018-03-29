<template>
  <el-container>
    <el-aside width="240px" style="border-right:1px solid #e6e6e6">
      <div class="menu">
        <el-input
          placeholder="输入测试集名称进行过滤"
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
        title="提示"
        :visible.sync="delDialogVisible"
        width="30%"
      >
        <span>确认删除？</span>
        <span slot="footer" class="dialog-footer">
                    <el-button @click="delDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="delCase">确 定</el-button>
                  </span>
      </el-dialog>
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
    watch: {
      'isNewGroupSaved': function (val, oldVal) { //新增group
        if (val == 1) {
          var node = this.$refs.tree.currentNode.node;

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
        }
      }
    },
    methods: {

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
//          return resolve([
//              {
//                name: '测试集1',
//                id: 1,
//                type: true
//              },
//              {
//                name: '测试集2',
//                id: 2,
//                type: true
//              }
//          ]);
          var vueThis = this;
          this.axios.get(vueThis.groupServer+'getByPid?pid='+node.data.id)
            .then(function(res){
              if (res.data.code === 10000 ) {
                var tempApi = res.data.data;
                return resolve(res.data.data);
              }else{
                vueThis.$message.error('抱歉，获取信息失败：' + err.data.msg);
              }
            })



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
      addCase(){ //右键新增接口树节点
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
        this.delDialogVisible = true;
      },

      delCase(){ //右键删除case
        this.delDialogVisible = false;
        const node = this.$refs.tree.currentNode.node;
        const nodeId = node.data.id;
        var vueThis = this;
        if(node.isLeaf === false){//删除case目录

          this.axios.get(vueThis.groupServer + "deleteGroup?id=" + nodeId)
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

        }else{ //删除某个case
          this.axios.get(vueThis.groupServer + "deleteGroup?id=" + nodeId)
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

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
    overflow: scroll;
    -webkit-box-sizing: border-box;
  }
  aside {
    padding-left: 20px;
    padding-top: 20px;
    padding-right: 20px;
    width: 100%;
  }

</style>
