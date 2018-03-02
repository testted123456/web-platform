<template>
    <el-aside width="200px">
        <div >
            <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
            </el-input>
            <el-tree
                :props="props1"
                :load="loadNode1"
                node-key="id"
                lazy
                :render-content="renderContent">
                >
            </el-tree>
            <!--<el-tree-->
            <!--:data="data4"-->
            <!--show-checkbox-->
            <!--node-key="id"-->
            <!--default-expand-all-->
            <!--:expand-on-click-node="false"-->
            <!--:render-content="renderContent">-->
            <!--</el-tree>-->
        </div>
    </el-aside>
</template>


<script>
    export default {
        data() {
            return {
                data: [],
                props1: {
                    label: 'name',
                    isLeaf: 'leaf'
                }
            };
        },
        methods: {
            loadNode1(node, resolve) {
                console.log(this.data);
                if (node.level === 0) {
                    return resolve([{name: 'region', id: 1}]);
                }
                if (node.level > 1) return resolve([]);

                setTimeout(() => {

                    const data = [{
                        name: 'leaf',
                        leaf: false,
                        id: 2
                    }, {
                        name: 'zone',
                        id: 3
                    }];

                    resolve(data);
                }, 500);
            },
            renderContent(h, { node, data, store }) {
                return (
                    <span class="custom-tree-node">
                    <span>{node.label}</span>
                <span>
                <el-button size="mini" type="text" on-click={ () => this.append(data) }>append</el-button>
                <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>delete</el-button>
                </span>
                </span>);
            },
            append(data) {
                const newChild = {id: 4, label: 'testtest', leaf: true, children: []};
                if (!data.children) {
                    this.$set(data, 'children', []);
                }
                data.children.push(newChild);
            },

            remove(node, data) {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
            }

        }
    };
</script>
<!--<style>-->
    <!--.custom-tree-node {-->
        <!--flex: 1;-->
        <!--display: flex;-->
        <!--align-items: center;-->
        <!--justify-content: space-between;-->
        <!--font-size: 14px;-->
        <!--padding-right: 8px;-->
    <!--}-->
<!--</style>-->
