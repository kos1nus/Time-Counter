//область пемеренных
var DomainArray = new Array();
var UserRegExpArray = new Array();
var TO;
var FocusDomain='';
var ID_DomainPage,Name_UserRegExpPage,idx_UserRegExpArray;
var Interval = 2;
function FuncCT(){clearTimeout(TO);er('Сброс таймера');FocusDomain='';BadgeUpdate();}

/* -- Выставляет стандартные значения -- */
if(!local.getItem('D_'+GetCurDate().full)) local.setItem('D_'+GetCurDate().full, JSON.stringify([]));	
if(!local.getItem('UserRegExpPattern')) local.setItem('UserRegExpPattern', JSON.stringify([]));
if(!local.getItem('TOTAL')) local.setItem('TOTAL', JSON.stringify([]));
if(!local.getItem('ThreeLVLDomain')) local.setItem('ThreeLVLDomain', JSON.stringify(['google.com','google.ru','ucoz.ru','narod.ru']));
if(!local.getItem('IdleTime')) local.setItem('IdleTime', JSON.stringify(5));

//Присоединяем уникальный срипт браузера
if(navigator.appName == 'Opera') include('js/_opera.js'); else include('js/_chrome.js',function(){IndexFload();});

/* 
Тут вставляются некоторые функции из _chrome.js/_opera.js
*/

function CheckDomain(URL){
	var check = fnGetDomain(URL);
	if(check!=false) var domain = check; else{FuncCT(); return false;}	
	er(domain+' находится в фокусе');
	
	//Проверяем пользовательские настройки шаблона
	ID_DomainPage = Name_UserRegExpPage = idx_UserRegExpArray = undefined;//обнуляем переменные
	var UserRegExpPattern = JSON.parse(local.getItem('UserRegExpPattern'));
	for(var i=0; i<UserRegExpPattern.length; i++){
		var UserPattern = new RegExp(UserRegExpPattern[i][1]);
		if(UserPattern.test(URL)){
			Name_UserRegExpPage = UserRegExpPattern[i][0];
			ID_DomainPage = URL.match(UserPattern)[1];
			
			var count = UserRegExpArray.length;
			if(count != 0){
				idx_UserRegExpArray=-1;
				for(x=0; x<count; x++){if(UserRegExpArray[x][0] == ID_DomainPage) idx_UserRegExpArray = x;}
				if(idx_UserRegExpArray==-1){
					UserRegExpArray.push([ID_DomainPage,0]);
				idx_UserRegExpArray=UserRegExpArray.length-1;
				}
			}else{
				UserRegExpArray.push([ID_DomainPage,0]);
				idx_UserRegExpArray=UserRegExpArray.length-1;
			}
			er(ID_DomainPage);
			i=UserRegExpPattern.length;
		}
	}

	if(domain != FocusDomain){
		FocusDomain = domain;
	
		//Проверка домена
		var count = DomainArray.length;
		if(count != 0){
			var idx_DomainArray=-1;
			for(i=0; i<count; i++){if(DomainArray[i][0] == domain) idx_DomainArray = i;}
			if(idx_DomainArray==-1){
				DomainArray.push([domain,0]);
				idx_DomainArray=DomainArray.length-1;
			}
		}else{
			DomainArray.push([domain,0]);
			idx_DomainArray=DomainArray.length-1;
		}	
		
		er('Сброс таймера');	
		clearTimeout(TO); 
		TO = window.setInterval(function(){
			PushStat(domain, idx_DomainArray);
			if(idx_UserRegExpArray > -1) PushUserRE(Name_UserRegExpPage,ID_DomainPage,idx_UserRegExpArray);
		},Interval*1000); 
	}
}

function PushUserRE(Name_UserRegExpPage,ID_DomainPage,idx_UserRegExpArray){
	er('ID странцы "польовательского шаблона" - '+ID_DomainPage);
	UserRegExpArray[idx_UserRegExpArray][1]+=Interval;
	if(UserRegExpArray[idx_UserRegExpArray][1]==60){
		//input cur site stats
		if(local.getItem('U_'+Name_UserRegExpPage)){
			var TempArray = JSON.parse(local.getItem('U_'+Name_UserRegExpPage));
			var t_idx=-1;
			for(i=0; i<TempArray.length; i++){ if(TempArray[i][0]==ID_DomainPage)t_idx=i; }
			if(t_idx!=-1) TempArray[t_idx][1]++; else TempArray.push([ID_DomainPage, 1]);
		}else{
			var TempArray = new Array([ID_DomainPage, 1]);
		}
		local.setItem('U_'+Name_UserRegExpPage, JSON.stringify(TempArray));
		
		//reset count
		UserRegExpArray[idx_UserRegExpArray][1]=0;
	}
}



function PushStat(domain, idx_DomainArray){
	DomainArray[idx_DomainArray][1]+=Interval;
	er(domain+' '+DomainArray[idx_DomainArray][1]+' сек. из 60');
	if(DomainArray[idx_DomainArray][1]==60){
		//Запись общей статистики
		if(local.getItem('TOTAL')){
			var TempArray = JSON.parse(local.getItem('TOTAL'));
			var t_idx=-1;
			for(i=0; i<TempArray.length; i++){ if(TempArray[i][0]==domain)t_idx=i; }
			if(t_idx!=-1){
				TempArray[t_idx][1]++; 
				if(!local.getItem('S_'+domain)) PushSiteIdx.CheckSite(domain);
			}else{ 
				TempArray.push([domain, 1]);
				PushSiteIdx.CheckSite(domain);
			}
		}else{
			var TempArray = new Array([domain, 1]);
			PushSiteIdx.CheckSite(domain);
		}	
		local.setItem('TOTAL', JSON.stringify(TempArray));
		
		//Запись статистики текущего дня
		var cur_date = GetCurDate().full;
		if(local.getItem('D_'+cur_date)){
			var TempArray = JSON.parse(local.getItem('D_'+cur_date));
			var t_idx=-1;
			for(i=0; i<TempArray.length; i++){ if(TempArray[i][0]==domain)t_idx=i; }
			if(t_idx!=-1){
				TempArray[t_idx][1]++;
				var badge_value = TempArray[t_idx][1];
			}else{ 
				TempArray.push([domain, 1]);
				var badge_value = 1;
				PushSiteIdx.CheckIdx(domain,(TempArray.length-1));
			}	
		}else{
			var TempArray = new Array([domain, 1]);
			var badge_value = 1;
			PushSiteIdx.CheckIdx(domain,0);
		}
		
		BadgeUpdate(domain,badge_value);
		local.setItem('D_'+cur_date, JSON.stringify(TempArray));
		
		//Сброс счетчика
		DomainArray[idx_DomainArray][1]=0;	
	}
}

var PushSiteIdx = {
	CheckSite: function(domain){
			local.setItem('S_'+domain, JSON.stringify([]));
			er('Проверка '+domain);
		},
	CheckIdx: function(domain,idx){
			var TempArray = JSON.parse(local.getItem('S_'+domain));
			TempArray.push({'date':GetCurDate().full, 'index':idx});
			local.setItem('S_'+domain, JSON.stringify(TempArray));
			er('Установлен индекс '+idx+' для '+domain);
		}
}