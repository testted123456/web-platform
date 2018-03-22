<template>
    <div>
        <div id="abc" style="height: 300px;background-color: pink;">
            <textarea class="sdf" id="abcf">
                test -
              </textarea>
        </div>
        <div id="abc1" style="height: 300px;background-color: pink;">
            <textarea class="sdf1" id="abcf1">
                test -
              </textarea>
        </div>
    </div>
</template>

<script>
    // import {initAce} from "../assets/js/hd-ace";
    export default {
        name: "ace-test",
        mounted() {
            this.ace1()
            this.ace2()
        },
        methods:{
            ace1(){
                //初始化对象
                // console.log(ace);
                // var ace = initAce()
                // var { ...hdAce } = ace
                var hdAce = ace
                var editor = hdAce.edit('abc')

                //设置风格和语言（更多风格和语言，请到github上相应目录查看）
                var theme = "clouds"
                var language = "c_cpp"
                // editor.setTheme("ace/theme/" + theme);
                // editor.session.setMode("ace/mode/" + language);

                //字体大小
                // editor.setFontSize(18);

                //设置只读（true时只读，用于展示代码）
                editor.setReadOnly(false);

                //自动换行,设置为off关闭
                editor.setOption("wrap", "free")

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
                            score: 1000 // 让test排在最上面
                        }, {
                            name: "abc",
                            value: "abc",
                            caption: "abc",
                            meta: "abc",
                            type: "abc",
                            score: 999 // 让test排在最上面
                        }, {
                            name: "090f",
                            value: "090f",
                            caption: "090f",
                            meta: "090f",
                            type: "090f",
                            score: 998 // 让test排在最上面
                        }, {
                            name: "190f",
                            value: "190f",
                            caption: "190f",
                            meta: "190f",
                            type: "190f",
                            score: 994 // 让test排在最上面
                        }, {
                            name: "6764",
                            value: "6764",
                            caption: "6764",
                            meta: "6764",
                            type: "6764",
                            score: 100 // 让test排在最上面
                        }]);
                    }
                });
                editor.setOptions({
                    enableBasicAutocompletion: true,
                    enableSnippets: false,
                    enableLiveAutocompletion: true,
                    showPrintMargin: false,
                    ShowGutter: false
                })
            },
            ace2(){
                //初始化对象
                // console.log(ace);
                // var ace = initAce()
                // var { ...hdAce } = ace
                var hdAce = ace

                var editor = hdAce.edit('abc1')

                //设置风格和语言（更多风格和语言，请到github上相应目录查看）
                var theme = "clouds"
                var language = "c_cpp"
                // editor.setTheme("ace/theme/" + theme);
                // editor.session.setMode("ace/mode/" + language);

                //字体大小
                // editor.setFontSize(18);

                //设置只读（true时只读，用于展示代码）
                editor.setReadOnly(false);

                //自动换行,设置为off关闭
                editor.setOption("wrap", "free")

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
                            score: 1000 // 让test排在最上面
                        }, {
                            name: "abc",
                            value: "abc",
                            caption: "abc",
                            meta: "abc",
                            type: "abc",
                            score: 999 // 让test排在最上面
                        }, {
                            name: "090f",
                            value: "090f",
                            caption: "090f",
                            meta: "090f",
                            type: "090f",
                            score: 998 // 让test排在最上面
                        }, {
                            name: "190f",
                            value: "190f",
                            caption: "190f",
                            meta: "190f",
                            type: "190f",
                            score: 994 // 让test排在最上面
                        }, {
                            name: "6764",
                            value: "6764",
                            caption: "6764",
                            meta: "6764",
                            type: "6764",
                            score: 100 // 让test排在最上面
                        }]);
                    }
                });
                editor.setOptions({
                    enableBasicAutocompletion: true,
                    enableSnippets: false,
                    enableLiveAutocompletion: true,
                    showPrintMargin: false,
                    ShowGutter: false
                })
            }
        }
    }
</script>

<style scoped>

</style>
