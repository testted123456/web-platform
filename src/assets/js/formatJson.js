/**
 * Created by ted on 2018/1/11.
 */
var formatJson =function (jsonVal) {
  if(jsonVal == null || jsonVal == 'null' ){
    return null;
  }
  if (typeof jsonVal === 'object'){
    return JSON.stringify(jsonVal, null, 4);
  }else{
    try{
      let jsonObj = JSON.parse(jsonVal);
      return JSON.stringify(jsonObj, null, 4);
    }catch(err) {

    }

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

