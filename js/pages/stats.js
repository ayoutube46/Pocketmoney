function statsView(){
  var mon=addDays(monday(new Date()),-7*S.wk),a=ymd(mon),e=ymd(addDays(mon,6));
  var wk=inRange(a,e).filter(function(x){return !x.pot_id}),by={};
  wk.forEach(function(x){var k=x.category_id||0;by[k]=(by[k]||0)+Number(x.amount)});
  var keys=Object.keys(by).sort(function(p,c){return by[c]-by[p]}),tot=sum(wk),cols=['--a1','--a2','--a3','--a4'];
  var cat=keys.length?keys.map(function(k,i){var c=catOf(+k||null);return '<div class="tr tap" onclick="catSheet('+(+k||0)+')"><div class="l"><span>'+c.emoji+' '+esc(c.name)+'</span><span>'+money(by[k])+'</span></div><div class="trk"><i style="width:'+Math.round(by[k]/tot*100)+'%;background:var('+cols[i%4]+')"></i></div></div>'}).join(''):'<p class="mu">Nothing spent this week.</p>';
  var pots=S.pots.map(function(p){var u=sum(inRange(a,e).filter(function(x){return x.pot_id===p.id}));return '<div class="tr tap" onclick="viewPot('+p.id+')"><div class="l"><span>'+p.emoji+' '+esc(p.name)+'</span><span>'+money(u)+' used</span></div></div>'}).join('');
  var weeks=[0,1,2,3,4,5].map(function(i){var m=addDays(monday(new Date()),-7*i),sp=weekSpent(m),bw=weekBudget(m),over=sp>bw;
    return '<div class="tr tap" onclick="S.wk='+i+';render();scrollTo(0,0)"><div class="l"><span'+(i===S.wk?' style="font-weight:800"':'')+'>'+short(m)+(i===0?' (now)':'')+'</span><span style="color:'+(over?'var(--bad)':'var(--tx)')+'">'+money(sp)+' · '+(over?'over '+money(sp-bw):money(bw-sp)+' left')+'</span></div><div class="trk"><i style="width:'+Math.min(100,sp/Math.max(bw,1)*100)+'%;background:'+(over?'var(--bad)':'var(--a1)')+'"></i></div></div>'}).join('');
  return topbar('Stats')
   +'<div class="wkn"><button class="round" onclick="S.wk++;render()">‹</button><b>'+short(mon)+' – '+short(addDays(mon,6))+(S.wk===0?' (this week)':'')+'</b><button class="round" onclick="if(S.wk>0){S.wk--;render()}">›</button></div>'
   +'<section class="card"><h2>Spending by category</h2>'+cat+'</section>'
   +(S.pots.length?'<section class="card"><h2>Set-asides used</h2>'+pots+'</section>':'')
   +'<section class="card"><h2>Last 6 weeks</h2>'+weeks+'<p class="mu sm">Tap a week to view it. Budget = weekly budget − set-asides + extra money.</p></section>';
}
VIEWS.stats=statsView;
