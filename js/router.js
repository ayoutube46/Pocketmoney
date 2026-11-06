/* Router: each page file registers its view in VIEWS; the page's <body data-page> picks which one renders */
var VIEWS={};
var PAGE=document.body.getAttribute('data-page')||'home';
function render(){
  $('#nav').innerHTML='<div class="brand"><i>⚡</i>Pocket</div>'+TABS.map(function(t){return t[0]==='+'?'<button class="plus" onclick="menu()" aria-label="Add">+</button>':'<button class="'+(S.tab===t[0]?'on':'')+'" onclick="go(\''+t[0]+'\')"><span>'+t[1]+'</span>'+t[2]+'</button>'}).join('');
  $('#view').innerHTML=VIEWS[S.tab]();
}
function go(t){
  closeSheet();
  if(t===S.tab){if(t==='stats')S.wk=0;render();window.scrollTo(0,0);return}
  window.location.href=PAGES[t];
}
