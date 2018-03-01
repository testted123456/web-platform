<template>
  <div class="container">
      <div>
        <el-container>
          <el-aside width="240px">
            <el-input
              placeholder="输入用例名称进行过滤"
              round
            >
            </el-input>
            <vue-content-menu :contextMenuData="contextMenuData"
                              @addDir="addDir"
                              @addItem="addCase"
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
  </div>

</template>

<script>
  import VueContentMenu from '@/components/common/VueContentMenu.vue';
  import {ElCol} from 'element-ui'

  export default {
    components: {ElCol, VueContentMenu},
    name: 'TestCaseMain',
    data () {
      return {
        data: [
          {id: 1, name: 'node1'},
          {
            id: 2, name: 'node2', children: [
            {id: 3, name: 'node2-1'}
          ]
          }
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
        }
      }
    },
    computed: {
      isNewTestCaseSaved() {
        return this.$store.state.testCase.isNewTestCaseSaved;
      }
    },
    watch: {
      'isNewTestCaseSaved': function (val, oldVal) { //新增testCase
        if (val == 1) {
          var node = this.$refs.tree.currentNode.node;

          if (!node.data.children) {
            this.$set(node.data, 'children', []);
            node.childNodes.forEach(function (vaule, index, array) {
              node.data.children.push(vaule.data);
            })
          }

          var newChild = this.$store.state.testCase.newTestCase;
          node.data.children.push(newChild);
          this.$store.commit('changeTestCaseStatus', 0);

          if (!node.expanded) {
            node.expand();
          }
        }
      }
    },
    methods: {

      handleNodeClick(data, node, instance){
        if (node.isLeaf) {
          this.$router.push({name: 'TestCaseEdit', params: {id: node.data.id}});
        } else {
          this.$router.push({name: 'TestCaseDirEdit', params: {id: node.data.id}});
        }
      },
      loadNode(node, resolve) { //渲染树节点
        if (node.level === 0) {
          return resolve([{name: 'Root', id: 0, type: false}]);
        } else if (node.isLeaf === true) {
          return;
        } else {

            //先注释 用本地数据
//          this.$http.get("http://192.168.32.105:8083/case/testCase/getCaseTreeByPId?pId=" + node.data.id).then(function (res) {
//            if (res.data.succeed) {
//              var tempApi = res.data.data;
//
//              return resolve(res.data.data);
//            }
//            return;
//
//          }, function (res) {
//
//          });

            var caseTreeData =
                        [{
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
            }, {
                "id": 2,
                "pId": 0,
                "name": "test",
                "description": "",
                "type": true,
                "env": "",
                "projectName": "",
                "createdBy": null,
                "createdTime": null,
                "updatedBy": null,
                "updatedTime": null,
                "optstatus": 0
            }];
            var tempApi = caseTreeData;

            return resolve(caseTreeData);

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
        this.$router.push({path: '/testCaseDirNew', query: {pId: pId}});
        this.closeMenu();
      },
      addCase(){ //右键新增接口树节点
        var node = this.$refs.tree.currentNode.node;

        if (!node.expanded) {
          node.expand();
        }

        var pId = node.data.id;
        this.$router.push({path: '/testCaseNew', query: {pId: pId}});
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
