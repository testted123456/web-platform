<template>
  <div id="cm-wrapper"
       :style="{display: contextMenuData.isDisplay}" @click.self="closeMenu" @contextmenu.prevent="closeMenu">
    <div id="cm">
      <span id="addDir" :style="{background:addDirBackGroundColor}"  @mouseover="setAddDirBackground('#46A3FF')" @mouseleave="setAddDirBackground('none')" >
        <input type="button" @click.stop="addDir" v-bind:disabled="!contextMenuData.showAddDir" style="width: inherit;height: inherit; border: none;background: inherit" value="新增目录"/>
      </span>
      <span id="addItem" :style="{background:addItemBackGroundColor}" @mouseover="setAddItemBackground('#46A3FF')" @mouseleave="setAddItemBackground('none')" >
        <input type="button" @click.stop="addItem" v-bind:disabled="!contextMenuData.showAddItem" style="width: inherit;height: inherit; border: none;background: inherit" value="新增节点"/></span>
      <span id="del" :style="{background:delBackGroundColor}" @mouseover="setDelBackground('#46A3FF')" @mouseleave="setDelBackground('none')">
        <input type="button" @click.stop="delItem" v-bind:disabled="!contextMenuData.showDel" style="width: inherit;height: inherit; border: none;background: inherit" value="删除"/>
      </span>
        <span id="refresh" :style="{background:refreshBackGroundColor}" @mouseover="setRefreshBackground('#46A3FF')" @mouseleave="setRefreshBackground('none')">
        <input type="button" @click.stop="refreshApi" style="width: inherit;height: inherit; border: none;background: inherit" value="刷新"/>
      </span>
    </div>
  </div>
</template>

<script>
  export default{
    name: 'VueContentMenu',
    data(){
          return{
            addDirBackGroundColor: 'no',
            addItemBackGroundColor: 'no',
            delBackGroundColor: 'no',
            refreshBackGroundColor: 'no'
          }
    },
    props: {
      contextMenuData: {
        type: Object,
        default() {
            return{
              isDisplay: 'none',
              axios: {
                x: null,
                y: null
              },
              showAddDir: null,
              showAddItem: null,
              showDel: null
            }
        }
      }
    },
    methods:{
      closeMenu(){
        this.contextMenuData.isDisplay = 'none';
      },
      setAddDirBackground(color){
        if(this.contextMenuData.showAddDir){
          this.addDirBackGroundColor = color;
        }
      },
      setAddItemBackground(color){
          if(this.contextMenuData.showAddItem){
            this.addItemBackGroundColor = color;
          }
      },
      setDelBackground(color){
          if(this.contextMenuData.showDel){
            this.delBackGroundColor = color;
          }
      },
      setRefreshBackground(color){
        this.refreshBackGroundColor = color;
      },
      addDir(){
        this.$emit('addDir');
      },
      addItem(){
        this.$emit('addItem');
      },
      delItem(){
        this.$emit('delItem');
      },
      refreshApi(){
        this.$emit('refreshApi');
      }
    },
    watch:{
      'contextMenuData.isDisplay' : function (val, oldVal) {
          if(val === 'block'){
            document.getElementById('cm').style.left = this.contextMenuData.axios.x + 'px';
            document.getElementById('cm').style.top = this.contextMenuData.axios.y + 'px';
          }
      }
    },


  }
</script>

<style scoped>
  #cm-wrapper {
    font-size: 1em;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    z-index: 100;
  }
  #cm {
    position: relative;
    width: 90px;
    height: 120px;
    background: #F0F0F0;
    border-radius: 5px;
    padding-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 20px;
    border: 1px;
  }
  span{
    width: 100%;
    display:block;
    margin-top: 2px;
  }
  input{
    text-align: left;
  }

</style>
