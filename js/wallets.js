/* ---------- wallets ---------- */
function walRow(x){var w=x.wallet_id&&walOf(x.wallet_id);return w?dr('Wallet',w.emoji+' '+esc(w.name)):''}
function walOpts(sel){return '<option value="">No wallet</option>'+S.wallets.map(function(w){return '<option value="'+w.id+'"'+(w.id===sel?' selected':'')+'>'+w.emoji+' '+esc(w.name)+'</option>'}).join('')}
function walChips(t){
  if(!S.wallets.length)return '';
  return lb(t)+'<div class="chips">'+S.wallets.map(function(w){return '<button class="chip'+(w.id===S.wal?' on':'')+'" data-w="'+w.id+'" onclick="pickWal('+w.id+')">'+w.emoji+' '+esc(w.name)+'</button>'}).join('')+'</div>';
}
function pickWal(id){S.wal=id;localStorage.setItem('wal',id);document.querySelectorAll('[data-w]').forEach(function(c){c.classList.toggle('on',+c.dataset.w===id)})}
function walStrip(){
  return '<div class="scroll">'+S.wallets.map(function(w){var b=walBal(w);return '<div class="pc tap" onclick="viewWal('+w.id+')"><div class="em">'+w.emoji+'</div><b>'+esc(w.name)+'</b><div class="v"'+(b<0?' style="color:var(--bad)"':'')+'>'+money(b)+'</div></div>'}).join('')+'<div class="pc add tap" onclick="walForm()"><div class="em">＋</div><small>New wallet</small></div></div>';
}
function walMgr(){
  sheet('<h2>Wallets</h2>'+(S.wallets.map(function(w){return '<div class="item tap" onclick="viewWal('+w.id+')"><div class="em">'+w.emoji+'</div><div class="t"><span>'+esc(w.name)+'</span></div><div class="amt">'+money(walBal(w))+'</div></div>'}).join('')||'<p class="mu" style="margin-bottom:12px">Add the places you keep money: apps, cash, a bank…</p>')+'<button class="btn" onclick="walForm()">New wallet</button>');
}
function walForm(id){
  var w=id?walOf(id):null;
  modal(w?'Edit wallet':'New wallet',lb('Emoji and name')+'<div style="display:flex"><input id="f0" type="text" maxlength="2" value="'+esc(w?w.emoji:'👛')+'" style="width:64px;margin-right:8px;text-align:center">'+txt('f1',w&&w.name,24,'e.g. Cash, JazzCash')+'</div>'+lb(w?'Current balance':'Money in it now')+amtBlock(w?r2(walBal(w)):''),w?'Save changes':'Add wallet',function(){
    var n=gv('#f1'),e=gv('#f0')||'👛',v=amt();if(!n)return toast('Enter a wallet name');
    if(!w)return done(sb.from('wallets').insert({name:n,emoji:e,base:v}),'Wallet added');
    done(sb.from('wallets').update({name:n,emoji:e,base:r2(Number(w.base)+v-walBal(w))}).eq('id',id),'Wallet updated');
  });
}
function walMove(mode,from){
  if(S.wallets.length<(mode?1:2))return walForm();
  var o=function(sel){return S.wallets.map(function(w){return '<option value="'+w.id+'"'+(w.id===sel?' selected':'')+'>'+w.emoji+' '+esc(w.name)+' ('+money(walBal(w))+')</option>'}).join('')};
  var f=from||S.wallets[0].id,t=(S.wallets.find(function(w){return w.id!==f})||{}).id;
  modal(mode>0?'Add money to a wallet':'Move between wallets',amtBlock('')+(mode<=0?'<div class="chips"><button class="chip" onclick="maxAmt()">Use whole balance</button></div>'+lb('From')+'<select id="wf">'+o(f)+'</select>':'')+(mode>=0?lb(mode>0?'Into':'To')+'<select id="wt">'+o(mode>0?f:t)+'</select>':'')+txt('f1','',60,'Note (optional)'),'Confirm',function(){
    var a=amt(),fi=mode<=0?+$('#wf').value:null,ti=mode>=0?+$('#wt').value:null;
    if(!a)return toast('Enter an amount above 0');
    if(fi&&ti&&fi===ti)return toast('Pick two different wallets');
    if(fi&&a>walBal(walOf(fi)))return toast('That wallet only holds '+money(walBal(walOf(fi))));
    done(sb.from('wallet_moves').insert({from_id:fi,to_id:ti,amount:a,note:gv('#f1')||null}),mode>0?'Money added':'Money moved');
  });
}
function maxAmt(){var w=walOf(+$('#wf').value);if(w){K.v=String(Math.max(0,r2(walBal(w))));$('#ad').textContent='Rs.'+K.v}}
function viewWal(id){
  var w=walOf(id);if(!w)return;var b=walBal(w);
  var l=S.wm.filter(function(m){return m.from_id===id||m.to_id===id}).slice(0,4).map(function(m){var i=m.to_id===id,o=walOf(i?m.from_id:m.to_id);return dr(short(new Date(m.created_at))+' · '+(i?'from ':'to ')+(o?esc(o.name):'outside'),'<span style="color:'+(i?'var(--a2)':'var(--bad)')+'">'+(i?'+':'−')+money(m.amount)+'</span>')}).join('');
  detail(esc(w.name),w.emoji,'<span'+(b<0?' style="color:var(--bad)"':'')+'>'+money(b)+'</span>',dr('Spent from it',money(sum(S.exp.filter(function(x){return x.wallet_id===id}))))+dr('Received into it',money(sum(S.inc.filter(function(x){return x.wallet_id===id}))))+(l?'<p class="mu sm" style="margin-top:10px">Latest transfers</p>'+l:'')+'<div class="row2" style="margin:12px 0 8px">'+btn('Move out','walMove(0,'+id+')','')+btn('Add money','walMove(1,'+id+')')+'</div>',btn('Edit','walForm('+id+')')+btn('Delete','delWal('+id+')','bad'));
}
function delWal(id){ask('Delete wallet?','Its transfers are removed and past expenses stay but lose their wallet tag.','Delete',function(){done(sb.from('wallets').delete().eq('id',id),'Wallet deleted')})}

