var completions = [
  {
    name: "ace",
    value: "ace",
    caption: "ace",
    meta: "ace",
    type: "禁用",
    score: 1000
  }
]

// 通过接口id 返回接口ace字库
var getCompletions = function (id) {
  return completions;
}

var getCompletionsArr =  function(ids){
  return completions;
}
export default {
  completions,
  getCompletions,
  getCompletionsArr
}
