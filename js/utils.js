/* Small helpers: DOM, dates, money, escaping */
var $=function(s){return document.querySelector(s)};
var pad=function(n){return(n<10?'0':'')+n};
var ymd=function(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())};
var parse=function(s){var p=s.split('-');return new Date(+p[0],+p[1]-1,+p[2])};
var addDays=function(d,n){return new Date(d.getFullYear(),d.getMonth(),d.getDate()+n)};
var monday=function(d){return addDays(d,-((d.getDay()+6)%7))};
var wks=function(a,b){return Math.round((parse(b)-parse(a))/6048e5)};
var r2=function(n){return Math.round(n*100)/100};
var money=function(n){return 'Rs.'+Number(n).toLocaleString('en-PK',{maximumFractionDigits:2})};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var DN=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],MN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var short=function(d){return d.getDate()+' '+MN[d.getMonth()]};
var fullDate=function(d){return DN[(d.getDay()+6)%7]+', '+d.getDate()+' '+MN[d.getMonth()]+' '+d.getFullYear()};
