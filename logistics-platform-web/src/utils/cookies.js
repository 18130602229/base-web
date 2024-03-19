 const setCookie = (cname,cvalue,exdays) => {
  var d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  // d.setTime(d.getTime()+(exdays*1*1000)); 
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; path=/ ;" + expires;
}

const getCookie = (cname) =>{
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}

const clearCookie = () => { 
  var keys=document.cookie.match(/[^ =;]+(?=\=)/g); 
  if (keys) { 
  for (var i = keys.length; i--;) 
    // document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString() 
    setCookie(keys[i],"",0);
  } 
}
export {
	setCookie,
  getCookie,
  clearCookie
}