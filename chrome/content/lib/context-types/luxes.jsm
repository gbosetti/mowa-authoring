/* metadata */

var EXPORTED_SYMBOLS = ["LightLevel", "LightLevelBuilder"];

Components.utils.import("chrome://mowa/content/lib/context-types/base-context-manager.jsm");

function LightLevel(props) { //.lux
	
	ContextValue.call(this, props);    
	
	this.getManager = function() {
		return "LightLevelBuilder"; 
	};
	this.createWrapeeInstance = function(ctx) {

		return new ctx["LightLevel"](this.lux); 
	};
}

function LightLevelBuilder(props){

	ContextValuesManager.call(this, props);
	this.getContextType = function(){
		return LightLevel;
	}
	this.createNewEmptyContextValue = function(){
		return new LightLevel();
	}
}