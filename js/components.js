/* Shared view fragments used by several pages */
/* ---------- views ---------- */
function topbar(t,right){return '<div class="top"><h1>'+t+'</h1>'+(right||'<button class="round" onclick="go(\'settings\')">⚙️</button>')+'</div>'}
function expRow(x){
  var c=catOf(x.category_id),p=x.pot_id?potOf(x.pot_id):null;
  return '<div class="item tap" onclick="viewExp('+x.id+')"><div class="em">'+(p?p.emoji:c.emoji)+'</div><div class="t"><span>'+esc(x.note||c.name)+'</span><span class="mu sm">'+(p?esc(p.name)+' set-aside · ':'')+esc(c.name)+'</span></div><div class="amt">'+money(x.amount)+'</div></div>';
}
function incRow(x){return '<div class="item tap" onclick="viewInc('+x.id+')"><div class="em">💰</div><div class="t"><span>'+esc(x.note||'Extra money')+'</span><span class="mu sm">Extra money</span></div><div class="amt" style="color:var(--a2)">+'+money(x.amount)+'</div></div>'}
function potStrip(){
  var c=S.pots.map(function(p){var b=potBal(p);return '<div class="pc tap" onclick="viewPot('+p.id+')"><div class="em">'+p.emoji+'</div><b>'+esc(p.name)+'</b><div class="v"'+(b<0?' style="color:var(--bad)"':'')+'>'+money(b)+'</div><small class="mu">+'+money(p.weekly_amount)+' / wk</small></div>'}).join('');
  return '<div class="scroll">'+c+'<div class="pc add tap" onclick="potForm()"><div class="em">＋</div><small>New set-aside</small></div></div>';
}
