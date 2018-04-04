<template>
    <div :id="editorID"></div>
</template>

<script>
    export default {
        props: ['editorID', 'aceTextChange', 'value','ids'],
        data() {
            return {
                aceEditor: null
            }
        },
        mounted() {
            this.aceEditor = this.initAce(this.editorID)
            this.aceEditor.setValue(this.value ? this.value : '')
        },
        methods: {
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
                // editor.setOption("wrap", "free")
                //启用提示菜单
                var languageTools = hdAce.require("ace/ext/language_tools");
                var completions = this.aceManager.getCompletionsArr()
                languageTools.addCompleter({
                    getCompletions: function (editor, session, pos, prefix, callback) {
                        callback(null, completions);
                    }
                });

                editor.setOptions({
                    enableBasicAutocompletion: true,
                    enableSnippets: false,
                    enableLiveAutocompletion: true,
                    showPrintMargin: false,
                    ShowGutter: false,
                    highlightActiveLine:false
                })
                editor.session.setUseSoftTabs(true);
                editor.session.setUseWrapMode(false);
                editor.setHighlightActiveLine(false);
                editor.renderer.setShowGutter(false)
                editor.setShowPrintMargin(false);
                editor.setReadOnly(false);  // false to make it editable
                var that = this;
                editor.getSession().on('change', function (e) {
                    var valuef = editor.getValue()
                    that.$emit('aceTextChange', valuef)
                });
                return editor
            },
            resetAceContent(text){
                this.aceEditor.setValue(text ? text : '')
            }

        }
    }
</script>

<style scope>
</style>
