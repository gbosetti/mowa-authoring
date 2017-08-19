var EXPORTED_SYMBOLS = ["ContextValue","ContextValuesManager"];

function ContextValue(props){

	for(var prop in props){ //This way, the data model can be easily wrapped and loaded in the session manager
        this[prop] = props[prop];
    }

    if(this.id == undefined) //This id is just to allow to persist the object even if it is not fully created
    	this.id = new Date().getTime().toString();
}


function ContextValuesManager(props){

	this.values = {};
	for(var prop in props){ //This way, the data model can be easily wrapped and loaded in the session manager
        this[prop] = props[prop];
    }

	this.addContextValue = function(value){

		if(value == undefined || value.id == undefined) return;
		
		this.values[value.id] = value;
	}

	this.getValues = function(){

		var cvs = [];
		for (value in this.values){
			cvs.push(this.values[value]);
		}
		return cvs;
	}

	this.createNewEmptyContextValue = function(){}
}
