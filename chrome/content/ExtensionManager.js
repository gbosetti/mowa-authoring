/* WARNING! The shared object "authoring" mustn't use prototype, otherwise functions aren't copied to the shared context.
*/
Components.utils.import("resource://gre/modules/FileUtils.jsm");
Components.utils.import("resource://gre/modules/NetUtil.jsm");
Components.utils.import("resource://gre/modules/Services.jsm");

function ExtensionManager(ctx, charset){

	this.loadModules();
	this.appsDir = ["MoWA", "authoring", "applications"]; //here, so this can't be modified by the developer
	this.charset = charset;
	this.scriptingManager;
	this.authoringTool;
	this.qrDecoder;
	this.gpsManager;
	this.bundles;
	this.spaces = new Array();
	this.ctx = ctx;
	this.initialize(ctx, charset);
	this.filesManager = new JsonFileManager(window, this.appsDir);
	this.sessionManager = new SessionManager(this);
	this.augLayerManager = new AugmentationLayerManager(window, charset);
}
ExtensionManager.prototype.logApp = function(filename){

	console.log(this.sessionManager.storage.application);
}
ExtensionManager.prototype.setProgressPoint = function(achievedPoint){
	//This should be done with the state pattern & a setter... 
	this.sessionManager.progressPoint = achievedPoint;
}
ExtensionManager.prototype.getProgressPoint = function(){
	//This should be done with the state pattern & a setter... 
	return this.sessionManager.progressPoint;
}
ExtensionManager.prototype.getArtifactContent = function(filename){

	var file = this.filesManager.getNsiFile(filename, this.appsDir);
	return this.filesManager.readFileContent(file);
}
ExtensionManager.prototype.removeSensorSpec = function(sensor){
	this.sessionManager.removeSensor(sensor);
	this.sessionManager.removeContextManagerByClass(sensor.manager);
	this.saveAppInSessionIntoFile();
}
ExtensionManager.prototype.getCurrentArtifactData = function(key){
	return this.sessionManager.getCurrentArtifactData(key);
};
ExtensionManager.prototype.addContextValueToManager = function(cValue, keyManager){

	this.sessionManager.addContextValueToManager(cValue, keyManager);
	this.saveAppInSessionIntoFile();
}
ExtensionManager.prototype.removeContextValue = function(keyManager, key){
	this.sessionManager.removeContextValue(keyManager, key);
	this.saveAppInSessionIntoFile();
};
ExtensionManager.prototype.getAppData = function(key){
	return this.sessionManager.getAppData(key);
};
ExtensionManager.prototype.setCurrentArtifactData = function(key, value){
	this.sessionManager.setCurrentArtifactData(key, value);
	this.saveAppInSessionIntoFile();
};
ExtensionManager.prototype.setCurrentAugmentation = function(aug){
	this.sessionManager.setCurrentAugmentation(aug);
};
ExtensionManager.prototype.createNewAppConfiguration = function(){
 	this.sessionManager.initializeStorage();
 	this.sessionManager.setAppData("filename", this.getNewFilename());
 	this.saveAppInSessionIntoFile();
};
ExtensionManager.prototype.createNewEmptyContextValueByManager = function(keyManager) {

	var cValue = this.sessionManager.createNewEmptyContextValueByManager(keyManager);
	this.sessionManager.setCurrentContextValueId(cValue.id);
};
ExtensionManager.prototype.setCurrentDigitalCounterpartValue = function(prop, value){
	this.sessionManager.setCurrentDigitalCounterpartValue(prop, value);
	this.saveAppInSessionIntoFile();
}
ExtensionManager.prototype.setCurrentDCPropertyValue = function(key, value){
	this.sessionManager.setCurrentDCPropertyValue(key, value);
	this.saveAppInSessionIntoFile();
}
ExtensionManager.prototype.setCurrentAugmentationValue = function(prop, value){
	this.sessionManager.setCurrentAugmentationValue(prop, value);
	this.saveAppInSessionIntoFile();
}
ExtensionManager.prototype.setCurrentContextValue = function(prop, value){
	this.sessionManager.setCurrentContextValue(prop, value);
	this.saveAppInSessionIntoFile();
}
ExtensionManager.prototype.setCurrentDcId = function(id){

	this.sessionManager.setCurrentDcId(id);
}
ExtensionManager.prototype.setCurrentContextValueId = function(id){

	this.sessionManager.setCurrentContextValueId(id);
}
ExtensionManager.prototype.setCurrentContextManager = function(id){

	this.sessionManager.setCurrentContextManager(id);
}
ExtensionManager.prototype.addSensorSpec = function(sensor){

	try{
		this.sessionManager.addSensor(Components.utils.waiveXrays(sensor));
		this.sessionManager.addContextManagerByClass(
			sensor.manager, new window[sensor.manager]());
		this.saveAppInSessionIntoFile();

	}catch(err){console.log(err.message);}
}
ExtensionManager.prototype.addContextValueToTheCurrentDC = function(cValue){

	this.sessionManager.addContextValueToTheCurrentDC(cValue);
	this.saveAppInSessionIntoFile();
}
ExtensionManager.prototype.getAugmentations = function() {

	return Components.utils.cloneInto(
		this.sessionManager.getAugmentations(),
		(this.getUnsafeWindow()),
		{ cloneFunctions: true }
	);
};
ExtensionManager.prototype.getNoAugmentation = function() {
	return Components.utils.cloneInto(
		this.sessionManager.getNoAugmentation(),
		(this.getUnsafeWindow()),
		{ cloneFunctions: true }
	);
};
ExtensionManager.prototype.addDCToTheCurrentAugmentation = function(cValue){

	this.sessionManager.addDCToTheCurrentAugmentation(cValue);
	this.saveAppInSessionIntoFile();
}
ExtensionManager.prototype.removeDCToTheCurrentAugmentation = function(cValue){

	this.sessionManager.removeDCToTheCurrentAugmentation(cValue);
	this.saveAppInSessionIntoFile();
}
ExtensionManager.prototype.removeContextValueFromTheCurrentDC = function(cValue){

	this.sessionManager.removeContextValueFromTheCurrentDC(cValue);
	this.saveAppInSessionIntoFile();
}
ExtensionManager.prototype.createNewEmptyDigitalCounterpart = function(){

	var dc = this.sessionManager.createNewEmptyDigitalCounterpart();
	this.sessionManager.setCurrentDcId(dc.id);
}
ExtensionManager.prototype.createNewEmptyAugmentation = function(){

	var augmentation = this.sessionManager.createNewEmptyAugmentation();
	this.sessionManager.setCurrentAugmentation(augmentation);
}
ExtensionManager.prototype.createNewEmptyDCProperty = function(){

	var prop = this.sessionManager.createNewEmptyDCProperty();
	this.sessionManager.setCurrentDcProperty(prop.id);
}
ExtensionManager.prototype.setCurrentDcProperty = function(id){

	this.sessionManager.setCurrentDcProperty(id);
}
ExtensionManager.prototype.getRequiredModules = function(){
	var modules = [
		"augmentation.jsm",
		"DigitalCounterpartBuilder.jsm",
		"session-manager.jsm",
		"xpath-interpreter.jsm",
		"restricted-api-wrapper.jsm",
		"augmentation-layer-management.jsm"
	];

	var sensors = this.getAvailableSensors();
	for (var i = sensors.length - 1; i >= 0; i--) {
		modules.push(sensors[i].jsm);
	};

	return modules;
}
ExtensionManager.prototype.removeAugmentation = function(aug) {
	this.sessionManager.removeAugmentation(aug);
	this.saveAppInSessionIntoFile();
};
ExtensionManager.prototype.removeDCProperty = function(id) {
	this.sessionManager.removeDCProperty(id);
	this.saveAppInSessionIntoFile();
};
ExtensionManager.prototype.removeDigitalCounterpart = function(dc) {
	this.sessionManager.removeDigitalCounterpart(dc);
	this.saveAppInSessionIntoFile();
};
ExtensionManager.prototype.loadModules = function(){

	var modules = this.getRequiredModules();

	for (var i = 0; i < modules.length; i++) {
		Components.utils.import("chrome://mowa/content/lib/" + modules[i]);
	}
}
ExtensionManager.prototype.getContextValuesByManager = function(keyManager){

	var cValues = this.sessionManager.getContextValuesByManager(keyManager);

	return Components.utils.cloneInto(
		cValues, (this.getUnsafeWindow()), { cloneFunctions: true }
	);
};
ExtensionManager.prototype.loadContextValueClassInWindow = function(className){
	return this.sessionManager.loadChromeFileWithApiAccess(className);
};
ExtensionManager.prototype.unloadModules = function(){

	var modules = this.getRequiredModules();
		modules.push("context-types/base-context-manager.jsm")

	for (var i = 0; i < modules.length; i++) {
		Components.utils.unload("chrome://mowa/content/lib/" + modules[i]);
	}
}
ExtensionManager.prototype.initialize = function(ctx, charset){

	this.loadLanguageBundles();
	this.loadBaseFrameworkModule(ctx, charset);
	this.createMainMenu();
}
ExtensionManager.prototype.getMainMenu = function(){
	return this.mainMenu;
}
ExtensionManager.prototype.setAppData = function(key, value) {
	this.sessionManager.setAppData(key, value);
	this.saveAppInSessionIntoFile();
};
ExtensionManager.prototype.updateAppData = function(key, value){
	this.sessionManager.updateAppData(key, value);
	this.saveAppInSessionIntoFile();
};
ExtensionManager.prototype.saveAppInSessionIntoFile = function(){

	var parsedAppData = this.sessionManager.getApplicationSpec();
	var appData = JSON.stringify(parsedAppData, null, 4);

	if(appData)
		this.filesManager.writeFile(
			this.appsDir,
			parsedAppData.filename,
			appData,
			this.charset
	);
}
ExtensionManager.prototype.removeAuthoredApp = function(filename){
	this.filesManager.removeFile(filename, this.appsDir);
}
ExtensionManager.prototype.createMainMenu = function(){

	var mainMenuIsChecked = false;
	var me = this;
	this.mainMenu = this.ctx.NativeWindow.menu.add({
		name: "MoWA Authoring",
		icon: null,
		checkable: false,
		callback: function(){
			me.showAuthoringTool();
		}
	});
}
ExtensionManager.prototype.toFullScreenMode = function(){

	window.BrowserApp.selectedBrowser.contentWindow.fullScreen = true;
}
ExtensionManager.prototype.closeFullScreenMode = function(){

	window.BrowserApp.selectedBrowser.contentWindow.fullScreen = false;
}
ExtensionManager.prototype.closeCurrentTab = function(){

	window.BrowserApp.closeTab(window.BrowserApp.selectedTab);
}
ExtensionManager.prototype.loadUnsafeWindow = function(){

	this.unsafeWindow = Components.utils.waiveXrays(window.BrowserApp.selectedBrowser.contentWindow);
}
ExtensionManager.prototype.getUnsafeWindow = function(){

	if(this.unsafeWindow)
		return this.unsafeWindow;
	else{
		this.loadUnsafeWindow();
		return this.unsafeWindow;
	}
}
ExtensionManager.prototype.getContextValuesByContextType = function(){

	return this.sessionManager.getContextValuesByContextType();
}
ExtensionManager.prototype.getUnsafeDocument = function(){

	return this.unsafeWindow.document;
}
ExtensionManager.prototype.getCurrentDigitalCounterpart = function(){

	var currentDC = this.sessionManager.getCurrentDigitalCounterpart();
	return Components.utils.cloneInto(currentDC, this.unsafeWindow, {
        cloneFunctions: true
    });
}
ExtensionManager.prototype.getCurrentDCProperty = function(){

	return this.sessionManager.getCurrentDCProperty();
}
ExtensionManager.prototype.getCurrentAugmentation = function(){

	var augmentation = this.sessionManager.getCurrentAugmentation();
	return Components.utils.cloneInto(augmentation, this.unsafeWindow, {
        cloneFunctions: true
    });
}
ExtensionManager.prototype.getCurrentAugmenter = function(){ //TODO: change the name

	//This is not the augmenter itself, it is the representation of the stored augmenter!!!
	var augmentation = this.sessionManager.getCurrentAugmentation();
	return augmentation.getAugmenter({id: this.sessionManager.currentAugmenter });
}
ExtensionManager.prototype.getCurrentAugmenterInstance = function(){ //TODO: change the name

	var className = this.getCurrentAugmenter().augmenter;
	var augmenterClass = this.loadAugmenterBuilder(className);
	return new augmenterClass();
}
ExtensionManager.prototype.setCurrentAugmenterParam = function(key, value){

	this.sessionManager.setCurrentAugmenterParam(key, value);
}
ExtensionManager.prototype.getCurrentUrl = function(){

	return this.unsafeWindow.document.URL;
}
ExtensionManager.prototype.currentUrlMatches = function(url){

	return (this.unsafeWindow.document.URL.indexOf(url) != 0);
}
ExtensionManager.prototype.isApiLoaded = function(url){

	return (this.unsafeWindow.MoWA);
}
ExtensionManager.prototype.showAuthoringTool = function(){

	this.toFullScreenMode();
	this.loadUriWithApi("chrome://mowa/content/data/index.html"); //augmentations/augmentation-layer.html"); //
}
ExtensionManager.prototype.getNextSensorCogForm = function(){
	//TODO: check for existing values in case value is an array
	//Todo: this should be done at the app side

	return this.sessionManager.getNextSensorCogForm();
}
ExtensionManager.prototype.loadUrlInBrowser = function(frameId, url, onLoadCallback, beforeUnloadCallback){ //for iframes
	try{
		//params = Components.utils.waiveXrays(params);
		var frame = this.getUnsafeDocument().querySelector(frameId);
		if(!frame.listenerHasBeenLoaded){
			frame.addEventListener("load", function changeUrlFromFrame(){

				//notifying the url every time a new one is loaded
				var uWin = Components.utils.waiveXrays(this.contentWindow);
                if(onLoadCallback) {
                	onLoadCallback(uWin.location.href);
                }

                //capturing possible navigations (so we can detect an "on document leaving" event)
                var elems = uWin.document.querySelectorAll('button, a');
                for (var i = elems.length - 1; i >= 0; i--) {
                	elems[i].addEventListener("click", function (event) {
						if(beforeUnloadCallback) beforeUnloadCallback();
					}, false);
                }
			}, false);
			frame.listenerHasBeenLoaded = true;
		}
		frame.setAttribute('src', url);

	}catch(err){console.log(err.message);}
}
ExtensionManager.prototype.loadAppFromFile = function(filename){
	//TODO: check for existing values in case value is an array
	//try{
		var content = this.getArtifactContent(filename);
		this.sessionManager.loadApplicationSpec(JSON.parse(content));
		return true;
	/*}catch(err){
		console.log(err.message);
		this.unsafeWindow.alert("The application can not be loaded");
		return false;
	}*/
}
ExtensionManager.prototype.getPrevSensorCogForm = function(){
	//TODO: check for existing values in case value is an array

	return this.sessionManager.getPrevSensorCogForm();
}
ExtensionManager.prototype.getConsole = function(){
	//TODO: check for existing values in case value is an array

	return console;
}
ExtensionManager.prototype.getWindow = function(){
	//TODO: check for existing values in case value is an array

	return window;
}
ExtensionManager.prototype.loadUriWithApi = function(uri){

	var me = this;
	//var MoWA = this.getAPI();
    var MoWA = new RestrictedWoaApi(this);
    this.authoringTool = MoWA; //CLonning as MoWA to keep that name

	//Adding event listener before opening the document
	window.addEventListener("DOMContentLoaded", function(){try{

 		me.loadUnsafeWindow();
        if(me.currentUrlMatches(uri)) //Just load the tool in our chrome index file
        	return;

        if(!me.isApiLoaded()){ //Otherwise there is a so big problem with the browser...
	        //TODO: move the following two lines to main manager, so it can be sahred with ScriptingManager
	        //me.loadSpaceRepresentationsModules(me.getUnsafeWindow(), me.charset);
	        //Sharing the MoWA object with the current page's window
	        me.loadApiIntoCurrContext(MoWA);
	    }
	}catch(err){console.log(err.message)};}, false);

	//Loading the index form
	window.BrowserApp.loadURI(uri);
}
ExtensionManager.prototype.getAPI = function() {

}
ExtensionManager.prototype.loadApiIntoCurrContext = function(MoWA) {

	this.unsafeWindow.MoWA = Components.utils.cloneInto(MoWA, this.unsafeWindow, {
        cloneFunctions: true
    });
}
ExtensionManager.prototype.closeAuthoringTool = function() {
	this.closeFullScreenMode();
	this.closeCurrentTab()
};
ExtensionManager.prototype.loadLanguageBundles = function(){
	try{
		var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
		this.bundles = {
			"bootstrap": stringBundleService.createBundle("chrome://MoWA/locale/bootstrap.properties"),
			"AppMod": stringBundleService.createBundle("chrome://MoWA/locale/ApplicationModule.properties"),
			"LocManMod": stringBundleService.createBundle("chrome://MoWA/locale/LocationManagerModule.properties"),
			"MobHypMod": stringBundleService.createBundle("chrome://MoWA/locale/MobileHypermediaModule.properties"),
			"ScrManMod": stringBundleService.createBundle("chrome://MoWA/locale/ScriptingManagerModule.properties"),
			"FilManMod": stringBundleService.createBundle("chrome://MoWA/locale/FilesManagementModule.properties")
		};
	}catch(err){console.log(err.message)};
}
ExtensionManager.prototype.getLanguageBundle = function(key){

	return this.bundles[key];
}
ExtensionManager.prototype.loadSubScript = function(path, ctx, charset){

	Services.scriptloader.loadSubScript(path, ctx, charset);
}
ExtensionManager.prototype.retrieveRelativeFile = function(relativePath, async){
	try{
		const uXMLHttpRequest = Components.Constructor("@mozilla.org/xmlextras/xmlhttprequest;1",
								"nsIXMLHttpRequest", "open");

		let req = uXMLHttpRequest("GET", 'chrome://MoWA/content/data/' + relativePath, async);
	    req.send(null);
        return req.responseText;
    }catch(err){ /*console.log(err); alert('Error from addon: ' + err.message);*/}
    return;
};
ExtensionManager.prototype.saveCurrentArtifactData = function(sourceCode, filename){

	return this.filesManager.saveCurrentArtifactData(sourceCode, filename, this.appsDir);
}
ExtensionManager.prototype.getAuthoredAppsData = function(ctx, charset){

	var files = this.filesManager.getAuthoredAppsFiles(this.appsDir);

    return Components.utils.cloneInto(
		files, (this.getUnsafeWindow()), { cloneFunctions: true });
}
ExtensionManager.prototype.loadBaseFrameworkModule = function(ctx, charset){

	var orderedModules = [
		"FilesManagementModule"
	];

	this.loadJsFiles(ctx, orderedModules);
}
ExtensionManager.prototype.loadJsFiles = function(ctx, orderedModules){

	for (var i = 0; i < orderedModules.length; i++) {
		this.loadSubScript(
			"chrome://MoWA/content/lib/" + orderedModules[i] + ".js",
			ctx,
			this.charset
		);
	};
}
ExtensionManager.prototype.createScriptingManager = function(ctx){

	this.scriptingManager = new ctx["ScriptingManager"];
}
ExtensionManager.prototype.getScriptingManager = function(){

	return this.scriptingManager;
}
ExtensionManager.prototype.getAuthoringTool = function(){

	return this.authoringTool;
}
ExtensionManager.prototype.createQrDecoder = function(ctx){

	this.qrDecoder = new ctx["QrCodesManager"];
}
ExtensionManager.prototype.getDigitalCounterpartById = function(id){

	return this.sessionManager.getDigitalCounterpartById(id);
}
ExtensionManager.prototype.getDigitalCounterparts = function(){

	var dcs = this.sessionManager.getDigitalCounterparts();

	return Components.utils.cloneInto(
		dcs, this.getUnsafeWindow(),
		{ cloneFunctions: true });
    //return this.alphabeticallyOrder(dcs, "name")
}

