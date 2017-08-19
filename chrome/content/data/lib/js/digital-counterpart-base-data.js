function SensorsLoadingData(){}
SensorsLoadingData.prototype.loadControlsData = function(){

	
}

try{
	window.appBuilder = new MHAppsBuilder(); 
	appBuilder.startBuildingProcess(function(){
	    appBuilder.initialize(new SensorsLoadingData()); 
	});
}catch(err){console.log(err.message)}

window.onload = function(){

	//NAVIGATION
	document.querySelector(".previous > a").onclick = function(){
		
       	appBuilder.loadUriWithApi("floor-plan-new-poi.html");
	}
	document.querySelector(".next > a").onclick = function(){
		
		appBuilder.loadUriWithApi("digital-counterpart-external-prop.html");
	}
}