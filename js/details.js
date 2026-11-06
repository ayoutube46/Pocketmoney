/* ---------- details ---------- */
var btn=function(t,f,c){return '<button class="btn '+(c||'alt')+' sm2" onclick="'+f+'">'+t+'</button>'};
var stamp=function(x){return x.created_at?dr('Added on',fullDate(new Date(x.created_at))):''};
function viewExp(id){
  var x=S.exp.find(function(e){return e.id===id});if(!x)return;var c=catOf(x.category_id),p=x.pot_id?potOf(x.pot_id):null;
  detail('Expense',p?p.emoji:c.emoji,money(x.amount),dr('Category',esc(c.name))+dr('Paid from',p?esc(p.name)+' set-aside':'Weekly money')+walRow(x)+dr('Note',x.note?esc(x.note):dash)+dr('Date',fullDate(parse(x.spent_on)))+stamp(x),btn('Edit','editExp('+id+')')+btn('Delete','ask(\'Delete expense?\',\'This can’t be undone.\',\'Delete\',function(){done(sb.from(\'expenses\').delete().eq(\'id\','+id+'),\'Expense deleted\')})','bad'));
}
function editExp(id){
  var x=S.exp.find(function(e){return e.id===id});
  var o='<option value="">💸 Other</option>'+S.cats.map(function(c){return '<option value="'+c.id+'"'+(c.id===x.category_id?' selected':'')+'>'+c.emoji+' '+esc(c.name)+'</option>'}).join('');
  var po='<option value="">💵 Weekly money</option>'+S.pots.map(function(p){return '<option value="'+p.id+'"'+(p.id===x.pot_id?' selected':'')+'>'+p.emoji+' '+esc(p.name)+'</option>'}).join('');
  modal('Edit expense',amtBlock(x.amount)+lb('Category')+'<select id="f2">'+o+'</select>'+lb('Paid from')+'<select id="f5">'+po+'</select>'+lb('Wallet')+'<select id="f6">'+walOpts(x.wallet_id)+'</select>'+txt('f3',x.note,80,'Note')+'<input id="f4" type="date" value="'+x.spent_on+'">','Save changes',function(){
    if(!amt())return toast('Enter an amount above 0');if(!$('#f4').value)return toast('Pick a date');
    done(sb.from('expenses').update({amount:amt(),category_id:parseInt($('#f2').value)||null,pot_id:parseInt($('#f5').value)||null,wallet_id:parseInt($('#f6').value)||null,note:gv('#f3')||null,spent_on:$('#f4').value}).eq('id',id),'Expense updated');
  });
}
function viewInc(id){
  var x=S.inc.find(function(e){return e.id===id});if(!x)return;
  detail('Extra money','💰','<span style="color:var(--a2)">+'+money(x.amount)+'</span>',dr('Where from',x.note?esc(x.note):dash)+walRow(x)+dr('Date received',fullDate(parse(x.received_on)))+stamp(x),btn('Edit','editInc('+id+')')+btn('Delete','ask(\'Delete entry?\',\'This lowers that week’s budget.\',\'Delete\',function(){done(sb.from(\'income\').delete().eq(\'id\','+id+'),\'Entry deleted\')})','bad'));
}
function editInc(id){
  var x=S.inc.find(function(e){return e.id===id});
  modal('Edit extra money',amtBlock(x.amount)+txt('f2',x.note,60,'Where from?')+lb('Received in')+'<select id="f4">'+walOpts(x.wallet_id)+'</select><input id="f3" type="date" value="'+x.received_on+'">','Save changes',function(){
    if(!amt())return toast('Enter an amount above 0');if(!$('#f3').value)return toast('Pick a date');
    done(sb.from('income').update({amount:amt(),note:gv('#f2')||null,wallet_id:parseInt($('#f4').value)||null,received_on:$('#f3').value}).eq('id',id),'Entry updated');
  });
}
function viewSav(id){
  var x=S.sav.find(function(e){return e.id===id});if(!x)return;var d=new Date(x.created_at),out=Number(x.amount)<0;
  detail('Savings entry',out?'📤':'📥','<span style="color:'+(out?'var(--bad)':'var(--a2)')+'">'+(out?'':'+')+money(x.amount)+'</span>',dr('Type',x.source==='goal'?'Goal paid out':out?'Withdrawn':'Added')+dr('Note',x.note?esc(x.note):dash)+dr('Date',fullDate(d)),btn('Edit','editSav('+id+')')+btn('Delete','delSav('+id+')','bad'));
}
function editSav(id){
  var x=S.sav.find(function(e){return e.id===id}),sg=x.amount<0?-1:1;
  modal('Edit savings entry',amtBlock(Math.abs(x.amount))+txt('f3',x.note,60,'Note'),'Save changes',function(){
    var a=amt();if(!a)return toast('Enter an amount above 0');
    if(freeSav()-Number(x.amount)+sg*a<0)return toast('That would cut into money kept for goals');
    done(sb.from('savings').update({amount:sg*a,note:gv('#f3')||null}).eq('id',id),'Entry updated');
  });
}
function delSav(id){
  var x=S.sav.find(function(e){return e.id===id});
  if(freeSav()-Number(x.amount)<0)return toast('Deleting this would cut into money kept for goals');
  ask('Delete savings entry?','This can’t be undone.','Delete',function(){done(sb.from('savings').delete().eq('id',id),'Entry deleted')});
}
function viewPot(id){
  var p=potOf(id);if(!p)return;var b=potBal(p);
  var l=S.exp.filter(function(x){return x.pot_id===id}).slice(0,4).map(function(x){return dr(esc(x.note||catOf(x.category_id).name)+' · '+short(parse(x.spent_on)),money(x.amount))}).join('');
  detail(esc(p.name),p.emoji,'<span'+(b<0?' style="color:var(--bad)"':'')+'>'+money(b)+'</span>',dr('Set aside each week',money(p.weekly_amount))+dr('Set aside so far',money(potAcc(p)))+dr('Used',money(potUsed(p)))+(l?'<p class="mu sm" style="margin-top:10px">Latest spending</p>'+l:'')+'<button class="btn" style="margin:12px 0 8px" onclick="expForm('+id+')">Spend from this</button>',btn('Edit','potForm('+id+')')+btn('Delete','delPot('+id+')','bad'));
}
function delPot(id){ask('Delete set-aside?','Its balance disappears and past spending from it will count against your weekly money.','Delete',function(){done(sb.from('pots').delete().eq('id',id),'Set-aside deleted')})}
function viewGoal(id){
  var g=S.goals.find(function(x){return x.id===id});if(!g)return;var b=goalBal(g),p=Math.min(100,b/g.target*100);
  var l=S.moves.filter(function(m){return m.goal_id===id}).slice(0,4).map(function(m){return dr(short(new Date(m.created_at)),'<span style="color:'+(m.amount<0?'var(--bad)':'var(--a2)')+'">'+(m.amount>0?'+':'')+money(m.amount)+'</span>')}).join('');
  detail(esc(g.name),g.emoji||'🎯',money(b),'<div class="meter"><i style="width:'+p+'%"></i></div><p class="mu sm" style="text-align:center;margin-bottom:6px">'+(b>=g.target?'Target reached!':money(g.target-b)+' to go of '+money(g.target))+'</p>'+l
   +'<div class="row2" style="margin:12px 0 8px">'+btn('＋ Add money','goalMove('+id+',1)','')+btn('Take back','goalMove('+id+',-1)')+'</div>'
   +'<button class="btn alt sm2" style="margin-bottom:8px" onclick="finishGoal('+id+')">✅ I’ve spent it — close goal</button>',btn('Edit','goalForm('+id+')')+btn('Delete','delGoal('+id+')','bad'));
}
function finishGoal(id){
  var g=S.goals.find(function(x){return x.id===id}),b=goalBal(g);
  ask('Close this goal?',money(b)+' leaves your savings as spent on “'+esc(g.name)+'”. It won’t change your weekly budget.','Close goal',async function(){
    try{if(b>0)await q(sb.from('savings').insert({amount:-b,note:'Goal: '+g.name,source:'goal'}));await q(sb.from('goals').update({active:false}).eq('id',id));await load();closeSheet();toast('Goal closed')}catch(e){}
  });
}
function delGoal(id){var g=S.goals.find(function(x){return x.id===id});ask('Delete goal?',money(goalBal(g))+' goes back to your free savings.','Delete',function(){done(sb.from('goals').delete().eq('id',id),'Goal deleted')})}

