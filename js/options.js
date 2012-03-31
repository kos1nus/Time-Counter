//облать перменных
var UserRegExpPattern, select_pattern, txt_pattern, ThreeLVLDomain, select_ThreeLVLDomain;
			
//Присоединяем уникальный срипт браузера
if(navigator.appName == 'Opera')
	window.addEventListener('DOMContentLoaded',function(){include('js/_opera.js',Fload)},false); 
else
	include('js/_chrome.js',function(){Fload();});

//стартовая функция			
function Fload(){
	//локализация
	var dom_elems = document.querySelectorAll('input[type="button"]');
		for(var i=0; i<dom_elems.length; i++) if(i18n(dom_elems[i].id)!='undefined')dom_elems[i].value = i18n(dom_elems[i].id);
	var dom_elems = document.querySelectorAll('legend, label');
		for(var i=0; i<dom_elems.length; i++) if(i18n(dom_elems[i].id)!='undefined')dom_elems[i].innerHTML = i18n(dom_elems[i].id);
	var dom_elems = document.querySelectorAll('input[type="checkbox"]');
		for(var i=0; i<dom_elems.length; i++) if(i18n(dom_elems[i].id)!='undefined')dom_elems[i].title = i18n(dom_elems[i].id);		
	QSF('#option_about').innerHTML = GetAbout();
	
	//Пользовательский шаблон
	select_pattern = QSF('#SelectRegExp');
	txt_pattern = QSF('#pattern');
	select_pattern.addEventListener('change',function(){GetPattern(this.value);},false);
	
	if(local.getItem('UserRegExpPattern')) UserRegExpPattern = JSON.parse(local.getItem('UserRegExpPattern')); else UserRegExpPattern = new Array();
	var count = UserRegExpPattern.length;
	if(count>0){
		for(var i=0; i<count; i++){select_pattern.options[i]=new Option(UserRegExpPattern[i][0],i);}
		txt_pattern.value = UserRegExpPattern[select_pattern.selectedIndex][1];
	}
	
	//3-хуровневые домена
	select_ThreeLVLDomain = QSF('#SelectThreeLVLDomain');
	
	ThreeLVLDomain = JSON.parse(local.getItem('ThreeLVLDomain'));
	var count = ThreeLVLDomain.length;
	if(count>0) for(var i=0; i<count; i++){select_ThreeLVLDomain.options[i]=new Option(ThreeLVLDomain[i],i);}

	//настройка времени простоя
	ChengeIDLEcheck((local.getItem('IdleTime')>0)?true:false);
}
		
		
//шаблоны		
function AddPattern(){
	var name = prompt(i18n('alert_pattern_name'));
		if(name=='' || name==null) return;
	var pattern = prompt(i18n('alert_patten'));
		if(pattern=='' || pattern==undefined) return;
	var tmp_url = prompt(i18n('alert_pattern_test'));
	var tmp_pattern = new RegExp(pattern);
		if(tmp_url=='' || tmp_url==undefined || tmp_pattern.test(tmp_url)==false){
			alert(i18n('alert_pattern_test_error'));return;
		}else if(tmp_url.match(tmp_pattern)[1]==null){
			alert(i18n('alert_pattern_test_error2'));return;
		}else{
			alert(i18n('alert_test_excellent'));
		}
		
	UserRegExpPattern.push([name,pattern]);
	local.setItem('UserRegExpPattern', JSON.stringify(UserRegExpPattern));
	window.location.reload();
}
	
function DelPattern(){
	if(select_pattern.selectedIndex!=-1){
		if(confirm(i18n('alert_remove_pattern'))){
			if(local.getItem('U_'+UserRegExpPattern[select_pattern.selectedIndex][0])) local.removeItem('U_'+UserRegExpPattern[select_pattern.selectedIndex][0]);
			if(local.getItem('DomainIdPage')==UserRegExpPattern[select_pattern.selectedIndex][0]) local.removeItem('DomainIdPage');
			UserRegExpPattern.splice(select_pattern.selectedIndex,1);
			local.setItem('UserRegExpPattern', JSON.stringify(UserRegExpPattern));
			window.location.reload();
		}
	}	
}
	
