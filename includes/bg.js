var TimeCounterTimer;
var interval = 600000;//по умолчанию 10 минут;
var idle_state = false; //задаем статус простоя. Если FALSE значит простоя нет.

//---
opera.extension.onmessage = function(e){interval = e.data.value; console.log('Установленное время простоя - '+interval/1000+' секунд');}//устанавливаем время простоя 
window.onblur = function(){clearTimeout(TimeCounterTimer)};//сбрасываем таймер, если вкладка теряет фокус
window.onmousemove = function(e){//при движении мышки сбрасываем таймер и снова задаем его. 
	clearTimeout(TimeCounterTimer); 
	TimeCounterIDLE();
	if(idle_state == true){
		console.log('Возбуждаем таймер');
		opera.extension.postMessage({action:'idle_start'});//отправляем запрос на возбуждение таймера.
		idle_state = false;
	}		
}

//---
function TimeCounterIDLE(){TimeCounterTimer = setTimeout(function(){
	console.log('Прошло '+interval/1000+' секунд. Таймер остановлен');
	opera.extension.postMessage({action:'idle_stop'});
	idle_state = true;//Простой.
}, interval);}


