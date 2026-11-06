function historyView(){
  var f=S.flt,fl=[['all','All'],['e','Spent'],['i','Received'],['p','Set-asides']];
  var chips='<div class="chips">'+fl.map(function(x){return '<button class="chip'+(f===x[0]?' on':'')+'" onclick="S.flt=\''+x[0]+'\';render()">'+x[1]+'</button>'}).join('')+'</div>';
  var ex=S.exp.filter(function(x){return f==='p'?x.pot_id:f==='i'?false:true}).slice(0,200).map(function(x){return{k:'e',d:x.spent_on,x:x}});
  var ic=(f==='all'||f==='i')?S.inc.slice(0,60).map(function(x){return{k:'i',d:x.received_on,x:x}}):[];
  var items=ex.concat(ic).sort(function(p,q2){return p.d<q2.d?1:p.d>q2.d?-1:q2.x.id-p.x.id});
  var out=topbar('History')+chips,cur='';
  if(!items.length)return out+'<div class="card"><p class="mu">Nothing here yet.</p></div>';
  items.forEach(function(it){
    if(it.d!==cur){cur=it.d;var d=parse(cur),sp=sum(S.exp.filter(function(y){return y.spent_on===cur}));out+='<div class="day"><span>'+DN[(d.getDay()+6)%7]+' '+short(d)+'</span><span>'+(sp?money(sp):'')+'</span></div>'}
    out+=it.k==='i'?incRow(it.x):expRow(it.x);
  });
  return out;
}
VIEWS.history=historyView;
