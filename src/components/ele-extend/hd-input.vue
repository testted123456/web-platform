<template>
  <div class="hd-input">
    <el-input ref="input" type="textarea" :rows="1" resize="none" v-model="inputMode"></el-input>
    <!--放大按钮-->
    <div class="hd-input-btn" @click="enlarge">
      <i class="el-icon-circle-plus-outline hd-input-icon"></i>
    </div>
    <el-dialog
      v-if="dialog.visible"
      class="hd-dialog"
      :title="dialog.title"
      width="50%"
      :visible.sync="dialog.visible"
      append-to-body
    >
      <el-input
        type="textarea"
        :rows="15"
        resize="none"
        placeholder="请输入内容"
        v-model="inputMode"
      >
      </el-input>
    </el-dialog>
  </div>
</template>

<script>
  export default{
    props: ['value'],
    data(){
      return {
        inputMode: '',
        dialog: {
          visible: false,
          title: '请输入内容'
        }
      }
    },
    watch: {
      inputMode(val){
        this.$emit('input', val)
      }
    },
    created() {
      this.inputMode = this.value
    },

    methods: {
      enlarge(){
        this.dialog.visible = true
      }
    }
  }
</script>

<style scope>
  .hd-input {
    position: relative;
  }

  .hd-input-btn {
    position: absolute;
    text-align: center;
    right: 5px;
    top: 50%;
    width: 20px;
    height: 20px;
    margin-top: -10px;
    cursor: pointer;
  }

  .hd-input-icon {
    display: block;
  }
  .el-textarea textarea{
    min-height:40px !important;
    overflow: hidden;
  }
</style>
