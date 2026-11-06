/* App state, toast/db helpers, and data loading */
var S={tab:'home',set:{weekly_budget:1000,palette:localStorage.getItem('pal')||'sensei'},cats:[],exp:[],inc:[],sav:[],goals:[],moves:[],pots:[],wallets:[],wm:[],wal:+localStorage.getItem('wal')||null,cat:null,pay:null,flt:'all',wk:0};
var K={v:''},sb,ready=false;
var PAGES={home:'index.html',history:'history.html',stats:'stats.html',savings:'savings.html',settings:'settings.html'};
var TABS=[['home','🏠','Home'],['history','🧾','History'],['+'],['stats','📊','Stats'],['savings','🏺','Savings']];

function toast(m){var t=$('#toast');t.textContent=m;t.className='show';clearTimeout(toast.t);toast.t=setTimeout(function(){t.className=''},2600)}
async function q(p){var r=await p;if(r.error){toast(r.error.message);throw r.error}return r.data}
async function run(p,msg){await q(p);await load();if(msg)toast(msg)}
function applyPalette(){document.documentElement.setAttribute('data-p',S.set.palette||'sensei');var m=document.querySelector('meta[name=theme-color]');if(m)m.content=getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()}

async function load(){
  var r=await Promise.all([
    q(sb.from('settings').select('*').eq('id',1).single()),
    q(sb.from('categories').select('*').order('sort').order('id')),
    q(sb.from('expenses').select('*').order('spent_on',{ascending:false}).order('id',{ascending:false})),
    q(sb.from('savings').select('*').order('id',{ascending:false})),
    q(sb.from('goals').select('*').order('id',{ascending:false})),
    q(sb.from('income').select('*').order('received_on',{ascending:false}).order('id',{ascending:false})),
    q(sb.from('pots').select('*').order('id')),
    q(sb.from('goal_moves').select('*').order('id',{ascending:false})),
    q(sb.from('wallets').select('*').order('id')),
    q(sb.from('wallet_moves').select('*').order('id',{ascending:false}))
  ]);
  S.set=r[0];S.cats=r[1];S.exp=r[2];S.sav=r[3];S.goals=r[4].filter(function(g){return g.active});S.inc=r[5];S.pots=r[6];S.moves=r[7];S.wallets=r[8];S.wm=r[9];
  if(!S.wallets.some(function(w){return w.id===S.wal}))S.wal=S.wallets.length?S.wallets[0].id:null;
  localStorage.setItem('pal',S.set.palette);
  if(!S.cat||!S.cats.some(function(c){return c.id===S.cat}))S.cat=S.cats.length?S.cats[0].id:null;
  ready=true;applyPalette();render();
}

