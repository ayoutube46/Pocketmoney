function settingsView(){
  var row=function(em,t,v,f){return '<div class="item tap" onclick="'+f+'"><div class="em">'+em+'</div><div class="t"><span>'+t+'</span><span class="mu sm">'+v+'</span></div><span class="mu">›</span></div>'};
  return topbar('Settings','<button class="round" onclick="go(\'home\')">✕</button>')
   +row('💵','Weekly budget',money(S.set.weekly_budget)+(commit(monday(new Date()))?' · '+money(commit(monday(new Date())))+' set aside':''),'budForm()')
   +row('👛','Wallets',S.wallets.length+' wallets · '+money(walTotal()),'walMgr()')
   +row('⛽','Weekly set-asides',S.pots.length+' active','potMgr()')
   +row('🏷️','Categories',S.cats.length+' categories','catMgr()')
   +row('🎨','Colours',esc(S.set.palette),'palSheet()');
}
VIEWS.settings=settingsView;
