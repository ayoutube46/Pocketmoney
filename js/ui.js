/* ---------- sheets ---------- */
function sheet(h){$('#sheet').innerHTML='<div class="box"><div class="grab"></div>'+h+'</div>';$('#sheet').className='show'}
function closeSheet(){$('#sheet').className=''}
function modal(title,body,label,save){sheet('<h2>'+title+'</h2>'+body+'<div class="row2"><button class="btn alt" onclick="closeSheet()">Cancel</button><button class="btn" id="sv">'+label+'</button></div>');$('#sv').onclick=save}
function done(p,msg){return run(p,msg).then(closeSheet,function(){})}
function ask(title,msg,yes,fn){sheet('<h2>'+title+'</h2><p class="mu" style="margin-bottom:16px">'+msg+'</p><div class="row2"><button class="btn alt" onclick="closeSheet()">Keep it</button><button class="btn bad" id="sv">'+yes+'</button></div>');$('#sv').onclick=fn}
var dr=function(k,v){return '<div class="dr"><span class="k">'+k+'</span><span class="v">'+v+'</span></div>'};
var dash='<span class="mu">–</span>';
function detail(title,em,amt,rows,acts){sheet('<h2>'+title+'</h2><div class="dhead"><div class="em">'+em+'</div><div class="amt">'+amt+'</div></div>'+rows+'<div class="row2" style="margin-top:14px">'+acts+'</div>')}
var lb=function(t){return '<label class="lb">'+t+'</label>'};
var txt=function(id,v,m,ph){return '<input id="'+id+'" type="text" maxlength="'+m+'" placeholder="'+(ph||'')+'" value="'+esc(v||'')+'">'};
var gv=function(id){return $(id).value.trim()};
function amtBlock(init){
  K.v=init?String(init):'';
  return '<div class="ad" id="ad">Rs.'+(K.v||'0')+'</div><div class="kp">'+['1','2','3','4','5','6','7','8','9','.','0','<'].map(function(k){return '<button onclick="key(\''+k+'\')">'+(k==='<'?'⌫':k)+'</button>'}).join('')+'</div>';
}
function key(k){
  var v=K.v;
  if(k==='<')v=v.slice(0,-1);
  else if(k==='.'){if(v.indexOf('.')<0)v=(v||'0')+'.'}
  else{if(v.length>=9)return;if(v.indexOf('.')>=0&&v.split('.')[1].length>=2)return;if(v==='0')v='';v+=k}
  K.v=v;$('#ad').textContent='Rs.'+(v||'0');
}
var amt=function(){var a=parseFloat(K.v);return a>0?a:0};

/* swipe-down to close */
var dy0=null;
document.addEventListener('touchstart',function(e){dy0=e.target.className==='grab'?e.touches[0].clientY:null},{passive:true});
document.addEventListener('touchmove',function(e){if(dy0===null)return;var d=e.touches[0].clientY-dy0,b=$('#sheet .box');if(d>0&&b)b.style.transform='translateY('+d+'px)'},{passive:true});
document.addEventListener('touchend',function(e){if(dy0===null)return;var d=e.changedTouches[0].clientY-dy0,b=$('#sheet .box');dy0=null;if(d>80)closeSheet();else if(b)b.style.transform=''});

