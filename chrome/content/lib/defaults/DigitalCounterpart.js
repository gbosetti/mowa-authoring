function DigitalCounterpart(name, url, urlPattern, props, contextValues){
	
	this.name = name;
	this.url = url;
	this.urlPattern = urlPattern;
	this.props = props || {};
	this.contextValues = contextValues || {};

    var me = this;
    this.getName = function(){
		return this.name;
	}
    this.getDemoUrl = function(){
		return this.url; 
	}
	this.getAvailableProperties = function(){

    	var props = {}; 

    	for (i in this.props){
    		props[this.props[i].name] = this.props[i].value; //TODO: debería hacerse con .getValue(this.props[i].xpath) pero eso implica hacer asíncronos un montón de mensajes.
    	}

    	return props;
	}
	this.alphabeticallyOrder = function(collection, prop){

		if(collection && collection.length && collection.length>1)
			collection.sort(function(a, b) {
				var textA = b[prop].toUpperCase();
				var textB = a[prop].toUpperCase();
				return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
			});
		return collection;
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
	this.removeRelatedContextValue = function(cValue){

		delete this.contextValues[cValue.id];
	}
}