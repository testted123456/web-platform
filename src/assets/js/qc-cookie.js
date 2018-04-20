/**
 * Created by keepup on 2018/2/25.
 */
// Cookie取值
function getCookie  (name)
{
  var cookieValue = "";
  var search = name + "=";
  if (document.cookie.length > 0)
  {
    var offset = document.cookie.indexOf (search);
    if (offset != -1)
    {
      offset += search.length;
      var end = document.cookie.indexOf (";", offset);
      if (end == -1)
        end = document.cookie.length;
      cookieValue = unescape (document.cookie.substring (offset, end))
    }
  }
  return cookieValue;
}


//Cookie设置值
function saveCookie (name, value, hours)
{
  var expire = "";
  if (hours != null)
  {
    expire = new Date ((new Date ()).getTime () + hours * 3600000);
    expire = "; expires=" + expire.toGMTString ();
  }
  document.cookie = name + "=" + escape (value) + expire;
}




export default {saveCookie: saveCookie, getCookie: getCookie}



//          this.cookieManager.saveCookie("name",this.formData.account,"23");
//          this.cookieManager.getCookie("name");
