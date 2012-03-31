function GetAbout(){return 'Ver: 1.3 || <b>kos1nus</b> || ortodox.kos1nus@gmail.com'}
function OpenNewTab(value){
	er(value+' open');
	window.open(value);
}	
function i18n(name){return	chrome.i18n.getMessage(name);}

//Часть срипта из INDEX.JS
var IdleState = false;

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
		if(!/chrome:|chrome-extension:/.test(tab.url) && tab.url!=''){
			CheckDomain(tab.url);
			BadgeUpdate(fnGetDomain(tab.url));
		}else{
			er('Нет активной вкладки'); FuncCT();
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


//простой компьютера
chrome.idle.onStateChanged.addListener(function(newstate){er("Браузер сейчас " + newstate);});
setInterval(function(){
	var G_focus;
	chrome.windows.getCurrent(function(e){if(e.focused == false) G_focus = false});
	
	var idle_time = parseInt(local.getItem('IdleTime'));
	if(idle_time > 0  && G_focus==true){
		chrome.idle.queryState(idle_time*60, function (state){
			if(state=='active'){
				if(IdleState==true){ TabOnFocus(); IdleState = false; WebNotifi(IdleState);}
			}else{
				if(IdleState==false){ FuncCT(); IdleState = true; WebNotifi(IdleState);}		
			}							
		});
	}
}, 2000);

function WebNotifi(state){
	var message = (state==true)? i18n('alert_idle_true'):i18n('alert_idle_false');
	var notification = webkitNotifications.createNotification('',message,'');
	notification.ondisplay = function(){setTimeout(function(){notification.cancel();},5000);}
	notification.show(); 
}
	
//Часть срипта из страницы настроек
function FuncChangeIdleTime(){return false;}