/*function NoSensor(className, displayName, configForm){ Sensor.call(this, className, displayName, configForm); }
Sensor.prototype.display = function(ui) {};*/
ExtensionManager.prototype.getAvailableSensors = function(){
	//TODO: retrieve these specifications from files (to make it easy to add new ones)
	//TODO: SensorSpec should be provided by the sensors
    var sensors = [
        {
        	className: "LightLevel",
        	displayName: "Light level",
        	configForm: "sensors/config-luxes.html", 
        	manager: "LightLevelBuilder",
        	src: "context-types/sensors/LightLevelSensor.js",
        	jsm: "context-types/luxes.jsm"
        },
        {
        	className: "DeviceOrientation",
        	displayName: "Orientation",
        	configForm: "sensors/config-orientations.html",
        	manager: "OrientationBuilder",
        	src: "context-types/sensors/DeviceOrientationSensor.js",
        	jsm: "context-types/orientation.jsm"
        }
    ];

    //Alphabetically ordering elements
    this.alphabeticallyOrder(sensors, "displayName");

	return sensors;
}
ExtensionManager.prototype.getAllContextValues = function(){

	var cValues = this.sessionManager.getAllContextValues();
	return Components.utils.cloneInto(
		cValues, this.getUnsafeWindow(), { cloneFunctions: true }
	);
};
ExtensionManager.prototype.getAllDcProperties = function(){

	return this.sessionManager.getCurrentDigitalCounterpart().getProperties();
};
ExtensionManager.prototype.loadContextValueClassInWindow = function(className){
	return Components.utils.cloneInto(
		window[className],
		this.getUnsafeWindow(),
		{ cloneFunctions: true });
};
ExtensionManager.prototype.alphabeticallyOrder = function(collection, prop){

	if(collection && collection.length && collection.length>1)
		collection.sort(function(a, b) {
			var textA = b[prop].toUpperCase();
			var textB = a[prop].toUpperCase();
			return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
		});
	return collection;
}
ExtensionManager.prototype.getQrDecoder = function(){

	return this.qrDecoder;
}
ExtensionManager.prototype.createGpsManager = function(ctx){

	this.gpsManager = new ctx["GpsManager"];
}
ExtensionManager.prototype.getGpsManager = function(){

	return this.gpsManager;
}
ExtensionManager.prototype.getNewFilename = function(){
	return 'mowa-' + Date.now() + '.json';
};
ExtensionManager.prototype.loadAugmenterBuilders = function(win){

	this.augLayerManager.loadAugmenterBuilders(win);
}
ExtensionManager.prototype.loadUserSelectedSensors = function(){

	this.augLayerManager.loadUserSelectedSensors(this.sessionManager.getUserSelectedSensors());
}
ExtensionManager.prototype.getUserSelectedSensors = function(){
	return this.sessionManager.getUserSelectedSensors();
}
ExtensionManager.prototype.loadAugmenterBuilder = function(className){

	return this.augLayerManager.loadAugmenterBuilder(className);
}
ExtensionManager.prototype.loadUserDefinedAugmenterBuilders = function(params){

	var augConfigs = this.sessionManager.getCurrentAugmentationUnits();
	if(augConfigs.length < 1) return;

  	for (var i = 0; i < augConfigs.length; i++) {

		augConfigs[i].iframeSelector = "#augmentation-browser";
		augConfigs[i].messages = {};
		this.augLayerManager.createDefaultThumbnail(augConfigs[i],  this.getUnsafeDocument());
  };
}
ExtensionManager.prototype.getAugmentersData = function(){

	return this.augLayerManager.getConcreteAugmentersData();
}
ExtensionManager.prototype.loadAugmentersStyleInBrowser = function(iframeSelector){

 	this.loadStylesheets(
    	iframeSelector,
    	[
    		'chrome://MoWA/content/data/lib/css/mowa-augmenters.css',
    		'chrome://MoWA/content/data/lib/css/mowa-content-selection.css',
    		'chrome://MoWA/content/data/lib/css/tingle.min.css'
    	]
    );
};
ExtensionManager.prototype.getWaivedWindow = function(iframeSelector){

	return Components.utils.waiveXrays(this.getUnsafeDocument().querySelector(iframeSelector).contentWindow);
}
ExtensionManager.prototype.loadStylesheets = function(iframeSelector, files){

	var uWin = this.getWaivedWindow(iframeSelector);
    for (var i = 0; i < files.length; i++) {
    	var css = uWin.document.createElement("link");
	        css.setAttribute("rel", "stylesheet");
            css.setAttribute("type", "text/css");
            css.setAttribute("href", files[i]);
        uWin.document.getElementsByTagName("head")[0].appendChild(css);
    };
};
ExtensionManager.prototype.enableAugmentersInteractionInBrowser = function(params){ //messages,onThumbMoved

	var me=this, frame =  this.getUnsafeDocument().querySelector(params.iframeSelector);
	frame.addEventListener("load", function attachAugmenterBuildersBehaviour(event){

		//Loading the Builder classes into context
		var uWin = Components.utils.waiveXrays(event.target.contentWindow);
		
		me.augLayerManager.loadSandboxForAugmentationElements(uWin);
		me.loadUserSelectedSensors();
		var dc = me.augLayerManager.instantiateDigitalCounterpart()
		me.loadAugmenterBuilders(dc);
		


		me.augLayerManager.setLocaleBundle(params.messages);

		//Give Dom elements the expected augmentation behaviour
	    var domElems = uWin.document.body.getElementsByTagName('*');
	    me.augLayerManager.loadPositioningBehaviourIntoDomElements(domElems, params.onThumbMoved, params.messages);

	    //Load the already defined buidlers by the user
	    me.loadUserDefinedAugmenterBuilders();
	});
}
ExtensionManager.prototype.loadDcPropertyValueSelection = function(iframeSelector){

	var me = this;
	var frame =  this.getWaivedWindow(iframeSelector);
	var domElems = frame.document.body.getElementsByTagName('*');

	this.augLayerManager.disableDomElementsDefaultBehaviour(domElems);

	frame.document.body.addEventListener("touchstart", function(evt){
		evt.stopImmediatePropagation(); evt.preventDefault();
		me.sessionManager.clearLastHighlightedElem();
	}, false);

	frame.document.body.addEventListener("touchmove", function(evt){
		evt.stopImmediatePropagation(); evt.preventDefault();

		var pointed = evt.target.ownerDocument.elementFromPoint(evt.touches[0].clientX, evt.touches[0].clientY);
		if(pointed && me.sessionManager.getLastHighlightedElem() != pointed){
			pointed.classList.add("mowa-highlighted-dom-element");

			var elem = me.sessionManager.getLastHighlightedElem();
			if (elem && elem.classList.contains("mowa-highlighted-dom-element")) {
				elem.classList.remove("mowa-highlighted-dom-element");
			}
			me.sessionManager.setLastHighlightedElem(pointed);
		}
	}, false);

	frame.document.body.addEventListener("touchend", function(evt){

		//Removing highlighting and showing the thumbnail
		try{
			//var elem = me.sessionManager.getLastHighlightedElem();
			var textContent = me.sessionManager.getLastHighlightedElem().textContent;
			me.setCurrentDCPropertyValue("value", (textContent)? textContent.trim() : textContent);

			//TODO: this is the right way to do it, but we are avoiding it for a matter of time. 
			//Otherwise we should asynchronously retrieve the values and it involves too many changes by now
			//var xpi = new window["XPathInterpreter"]();        
	        //var xpath = xpi.getElementXPath(elem);
	        //me.setCurrentDCPropertyValue("xpath", xpath);

	    }catch(err){
	    	console.log(err);
	    }
	}, false);
}
ExtensionManager.prototype.getAugmenterClassFrom = function(augmenters, className){

	//var augmenters = ;
	for (var i = 0; i < augmenters.length; i++) {

		if(augmenters[i].className == className)
			return augmenters[i];
	};
}
ExtensionManager.prototype.createNewThumbnail = function(params) { //onAugmenterExecution

	params = Components.utils.waiveXrays(params);
	params.id = this.sessionManager.createNewEmptyAugmenter({
		augmenter: params.augmenter,
		cog: params.cog
	}).id;

	this.augLayerManager.createDefaultThumbnail(params, this.getUnsafeDocument());
}
