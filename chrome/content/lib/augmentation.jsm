var EXPORTED_SYMBOLS = ["Augmentation", "Augmenter"];

function Augmentation(data){

	this.name = "Demo augmentation";
	this.digitalCounterparts = {}; //this should be just one, to avoid problems with DOM structure and locators
	this.augmenters = {};

    this.initialize = function(props){

		for(var prop in props){
	        this[prop] = props[prop];
	    }

	    if(this.id == undefined)
    		this.id = new Date().getTime().toString();
    };
    this.addDigitalCounterpart = function(dc){
        if(dc == undefined || dc.id == undefined) return;

    	this.digitalCounterparts[dc.id] = dc;
    };
    this.removeDigitalCounterpart = function(dc){
    	delete this.digitalCounterparts[dc.id];
    };
    this.hasDigitalCounterpart = function(dc){
        return (this.digitalCounterparts[dc.id])? true:false;
    };
    this.getDigitalCounterpartIds = function(dc){ //This will dissapear when persistence will be in a separate layer
        var ids = [];
        for(id in this.digitalCounterparts){
            ids.push(id);
        }
        return ids;
    };
    this.listProperties = function(obj){ //This will dissapear when persistence will be in a separate layer
        var props = [];
        for(id in obj){
            props.push(obj[id]);
        }
        return props;
    };
    this.getName = function(){
    	return this.name;
    };
    this.getAugmenters = function(){
        return this.listProperties(this.augmenters);
    };
    this.removeAugmenter = function(dc){
        delete this.augmenters[dc.id];
    };
	this.getAugmenter = function(dc){
        return this.augmenters[dc.id];
    };
	this.addAugmenter = function(dc){
        this.augmenters[dc.id] = dc;
    };
    this.getFirstDigitalCounterpart = function(){

        for(i in this.digitalCounterparts){
            return this.digitalCounterparts[i];
        }
    };

    this.initialize(data);
}

function Augmenter(data){

    this.id;
	this.xpath;
	this.position;
    this.className; //Augmenter to instantiate
    this.parameters = {};

    this.initialize = function(props){

        for(var prop in props){
            this[prop] = props[prop];
        }

        if(this.id == undefined)
            this.id = new Date().getTime().toString();
    };
    this.cloneprops = function(obj){ //This will dissapear when persistence will be in a separate layer
        var props = {};
        for(id in obj){
            props[id] = obj[id];
        }
        return props;
    };
	this.addParameter = function(dc){
        if(dc == undefined || dc.id == undefined) return;

        this.parameters[dc.id] = dc;
    };
    this.removeParameter = function(dc){
        delete this.parameters[dc.id];
    };
	this.setParameter = function(id, value){

        this.parameters[id] = value;
    };
    this.getParameter = function(id){
        return this.parameters[id]
    }
    this.getParameters = function(){

        var params = this.cloneprops(this.parameters);

            //Lo atamo' con alambre
            params.id = {className: "TextualParameter", value: this.id};
            params.xpath = {className: "TextualParameter", value: this.xpath};
            params.order = {className: "TextualParameter", value: this.position};

        return params;
    };
	this.setXpath = function(xpath){
        this.xpath = xpath;
    };
	this.setPosition = function(position){
        this.position = position;
    };
	this.getPosition = function(position){
        return this.position || "before";
    };
    this.initialize(data);
}
