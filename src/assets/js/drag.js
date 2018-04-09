
var params = {
	left: 0,
	top: 0,
	width:0,
	currentX: 0,
	currentY: 0,
	flag: false
};
//获取相关CSS属性
var getCss = function(o,key){
	return o.currentStyle? o.currentStyle[key] : document.defaultView.getComputedStyle(o,false)[key];
};

//拖拽的实现
var startDrag = function(bar, target, callback){
	if(getCss(target, "left") !== "auto"){
		params.left = getCss(target, "left");
	}
  if(getCss(target, "width") !== "auto"){
    params.width = getCss(target, "width");
  }

	//o是移动对象
	bar.onmousedown = function(event){
    // console.log('mousedown')
		params.flag = true;
		if(!event){
			event = window.event;
			//防止IE文字选中
			bar.onselectstart = function(){
				return false;
			}
		}
		var e = event;
		params.currentX = e.clientX;

	};
	document.onmouseup = function(){
    // console.log('mouseup')
		params.flag = false;
		if(getCss(target, "left") !== "auto"){
			params.left = getCss(target, "left");
		}
    if(getCss(target, "width") !== "auto"){
      params.width = getCss(target, "width");
    }
	};
	document.onmousemove = function(event){
	  // console.log('move')
		var e = event ? event: window.event;
		if(params.flag){
			var nowX = e.clientX;
			var disX = nowX - params.currentX;
			if(parseInt(params.width) + disX > 240){
        target.style.width = parseInt(params.width) + disX + "px";
      }

			if (typeof callback == "function") {
				callback((parseInt(params.left) || 0) + disX, (parseInt(params.top) || 0) + disY);
			}

			if (event.preventDefault) {
				event.preventDefault();
			}
			return false;
		}


	}
};

export default {getWidth: startDrag}
