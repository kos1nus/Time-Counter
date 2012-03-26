//--- var
var ch0_select=ch1_select=0;
var ch1_value='.*';
var chart_item, chart_type, Chart_Main, date_F, date_T, open_set_interval, div_set_interval, sel_1, sel_2;

addEventListener('DOMContentLoaded',Fload,false);

function Fload(){//первая загрузка
	if(local.getItem('DomainIdPage') && local.getItem('U_'+local.getItem('DomainIdPage'))){
		var UserRE_IdPage = local.getItem('DomainIdPage');
		QSF('#input_UsReEx').disabled = false;
	}else if(local.getItem('UserRegExpPattern')  && JSON.parse(local.getItem('UserRegExpPattern'))[0] && local.getItem('U_'+JSON.parse(local.getItem('UserRegExpPattern'))[0][0])){
		var UserRE_IdPage = JSON.parse(local.getItem('UserRegExpPattern'))[0][0];
		QSF('#input_UsReEx').disabled = false;
	}
	
	open_set_interval = QSF('#open_set_interval');//кнопка открытия формы выбора интервала
	div_set_interval = QSF('#div_set_interval');//форма выбора интервала
	sel_1=QSF('#select_1_set_interval');
	sel_2=QSF('#select_2_set_interval');
	
	open_set_interval.addEventListener('click', function(){
		if(open_set_interval.value == '*') SetIntervalForm(1); else SetIntervalForm(0);
	},false);
	
	sel_1.addEventListener('change', function(){RenderMainChar(sel_1.selectedIndex,sel_2.selectedIndex);},false);
	sel_2.addEventListener('change', function(){RenderMainChar(sel_1.selectedIndex,sel_2.selectedIndex);},false);
	
	var dom_elems = document.querySelectorAll('input.button,input.button_selected');
	for(var i=0; i<dom_elems.length; i++){//собитие изменения выпадающего списка
		dom_elems[i].value = i18n(dom_elems[i].id);
		dom_elems[i].addEventListener('click', function(){
			QSF('.button_selected').setAttribute('class','button');
			this.setAttribute('class','button_selected');
			ch0_select=parseInt(this.name); 
			er(parseInt(i));
			UpdateSelect();
			if(select.selectedIndex>-1){
				ch1_value=select[select.selectedIndex].value;
				ch1_select=select.selectedIndex;
			}else 
				ch1_select=select.selectedIndex;	
				
			if(ch0_select==3){
				RenderMainChar(6,0);//если выбрали статистику по сайтам, передаем параметры на отображения периода. По умолчанию покажет 7 последних дней.
				open_set_interval.style.display = 'block';
			}else{
				RenderMainChar();
				open_set_interval.style.display = 'none';
			}
			SetIntervalForm(0);			
		},false);
	
	}
	
	select = QSF('#SelectExtra');
	select.addEventListener('change',function(){
		ch1_select = select.selectedIndex;
		ch1_value = select[select.selectedIndex].value;
		RenderMainChar(6,0);//если выбрали статистику по сайтам, передаем параметры на отображения периода. По умолчанию покажет 7 последних дней.
		SetIntervalForm(0);
	},false);
	UpdateSelect();
	RenderMainChar(6,0);//если выбрали статистику по сайтам, передаем параметры на отображения периода. По умолчанию покажет 7 последних дней.
}

function SetIntervalForm(x){//форма выбора интервала на графике выбранного сайта
	if(x){
		div_set_interval.style.display ='block';
		open_set_interval.value = 'X';
		
		var TempArray = JSON.parse(local.getItem(ch1_value));
		var count = TempArray.length;				
						
		for(var i=0; i<count; i++){
			sel_1.options[i]=new Option(FormDate(TempArray[count-i-1].date).dmy,TempArray[count-i-1].index);
			sel_2.options[i]=new Option(FormDate(TempArray[count-i-1].date).dmy,TempArray[count-i-1].index);
		}
		sel_1.selectedIndex=date_F;
		sel_2.selectedIndex=date_T;	
	}else{
		open_set_interval.value = '*';
		sel_2.innerHTML=sel_1.innerHTML='';
		div_set_interval.style.display ='none';
	}
}


