var TimeCounterTimer;
var interval;//по умолчанию 10 минут;
var idle_state = false; //задаем статус простоя. Если FALSE значит простоя нет.
var idle_m;

//---
opera.extension.onmessage = function(e){
	switch(e.data.action){
		case 'connect':{//соединение скрипта, получение настроек.
			interval=e.data.value; 
			idle_m = e.data.idle_m;
			console.log('Установленное время простоя - '+interval+' минут');
		};break;
		case 'change_idle_time':interval=e.data.value; console.log('Установленное время простоя - '+interval+' минут');break;//устанавливаем время простоя
		case 'oera_lost_focus':{console.log('фокус потерян');clearTimeout(TimeCounterTimer)};break;//окно оперы теряет фокус. как оказалось, простого события blur во встроенном сткипте оказалось недостаточно для отслеживания сего.
	} 
}
window.onblur = function(){console.log('фокус потерян');clearTimeout(TimeCounterTimer)};//сбрасываем таймер, если вкладка теряет фокус
window.onfocus=window.onkeypress=window.onmousemove=function(e){//при движении мышки сбрасываем таймер и снова задаем его.
	clearTimeout(TimeCounterTimer); 
	TimeCounterIDLE();
};


//---
function TimeCounterIDLE(){//Таймер, отсчитывающий время до простоя
	if(idle_state == true){
		console.log('Возбуждаем таймер');
		opera.extension.postMessage({action:'idle_stop'});//отправляем запрос на возбуждение таймера.
		idle_state = false;//нет простоя
		Noti(false);
	}		
	if(interval>0){
		TimeCounterTimer = setTimeout(function(){
			console.log('Прошло '+interval+' Минут. Таймер остановлен');
			opera.extension.postMessage({action:'idle_start'});
			idle_state = true;//Простой.
			Noti(true);
		}, interval*60000);
	}	
}

function Noti(creatNoti){
	if(creatNoti==true){
		var elem = document.createElement('div');
			elem.setAttribute('id','TimeCounter');
			var lg = window.navigator.language.substring(0,2);		
			elem.innerHTML ='Time Counter :: ' + idle_m;
			elem.style ='position:fixed; display:table-cell; text-align:center; top:6px; height:18px; width:100%; padding:2px; background:#ff9900; border:1px solid rgba(0,0,0,0.5); color:white; font: bold small-caps 14px/16px fantasy;'; 	
		document.body.appendChild(elem);
	}else{
		document.body.removeChild(document.querySelector('#TimeCounter'));
	}
}
	