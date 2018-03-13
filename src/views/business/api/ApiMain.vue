<template>
    <div>
        <el-container>
            <el-aside  width="240px" >
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
                  title="提示"
                  :visible.sync="delDialogVisible"
                  width="30%"
                  >
                  <span>确认删除？</span>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="delDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="delApi">确 定</el-button>
                  </span>
                </el-dialog>
            </el-aside>
            <router-view></router-view>
        </el-container>
    </div>
</template>

<script>

  import Router from 'vue-router';
  import store from '@/store';
  import VueContentMenu from '@/components/common/VueContentMenu.vue';
  import ElTree from '@/components/common/tree/src/tree.vue'

  export default {

  components: {Router, VueContentMenu, ElTree},

  name: 'ApiMain',
  data () {
    return {
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
        return this.$store.state.api.isNewApiSaved;
    }
  },

  watch:{
      'isNewApiSaved': function (val, oldVal) { //新增api
        if(val == 1){
          var node = this.$refs.tree.currentNode.node;

          if (!node.data.children) {
            this.$set(node.data, 'children', []);
            node.childNodes.forEach(function (vaule, index, array) {
              node.data.children.push(vaule.data);
            })
          }

          var newChild = this.$store.state.api.newApi;

          if(newChild.type === false){
            newChild.children = [];
          }

          node.data.children.push(newChild);
          this.$store.commit( 'changeApiStatus', 0);

          if(!node.expanded){
              node.expand();
          }
        }
      }
  },

  methods: {
    handleNodeClick(data, node, instance){
      if (node.data.type === true) {
        this.$router.push({name: 'ApiEdit', params: {id: node.data.id}});
      } else {
        this.$router.push({name: 'ApiDirEdit', params: {id: node.data.id}});
      }
    },

    loadNode(node, resolve) { //渲染树节点
      if(node.level === 0){
        return resolve([{ name:  'Root', id: 0 , type: false}]);
      }else if(node.isLeaf === true){
          return;
      }else{
        this.$http.get(this.apiServer + "api/getApiTreeByPId?pId=" + node.data.id).then(function (res) {
          if(res.data.code == '10000'){
            var tempApi = res.data.data;
            return resolve(res.data.data);
          }
          return;
        },function (res) {

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

      var pId = node.data.id;
      this.$router.push({name: 'ApiDirNew', query: {pId: pId}});
      this.closeMenu();
    },

    addApi(){ //右键新增接口树节点
      var node = this.$refs.tree.currentNode.node;

      if(!node.expanded){
        node.expand();
      }

      var pId = node.data.id;
      this.$router.push({name: 'ApiNew', query: {pId: pId}});
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

      if(node.isLeaf === false){//删除目录
        this.$http.get(this.apiServer + "api/delApiDir?id=" + nodeId).then(function (res) {
          if(res.data.code == '10000'){
            this.delItem(node);

            this.$message({
              message: '恭喜你，删除接口目录成功！',
              type: 'success'
            });
          }else{
            this.$message.error('抱歉，删除接口目录失败：' + res.data.msg);
          }
        },function (res) {
          this.$message.error('抱歉，服务器异常。');
        });
      }else{
        this.$http.get(this.apiServer + "api/delApi?id=" + nodeId).then(function (res) {
          if(res.data.code == '10000'){
            this.delItem(node);

            this.$message({
              message: '恭喜你，删除接口成功！',
              type: 'success'
            });
          }else{
            this.$message.error('抱歉，删除接口失败：' + res.data.msg);
          }
        },function (res) {
          this.$message.error('抱歉，服务器异常。');
        });
      }
    },

    showDelDialog(){
      this.closeMenu();
      this.delDialogVisible = true;
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
aside {
  padding-left: 20px;
  padding-top: 20px;
  width: 100%;
}

</style>
