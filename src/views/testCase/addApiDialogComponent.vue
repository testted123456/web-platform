<template>
  <el-container>
    <el-row >
      <el-col :span="12" style="border:1px solid #ccc;border-radius:3px;">
        <div class="vue-transfer-tree">
          <label class="vue-transfer-label">接口</label>
          <div style="text-align: center;padding-top:10px;">
            <el-button @click="show = !show" style="width:60%;">搜 索 <i class="el-icon-search"></i></el-button>

            <div style="display: flex; margin-top: 20px; height: 1px;width:100%;background-color: #fff;">
              <el-collapse-transition name="el-fade-in-linear">
                <div v-show="show" class="transition-box" style="z-index: 99">
                  <el-row style="padding:4px 0">
                    <el-col :span="4" style="padding-top:8px;color:#999;font-size: 12px; ">App字段</el-col>
                    <el-col :span="20">
                      <el-input v-model.trim="searchInfo.app" placeholder="请输入App字段"></el-input>
                    </el-col>
                  </el-row>
                  <el-row style="padding:4px 0">
                    <el-col :span="4" style="padding-top:8px;color:#999;font-size: 12px; ">API名称</el-col>
                    <el-col :span="20">
                      <el-input v-model.trim="searchInfo.name" placeholder="请输入API名称"></el-input>
                    </el-col>
                  </el-row>
                  <el-row style="padding:4px 0">
                    <el-col :span="4" style="padding-top:8px; color:#999;font-size: 12px;">API URL</el-col>
                    <el-col :span="20">
                      <el-input v-model.trim="searchInfo.urlAddress" placeholder="请输入API URL"></el-input>
                    </el-col>
                  </el-row>
                  <el-row style="padding:4px 0">
                    <el-col :span="4" style="padding-top:8px; color:#999;font-size: 12px;">API分支</el-col>
                    <el-col :span="20">
                      <el-input v-model.trim="searchInfo.branch" placeholder="请输入API分支"></el-input>
                    </el-col>
                  </el-row>
                  <el-row style="padding:4px 0">
                    <el-col :span="4" style="padding-top:8px; color:#999;font-size: 12px;">API模块</el-col>
                    <el-col :span="20">
                      <el-input v-model.trim="searchInfo.module" placeholder="请输入API模块"></el-input>
                    </el-col>
                  </el-row>
                  <el-row style="padding:4px 0">
                    <el-col :span="4" style="padding-top:8px; color:#999;font-size: 12px;">API系统</el-col>
                    <el-col :span="20">
                      <el-input v-model.trim="searchInfo.system" placeholder="请输入API系统"></el-input>
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

          <!--<el-tree :load="loadNode"-->
                   <!--lazy-->
                   <!--ref="tree"-->
                   <!--:props="defaultProps"-->
                   <!--@node-click="handleNodeClick">-->
          <!--</el-tree>-->
          <el-table
            :show-header=true
            @row-dblclick="dblclick"
            @row-click='addrowclick'
            ref="apisTable"
            highlight-current-row
            :data="filterData"
            style="width: 100%; margin-top: 2px">
            <el-table-column
              prop="name"
              label="API名称" >
            </el-table-column>
            <el-table-column
              prop="urlAddress"
              label="API URL" >

            </el-table-column>
            <el-table-column
              prop="branch"
              label="API分支" >
              <!--<template slot-scope="scope">-->
                <!--<el-input type="text" v-model="scope.row.branch"></el-input>-->
              <!--</template>-->
            </el-table-column>
            <el-table-column
              prop="module"
              label="API模块" >
            </el-table-column>
            <el-table-column
              prop="system"
              label="API系统" >
            </el-table-column>

          </el-table>

        </div>
      </el-col>
      <el-col :span="2">
        <div style="text-align: center;margin-left: 2px;margin-top: 80%">
          <div><input type="button" value=">" @click="addApi" style="border-radius: 60px;height: 40px;width: 40px"/></div>
        </div>
      </el-col>
      <el-col :span="10" style="border:1px solid #ccc;border-radius:3px;">
        <div class="vue-transfer-tree">
          <label class="vue-transfer-label">已选接口</label>
          <el-table
            :show-header=true
            @row-click="rowClick"
            ref="singleTable"
            highlight-current-row
            :data="tempApis"
            style="width: 100%; margin-top: 2px">
            <el-table-column
              prop="name"
              label="接口名称" min-width="150">
              <template slot-scope="scope">
                <el-button type="text">{{ scope.row.name }}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="system"
              label="系统">
            </el-table-column>
            <el-table-column
              prop="branch"
              label="分支">
            </el-table-column>
            <el-table-column
              prop="action"
              label="操作">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, tempApis)"
                  type="text"
                  size="small">
                  <i class="el-icon-minus"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>

  export default {
    props: ['selectedApis'],
    components: {},
    name: 'addApiDialogComponent',
    data(){
      return {
        addRowData:{},
        filterData:[],
        show:true,
        searchInfo:{
          app:'',
          name:'',
          urlAddress:'',
          branch:'',
          module:'',
          system:''
        },
        defaultProps:{
          label: 'name',
          isLeaf: 'type',
          children: 'children'
        },
        tempApis:[],
        submitApis:[]
      }
    },

    created(){
      //字符串截取显示
      // submitApis 需要提交的数据
      // tempApis   展示数据

      var a = this.selectedApis;
      a = JSON.stringify(a)
      a = JSON.parse(a);

      var b = this.selectedApis;
      b = JSON.stringify(b)
      b = JSON.parse(b);

      this.submitApis= a;
      this.tempApis = b;

      var that = this;
      this.tempApis.forEach(function(val,index,arr){
        if(that.getString(val.name) > 50){
          val.name = that.cutstr(val.name , 50)
        }
      })

    },

    methods: {
      getString(str){
        // return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  //先把中文替换成两个字节的英文，在计算长度
        var realLength = 0, len = str.length, charCode = -1;
        for (var i = 0; i < len; i++) {
          charCode = str.charCodeAt(i);
          if (charCode >= 0 && charCode <= 128) realLength += 1;
          else realLength += 2;
        }
        return realLength;
      },
      cutstr(str, len) {
        var str_length = 0;
        var str_len = 0;
        var str_cut = new String();
        str_len = str.length;
        for (var i = 0; i < str_len; i++) {
          var a = str.charAt(i);
          str_length++;
          if (escape(a).length > 4) {
            //中文字符的长度经编码之后大于4
            str_length++;
          }
          str_cut = str_cut.concat(a);
          if (str_length >= len) {
            str_cut = str_cut.concat("...");
            return str_cut;
          }
        }
        //如果给定字符串小于指定长度，则返回源字符串；
        if (str_length < len) {
          return str;
        }
      },

      //过滤搜索树的内容
      filterTreeData(){
        // if(this.searchInfo.name == '' && this.searchInfo.urlAddress == '' && this.searchInfo.branch == '' && this.searchInfo.module == '' && this.searchInfo.system == ''){
        //   this.$message.error('请输入要筛选的条件！' );
        // }else{
        //   if(this.searchInfo.system == ''){
        //     this.$message.error('api系统必填！' );
        //   }else if(this.searchInfo.name == '' && this.searchInfo.urlAddress == ''){
        //     this.$message.error('api名称或则api url需要选填一项！' );
        //   }else{
            var vueThis = this;
            vueThis.apiAxios({
              method: 'get',
              url: "api/searchApi?name="+ vueThis.searchInfo.name +"&urlAddress="+ vueThis.searchInfo.urlAddress +"&branch="+ vueThis.searchInfo.branch +"&module="+ vueThis.searchInfo.module +"&system="+ vueThis.searchInfo.system
              +"&app="+vueThis.searchInfo.app
            })
              .then(function (res) {

                if (res.data.code === 10000 ) {
                  if(res.data.data.length === 0){
                    vueThis.$message.error('搜索出的信息为空！' );
                  }
                  vueThis.show = false;
                  vueThis.filterData = res.data.data;
                  // var  node = vueThis.$refs.tree.root.childNodes[0];
                  // node.loaded = true;
                  // node.data.children = res.data.data;
                  // node.updateChildren();
                  // node.expand();
                }else{
                  vueThis.$message.error('抱歉，服务器异常！' );
                }

              })
              .catch(function (err) {
                vueThis.$message.error(err);
              });
          // }

        // }
      },
      // 懒加载树内容
      loadNode(node, resolve) { //渲染树节点

        if (node.level === 0) {
          return resolve([{name: '接口', id: 0, type: false}]);
        } else if (node.isLeaf === true) {
          return;
        } else {
          var vueThis = this;

          if(node.data.children){
            return resolve(node.data.children);
          }else{
            vueThis.apiAxios({
              method: 'get',
              url: "api/getApiTreeByPId?pId=" + node.data.id
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

      handleNodeClick(data, node, instance) {
      },
      //表格某行双击
      dblclick(row, event){
        console.log(row)
        var data = row;

        var newApiData = {
          checked:false,
          id:'',
          // testCase:data.testCase,
          interfaceId: data.id,
          apiType: data.apiType,
          postWay: data.postWay,
          orderNo:'',
          step:'',
          name:data.name,
          branch:data.branch,
          system:data.system,
          urlAddress:data.urlAddress,
          variables:null,
          requestHead:data.requestHead,
          requestBody:data.requestBody,
          responseHead:data.responseHead,
          responseBody:data.responseBody,
          assertions:null
        }

        this.submitApis.push(newApiData);

        newApiData = JSON.stringify(newApiData);
        newApiData = JSON.parse(newApiData);

        console.log(this.getString(newApiData.name))

        if(this.getString(newApiData.name) > 50){
          newApiData.name = this.cutstr(newApiData.name , 50)
        }

        console.log(newApiData.name)

        this.tempApis.push(newApiData);

      },
      //表格某行单次点击
      addrowclick(row, event, column){
        this.addRowData = row;
      },
      //增加到右边表格数组
      addApi(){
        var data = this.addRowData;
        if(JSON.stringify(data) == "{}"){
          this.$message.error('抱歉，请先选择你要增加的接口！' );
        }else{
          var newApiData = {
            checked:false,
            id:'',
            testCase:data.testCase,
            interfaceId: data.id,
            apiType: data.apiType,
            postWay: data.postWay,
            orderNo:'',
            step:'',
            name:data.name,
            branch:data.branch,
            system:data.system,
            urlAddress:data.urlAddress,
            variables:null,
            requestHead:data.requestHead,
            requestBody:data.requestBody,
            responseHead:data.responseHead,
            responseBody:data.responseBody,
            assertions:null
          }

          this.submitApis.push(newApiData);

          newApiData = JSON.stringify(newApiData);
          newApiData = JSON.parse(newApiData);

          console.log(this.getString(newApiData.name))

          if(this.getString(newApiData.name) > 50){
            newApiData.name = this.cutstr(newApiData.name , 50)
          }

          console.log(newApiData.name)

          this.tempApis.push(newApiData);
        }

      },
      rowClick(row, event, column){
        this.$refs.singleTable.setCurrentRow(row);
        //  console.log(column)
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
        this.submitApis.splice(index, 1);
      },
      getApis(){
        return this.submitApis.concat();
      },
      resetApis(){
        this.tempApis = this.selectedApis.concat()
      }
    }
  }

</script>

<style scoped>

  .el-row {
    width:100%;
  }
  .el-tree {
    margin-right: 2px;
  }
  .el-input--small{
    margin-left: 2px;
    margin-right:10px;
  }
  .el-input__inner{
    width: 80%;
    padding-right: 0px;
    overflow-x: hidden;
  }
  .vue-transfer-tree {
    /*border: 0.5px solid;*/
    border-radius: 5px;
    min-height: 500px;
    height: 500px;
    margin-left: 2px;
    margin-right: 2px;
    padding-right: 1px;
    overflow-y: auto;
    overflow-x: auto;
  }
  .vue-transfer-label{
    width: 100%;
    background:#f5f7fa;
    display: inline-block;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    min-height: 30px;
    margin-top:1px;
    padding-left: 3px;
    padding-top: 10px;
    font-weight: 500;
  }
  .vue-transfer-input{
    border-radius: 15px;
    margin-left:10%;
    margin-right: 10%;
    width: 80%;
    margin-top: 10px;
    min-height: 32px;
    border-width: 0.5px;
  }

  .transition-box {
    margin-bottom: 10px;
    width: 96%;
    margin-left:2%;
    height: 320px;
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
