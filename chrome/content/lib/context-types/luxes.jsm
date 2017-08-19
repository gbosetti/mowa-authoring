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
	this.displayInList = function(ui) {

		var box = ui.createUserDefValueBox("list-group-item"); 
			box.id = this.id;
			box.appendChild(ui.createUserDefBoxControls(function(){
				alert("removing");
			}));
			box.appendChild(ui.createUserDefValueTitle(this.name));
			box.appendChild(ui.createUserDefValueItem("Lux value: " + this.lux));
			box.onclick = function(){
				ui.setCurrentContextValueId(this.id);
				ui.loadLightLevelSetup();
			}

		ui.append(box, "#luxes");
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