function RenderMainChar(F,T){//формирование графика
	if(ch0_select>-1 && ch1_select>-1){
		var MainCharData = new Array();
		switch(ch0_select){
			case 0:{//круговая диаграмма общей статистики. 
				var TempArray = JSON.parse(local.getItem('TOTAL'));
				var count = TempArray.length;
				var ttl = 0;
				
				if(ch1_value!='.*'){
					var TempPattern = new RegExp('.+\\'+ch1_value);
					for(var i=0;i<count; i++){if(TempPattern.test(TempArray[i][0])){
						ttl += TempArray[i][1];
					}}
					var balance = ttl;
					for(var i=0;i<count; i++){if(TempPattern.test(TempArray[i][0]) && TempArray[i][1]>(ttl/100*1)){
							MainCharData.push(TempArray[i]);
							balance -= TempArray[i][1];
					}}
					if(balance>0)MainCharData.push([i18n('code_other'), balance]);
				}else{
					for(i=0; i<count; i++){ttl += TempArray[i][1];}
					var balance = ttl;
					for(i=0; i<count; i++){
						if(TempArray[i][1]>(ttl/100*1)){
							MainCharData.push(TempArray[i]);
							balance -= TempArray[i][1];
						}
					}
					if(balance>0)MainCharData.push([i18n('code_other'), balance]);
				}	
			};break;
			case 1:
			case 2:{//дневная статистика и "пользовательский шаблон"
				var TempArray = JSON.parse(local.getItem(ch1_value));
				var count = TempArray.length;
				var ttl = 0;			
				
				for(var i=0;i<count; i++){ttl += TempArray[i][1];}
				var balance = ttl;
				
				for(var i=0;i<count; i++){if(TempArray[i][1]>(ttl/100*1)){
							MainCharData.push(TempArray[i]);
							balance -= TempArray[i][1];
				}}
				if(balance>0) MainCharData.push([i18n('code_other'), balance]);	
			};break;
			case 3:{//создаем график для статистики выбранного сайта
				var TempArray = JSON.parse(local.getItem(ch1_value));
				var TempArray_2 = new Array();
				var xAxis = new Array();
				var ttl = 0;
				TempArray_3 = new Array();
				var count = TempArray.length;	
				
				var tmp = F;if(F<T){F=T;T=tmp;}
				
				F=((count-1)<F)?0:count-F-1; 
				T=count-T-1;
								
				date_F=count-F-1;
				date_T=count-T-1;
								
				for(var i=F; i<=T; i++){
					xAxis.push(FormDate(TempArray[i].date).dm);
					var a = JSON.parse(local.getItem('D_'+TempArray[i].date))[TempArray[i].index][1];
					TempArray_2.push(a);
					ttl += a;
				}
					
				MainCharData.push({name:CharName(ch1_value), data:TempArray_2});
			};break;
		}

		if(ch0_select==3)RenserAreaChar(MainCharData,ttl,xAxis); else RenderPieChar(MainCharData,ttl);			
	}else{	
		er('error');
	}	
}

function RenderPieChar(MainCharData,ttl){//круговая диаграмма
	$(document).ready(function() {
		chart = new Highcharts.Chart({
			chart:{renderTo:'container', plotBackgroundColor:null, plotBorderWidth:null, plotShadow:false,backgroundColor:null},
			title:{text:i18n('code_total')+': '+GetGoodTime(ttl).hm},
			tooltip:{formatter:function(){return '<b>'+ this.point.name+'</b>: '+this.percentage.toFixed(2)+' %'}},
			legend:{enabled:true, floating:false, layout:'horizontal', x:0, y:0},
			credits:{enabled: false},
			exporting:{enabled: false},
			plotOptions:{pie:{
				allowPointSelect: false,
				cursor: 'pointer',
				point:{events:{click:function(){if(this.name!=i18n('code_other') && this.name!='LAN' && this.name!='localhost' && ch0_select!=2){OpenNewTab('http://'+this.name);}}}},
				animation:false,
				size:'60%',
				showInLegend:true,
				dataLabels: {
					enabled: true,
					color: '#000000',
					connectorColor: '#000000',
					formatter: function(){return '<b>'+ this.point.name +'</b>: ' + GetGoodTime(this.point.y).hm;}			
				}
			}},
		    series: [{type:'pie', data:MainCharData}]
		});
	});			
}		

