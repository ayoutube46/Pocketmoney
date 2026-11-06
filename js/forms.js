/* ---------- forms ---------- */
function expForm(potId){
  S.pay=potId||null;
  var cats=S.cats.map(function(c){return '<button class="chip'+(c.id===S.cat?' on':'')+'" data-c="'+c.id+'" onclick="pickCat('+c.id+')">'+c.emoji+' '+esc(c.name)+'</button>'}).join('');
  var pays='<button class="chip'+(!S.pay?' on':'')+'" data-p="0" onclick="pickPay(0)">💵 Weekly money</button>'+S.pots.map(function(p){return '<button class="chip'+(S.pay===p.id?' on':'')+'" data-p="'+p.id+'" onclick="pickPay('+p.id+')">'+p.emoji+' '+esc(p.name)+'</button>'}).join('');
  modal('Add expense',amtBlock('')+(S.pots.length?lb('Pay from')+'<div class="chips">'+pays+'</div>':'')+walChips('Wallet')+lb('Category')+'<div class="chips">'+cats+'</div>'+txt('f1','',80,'Note (optional)')+'<input id="f2" type="date" value="'+ymd(new Date())+'">','Add expense',function(){
    if(!amt())return toast('Enter an amount above 0');
    if(!S.cat)return toast('Add a category in Settings first');
    done(sb.from('expenses').insert({amount:amt(),category_id:S.cat,pot_id:S.pay,wallet_id:S.wal||null,note:gv('#f1')||null,spent_on:$('#f2').value||ymd(new Date())}),'Expense added');
  });
}
function pickCat(id){S.cat=id;document.querySelectorAll('[data-c]').forEach(function(c){c.classList.toggle('on',+c.dataset.c===id)})}
function pickPay(id){S.pay=id||null;document.querySelectorAll('[data-p]').forEach(function(c){c.classList.toggle('on',+c.dataset.p===id)})}
function incForm(){
  modal('Extra money',amtBlock('')+walChips('Received in')+txt('f1','',60,'Where from? (optional)')+'<input id="f2" type="date" value="'+ymd(new Date())+'">','Add money',function(){
    if(!amt())return toast('Enter an amount above 0');
    done(sb.from('income').insert({amount:amt(),wallet_id:S.wal||null,note:gv('#f1')||null,received_on:$('#f2').value||ymd(new Date())}),'Extra money added');
  });
}
function savForm(sign){
  modal(sign>0?'Add to savings':'Withdraw savings',amtBlock('')+'<div class="chips"><button class="chip'+(sign>0?' on':'')+'" id="sg1" onclick="S.sg=1;sgT()">📥 Add</button><button class="chip'+(sign<0?' on':'')+'" id="sg2" onclick="S.sg=-1;sgT()">📤 Withdraw</button></div>'+'<p class="mu sm" style="margin-bottom:8px">Free to use: '+money(freeSav())+'. Money kept for goals can’t be withdrawn here.</p>'+txt('f1','',60,'Note (optional)'),'Save',function(){
    var a=amt(),sg=S.sg||sign;if(!a)return toast('Enter an amount above 0');
    if(sg<0&&a>freeSav())return toast('Only '+money(freeSav())+' is free to withdraw');
    done(sb.from('savings').insert({amount:sg*a,note:gv('#f1')||null}),'Savings updated');
  });
  S.sg=sign;
}
function sgT(){$('#sg1').classList.toggle('on',S.sg>0);$('#sg2').classList.toggle('on',S.sg<0)}
function goalForm(id){
  var g=id?S.goals.find(function(x){return x.id===id}):null;
  modal(g?'Edit goal':'New goal',lb('Emoji and name')+'<div style="display:flex"><input id="f0" type="text" maxlength="2" value="'+esc(g?g.emoji||'🎯':'🎯')+'" style="width:64px;margin-right:8px;text-align:center">'+txt('f1',g&&g.name,40,'What are you saving for?')+'</div>'+lb('Target')+amtBlock(g?g.target:''),g?'Save changes':'Create goal',function(){
    var n=gv('#f1'),t=amt();if(!n||!t)return toast('Enter a goal name and target');
    var d={name:n,target:t,emoji:gv('#f0')||'🎯'};
    done(g?sb.from('goals').update(d).eq('id',id):sb.from('goals').insert(d),g?'Goal updated':'Goal created');
  });
}
function goalPick(){
  if(!S.goals.length)return goalForm();
  sheet('<h2>Which goal?</h2>'+S.goals.map(function(g){return '<button class="menu" onclick="goalMove('+g.id+',1)"><div class="em">'+(g.emoji||'🎯')+'</div><div><b>'+esc(g.name)+'</b><small>'+money(goalBal(g))+' of '+money(g.target)+'</small></div></button>'}).join(''));
}
function goalMove(id,sign){
  var g=S.goals.find(function(x){return x.id===id}),bal=goalBal(g);
  modal((sign>0?'Put into ':'Take back from ')+esc(g.name),amtBlock('')+'<p class="mu sm" style="margin-bottom:10px">'+(sign>0?'Free savings: '+money(freeSav()):'In this goal: '+money(bal))+'</p>','Confirm',function(){
    var a=amt();if(!a)return toast('Enter an amount above 0');
    if(sign>0&&a>freeSav())return toast('Only '+money(freeSav())+' of free savings available');
    if(sign<0&&a>bal)return toast('This goal only holds '+money(bal));
    done(sb.from('goal_moves').insert({goal_id:id,amount:sign*a}),sign>0?'Added to goal':'Returned to free savings');
  });
}
function potForm(id){
  var p=id?potOf(id):null;
  modal(p?'Edit set-aside':'New weekly set-aside',lb('Emoji and name')+'<div style="display:flex"><input id="f0" type="text" maxlength="2" value="'+esc(p?p.emoji:'⛽')+'" style="width:64px;margin-right:8px;text-align:center">'+txt('f1',p&&p.name,24,'e.g. Fuel')+'</div>'+lb('Set aside every week')+amtBlock(p?p.weekly_amount:''),p?'Save changes':'Create',function(){
    var n=gv('#f1'),a=amt(),e=gv('#f0')||'⛽';if(!n||!a)return toast('Enter a name and weekly amount');
    var cur=ymd(monday(new Date()));
    if(Number(S.set.weekly_budget)<commit(monday(new Date()))-(p?Number(p.weekly_amount):0)+a)toast('Heads up: set-asides now exceed your weekly budget');
    if(!p)return done(sb.from('pots').insert({name:n,emoji:e,weekly_amount:a,since:cur,anchor:cur,base:0}),'Set-aside created');
    var d={name:n,emoji:e};
    if(a!==Number(p.weekly_amount)){d.base=r2(Number(p.base)+Number(p.weekly_amount)*wks(p.anchor,cur));d.anchor=cur;d.weekly_amount=a}
    done(sb.from('pots').update(d).eq('id',id),'Set-aside updated');
  });
}
function potMgr(){
  sheet('<h2>Weekly set-asides</h2>'+(S.pots.map(function(p){return '<div class="item tap" onclick="viewPot('+p.id+')"><div class="em">'+p.emoji+'</div><div class="t"><span>'+esc(p.name)+'</span><span class="mu sm">'+money(p.weekly_amount)+' / week</span></div><span class="mu">›</span></div>'}).join('')||'<p class="mu" style="margin-bottom:12px">None yet.</p>')+'<button class="btn" onclick="potForm()">New set-aside</button>');
}
function budForm(){
  modal('Weekly budget',amtBlock(S.set.weekly_budget)+'<p class="mu sm" style="margin-bottom:10px">Your total for the week. Set-asides come out of this first.</p>','Save budget',function(){if(!amt())return toast('Enter a budget above 0');done(sb.from('settings').update({weekly_budget:amt()}).eq('id',1),'Budget saved')});
}
function catMgr(){
  sheet('<h2>Categories</h2>'+S.cats.map(function(c){return '<div class="item tap" onclick="catForm('+c.id+')"><div class="em">'+c.emoji+'</div><div class="t">'+esc(c.name)+'</div><span class="mu">Edit ›</span></div>'}).join('')+'<button class="btn" onclick="catForm()">New category</button>');
}
function catForm(id){
  var c=id?S.cats.find(function(e){return e.id===id}):null;
  modal(c?'Edit category':'New category',lb('Emoji')+txt('f1',c&&c.emoji,4,'🙂')+lb('Name')+txt('f2',c&&c.name,24,'Category name'),c?'Save changes':'Add',function(){
    var n=gv('#f2');if(!n)return toast('Enter a category name');
    var d={name:n,emoji:gv('#f1')||'💸'};
    done(c?sb.from('categories').update(d).eq('id',id):sb.from('categories').insert({name:n,emoji:d.emoji,sort:S.cats.length+1}),c?'Category updated':'Category added');
  });
  if(c){var r=document.querySelector('#sheet .row2');r.insertAdjacentHTML('beforebegin','<button class="btn alt" style="margin-bottom:8px" onclick="delCat('+id+')">Delete category</button>')}
}
function delCat(id){ask('Delete category?','Past expenses will show as Other.','Delete',function(){done(sb.from('categories').delete().eq('id',id),'Category deleted')})}

