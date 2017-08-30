var EXPORTED_SYMBOLS = ["Orientation", "NoOrientation", "OrientationBuilder"];

Components.utils.import("chrome://mowa/content/lib/context-types/base-context-manager.jsm");

function Orientation(props) { //name, alpha, beta, gamma) {
	
	ContextValue.call(this, props);    
	
	this.getManager = function() {
		return "OrientationBuilder"; 
	};
	this.createWrapeeInstance = function(ctx) {

		return new ctx["DeviceOrientation"](this.alpha, this.beta, this.gamma); 
	};
}

function OrientationBuilder(props){

	ContextValuesManager.call(this, props);
	this.getContextType = function(){
		return Orientation;
	}
	this.createNewEmptyContextValue = function(){
		return new Orientation();
	}
}