function RenserAreaChar(MainCharData,ttl,xAxis){//линейная диаграмма. Статистика по сайтам
	$(document).ready(function() {
		chart = new Highcharts.Chart({
			chart:{
				renderTo:'container',
				defaultSeriesType:'area',
				spacingBottom:30,
				backgroundColor:null
			},
			exporting:{enabled:false},
			title:{text:CharName(ch1_value) + ' :: '+i18n('code_total')+': '+GetGoodTime(ttl).hm},//Заголовок графика
			legend:{
				enabled:false,
				layout:'vertical',
				align:'left',
				verticalAlign:'top',
				x:150,
				y:100,
				floating:true,
				borderWidth:1,
				backgroundColor:'#FFFFFF'
			},
			xAxis:{categories:xAxis},
			yAxis:{title:{text:i18n('code_minutes_full')},labels:{formatter:function(){return this.value;}}},
			tooltip:{formatter:function(){return this.x +' :: '+ GetGoodTime(this.y).hm;}},//всплывающее окошко
			plotOptions:{area:{	fillOpacity: 0.5}},
			credits:{enabled:false},
			series:MainCharData
		});
	});
}

function ArraySort(IncomingArray){//сортируем массив. походу я уже это нигде не использую =\
	var count = IncomingArray.length;
	var ttl = 0;
	var SortAr = new Array();

	for(i=0; i<count; i++){ttl += IncomingArray[i][1];}
	var balance = ttl;
	for(i=0; i<count; i++){
		if(IncomingArray[i][1]>(ttl/100*1)){
			SortAr.push(IncomingArray[i]);
			balance -= IncomingArray[i][1];
		}
	}
	if(balance>0)SortAr.push([i18n('code_other'), balance]);
	return {ttl:ttl,SortAr:SortAr};
}

function CharName(name){//возвращаем нормальный имена
	switch(ch0_select){
		case 0: return name;	break;
		case 1:	return FormDate(name).dmy;	break;
		case 2: return name.match(/U_(.+)/)[1]; break;
		case 3: return name.match(/S_(.+)/)[1]; break;
	}
}

function FormDate(date){//формирование даты
	var a = date.match(/D?_?([0-9]+)\/([0-9]+)\/([0-9]+)/);
	var dd = (a[3]*1<10)?'0'+a[3]:a[3];
	var mm = i18n('month_'+[a[2]]);
	var yy = a[1];
	return {dm:dd+'.'+mm,dmy:dd+'.'+mm+'.'+yy};
}

//альтернативное меню
function UpdateSelect(){
		switch(ch0_select){
		case 0:{//Общая статистика
			var TempArray = JSON.parse(local.getItem('TOTAL'));
			var count = TempArray.length;
			var ch1_data = new Array();
			
			ch1_data.push(['.*','.*']);//добавлям первый элемент в массив.
			var ch1_data_count = ch1_data.length;
			
			for(var i=0; i<count;i++){
				var idx = 0;
				for(var x=0;x<ch1_data_count;x++){
					if(/\.[^.]+/.test(TempArray[i][0])){
						if(TempArray[i][0].match(/\.[^.]+$/)[0] == ch1_data[x][0]) idx = 1;
					}else{
						idx = 1;
					}	
				}
				if(idx==0){
					ch1_data.push([TempArray[i][0].match(/\.[^.]+$/)[0],TempArray[i][0].match(/\.[^.]+$/)[0]]);
					ch1_data_count = ch1_data.length;
				}
			}
		};break;
		case 1:{//Дневная статистика
			var TempArray = localStorage;
			var count = TempArray.length;
			var ch1_data = new Array();
			
			for(var i=--count; i>=0; i--){ if(/D_[0-9]+\/[0-9]+\/[0-9]+/.test(TempArray.key(i))) ch1_data.push([CharName(TempArray.key(i)),TempArray.key(i)]); }
		};break;
		case 2:{//Пользовательский шаблон
			var TempArray = localStorage;
			var count = TempArray.length;
			var ch1_data = new Array();
			
			for(var i=0; i<count; i++){ if(/U_.+/.test(TempArray.key(i))) ch1_data.push([CharName(TempArray.key(i)),TempArray.key(i)]); }
		};break;	
		case 3:{//Посайтовая статистика
			var TempArray = localStorage;
			var TempArray_2 = new Array();
			var count = TempArray.length;
			var ch1_data = new Array();
			
			for(var i=0; i<count; i++) if(/S_.+/.test(TempArray.key(i))) TempArray_2.push(TempArray.key(i));
			TempArray = TempArray_2.sort();
			for(var i=0; i<count; i++){ if(/S_.+/.test(TempArray[i])) ch1_data.push([CharName(TempArray[i]),TempArray[i]]); }
		};break;	
		case -1:{
			//no data
		};break;
	}
	
	select.innerHTML = '';
	var count = ch1_data.length;
	if(count>0) for(var i=0; i<count; i++){select.options[i]=new Option(ch1_data[i][0],ch1_data[i][1]);}
}