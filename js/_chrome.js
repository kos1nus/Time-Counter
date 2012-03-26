function GetAbout(){return 'Ver: 1.2.1 || <b>kos1nus</b> || ortodox.kos1nus@gmail.com'}
function OpenNewTab(value){
	er(value+' open');
	window.open(value);
}	
function i18n(name){return	chrome.i18n.getMessage(name);}

//Часть срипта из INDEX.JS
function IndexFload(){
	chrome.windows.onFocusChanged.addListener(function(windowId){
		if(windowId == -1){er('Главное окно НЕ активно');FuncCT();}
		else{er('Главное окно активно');TabOnFocus();}
	});
	chrome.tabs.onActiveChanged.addListener(function(){TabOnFocus();});
	chrome.tabs.onUpdated.addListener(function(){TabOnFocus();});
}

function TabOnFocus(){
	chrome.tabs.getSelected(null, function(tab){
		if(GlobalFocus == true && !/chrome:|chrome-extension:/.test(tab.url) && tab.url!=''){
			CheckDomain(tab.url);
			BadgeUpdate(fnGetDomain(tab.url));
		}else{
			er('Нет активной вкладки, Глобальный фокус - '+GlobalFocus); FuncCT();
		}
	});
}

function BadgeUpdate(domain,value){
	if(!domain){chrome.browserAction.setBadgeText({text:''}); return true;}
	if(!value){
		var cur_date = GetCurDate().full;
		if(local.getItem('D_'+cur_date)){
			var TempArray = JSON.parse(local.getItem('D_'+cur_date));
			var t_idx=-1;
			for(i=0; i<TempArray.length; i++)if(TempArray[i][0]==domain)t_idx=i; 
			if(t_idx!=-1)
				var value = TempArray[t_idx][1];
			else
				var value = 0;	
		}else{
			var value = 0;
		}
	}
	var a = GetGoodTime(value)
	chrome.browserAction.setBadgeText({text:(a.m>9)? a.h+':'+a.m :a.h+':0'+a.m});		
} 