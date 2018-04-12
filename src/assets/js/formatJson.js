/**
 * Created by ted on 2018/1/11.
 */
var formatJson =function (jsonStr) {
  if(jsonStr == null || jsonStr == 'null' || jsonStr == ''){
    console.log('null  null  null')
    return
  }else{
    let jsonObj = JSON.parse(jsonStr);
    return JSON.stringify(jsonObj, null, 4);
  }

}

//判断字符串是否为json
var isJson = function(text){
  if(text == null || text == 'null' || text == ''){
    return false;
  }
  try{
    if (typeof JSON.parse(text) == "object") {
      return true;
    }
  }catch (e){
  }
  return false;
}

export {
  formatJson, isJson
}

