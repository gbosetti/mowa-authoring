var EXPORTED_SYMBOLS = ["DigitalCounterpartBuilder", "DcProperty"];

function DcProperty(data){ //id name value

	this.initialize = function(props){

        for(var prop in props){
            this[prop] = props[prop];
        }

        if(this.id == undefined)
            this.id = new Date().getTime().toString();
    };
    this.initialize();
}

function DigitalCounterpartBuilder(props){
	
	this.name;
	this.url;
	this.urlPattern;
	this.props = {}; //id name xpath. Mas adelanto esto debería ser una clase, con un getValue (las props directas son devuelven su value y las enlazadas al doc evalúan el xpath)
	this.contextValues = {};

	//Constructor. With this "single parameter" way, the data model can be easily wrapped 
	for(var prop in props){ 
        this[prop] = props[prop];
    }

    //This id is just to allow to persist the object even if it is not fully created
    if(this.id == undefined) 
    	this.id = new Date().getTime().toString();

    var me = this;
    this.getName = function(){
		return this.name;
	}
    this.getDemoUrl = function(){
    	//In case there is a non litteral pattern
		return this.url; //Por ahora
	}
	this.getUrlPattern = function(){
		return this.urlPattern; 
	}
	this.getContextValues = function(){
		return this.contextValues; 
	}
	this.addRelatedContextValue = function(cValue){

		if(cValue == undefined || cValue.id == undefined) return;

		this.contextValues[cValue.id] = cValue;
	}
	this.hasContextValue = function(cValue){

		return (this.contextValues[cValue.id])? true: false;
	}
	this.removeRelatedContextValue = function(cValue){

		delete this.contextValues[cValue.id];
	}
	this.getProperty = function(propId){

		if(propId == undefined) return;

		return this.props[propId];
	}
	this.setProperty = function(id, key, value){ //id name value

		this.props[id][key] = value;
	}
	this.getProperties = function(){ 

		return this.props;
	}
	this.getAvailableProperties = function(win){

    	var props = (win)? new win["Object"] : {}; 

    	for (i in this.props){
    		props[this.props[i].name] = this.props[i].value; //TODO: debería hacerse con .getValue(this.props[i].xpath) pero eso implica hacer asíncronos un montón de mensajes.
    	}
		props["name"] = this.name; //lo atamo' con alambreee

    	return props;
	}
	this.addProperty = function(prop){ //id name value

		if(prop == undefined || prop.id == undefined) return;

		this.props[prop.id] = prop;
	}
	this.removePropertyById = function(id){

		delete this.props[id];
	}
	this.createWrapeeInstance = function(ctx, contextValues){
    	
    	var props = this.getAvailableProperties(ctx);

		return Components.utils.waiveXrays(new ctx["DigitalCounterpart"](
			this.getName(), 
			this.getDemoUrl(), 
			this.getUrlPattern(), 
			props, 
			contextValues
		));
	}
}