function EditPattern(){
	if(select_pattern.selectedIndex!=-1){
		var name = prompt(i18n('alert_pattern_name'),select_pattern[select_pattern.selectedIndex].text);
			if(name=='' || name==null) return;
		var pattern = prompt(i18n('alert_patten'),UserRegExpPattern[select_pattern.selectedIndex][1]);
			if(pattern=='' || pattern==undefined) return;
		var tmp_url = prompt(i18n('alert_pattern_test'));	
		var tmp_pattern = new RegExp(pattern);
			if(tmp_url=='' || tmp_url==undefined || tmp_pattern.test(tmp_url)==false){
				alert(i18n('alert_pattern_test_error'));return;
			}else if(tmp_url.match(tmp_pattern)[1]==null){
				alert(i18n('alert_pattern_test_error2'));return;
			}else{
				alert(i18n('alert_test_excellent'));
			}	
			
		UserRegExpPattern[select_pattern.selectedIndex] = [name,pattern];
		local.setItem('UserRegExpPattern', JSON.stringify(UserRegExpPattern));
		window.location.reload();
	}else{
		AddPattern();
	}	
}
	
function testIt(){
	if(select_pattern.selectedIndex!=-1){
		var tmp_url = prompt(i18n('alert_pattern_test'));
		var tmp_pattern = new RegExp(txt_pattern.value);
		if(tmp_pattern.test(tmp_url)==true){
			alert(i18n('alert_test_excellent'));
		}else{
			alert(i18n('alert_test_fail'));
		}
	}	
}

function GetPattern(idx){txt_pattern.value = UserRegExpPattern[idx][1];}	
function SetDefault(){if(select_pattern.selectedIndex!=-1){local.setItem('DomainIdPage', UserRegExpPattern[select_pattern.selectedIndex][0]);}}

//3-хуровневые домена
function AddThreeLVLDomain(){
	var name = prompt(i18n('alert_add_ThreeLVLDomain'));
		if(name=='' || name==null) return;
			
	ThreeLVLDomain.push(name);
	local.setItem('ThreeLVLDomain', JSON.stringify(ThreeLVLDomain));
	window.location.reload();
}

function EditThreeLVLDomain(){
	if(select_ThreeLVLDomain.selectedIndex!=-1){
		var name = prompt(i18n('alert_edit_ThreeLVLDomain'),select_ThreeLVLDomain[select_ThreeLVLDomain.selectedIndex].text);
			if(name=='' || name==null) return;
			
		ThreeLVLDomain[select_ThreeLVLDomain.selectedIndex] = name;
		local.setItem('ThreeLVLDomain', JSON.stringify(ThreeLVLDomain));
		window.location.reload();
	}else{
		AddThreeLVLDomain();
	}	
}

function DelThreeLVLDomain(){
	if(select_ThreeLVLDomain.selectedIndex!=-1){
		if(confirm(i18n('alert_del_ThreeLVLDomain'))){
			ThreeLVLDomain.splice(select_ThreeLVLDomain.selectedIndex,1);
			local.setItem('ThreeLVLDomain', JSON.stringify(ThreeLVLDomain));
			window.location.reload();
		}
	}	
}

//сброс данных
function ResetData(){
	if(prompt(i18n('alert_reset')) == 'reset'){
		local.clear();
		local.setItem('ExtraAlternatMenu', 1);		
		local.setItem('UserRegExpPattern', JSON.stringify([]));
		local.setItem('TOTAL', JSON.stringify([]));
		local.setItem('D_'+GetCurDate().full, JSON.stringify([]));
		local.setItem('ThreeLVLDomain', JSON.stringify(['google.com','google.ru','ucoz.ru','narod.ru']));
		local.setItem('IdleTime', 5);
		alert('OK');
		window.location.reload();
	}else
		alert(i18n('alert_no_reset'));
}

//изменени время простоя 
function IdleRangeCH(){
	QSF('#option_idle_label').innerHTML = QSF('#option_idle_range').value+' m.';
	local.setItem('IdleTime', QSF('#option_idle_range').value);
	FuncChangeIdleTime();
}

function ChengeIDLEcheck(boo){	
	QSF('#option_idle_check').checked = boo;
	if(boo == true){
		var tmp = Math.abs(local.getItem('IdleTime'));
		local.setItem('IdleTime', tmp);
		QSF('#option_idle_label').innerHTML = tmp+' m.';
		var range = QSF('#option_idle_range');
			range.value = tmp;
			range.disabled =false;
	}else{
		QSF('#option_idle_label').innerHTML = '--';
		QSF('#option_idle_range').disabled = true;
		local.setItem('IdleTime', Math.abs(local.getItem('IdleTime'))*-1);
	}
	FuncChangeIdleTime();
}