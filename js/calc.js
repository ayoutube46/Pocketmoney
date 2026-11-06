/* ---------- maths ---------- */
var catOf=function(id){return S.cats.find(function(c){return c.id===id})||{name:'Other',emoji:'💸'}};
var potOf=function(id){return S.pots.find(function(p){return p.id===id})};
var sum=function(a){return a.reduce(function(t,x){return t+Number(x.amount)},0)};
var inRange=function(a,b){return S.exp.filter(function(x){return x.spent_on>=a&&x.spent_on<=b})};
var weekSpent=function(m){return sum(inRange(ymd(m),ymd(addDays(m,6))).filter(function(x){return !x.pot_id}))};
var wdIn=function(a,b){return -sum(S.sav.filter(function(x){var d=ymd(new Date(x.created_at));return Number(x.amount)<0&&x.source!=='goal'&&d>=a&&d<=b}))};
var extraIn=function(a,b){return sum(S.inc.filter(function(x){return x.received_on>=a&&x.received_on<=b}))+wdIn(a,b)};
var commit=function(m){var e=ymd(addDays(m,6));return S.pots.filter(function(p){return p.since<=e}).reduce(function(t,p){return t+Number(p.weekly_amount)},0)};
var weekBudget=function(m){return Number(S.set.weekly_budget)-commit(m)+extraIn(ymd(m),ymd(addDays(m,6)))};
var potAcc=function(p){return Number(p.base)+Number(p.weekly_amount)*(wks(p.anchor,ymd(monday(new Date())))+1)};
var potUsed=function(p){return sum(S.exp.filter(function(x){return x.pot_id===p.id}))};
var potBal=function(p){return potAcc(p)-potUsed(p)};
var goalBal=function(g){return sum(S.moves.filter(function(m){return m.goal_id===g.id}))};
var inGoals=function(){return S.goals.reduce(function(t,g){return t+goalBal(g)},0)};
var freeSav=function(){return sum(S.sav)-inGoals()};
var walOf=function(id){return S.wallets.find(function(w){return w.id===id})};
var walBal=function(w){var mine=function(a,k){return a.filter(function(x){return x[k]===w.id})};return Number(w.base)+sum(mine(S.inc,'wallet_id'))-sum(mine(S.exp,'wallet_id'))+sum(mine(S.wm,'to_id'))-sum(mine(S.wm,'from_id'))};
var walTotal=function(){return S.wallets.reduce(function(t,w){return t+walBal(w)},0)};
function pend(){
  var mon=monday(new Date()),o=[];
  for(var i=1;i<=4;i++){var m=addDays(mon,-7*i),k=ymd(m),note='Leftover from week of '+k,left=r2(weekBudget(m)-weekSpent(m));
    if(inRange(k,ymd(addDays(m,6))).length&&left>0&&!S.sav.some(function(x){return x.note===note}))o.push({left:left,note:note,m:m})}
  return o;
}

