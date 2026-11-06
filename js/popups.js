/* ---------- popups ---------- */
function menu(){
  var m=function(em,t,d,f){return '<button class="menu" onclick="'+f+'"><div class="em">'+em+'</div><div><b>'+t+'</b><small>'+d+'</small></div></button>'};
  sheet('<h2>What would you like to do?</h2>'+m('🧾','Add expense','Spend from your week or a set-aside','expForm()')+m('💰','Add extra money','Boosts this week’s budget','incForm()')+m('🏺','Move money to savings','Or withdraw free savings','savForm(1)')+m('🎯','Put money in a goal','Keep it apart from free savings','goalPick()')+m('👛','Move money between wallets','Cash, apps, bank…','walMove(0)')+m('⛽','New weekly set-aside','e.g. fuel, set apart each week','potForm()')+m('✨','New goal','Save towards something specific','goalForm()'));
}
function weekSheet(){
  var mon=monday(new Date()),a=ymd(mon),e=ymd(addDays(mon,6)),ex=extraIn(a,e),c=commit(mon),sp=weekSpent(mon),b=weekBudget(mon);
  sheet('<h2>This week</h2>'+dr('Weekly budget',money(S.set.weekly_budget))+dr('Set aside',c?'− '+money(c):dash)+dr('Extra money / withdrawals',ex?'+ '+money(ex):dash)+dr('Available to spend','<b>'+money(b)+'</b>')+dr('Spent',money(sp))+dr('Left',money(b-sp))+dr('Spent from set-asides',money(sum(inRange(a,e).filter(function(x){return x.pot_id})))+'')+'<button class="btn alt" style="margin-top:14px" onclick="closeSheet()">Close</button>');
}
function sweepSheet(){
  var p=pend();if(!p.length)return closeSheet();
  sheet('<h2>Leftovers from earlier weeks</h2><p class="mu sm" style="margin-bottom:10px">Move what you didn’t spend into your free savings.</p>'+p.map(function(x,i){return '<div class="item"><div class="t"><span>Week of '+short(x.m)+'</span></div><div class="amt" style="margin-right:8px">'+money(x.left)+'</div><button class="btn sm2" style="width:auto;padding:0 14px" onclick="sweep('+i+')">Move</button></div>'}).join('')+(p.length>1?'<button class="btn" style="margin-top:6px" onclick="sweep(-1)">Move all</button>':''));
}
function sweep(i){var p=pend(),l=i<0?p:[p[i]];done(sb.from('savings').insert(l.map(function(x){return{amount:x.left,note:x.note}})),'Moved to savings').then(function(){if(pend().length)sweepSheet()})}
function catSheet(id){
  var mon=addDays(monday(new Date()),-7*S.wk),l=inRange(ymd(mon),ymd(addDays(mon,6))).filter(function(x){return !x.pot_id&&(x.category_id||0)===id});
  sheet('<h2>'+catOf(id||null).emoji+' '+esc(catOf(id||null).name)+'</h2>'+l.map(expRow).join('')+'<button class="btn alt" onclick="closeSheet()">Close</button>');
}
function palSheet(){
  var P=[['sensei','Sensei'],['sensei-dark','Sensei Dark'],['midnight','Midnight'],['graphite','Graphite'],['forest','Forest'],['ruby','Ruby'],['gold','Gold'],['neon','Neon'],['sunset','Sunset'],['mint','Mint'],['ocean','Ocean'],['berry','Berry'],['lime','Lime'],['aurora','Aurora'],['arctic','Arctic']],g={sensei:'#5b5ef0,#22c1a0','sensei-dark':'#6c6ff5,#2dd4bf',midnight:'#3b82f6,#22d3ee',graphite:'#64748b,#94a3b8',forest:'#16a34a,#84cc16',ruby:'#e11d48,#fb7185',gold:'#d97706,#f59e0b',neon:'#8b5cf6,#22d3ee',sunset:'#fb923c,#f43f5e',mint:'#34d399,#a3e635',ocean:'#38bdf8,#6366f1',berry:'#d946ef,#f43f5e',lime:'#65a30d,#eab308',aurora:'#14b8a6,#8b5cf6',arctic:'#6d5ef5,#0ea5e9'};
  sheet('<h2>Colours</h2><div class="pal">'+P.map(function(p){return '<button class="'+(S.set.palette===p[0]?'on':'')+'" style="background:linear-gradient(135deg,'+g[p[0]]+')" onclick="setPal(\''+p[0]+'\')">'+p[1]+'</button>'}).join('')+'</div><button class="btn alt" style="margin-top:12px" onclick="closeSheet()">Done</button>');
}
function setPal(p){S.set.palette=p;localStorage.setItem('pal',p);applyPalette();render();palSheet();sb.from('settings').update({palette:p}).eq('id',1).then(function(r){if(r.error)toast(r.error.message)})}

