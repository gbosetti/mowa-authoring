var EXPORTED_SYMBOLS = ["SessionManager"];
var console;
function SessionManager(eManager){

	this.window = eManager.getWindow();
	console = this.window.console;

	//Singleton
    if (SessionManager._instance) {
        return SessionManager._instance;
        //console.log("JUST NEW SessionManager...");
    }
    //console.log("... existing SessionManager");
    SessionManager._instance = this;

	//Props
	this.currentCogSensor;
	this.currentDcId;
	this.currentCvId;
	this.currentAugmentation;
	this.currentAugmenter;
	this.currentContextManagerKey;
	this.currentDcProp;
	this.selectedThumb;
	this.progressPoint = "StageOne"; //This is a classname to instantiate in another context (state pattern)

	this.loadDependencies();
	this.initializeStorage();
}
/*SessionManager.getInstance = function () {
    return SessionManager._instance || new SessionManager();
}*/
SessionManager.prototype.loadDependencies = function(){}
SessionManager.prototype.getWindow = function(){
	return this.window;
}
SessionManager.prototype.getCurrentThumbnail = function(){
	//we should move it to the session manager
	return this.selectedThumb;
};
SessionManager.prototype.initializeStorage = function(){

	this.currentCogSensor = undefined;
	this.currentDcId = undefined;
	this.currentCvId = undefined;
	this.currentAugmentation = undefined;
	this.currentContextManagerKey = undefined;

	//Este nivel está al pedo (storage)
	this.storage = {
		application: { /*results of the authored app to be exported at the end*/
			name: '',
			filename: 'default.json',
			sensors: {},  /*to simulate a set*/
			contextManagers: {}, /*to simulate a set*/
			digitalCounterparts: {},
			augmentations: {}
		}
	}
}
SessionManager.prototype.clearLastHighlightedElem = function(){
	this.lastHighlightedElem = undefined;
};
SessionManager.prototype.setLastHighlightedElem = function(elem){
	this.lastHighlightedElem = elem;
};
SessionManager.prototype.getLastHighlightedElem = function(){
	try{
		return this.lastHighlightedElem;
	}catch(err){
		console.log("CAN NOT RETURN THE VALUE", err);
		this.clearLastHighlightedElem();
		return this.lastHighlightedElem;
	}
};
SessionManager.prototype.addDCToTheCurrentAugmentation = function(dc) {
	this.getCurrentAugmentation().addDigitalCounterpart(dc);
};
SessionManager.prototype.removeDCToTheCurrentAugmentation = function(dc) {
	this.getCurrentAugmentation().removeDigitalCounterpart(dc);
};
SessionManager.prototype.removeAugmentation = function(aug) {

	delete this.storage.application.augmentations[aug.id];
};
SessionManager.prototype.removeDCProperty = function(id) {

	this.storage.application.digitalCounterparts[this.currentDcId].removePropertyById(id);
};
SessionManager.prototype.removeDigitalCounterpart = function(dc) {

	delete this.storage.application.digitalCounterparts[dc.id];
};
SessionManager.prototype.getAugmentations = function() {

	return this.getObjectPropertiesInArray(this.storage.application.augmentations);

	/*if(augmentations.length==0)
		return [new (this.getWindow())["NoAugmentation"]()];
	return augmentations;*/
};
SessionManager.prototype.getNoAugmentation = function() {
	return new (this.getWindow())["NoAugmentation"]();
}
SessionManager.prototype.getCurrentDigitalCounterpart = function(){
	//This is the current when configuring DCs, not when building the augmentation layer
	return this.storage.application.digitalCounterparts[this.currentDcId];
}
SessionManager.prototype.getCurrentDCProperty = function(){
	//This is the current when configuring DCs, not when building the augmentation layer
	return this.storage.application.digitalCounterparts[this.currentDcId].getProperty(this.currentDcProp);
}
SessionManager.prototype.getContextValueById = function(id){

	for (keyManager in this.storage.application.contextManagers){
		var cvs = this.storage.application.contextManagers[keyManager].getValues(); //ARRAY!!!!! NOT A SET

		for (var i = cvs.length - 1; i >= 0; i--) {
			if(cvs[i].id == id){
				return cvs[i];
			}
		}
	}
	return;
}
SessionManager.prototype.getContextValuesByIds = function(cvsIds){

	var res = [];
	for (i in cvsIds){
		var cv = this.getContextValueById(i);
		if(cv) res.push(cv);
	}
	return res;
}
SessionManager.prototype.getDigitalCounterpartWrapperBeingAugmented = function(){

	var currentDC = this.getCurrentAugmentation().getFirstDigitalCounterpart();
	return this.getDigitalCounterpartById(currentDC.id);
}
SessionManager.prototype.getCurrentAugmentation = function(){

	return this.storage.application.augmentations[this.currentAugmentation];
}
SessionManager.prototype.setCurrentAugmenterParam = function(key, value){

	return this.storage.application.augmentations[this.currentAugmentation].augmenters[this.currentAugmenter].setParameter(key, value);
}
SessionManager.prototype.setCurrentDcId = function(id){

	this.currentDcId = id; //This way we can persist the object even if is not fully created
}
SessionManager.prototype.setCurrentDcProperty = function(id){

	this.currentDcProp = id; //This way we can persist the object even if is not fully created
}
SessionManager.prototype.setCurrentAugmentationValue = function(prop, value){

	this.storage.application.augmentations[this.currentAugmentation][prop] = value;
}
SessionManager.prototype.setCurrentAugmentation = function(aug){

	this.currentAugmentation = aug.id; //This way we can persist the object even if is not fully created
}
SessionManager.prototype.setCurrentAugmenter = function(aug){

	this.currentAugmenter = aug.id; //This way we can persist the object even if is not fully created
}
SessionManager.prototype.setCurrentContextValueId = function(id){

	this.currentCvId = id; //This way we can persist the object even if is not fully created
}
SessionManager.prototype.setCurrentContextManager = function(id){

	this.currentContextManagerKey = id; //This way we can persist the object even if is not fully created
}
SessionManager.prototype.addContextValueToTheCurrentDC = function(cValue){

	this.getCurrentDigitalCounterpart().addRelatedContextValue(cValue);
}
SessionManager.prototype.removeContextValueFromTheCurrentDC = function(cValue){

	this.getCurrentDigitalCounterpart().removeRelatedContextValue(cValue);
}
SessionManager.prototype.createNewEmptyDigitalCounterpart = function(){

	var dc = new (this.getWindow())["DigitalCounterpartBuilder"]();
	this.addDigitalCounterpart(dc);
	return dc;
}
SessionManager.prototype.createNewEmptyAugmenter = function(params){

	var aug = new (this.getWindow())["Augmenter"](params);
	this.getCurrentAugmentation().addAugmenter(aug);
	return aug;
}
SessionManager.prototype.createNewEmptyAugmentation = function(){

	var augmentation = new (this.getWindow())["Augmentation"]();
	this.addAugmentation(augmentation);
	return augmentation;
}
SessionManager.prototype.createNewEmptyDCProperty = function(){

	var prop = new (this.getWindow())["DcProperty"]();

	//do not use getCurrentDigitalCounterpart to assign a value
	this.storage.application.digitalCounterparts[this.currentDcId].addProperty(prop);
	return prop;
}
SessionManager.prototype.createNewEmptyContextValueByManager = function(keyManager){

	var cv = this.storage.application.contextManagers[keyManager].createNewEmptyContextValue();
	this.storage.application.contextManagers[keyManager].addContextValue(cv);
	return cv;
}
SessionManager.prototype.addDigitalCounterpart = function(dc){

	this.storage.application.digitalCounterparts[dc.id] = dc;
}
SessionManager.prototype.addAugmentation = function(augmentation){

	this.storage.application.augmentations[augmentation.id] = augmentation;
}
SessionManager.prototype.getDigitalCounterparts = function(){

	var dcs = [];
	//console.log("******digitalCounterparts:", this.storage.application.digitalCounterparts);
	//this.getWindow().console.log(this.storage.application.digitalCounterparts);
	for (dc in this.storage.application.digitalCounterparts){
		dcs.push(this.storage.application.digitalCounterparts[dc])
	}
	//console.log("dcs:", dcs);
	//var noDc = [new (this.getWindow())["NoDigitalCounterpartBuilder"]()];
	return dcs;
}
SessionManager.prototype.getDigitalCounterpartById = function(id){

	return this.storage.application.digitalCounterparts[dc];
}
SessionManager.prototype.hasChildsAsProperties = function(obj){

	return (obj && Object.keys(obj).length > 0);
}
SessionManager.prototype.getContextValuesByContextType = function(contextType){
	//TODO flter by context types
	return this.storage.application.contextValues;
}
SessionManager.prototype.getNextSensorToCog = function(){
	//TODO: check for existing values in case value is an array

	if(this.currentCogSensor){
		var keys = Object.keys(this.storage.application.sensors);
		var index = keys.indexOf(this.currentCogSensor.className);

		this.currentCogSensor = this.storage.application.sensors[keys[index+1]];
	}
	else this.currentCogSensor = this.getFirstSensorToCog();
	return this.currentCogSensor;
}
SessionManager.prototype.getAllContextValues = function(){

	var accumContextValues = [];
	for (manager in this.storage.application.contextManagers){

		var cValues = this.storage.application.contextManagers[manager].getValues();
		accumContextValues = accumContextValues.concat(cValues);
	}

	return accumContextValues;
}
SessionManager.prototype.getObjectPropertiesInArray = function(jsonObject){

	var elems = [];
	for (prop in jsonObject){
		elems.push(jsonObject[prop]);
	}

	return elems;
}
SessionManager.prototype.getContextValuesByManager = function(keyManager){
	//TODO: apply ennumeration to decouple the implementation of the collection
	//console.log(this.storage.application.contextManagers);
	//console.log("keyManager", keyManager);
	var manager = this.storage.application.contextManagers[keyManager];
	var hasValues = manager && Object.keys(manager.values).length >0;

	if (hasValues)
		return manager.getValues();
	return [];
}
SessionManager.prototype.getPrevSensorToCog = function(){

	if(!this.currentCogSensor) return;

	var keys = Object.keys(this.storage.application.sensors);
	var index = keys.indexOf(this.currentCogSensor.className);

	this.currentCogSensor = this.storage.application.sensors[keys[index-1]];
	return this.currentCogSensor;
}
SessionManager.prototype.getFirstSensorToCog = function(){
	//TODO: check for existing values in case value is an array
	var keys = Object.keys(this.storage.application.sensors);
	return this.storage.application.sensors[keys[0]]
}
SessionManager.prototype.getNextSensorCogForm = function(){
	//TODO: add the NoSensor
	var nextSensor = this.getNextSensorToCog();

	if (nextSensor)
		return nextSensor.configForm;
	return;
}
SessionManager.prototype.getPrevSensorCogForm = function(){
	//TODO: add the NoSensor
	var nextSensor = this.getPrevSensorToCog();
	if (nextSensor)
		return nextSensor.configForm;
	return;
}
SessionManager.prototype.getAppData = function(key){
	return this.storage.application[key];
}
SessionManager.prototype.getCurrentArtifactData = function(key){
	return this.storage.currentArtefact[key];
}
SessionManager.prototype.getSessionStorage = function(){
	return this.storage;
}
SessionManager.prototype.getApplicationSpec = function(){

	return this.storage.application;
}

