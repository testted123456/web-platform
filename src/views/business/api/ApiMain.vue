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
            </el-aside>
            <router-view></router-view>
        </el-container>
    </div>
</template>

<script>

  import VueContentMenu from '@/components/common/VueContentMenu.vue'

export default {
  components: {ElContainer, ElMain, ElCol,Router,VueContentMenu},
  name: 'ApiMain',
  data () {
    return {
      data: [
        {id: 1, name: 'node1'},
        {id: 2, name: 'node2', children:[
          {id: 3, name: 'node2-1'}
        ]}
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
      currentTreeNode: {}
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
//      this.$router.push('/apiEdit')
      let id = node.data.id;
      this.$router.push({ name: 'ApiEdit', params: {id: id}});
    },

    loadNode(node, resolve) { //渲染树节点
      if(node.level === 0){
        return resolve([{ name:  'Root', id: 0 , type: false}]);
      }else if(node.isLeaf === true){
          return;
      }else{
        this.$http.get("http://192.168.32.105:8082/inter/api/getApiTreeByPId?pId=" + node.data.id).then(function (res) {
          if(res.data.succeed){
            var tempApi = res.data.data;
//            tempApi.requestHead = JSON.parse(tempApi.requestHead);
//            tempApi.responseHead = JSON.parse(tempApi.responseHead);
            return resolve(res.data.data);
          }
          return;

        },function (res) {

        });
        /**
          if(node.data.children){
              return resolve(node.data.children);
          }else{
            return resolve([{ name: 'region1', id: 1, type: false }, { name: 'region2', id: 2 }]);
          }**/
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
      this.$router.push({path: '/apiDirNew', query: {pId: pId}});
      this.closeMenu();
    },

    addApi(){ //右键新增接口树节点
      var node = this.$refs.tree.currentNode.node;

      if(!node.expanded){
        node.expand();
      }

      var pId = node.data.id;
      this.$router.push({path: '/apiNew', query: {pId: pId}});
      this.closeMenu();
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
