<template>
    <div class="hd-input">
        <!--<div :id="editorID" style="width: 100%;height: 40px">-->
        <!--</div>-->
        <el-input v-model="inputMode"></el-input>

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
            @close="dialogClose"
            append-to-body
        >
            <!--<div :id="editorID + '1'" class="ace-textarea"> </div>-->
            <div style="border: 1px solid #cccccc; padding-top: 10px">
                <hd-ace style="width: 100%;height: 200px" :editorID="editorID" @aceTextChange="textChange"
                        :value="inputMode"></hd-ace>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import hdAce from '@/components/hd-ace'

    export default {
        props: ['value', 'editorID'],
        components: {hdAce},
        data() {
            return {
                inputMode: '',
                dialog: {
                    visible: false,
                    title: '请输入内容'
                }
            }
        },
        watch: {
            inputMode(val) {
                this.$emit('input', val)
            }
        },
        mounted() {
            // 初始默认值
            this.inputMode = this.value
        },

        methods: {
            enlarge() {
                this.dialog.visible = true
            },
            dialogClose(){
            },
            textChange(text){
                this.inputMode = text
            }
        }
    }
</script>

<style scope>
    .ace-textarea {
        width: 100%;
        height: 100px;
        border: 1px solid #ccc;
    }

    .hd-input {
        position: relative;
        width: 100%;
        height: 40px;
        /*border:1px solid #dcdfe6;*/
        border-radius: 4px;
        overflow: hidden;
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
        z-index: 99;
    }

    .hd-input-icon {
        display: block;
    }

    .el-textarea textarea {
        min-height: 40px !important;
        overflow: hidden;
    }

    .textarea-input {
        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        height: 40px;
        line-height: 1;
        outline: 0;
        padding: 5 15px 0;
        -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
        transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
        width: 100%;
        overflow: hidden;
        /*background-color: pink;*/
        /*padding-top:1px;*/
    }

    .ace-tm .ace_gutter {
        display: none;
    }

    .ace_scroller {
        position: absolute;
        left: 2;
    }

    .ace_scrollbar-v {
        overflow: hidden;
    }

    .ace_text-layer, .ace_line {
        background-color: white !important;
        color: #606266;
    }

    /*.ace_line{*/
    /*display: none;*/
    /*}*/
</style>
