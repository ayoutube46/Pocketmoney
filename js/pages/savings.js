function savingsView(){
  var total=sum(S.sav),g=inGoals(),free=total-g,pg=total>0?Math.min(100,g/total*100):0;
  var pn=pend(),nudge=pn.length?'<div class="nudge tap" onclick="sweepSheet()"><p>Leftovers from earlier weeks: <b>'+money(pn.reduce(function(t,x){return t+x.left},0))+'</b></p><span class="mu">Move ›</span></div>':'';
  var goals=S.goals.map(function(x){var b=goalBal(x),p=Math.min(100,b/x.target*100);
    return '<div class="card tap" onclick="viewGoal('+x.id+')"><div style="display:flex;justify-content:space-between"><h3>'+(x.emoji||'🎯')+' '+esc(x.name)+'</h3><span class="mu">'+Math.round(p)+'%</span></div><div class="meter"><i style="width:'+p+'%"></i></div><p class="sm">'+money(b)+' of '+money(x.target)+(b>=x.target?' · ready!':'')+'</p></div>'}).join('')||'<p class="mu" style="margin:0 4px 8px">No goals yet. Money you put in a goal is kept apart from your free savings.</p>';
  var hist=S.sav.slice(0,8).map(function(x){var out=x.amount<0;return '<div class="item tap" onclick="viewSav('+x.id+')"><div class="em">'+(out?'📤':'📥')+'</div><div class="t"><span>'+esc(x.note||(out?'Withdrawn':'Added'))+'</span><span class="mu sm">'+short(new Date(x.created_at))+'</span></div><div class="amt" style="color:'+(out?'var(--bad)':'var(--a2)')+'">'+(out?'':'+')+money(x.amount)+'</div></div>'}).join('');
  return topbar('Savings')
   +'<section class="hero"><p class="mu">Total saved</p><p class="big">'+money(total)+'</p>'
   +'<div class="seg"><i style="width:'+pg+'%;background:var(--a3)"></i><i style="width:'+(100-pg)+'%;background:#fff"></i></div>'
   +'<div class="split"><div><p class="mu">Free to use</p><b>'+money(free)+'</b></div><div><p class="mu">Kept for goals</p><b>'+money(g)+'</b></div></div>'
   +'<div class="row2" style="margin-top:14px"><button class="btn alt sm2" onclick="savForm(1)">＋ Add</button><button class="btn alt sm2" onclick="savForm(-1)">Withdraw</button></div></section>'
   +nudge
   +'<div class="sec"><h3>Goals</h3><button onclick="goalForm()">＋ New goal</button></div>'+goals
   +'<div class="sec"><h3>Weekly set-asides</h3></div>'+potStrip()
   +(hist?'<div class="sec"><h3>Recent</h3></div>'+hist:'');
}
VIEWS.savings=savingsView;
