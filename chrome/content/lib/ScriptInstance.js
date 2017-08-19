/**
 * Represents an instance of any kind of installable and executable MoWA script, 
 * and provides the basic neccesary naming information to be localizable in the 
 * MoWA filesystem.  
 * @constructor
*/
function ScriptInstance(){

	//TODO: this class was a prototyped one, and that was removed to share via cloneInto. This may bring some exceptions in MoWA framework, so check that
	//Some def vals
	this.name;
	this.className;
	this.classType; // = 'concrete'; 
	this.namespace;
	this.fileExt = 'js';
	/**
	* This method returns the value of the script instance's className.
	* @method
	* @public 
	* @memberof ScriptInstance
	*/
	this.getClassName = function(){

		return this.className;
	};
	/**
	* This method returns the value of the script instance's class type.
	* Possible values are: concrete, abstract
	* @method
	* @public 
	* @memberof ScriptInstance
	*/
	this.getClassType = function(){

		return this.classType;
	};
	this.setName = function(name){

		this.name = name;
	};
	this.getName = function(){

		return this.name;
	};
	/**
	* This method sets the value of the script instance's className.
	* @method
	* @public 
	* @memberof ScriptInstance
	*/
	this.setClassName = function(className){

		this.className = className;
	};
	/**
	* This method sets the value of the script instance's class type. 
	* Possible values are: concrete, abstract
	* @method
	* @public 
	* @memberof ScriptInstance
	*/
	this.setClassType = function(classType){

		this.classType = classType;
	};
	/**
	* This method returns the value of the script instance's namespace.
	* @method
	* @public 
	* @memberof ScriptInstance
	*/
	this.getNamespace = function(){

		return this.namespace;
	};
	/**
	 * This method sets the value of the script instance's namespace.
	 * @method
	 * @public 
	 * @memberof ScriptInstance
	*/
	this.setNamespace = function(namespace){

		this.namespace = namespace;
	};
	/**
	* This method returns the file extension of the file the script instance is representing.
	* @method
	* @public 
	* @memberof ScriptInstance
	*/
	this.getFileExt = function(){

		return this.fileExt;
	};
	/**
	 * This method sets the value of the script file extension.
	 * @method
	 * @public 
	 * @memberof ScriptInstance
	 */
	this.setFileExt = function(fileExt){

		this.fileExt = fileExt || ".js";
	};
	this.createConfigurationInstance = function(id){ 

		var cfg;
		if(id==null || id==undefined) 
			id = this.constructor.name + "-" + Math.floor((Math.random() * 1000) + 1); 
		
		if(this.config){
		    cfg = new AugmenterConfig();
		    cfg.setClassName(this.constructor.name);
		    cfg.setId(id);

		    for (var attr in this.config) {
		        if (this.config.hasOwnProperty(attr)) 
		        	cfg[attr] = this.config[attr];
		    }
	    }
	    return cfg;
	};
};

function AugmenterConfig(){
    this.id;
    this.className;
    this.params = new Array();
	this.setId = function(id){

	    this.id = id;
	};
	this.getId = function(){

	    return this.id;
	};
	this.setClassName = function(className){
	    
	    this.className = className;
	};
	this.addParam = function(param){

		if(!param.id) param.id = Date.now();
		if(!param.displayName) param.displayName = param.id;
		/*if(!param.value) param.value = param.id; not a good ifea. I had a problem with xpath*/
		if(!param.userDefined) param.userDefined = false;

	    this.params.push(param);
	};
	this.getProperty = function(id){

	    for (var i = 0; i < this.params.length; i++) {
	        if(this.params[i].id == id)
	            return this.params[i];
	    };
	};
	this.setParameter = function(key, value){

	    for (var i = 0; i < this.params.length; i++) {
	        if(this.params[i].id == key){
	            this.params[i].value = value;
	            return;
	        }
	    };
	    console.log("No property was found with that keyname");
	};
	this.getParameters = function(){

	    return this.params;
	};
	this.hasParams = function(){

	    return (this.params && this.params.length > 0)? true: false;
	};
}