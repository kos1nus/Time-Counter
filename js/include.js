//Присоединяем уникальный срипт браузера
if(navigator.appName == 'Opera') include('js/_opera.js'); else include('js/_chrome.js');

//Вся остальная поепень
var local = window.localStorage;

var er = function(o){if (local.getItem('debug') == 1) return console.log(o);}//Спамит сообщения в консоль. Требует ключа debug в localStorage
var QSF = function(o){return document.querySelector(o);}//Сокращенный аналог querySelector

function fnGetDomain(u){//Возвращает имя узла, которое в дальнейшем будет использоваться в статистике.
	if(u.indexOf('file://localhost')!=-1) return 'localhost';
	
	try{var url = u.match(/:\/\/(.[^/^:]+)/)[1];}catch(e){er('error: '+e);er('ulr: '+u+' '+typeof(u));}
	if(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/.test(url)) return 'LAN';
	
	if(/.+\.(?:info|co|sch|mil|net|com|gov|org|edu|gr|ac|nom)\.[^\.]+$/.test(url)) return url.match(/([^/^.]+\.[^/^.]+\.[^/^.]+)$/)[1];
	
	var ThreeLVLDomain = JSON.parse(local.getItem('ThreeLVLDomain'));
	var t_idx = 0;
	try{
		for(var i=0; i<ThreeLVLDomain.length; i++) if(url.match(/([^/^.]+\.[^/^.]+)$/)[1]==ThreeLVLDomain[i]) t_idx=1;
		return (t_idx==1) ?url.match(/([^/^.]+\.[^/^.]+\.[^/^.]+)$/)[1] :url.match(/([^/^.]+\.[^/^.]+)$/)[1];
	}catch(e){
		er('some error '+e);
		return false;
	}
}

function GetGoodTime(minutes){//преобразует минуты из статистики в "часы:минуты" 
	var m = minutes % 60;
	var h = (minutes-m)/60;
	var hm='';
	if(h>0) hm = h+' '+i18n('code_hour');
	hm += m+' '+i18n('code_minutes');
	return {h:h,m:m,hm:hm};
}

function GetCurDate(){//возвращает текущую дату. 
	var dt = new Date();
	var CurDate = dt.getFullYear()+'/'+dt.getMonth()+'/'+dt.getDate();
	return {full:CurDate, d:dt.getDate(), m:dt.getMonth(), y:dt.getFullYear()};
}

function include(filename){//Динамическое подключение скриптов
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.src = filename;
	script.type = 'text/javascript';	
	head.appendChild(script);
}