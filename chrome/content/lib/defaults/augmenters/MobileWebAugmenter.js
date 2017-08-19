//::MoWA::
	//@name: Mobile Web Augmenter
	//@scriptType: MobileWebAugmenter
	//@className: MobileWebAugmenter
	//@classType: abstract
	//@namespace: mowa
	//@author: lifia
//::MoWA::

function ValidationResult(value, onFalseValMsg){
    this.value = value || false;
    this.setDefaultMessage = function(message){ //PRIVATE
        this.message = message;
    };
    this.setDefaultMessage(onFalseValMsg || "");
    this.getValue = function(){ 
        return this.value; 
    };
    this.getMessage = function(){
        return (!this.value)? this.message: ""; 
    };
}

function DataValidator(){
    this.validate = function(validatable){ //value, rules){

        //rules == number,string,boolean,symbol,symbol,object,undefined,date,email,url
        //Faltan video, time, tel, 
        // validatable = {data(*):object, required(*): true, type(*):string, regExp:null, customVal:null}
        //rules = rules.split(",");
        var res, 
            upperCaseType = validatable.type.substr(0, 1).toUpperCase() + 
                            validatable.type.substr(1);

        if(validatable.required){
            res = this.validateRequired(validatable.data);
            if(!res.getValue())
                return res;
        }

        if(validatable.regExp){
            res = this.validateRegExp(validatable.value, validatable.regExp);
            if(!res.getValue())
                return res;
        }

        if(validatable.customValidation){

            res = this.performCustomValidation(validatable.value, validatable.customVal);
            if(!res.getValue())
                return res;
        }

        //Calls a reflective method. E.g. validateNumber(value)
        return eval("this.validate" + upperCaseType + "(validatable.data)"); 
    };
    this.validateNotUndefined= function(value){

        return (!typeof value === 'undefined'); 
    };
    this.validateNotNull= function(value){

        return (value != null); 
    };
    this.validateRequired = function(value){
        
        return new ValidationResult(
            (this.validateNotNull(value) || this.validateNotUndefined(value)), 
            "This field is required" 
        );  
    };
    this.validateRegExp = function(value, regexStr){
        
        var regex = new RegExp(regexStr);

        return new ValidationResult(
            regex.test(value), 
            "The regular expression was not sucessfully validated" 
        );
    };
    this.performCustomValidation = function(value, callback){

        callback(value);
    };
    //Reflective methods
    this.validateNumber = function(value){
        
        var res = false;

        if(typeof value != NaN) 
            res = (typeof value === 'number');

        return new ValidationResult(
            res, 
            "Please enter a valid number" 
        );
    };
    this.validateString = function(value){
        
        return new ValidationResult(
            (typeof value === 'string'), 
            "Please enter a valid string" 
        );  
    };
    this.validateBoolean = function(value){

        return new ValidationResult(
            (typeof value === 'boolean'), 
            "Please enter a valid boolean value" 
        );      
    };
    this.validateSymbol = function(value){
        
        return new ValidationResult(
            (typeof value === 'symbol'), 
            "Please enter a valid symbol" 
        );  
    };
    this.validateObject = function(value){
        
        return new ValidationResult(
            (typeof value === 'object'), 
            "Please enter a valid object" 
        );  
    };
    this.validateDate = function(value){
        
        return new ValidationResult(
            (value instanceof Date), 
            "Please enter a valid Date" 
        );  
    };
    this.validateEmail = function(value){
        
        var input = document.createElement('input');
            input.type = 'email';
            input.value = value;

        return new ValidationResult(
            input.checkValidity(), 
            "Please enter a valid e-mail" 
        );  
    };
    this.validateVideo = function(value){
        
        /*return (document.createElement("video").canPlayType);
        return new ValidationResult(
            input.checkValidity(), 
            "Please enter a valid video" 
        );  */
    };
    this.validateUrl = function(value){
        
        var input = document.createElement('input');
            input.type = 'url';
            input.value = value;

        return new ValidationResult(
            input.checkValidity(), 
            "Please enter a valid URL" 
        );  
    }
};

/**
 * A MobileWebAugmenter is an abstract adaptation component which users must extend in order to adapt the current site's DOM.
 * @constructor
 * @abstract
 */
function MobileWebAugmenter(){

    ScriptInstance.call(this);

    this.dc; //podría recibirla por parámetro
    this.dataValidator = new DataValidator();
    this.config = new AugmenterConfig();

    this.onOrientationChange = function(sensedOrientation){};
    this.onLightLevelChange = function(sensedLux){};
    this.matchesAnyContextValue = function(cv){  

        for (var i in this.dc.contextValues) {

            if(this.dc.contextValues[i].matches(cv)){
                return true;
            }
        }
        return false;
    };
    this.setDigitalCounterpart = function(dc){
        //console.log("setting dc:",dc.getName());
        this.dc = dc;
    };
    this.setRequester = function(req){
        
        this.request = req;
    };
    /**
     * All MobileWebAugmenter subclasses must implement this method, which may receive required parameters and is responsible for performing the adaptation.
     * @method
     * @public 
     * @abstract
     * @memberof MobileWebAugmenter
     */
    this.execute = function(params){};
    /**
     * All MobileWebAugmenter subclasses must implement this method, which is responsible for undoing the action performed by the "execute method".
     * @method
     * @public 
     * @abstract
     * @memberof MobileWebAugmenter
     */
    this.undo = function(params){};
    /**
     * This method gets receives an xpath expression and evaluates it in the current document
     * @method
     * @private 
     * @memberof MobileWebAugmenter
     * @returns {HtmlObject}
     */
    this.getElementByXpath = function(path, doc) {

        try{
            return doc.evaluate(path,doc,null,9, null).singleNodeValue;
        }catch(err){console.log('getElementByXpath in MobileWebAugmenter: ' + err.message);}
        return;
    };
    this.setParamsForConfiguration = function(paramsSpecs){

        if(!paramsSpecs || paramsSpecs.length<1) return;
        for (var i = 0; i < paramsSpecs.length; i++) {

            var oParam = JSON.parse(paramsSpecs[i].value); 
            this.addConfigProperty(oParam.id,  oParam.displayName, oParam.validationMethod);
        };
    };
    this.addConfigProperty = function(id, displayName, validationMethod){ 

        this.config.addParam(id, displayName, validationMethod);
    };
};