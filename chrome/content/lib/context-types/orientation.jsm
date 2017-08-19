var EXPORTED_SYMBOLS = ["Orientation", "NoOrientation", "OrientationManager"];

Components.utils.import("chrome://mowa/content/lib/context-types/base-context-manager.jsm");

function Orientation(props) { //name, alpha, beta, gamma) {
	
	ContextValue.call(this, props);    
	
	this.getManager = function() {
		return "OrientationManager"; 
	};
	this.createWrapeeInstance = function(ctx) {

		return new ctx["DeviceOrientation"](this.alpha, this.beta, this.gamma); 
	};
	this.displayInList = function(ui) {

		var box = ui.createUserDefValueBox("list-group-item"); 
			box.id = this.id;
			box.appendChild(ui.createUserDefBoxControls(function(){
				alert("removing");
			}));
			box.appendChild(ui.createUserDefValueTitle(this.name));
			box.appendChild(ui.createUserDefValueItem("Alpha: " + this.alpha + 
				" - Beta: " + this.beta + " - Gamma: " + this.gamma));
			box.onclick = function(){
				ui.setCurrentContextValueId(this.id);
				ui.loadOrientationSetup();
			}

		ui.append(box, "#orientations");
	};
}
function NoOrientation() {
	Orientation.call(this);
	this.displayInList = function(ui) {
		var box = ui.createNoItemBox("You have no orientations defined for this app. Please, create at least one.");
		ui.append(box, "#orientations");
	};
}

function OrientationManager(props){

	ContextValuesManager.call(this, props);
	this.getNoContextValue = function(){
		return new NoOrientation();
	}
	this.getContextType = function(){
		return Orientation;
	}
	this.createNewEmptyContextValue = function(){
		return new Orientation();
	}
}