function GetAbout(){return 'Ver: '+widget.version+' || <b>'+widget.author+'</b> || '+widget.authorEmail;}//об авторе
function OpenNewTab(value){opera.extension.postMessage({action:'new_tab',value:value});}//открытие новой вкладки
function i18n(name){//функуция локализации
	var msg;
	var xhr = new XMLHttpRequest();					
	var lg = window.navigator.language.substring(0,2);		
	lg=(lg=='ru'||lg=='uk'||lg =='be')?'ru':'en';
			
	var fileURL = './_locales/'+lg+'/messages.json';		
	xhr.open("GET", fileURL, false);				
	xhr.onreadystatechange = function() {				
		if(this.readyState == 4) {				
			var theManifest = JSON.parse(this.responseText);
			if (theManifest[name]) msg = theManifest[name].message;			
		}
	};
	xhr.send();							
	
	if (msg == null) msg = default_getMessage(name);	
	return msg;
}

function default_getMessage(name){					
	var msg;
	var xhr = new XMLHttpRequest();					
	var fileURL = './_locales/en/messages.json';			
	xhr.open("GET", fileURL, false);
	xhr.onreadystatechange = function() {
		if(this.readyState == 4) {
			var theManifest = JSON.parse(this.responseText);
			if (theManifest[name]) msg = theManifest[name].message;
		}
	};
	xhr.send();
	
	if (msg == null) msg = 'undefined';	
	return msg;
}

function ChangeIDLEtime (time) {opera.extension.postMessage({'idle_time':time});}//сообщение о смене времени простоя, которое в дальнейшем будет протранслированно на все вкладки

//Часть срипта из INDEX.JS
function IndexFload(){
	opera.extension.windows.onblur = function(){er('Главное окно НЕ активно'); FuncCT(); opera.extension.broadcastMessage({action:'oera_lost_focus'})};
	opera.extension.windows.onfocus = function(){er('Главное окно активно'); TabOnFocus();}
	opera.extension.tabs.onfocus = function(){TabOnFocus();}
	opera.extension.onconnect = function(e){
		e.source.postMessage({action:'change_idle_time',value:local.getItem('IdleTime')});
		TabOnFocus();
	}
	opera.extension.onmessage = function(e){
		switch(e.data.action){
			case 'new_tab':opera.extension.tabs.create({url:e.data.value,focused:true});break;
			case 'idle_start':FuncCT();break;
			case 'idle_stop':TabOnFocus();break;
			case 'change_idle_time':{
				opera.extension.broadcastMessage({action:'change_idle_time',value:local.getItem('IdleTime')});
				console.log('Смена времени простоя');
			};break;
		}
	} 
	
	theButton = opera.contexts.toolbar.createItem({
		title:"Time Counter",
		icon:"img/favicon.png",
		popup:{href: "popup.html",width: 610,height: 430,scrollbars: 0},
		badge:{backgroundColor:'#8596dd'}
	});
	opera.contexts.toolbar.addItem(theButton);	
}

//вкладка получается фокус 
function TabOnFocus(){
	if(opera.extension.tabs.getFocused() && opera.extension.windows.getFocused().focused){
		CheckDomain(opera.extension.tabs.getFocused().url);
		BadgeUpdate(fnGetDomain(opera.extension.tabs.getFocused().url));
	}else{
		er('Нет активной вкладки'); FuncCT();
	}
}	

function BadgeUpdate(domain,value){//обновляем иконку на панели 
	if(!domain){theButton.badge.textContent =''; return true;}
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
	theButton.badge.textContent =(a.m>9)? a.h+':'+a.m :a.h+':0'+a.m;		
} 

//Часть срипта из страницы настроек
function FuncChangeIdleTime(){opera.extension.postMessage({action:'change_idle_time'});}