///////////////////////////
/////////////////////////// Allocations
///////////////////////////

SessionManager.prototype.loadApplicationSpec = function(application){

	application = this.getWrappedContextManagers(application);
	application = this.getWrappedDigitalCounterparts(application);
	application = this.getWrappedAugmentations(application);
	//application = this.updateMatchingBetweenCVsAndSelectedCVsinDCand(application);

	this.storage.application = application;

	return application;
}
/*SessionManager.prototype.updateMatchingBetweenCVsAndSelectedCVsinDCand = function(application){

	var fullCvs = this.getAllContextValues();
	for (var i = fullCvs.length - 1; i >= 0; i--) {
		for (var j = application.digitalCounterparts.length - 1; j >= 0; j--) {
			for (var k = application.digitalCounterparts[j].contextValues.length - 1; k >= 0; k--) {

				if(application.digitalCounterparts[j].contextValues[k].id == fullCvs[i].id){
					application.digitalCounterparts[j].contextValues[k].id = fullCvs[i].id;
					break;
				}
			}
		}
	}

	return application;
}*/
SessionManager.prototype.setCurrentDigitalCounterpartValue = function(prop, value){

	this.storage.application.digitalCounterparts[this.currentDcId][prop] = value;
}
SessionManager.prototype.setCurrentDCPropertyValue = function(key, value){

	console.log("setting value to prop ", this.currentDcProp);
	this.storage.application.digitalCounterparts[this.currentDcId].setProperty(this.currentDcProp, key, value);
}
SessionManager.prototype.setCurrentContextValue = function(prop, value){

	this.storage.application.contextManagers[this.currentContextManagerKey].values[this.currentCvId][prop] = value;
}
SessionManager.prototype.checkDigitalCounterpartsDefinition = function(application){

	if (application.digitalCounterparts == undefined ){
		application.digitalCounterparts = {};
	}
}
SessionManager.prototype.getWrappedAugmentations = function(application){

	for (aug in application.augmentations){
		application.augmentations[aug] = new (this.getWindow())["Augmentation"](application.augmentations[aug]);
		//application.augmentations[aug].augmenters = 
		this.wrapAugmenters(application.augmentations[aug].augmenters);
	}
	return application;
}
SessionManager.prototype.wrapAugmenters = function(augmenters){

	for (i in augmenters) {
		augmenters[i] = new (this.getWindow())["Augmenter"](augmenters[i]);
	}
	//return augmenters;
}
SessionManager.prototype.getWrappedDigitalCounterparts = function(application){

	this.checkDigitalCounterpartsDefinition(application);

	for (dc in application.digitalCounterparts){
		application.digitalCounterparts[dc] = new (this.getWindow())["DigitalCounterpartBuilder"](application.digitalCounterparts[dc]);
	}

	return application;
}
SessionManager.prototype.setCurrentThumbnail = function(elem){

	this.clearCurrentThumbnail();
	this.selectedThumb = elem;
	elem.selected = true;
	this.selectedThumb.classList.add("mowa-highlighted-thumbnail");
};
SessionManager.prototype.clearCurrentThumbnail = function(){
	try{
		if(this.getCurrentThumbnail()){
			this.selectedThumb.classList.remove("mowa-highlighted-thumbnail");
			this.selectedThumb.selected = false;
		}
	}catch(err){console.log(err);}
	this.selectedThumb = undefined;
};
SessionManager.prototype.clearAugmentationBrowserValues = function(){

	this.clearCurrentThumbnail();
	this.clearLastHighlightedElem();
}
SessionManager.prototype.getCurrentAugmentationUnits = function(){

	return this.getCurrentAugmentation().getAugmenters();
}
SessionManager.prototype.getWrappedContextManagers = function(application){

	for(var manager in application.contextManagers){

		var man = new (this.getWindow())[manager](application.contextManagers[manager]);

		for (value in man.values){
			man.values[value] = new (man.getContextType())(man.values[value]);
		}
		application.contextManagers[manager] = man;
	}
	return application;
}
SessionManager.prototype.addContextValueToManager = function(cValue, keyManager){

	//Every context value must be unique, forcing a name may make the user to realize this
	this.storage.application.contextManagers[keyManager].addContextValue(cValue);
}
SessionManager.prototype.removeContextValue = function(keyManager, key){
	delete this.storage.application.contextManagers[keyManager].values[key];
}
SessionManager.prototype.setAppData = function(key, value){
	return this.storage.application[key] = value;
}
SessionManager.prototype.updateAppData = function(key, value){
	//TODO: check for existing values in case value is an array
	return this.storage.application[key] = value;
}
SessionManager.prototype.addSensor = function(sensor){

	return this.storage.application.sensors[sensor.className] = sensor;
}
SessionManager.prototype.getUserSelectedSensors = function(){

	return this.storage.application.sensors;
}
SessionManager.prototype.addContextManagerByClass = function(key, manager){

	return this.storage.application.contextManagers[key] = manager;
}
SessionManager.prototype.removeContextManagerByClass = function(managerClass){

	delete this.storage.application.contextManagers[managerClass];
}
SessionManager.prototype.removeSensor = function(sensor){

	delete this.storage.application.sensors[sensor.className];
}
SessionManager.prototype.setCurrentArtifactData = function(key, value){
	this.storage.currentArtefact[key] = value;
}
