function homeView(){
  var today=new Date(),mon=monday(today),idx=(today.getDay()+6)%7,tStr=ymd(today);
  var b=weekBudget(mon),spent=weekSpent(mon),left=b-spent,daysLeft=7-idx,pct=Math.max(0,Math.min(100,spent/b*100));
  var days=[0,1,2,3,4,5,6].map(function(i){var d=ymd(addDays(mon,i));return sum(inRange(d,d).filter(function(x){return !x.pot_id}))});
  var ref=Math.max.apply(null,days.concat([b/7*1.5,1]));
  var strip=days.map(function(v,i){return '<div class="d'+(i===idx?' now':'')+'"><div class="bar"><i style="height:'+Math.round(v/ref*100)+'%"></i></div><b>'+DN[i][0]+'</b><small>'+(v?Math.round(v):'–')+'</small></div>'}).join('');
  var sub=left>0?'About '+money(left/daysLeft)+' a day for the next '+daysLeft+(daysLeft>1?' days':' day'):'You are over this week’s budget';
  var pn=pend(),nudge=pn.length?'<div class="nudge tap" onclick="sweepSheet()"><p>🏺 You have <b>'+money(pn.reduce(function(t,x){return t+x.left},0))+'</b> left over from earlier weeks</p><span class="mu">Move ›</span></div>':'';
  var recent=S.exp.slice(0,4).map(expRow).join('')||'<p class="mu" style="margin:0 4px">Nothing yet. Tap + to add your first expense.</p>';
  return topbar('Pocket')
   +'<section class="hero tap" onclick="weekSheet()"><p class="mu">'+short(mon)+' – '+short(addDays(mon,6))+' · tap for breakdown</p>'
   +'<p class="big'+(left<0?' neg':'')+'">'+money(left)+'</p><p class="mu">left to spend of '+money(b)+'</p>'
   +'<div class="meter'+(left<0?' over':'')+'"><i style="width:'+pct+'%"></i></div>'
   +'<p>'+sub+'</p><div class="strip">'+strip+'</div></section>'
   +nudge
   +'<div class="tiles"><button class="tile" onclick="expForm()"><span>🧾</span>Expense</button><button class="tile" onclick="incForm()"><span>💰</span>Extra money</button><button class="tile" onclick="savForm(1)"><span>🏺</span>Save</button></div>'
   +'<div class="sec"><h3>Wallets · '+money(walTotal())+'</h3><button onclick="walMove(0)">Move money</button></div>'+walStrip()
   +'<div class="sec"><h3>Set-asides</h3><button onclick="go(\'savings\')">See all</button></div>'+potStrip()
   +'<div class="sec"><h3>Recent</h3><button onclick="go(\'history\')">See all</button></div>'+recent;
}
VIEWS.home=homeView;
