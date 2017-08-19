var EXPORTED_SYMBOLS = ["RestrictedWoaApi"];

//This class has two responsibilities (I know, that isn't good but it is faster by now)
//The first one is to clone the requested values asked by the augmentations (in the web apps) from the MoWA API. This way, they have the value in their context and the API itself can reuse her own messages. Be careful in choosing not-duplicate names 'cause everything is clonned into the same context (the window). 
//On the other hand, it is also responsible of restricting the access of the full MoWA api instance to the programmers.
//This class should redirect to the eManager, not to implement things (it just clones values, but not more than that)

var console, window; //GLOBALS FOR PRODUCTION

function RestrictedWoaApi(eManager){ //this param is dirty

	console = eManager.getConsole(); //GLOBALS FOR PRODUCTION
	window = eManager.getWindow(); //GLOBALS FOR PRODUCTION

	this.lastHighlightedElem;
	this.selectedThumb;
	this.uPositioningMenu;


	this.logApp = function(){
		eManager.logApp();
	};
	this.setProgressPoint = function(value){
		eManager.setProgressPoint(value);
	};
	this.getProgressPoint = function(){
		return eManager.getProgressPoint();
	};
	this.getCurrentAugmenterInstance = function(unwrappedWin){
		var augmenterInstance = eManager.getCurrentAugmenterInstance();

		return Components.utils.cloneInto(augmenterInstance, unwrappedWin, {
	        cloneFunctions: true
	    });
	};
	this.setCurrentDCPropertyValue = function(key, value){
		eManager.setCurrentDCPropertyValue(key, value);
	};
	this.loadDcPropertyValueSelection = function(selector){
		eManager.loadDcPropertyValueSelection(selector);
	};
	this.setCurrentDcProperty = function(id){
		eManager.setCurrentDcProperty(id);
	};
	this.getAllDcProperties = function(){
		return this.cloneInto(eManager.getAllDcProperties(), eManager.getUnsafeWindow());
	};
	this.getUserSelectedSensors = function(){
		return this.cloneInto(eManager.getUserSelectedSensors(), eManager.getUnsafeWindow());
	};
	this.createNewEmptyDCProperty = function(){
		eManager.createNewEmptyDCProperty();
	};
	this.getAugmentersData = function(){
		return this.cloneInto(eManager.getAugmentersData(), eManager.getUnsafeWindow());
	};
	this.getCurrentDCProperty = function(){
		return this.cloneInto(eManager.getCurrentDCProperty(), eManager.getUnsafeWindow());
	};
	this.cloneInto = function(obj, ctx){

		return Components.utils.cloneInto(obj, ctx, { cloneFunctions: true });
	};
	this.getDigitalCounterpartById = function(id){
		var dcById = eManager.getDigitalCounterpartById(id);

		return Components.utils.cloneInto(dcById, (eManager.getUnsafeWindow()), {
	        cloneFunctions: true
	    });
	};
	this.getDigitalCounterparts = function(ennumeration){
		return eManager.getDigitalCounterparts();
	};
	this.loadAppFromFile = function(filename){
		return eManager.loadAppFromFile(filename);
	};
	this.setCurrentDcId = function(id){
		eManager.setCurrentDcId(id);
	};
	this.setCurrentAugmenterParam = function(key, value){
		eManager.setCurrentAugmenterParam(key, value);
	};
	this.getCurrentAugmenter = function(){
		var augmenter = eManager.getCurrentAugmenter();
		return Components.utils.cloneInto(augmenter, (eManager.getUnsafeWindow()), {
	        cloneFunctions: true
	    });
	};
	this.setCurrentContextValueId = function(id){
		eManager.setCurrentContextValueId(id);
	}
	this.setCurrentContextValue = function(prop, value){
		eManager.setCurrentContextValue(prop, value);
	}
	this.setCurrentContextManager = function(id){

		eManager.setCurrentContextManager(id);
	};
	this.getContextValuesByManager = function(keyManager){

		return eManager.getContextValuesByManager(keyManager);
	};
	this.createNewEmptyContextValueByManager = function(keyManager){
		eManager.createNewEmptyContextValueByManager(keyManager);
	};
	this.setCurrentDigitalCounterpartValue = function(prop, value){
		eManager.setCurrentDigitalCounterpartValue(prop, value);
	};
	this.setCurrentAugmentationValue = function(prop, value){
		eManager.setCurrentAugmentationValue(prop, value);
	};
	this.saveAppInSessionIntoFile = function(){
		eManager.saveAppInSessionIntoFile();
	};
	this.getCurrentAugmentation = function(){
		return eManager.getCurrentAugmentation();
	}
	this.addContextValueToManager = function(cValue, keyManager){
		eManager.addContextValueToManager(cValue, keyManager);
	};
	this.addDCToTheCurrentAugmentation = function(dc){
		eManager.addDCToTheCurrentAugmentation(dc);
	};
	this.removeDCToTheCurrentAugmentation = function(dc){
		eManager.removeDCToTheCurrentAugmentation(dc);
	};
	this.getAugmentations = function(){
		return eManager.getAugmentations();
	}
	this.getNoAugmentation = function(){
		return eManager.getNoAugmentation();
	};
	this.removeContextValue = function(keyManager, key){
		eManager.removeContextValue(keyManager, key);
	};
	this.removeAugmentation = function(aug){
		eManager.removeAugmentation(aug);
	};
	this.removeDCProperty = function(id){
		eManager.removeDCProperty(id);
	};
	this.removeDigitalCounterpart = function(dc){
		eManager.removeDigitalCounterpart(dc);
	};
	this.getAppData = function(key){
		return eManager.getAppData(key);
	};
	this.loadAugmentersPropertyValueSelection = function(selector){
		return eManager.loadAugmentersPropertyValueSelection(selector);
	};
	this.setAppData = function(key, value){
		eManager.setAppData(key, value);
	};
	this.removeAuthoredApp = function(filename){
		eManager.removeAuthoredApp(filename);
	};
	this.updateAppData = function(key, value){
		eManager.updateAppData(key, value);
	};
	this.getNextSensorCogForm = function(){
		return eManager.getNextSensorCogForm();
	};
	this.getPrevSensorCogForm = function(){
		return eManager.getPrevSensorCogForm();
	};
	this.getCurrentArtifactData = function(key){
		return eManager.getCurrentArtifactData(key);
	};
	this.setCurrentArtifactData = function(key, value){
		eManager.setCurrentArtifactData(key, value);
	};
	this.setCurrentAugmentation = function(aug){
		eManager.setCurrentAugmentation(aug);
	};
	this.getNewFilename = function(){
		return eManager.getNewFilename();
	};
	this.createNewAppConfiguration = function(){
	 	eManager.createNewAppConfiguration();
	};
	this.getAvailableSensors = function(){
		return eManager.getAvailableSensors();
	};
	this.createNewEmptyDigitalCounterpart = function(){
		eManager.createNewEmptyDigitalCounterpart();
	};
	this.createNewEmptyAugmentation = function(){
		eManager.createNewEmptyAugmentation();
	};
	this.addSensorSpec = function(sensor){
		eManager.addSensorSpec(sensor);
	};
	this.removeSensorSpec = function(sensor){
		eManager.removeSensorSpec(sensor);
	};
	this.getSessionStorage = function(){
		return eManager.sessionManager.getSessionStorage();
	};
	this.getAllContextValues = function(){
		return eManager.getAllContextValues();
	};
	this.loadUriWithApi = function(chromeUri){
		//TODO: validation of chrome uri
		eManager.loadUriWithApi(chromeUri);
	};
	this.loadChromeFileWithApiAccess = function(filename){
		this.loadUriWithApi("chrome://mowa/content/data/" + filename);
	};
	this.loadContextValueClassInWindow = function(className){
		return eManager.loadContextValueClassInWindow(className);
	};
	this.closeAuthoringTool = function(){
		eManager.closeAuthoringTool();
	};
	this.getContextValuesByContextType = function(){
		return eManager.getContextValuesByContextType();
	};
	this.demo = function(carDivId){
		console.log(eManager.getUnsafeDocument().getElementById(carDivId));
	};
	this.retrieveRelativeFile = function(relativePath, async){
		return eManager.retrieveRelativeFile(relativePath,async);
	};
	this.getArtifactContent = function(filename){
		return eManager.getArtifactContent(filename);
	};
	this.saveCurrentArtifactData = function(sourceCode, filename){
		return eManager.saveCurrentArtifactData(sourceCode, filename);
	};
	this.loadAugmentersStyleInBrowser = function(iframeSelector){
		eManager.loadAugmentersStyleInBrowser(iframeSelector);
	}
	this.enableAugmentersInteractionInBrowser = function(params){
		eManager.enableAugmentersInteractionInBrowser(params);
	}
	this.createDefaultThumbnail = function(params){
		eManager.createDefaultThumbnail(params);
	}
	this.createNewThumbnail = function(params){
		eManager.createNewThumbnail(params);
	}
	this.getAuthoredAppsFiles = function(ctx, charset){
		return eManager.getAuthoredAppsFiles(ctx, charset);
	};
	this.checkAppContent = function(xml){
		try{
			xml = Components.utils.waiveXrays(xml);
			var app = xml.getElementsByTagName('application')[0];
			if(app.getAttribute('className') && app.getAttribute('extendedClassName'))
				return true;
		}catch(err){} //'Error on checkAppContent: ' + err.message)}
		return false;
	};
	this.getAuthoredAppsData = function(){

		return eManager.getAuthoredAppsData();
	};



  	this.checkUrlRedirection = function(url){
		//Returns the redirected URL or the original one if request fails
		try{
			var xhr = new eManager.getUnsafeWindow().XMLHttpRequest();
			xhr.open('GET', url, false);
			xhr.send(null);
			return xhr.responseURL;
		}catch(err){
            console.log(err.message);
            return url;
        }
	};

  	this.addContextValueToTheCurrentDC = function(cValue){
  		 eManager.addContextValueToTheCurrentDC(cValue);
  	};
  	this.removeContextValueFromTheCurrentDC = function(cValue){
		eManager.removeContextValueFromTheCurrentDC(cValue);
  	};
  	this.getCurrentDigitalCounterpart = function(){
  		return eManager.getCurrentDigitalCounterpart();
  	}
  	this.loadUrlInBrowser = function(frameId, url, onLoadCallback, beforeUnloadCallback){
		eManager.loadUrlInBrowser(frameId, url, onLoadCallback, beforeUnloadCallback);
	};
}
