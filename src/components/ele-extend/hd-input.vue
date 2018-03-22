<template>
    <div class="hd-input">
        <div :id="editorID" style="width: 100%;height: 40px">
            <!--<input type="text" placeholder="asdf" v-model="inputMode" style="width: 100%;height:40px"/>-->
        </div>
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
            <div :id="editorID + '1'" style="width: 100%;height: 100px; border: 1px solid #ccc;">
                <!--<el-input-->
                    <!--placeholder="请输入内容"-->
                    <!--v-model="inputMode"-->
                <!--&gt;</el-input>-->
            </div>


        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: ['value', 'editorID'],
        data() {
            return {
                inputMode: '',
                dialog: {
                    visible: false,
                    title: '请输入内容'
                },
                restaurants: [],
                regStr: ', ',
                selectValue: '',
                aceEditor:null,
                aceEditor_dialog:null

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

            this.aceEditor =  this.initAce(this.editorID)
            this.aceEditor.setValue(this.inputMode)

        },

        methods: {
            enlarge() {
                this.dialog.visible = true
                var that = this
                this.$nextTick(()=>{
                  // dom 已经更新完毕
                    that.aceEditor_dialog =   that.initAce(this.editorID + '1')
                    this.aceEditor_dialog.setValue(this.inputMode)
                })
            },
            dialogClose(){
                this.aceEditor.setValue(this.inputMode)
            },
            initAce(eleID){
                //初始化对象
                // console.log(ace);
                var hdAce = ace
                var editor = hdAce.edit(eleID)
                //设置风格和语言
                var theme = "clouds"
                var language = "text"
                editor.setTheme("ace/theme/" + theme);
                editor.session.setMode("ace/mode/" + language);

                //字体大小
                editor.setFontSize(14);

                //设置只读（true时只读，用于展示代码）
                editor.setReadOnly(false);

                //自动换行,设置为off关闭
//            editor.setOption("wrap", "free")

                //启用提示菜单
                var languageTools = hdAce.require("ace/ext/language_tools");
                languageTools.addCompleter({
                    getCompletions: function (editor, session, pos, prefix, callback) {
                        callback(null, [{
                            name: "test",
                            value: "test",
                            caption: "test",
                            meta: "test",
                            type: "local",
                            score: 1000
                        }, {
                            name: "abc",
                            value: "abc",
                            caption: "abc",
                            meta: "abc",
                            type: "abc",
                            score: 999
                        }, {
                            name: "090f",
                            value: "090f",
                            caption: "090f",
                            meta: "090f",
                            type: "090f",
                            score: 998
                        }, {
                            name: "190f",
                            value: "190f",
                            caption: "190f",
                            meta: "190f",
                            type: "190f",
                            score: 994
                        }, {
                            name: "6764",
                            value: "6764",
                            caption: "6764",
                            meta: "6764",
                            type: "6764",
                            score: 100
                        }]);
                    }
                });

                editor.setOptions({
                    enableBasicAutocompletion: true,
                    enableSnippets: false,
                    enableLiveAutocompletion: true,
                    showPrintMargin: false,
                    ShowGutter: false,
                    highlightActiveLine: false
                })
                editor.session.setUseSoftTabs(true);
                document.getElementById(this.editorID).style.fontSize = '17px';
                editor.session.setUseWrapMode(false);
                editor.setHighlightActiveLine(false);
                editor.renderer.setShowGutter(false)
                editor.setShowPrintMargin(false);
                editor.setReadOnly(false);  // false to make it editable
                var that = this;
                editor.getSession().on('change', function(e) {
                    // e.type, etc
                    console.log(editor.getValue())
                    var valuef = editor.getValue()
                    that.inputMode = valuef
                });
                return editor
            }

        }
    }
</script>

<style scope>
  .hd-input {
    position: relative;
    width:100%;
    height:40px;
    border:1px solid #dcdfe6;
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
  .textarea-input{
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
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
    overflow: hidden;
    /*background-color: pink;*/
    /*padding-top:1px;*/
  }
  .ace-tm .ace_gutter{
    display: none;
  }
  .ace_scroller{
    position: absolute;
    left:2;
  }
  .ace_scrollbar-v{
    overflow: hidden;
  }
  .ace_text-layer,.ace_line{
    background-color: white !important;
    color:#606266;
  }
  /*.ace_line{*/
  /*display: none;*/
  /*}*/
</style>
