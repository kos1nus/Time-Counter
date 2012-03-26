//add events
addEventListener('DOMContentLoaded',Fload,false);

//var
var chart, G_click=true;

//load Function
function Fload(){
	var dom_elems = document.querySelectorAll('input[type="button"]');
	for(var i=0; i<dom_elems.length; i++){dom_elems[i].value = i18n(dom_elems[i].id);}
	
	if(local.getItem('DomainIdPage') && local.getItem('U_'+local.getItem('DomainIdPage'))){
		var UserRE_IdPage = local.getItem('DomainIdPage');
		QSF('#input_UsReEx').style.display = 'inline';
	}else if(local.getItem('UserRegExpPattern')  && JSON.parse(local.getItem('UserRegExpPattern'))[0] && local.getItem('U_'+JSON.parse(local.getItem('UserRegExpPattern'))[0][0])){
		var UserRE_IdPage = JSON.parse(local.getItem('UserRegExpPattern'))[0][0];
		QSF('#input_UsReEx').style.display = 'inline';
	}
	QSF('#input_TTL').addEventListener('click', function(){
		try{chart.destroy();}catch(e){}
		G_click=true;
		AddGraf('TOTAL');
		ChClass(this);
	}, false);
	QSF('#code_today').addEventListener('click',function(){
		try{chart.destroy();}catch(e){}
		if(local.getItem('D_'+GetCurDate().full)){AddGraf('D_'+GetCurDate().full);}
		G_click=true;
		ChClass(this);
	}, false);
	QSF('#input_UsReEx').addEventListener('click',function(){
		AddGraf('U_'+UserRE_IdPage);
		G_click=false;
		ChClass(this);
		}, false);
	QSF('#input_extra').addEventListener('click',function(){OpenNewTab('extra.html');}, false);
	QSF('#input_options').addEventListener('click',function(){OpenNewTab('options.html');}, false);
	
	AddGraf('D_'+GetCurDate().full);
}

function ChClass(e){
	if (QSF('.button_selected')){QSF('.button_selected').setAttribute('class','button');}
	e.setAttribute('class','button_selected');
}

function AddGraf(base){
	var TempArray = JSON.parse(local.getItem(base));
	var count = TempArray.length;
	var ttl = 0;
	var MainCharData = new Array();
	
	for(i=0; i<count; i++){ttl += TempArray[i][1];}
	var balance = ttl;
	for(i=0; i<count; i++){
		if(TempArray[i][1]>(ttl/100*1)){
			MainCharData.push(TempArray[i]);
			balance -= TempArray[i][1];
		}
	}
	if(balance>0)MainCharData.push([i18n('code_other'), balance]);
	
	//var chart;
	$(document).ready(function() {
		chart = new Highcharts.Chart({
			chart:{renderTo:'container', plotBackgroundColor:null, plotBorderWidth:null, plotShadow:false,backgroundColor:null},
			title:{text:i18n('code_total')+': '+GetGoodTime(ttl).hm},
			tooltip:{formatter: function(){return '<b>'+ this.point.name +'</b>: '+ this.percentage.toFixed(2) +' %';}},
			legend:{enabled:true, floating:false, layout:'horizontal', x:0, y:0},
			credits:{enabled: false},
			exporting:{enabled: false},
			plotOptions:{pie:{
				allowPointSelect: false,
				cursor: 'pointer',
				point:{events:{click:function(){if(this.name!=i18n('code_other') && this.name!='LAN' && this.name!='localhost' && G_click==true){OpenNewTab('http://'+this.name);}}}},
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