<template>
        <el-container>
            <el-aside :width=asideWidth id="dragAside" style="position:relative;border-right:1px solid #e6e6e6;overflow: scroll">
              <div style="position: absolute;left:20px;top:20px;padding-right:20px;">
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
              </div>
              <div style="width: 20px;height:100%;background:deeppink;position:absolute;right:0px;top:0;" @mousedown.stop ="onMouseDown"
                   @mousemove.stop="onMouseMove"
                   @mouseup="onMouseUp"
                   draggable="true" id="drag">
              </div>
            </el-aside>
          <router-view></router-view>
        </el-container>
</template>

<script>

  import Router from 'vue-router';
  import store from '@/store';
  import VueContentMenu from '@/components/common/VueContentMenu.vue';
  import ElTree from '@/components/common/tree/src/tree.vue'
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";

  export default {

  components: {ElCol, ElRow, Router, VueContentMenu, ElTree},

  name: 'ApiMain',
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
        return this.$store.state.api.isNewApiSaved;
    }
  },

  watch:{
      'isNewApiSaved': function (val, oldVal) { //新增api
        var node = this.$refs.tree.currentNode.node;
        console.log(node);
        if(val == 1){
          var newChild = this.$store.state.api.newApi;

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
          this.$store.commit( 'changeApiStatus', 0);
          node.updateChildren()

          if(!node.expanded){
              node.expand();
          }
        }else if(val == 2){
          var updatedApi = this.$store.state.api.newApi;
          node.data.name = updatedApi.name;
          this.$store.commit( 'changeApiStatus', 0);
        }
      },

      'isMouseDown': function (val, oldVal) {
        console.log('isMouseDown:' + val)
      }
  },
  mounted(){
      this.dragFun();
  },
  methods: {
    dragFun(){
      var div1 = document.getElementById("drag");
      div1.onmousedown = function(ev) {
        var oevent = ev || event;

        var distanceX = oevent.clientX - div1.offsetLeft;

        document.onmousemove = function (ev) {
          var oevent = ev || event;
          if(oevent.clientX - distanceX -20 > 202){
            div1.style.left = oevent.clientX - distanceX -20 + 'px';
            console.log(div1.style.left)
            document.getElementById("dragAside").style.width = oevent.clientX - distanceX + 20+  'px'
            console.log(document.getElementById("dragAside").style.width)
          }
        };
        document.onmouseup = function () {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }

    },
    onMouseDown(env){
//        var div1 = document.getElementById("drag");
//        var oevent  = env || envent;
////        this.isMouseDown = true;
//        var distanceX = oevent.clientX - div1.offsetLeft;
//        var disX = oEnv.clientX

//        document.onmousemove = function (env) {
//          console.log(this.asideWidth)
//          var oEnv = env || envent;
//          this.asideWidth = oEnv.clientX + 'px'
//          console.log(this.asideWidth)
//        }
//
//        document.onmouseup = function (env) {
//          document.onmousemove = null;
//        }
//      var oEnv = env || envent;
//
//      disX = oEnv.clientX - oDiv2.offsetLeft;
//      disY = oEnv.clientY - oDiv2.offsetLeft;
//
//      document.onmousemove = function (env) {
//        var oEnv = env || envent;
//        var l = oEnv.clientX - disX;
//
//        if(l<0){
//          l = 0;
//        }else if(l > oDiv1.offsetWidth - oDiv2.offsetWidth){
//          l = oDiv1.offsetWidth - oDiv2.offsetWidth;
//        }
//
//        oDiv2.style.left = l + 'px';
//        var scale = l/(oDiv1.offsetWidth-oDiv2.offsetWidth);
//
//        oDiv4.style.top = -scale*(oDiv4.offsetHeight-oDiv3.offsetHeight) + 'px';
//      }
//
//      document.onmouseup = function (env) {
//        document.onmousemove = null;
//      }
    },

    onMouseMove(env){
//      if(this.isMouseDown === true){
//        var oEnv = env || envent;
//        this.asideWidth = oEnv.clientX - oEnv.offsetX + 20 + 'px';
//        console.log(this.asideWidth)
//      }

//      document.onmouseup = function (env) {
//        this.isMouseDown = false;
//      }

    },

    onMouseUp(env){
//      this.isMouseDown = false;
    },


    handleNodeClick(data, node, instance){
      if(node.data.id === 0){
          console.log('xxx')
        this.$router.push({path: '/home/api'});
      }else if (node.data.type === true) {
        this.$router.push({name: 'ApiEdit', params: {id: node.data.id}});
      } else {
        this.$router.push({name: 'ApiDirEdit', params: {id: node.data.id}});
      }
    },

    loadNode(node, resolve) { //渲染树节点
      if(node.level === 0){
        return resolve([{ name:  '接口', id: 0 , type: false}]);
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

      node.isLeaf = false;

      var pId = node.data.id;
      this.$router.push({name: 'ApiDirNew', query: {pId: pId}});
      this.closeMenu();
    },

    addApi(){ //右键新增接口树节点
      var node = this.$refs.tree.currentNode.node;

      if(!node.expanded){
        node.expand();
      }

      node.isLeaf = false;

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

            this.$router.push({path: '/home/api'});
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

            this.$router.push({path: '/home/api'});
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

    refreshApi(){//刷新节点
      var node = this.$refs.tree.currentNode.node;
      var vueThis = this;

      this.apiAxios({
        method: 'get',
        url: 'api/getApiTreeByPId?pId=' + node.data.id
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
  overflow: scroll;
  -webkit-box-sizing: border-box;
  float:right;
}

</style>
