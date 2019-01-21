/**
 * 设置contentType
 * @param bodyType
 * @param rowType
 * @param contentTypeValue
 */
var setContentType=function (bodyType, rowType, head) {
  let contentType = '';

  if(bodyType === '1'){
    contentType = 'application/x-www-form-urlencoded';
  }else if(bodyType === '2'){
    switch (rowType){
      case "Text":
        contentType = '';
        break;
      case "Text(text/plain)":
        contentType = 'text/plain';
        break;
      case "Json(application/json)":
        contentType = 'application/json';
        break;
      case "Javascript(application/javascript)":
        contentType = 'application/javascript';
        break;
      case "XML(application/xml)":
        contentType = 'application/xml';
        break;
      case "XML(text/xml)":
        contentType = 'text/xml';
        break;
      case "HTML(text/html)":
        contentType = 'text/html';
        break;
      default:
        contentType = '';
    }
  }

  setContentTypeInHead(contentType, head);
}

/**
 * 根据content type设置消息头中字段content-type
 * @param contentType
 * @param head
 */
var setContentTypeInHead=function (contentType, head) {
  let contentTypeIndex = null;

  head.forEach(function (e, index) {
    if(e.Key === 'Content-Type'){
      contentTypeIndex = index;
    }
  });

  if(contentType === '' && contentTypeIndex != null){//content-type=Text并且request head中之前有
    if(contentTypeIndex == 0 && head.length == 1){
      head[contentTypeIndex].Key = '';
      head[contentTypeIndex].Value = '';
    }else {
      head.splice(contentTypeIndex, 1);
    }
  }else if(contentType != null && contentTypeIndex != null){//content-type != Text,并且request head中之前有
    head[contentTypeIndex].Value = contentType;
  }else if(contentType != null && contentTypeIndex === null){//content-type != Text,并且content-type不在request head中
    if(head.length === 1 && head[0].Key === '' && head[0].Value === ''){
      head[0].Key = 'Content-Type';
      head[0].Value = contentType;
    }else{
      head.push({'Key': 'Content-Type', 'Value': contentType});
    }
  }
}

/**
 * 根据消息头中的content-type设置页面bodyType, bodyRowType
 * @param head
 * @returns {{bodyType: string, bodyRowType: string}}
 */
var parseContentType=function(head){
  let contentTypeIndex = null;
  let bodyType = '';
  let bodyRowType = '';

  head.forEach(function (e, index) {
    if(e.Key === 'Content-Type'){
      contentTypeIndex = index;
    }
  });

  if(contentTypeIndex === null){
    bodyType = '2';
    bodyRowType = 'Text';
  }else{
    let contentTypeValue = head[contentTypeIndex].Value;
    switch (contentTypeValue){
      case "application/x-www-form-urlencoded":
        bodyType = '1';
        break;
      case "text/plain":
        bodyType = '2';
        bodyRowType = 'Text(text/plain)';
        break;
      case "application/json":
        bodyType = '2';
        bodyRowType = 'Json(application/json)';
        break;
      case "application/javascript":
        bodyType = '2';
        bodyRowType = 'Javascript(application/javascript)';
        break;
      case "application/xml":
        bodyType = '2';
        bodyRowType = 'XML(application/xml)';
        break;
      case "text/xml":
        bodyType = '2';
        bodyRowType = 'XML(text/xml)';
        break;
      case "text/html":
        bodyType = '2';
        bodyRowType = 'HTML(text/html)';
        break;
    }
  }

  return {'bodyType': bodyType,'bodyRowType':bodyRowType};
}

export {
  setContentType, setContentTypeInHead, parseContentType
}
