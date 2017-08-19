//::MoWA::
	//@scriptType: MobileWebAugmenter
	//@className: TitleSectionAugmenter
	//@classType: concrete
	//@requiredAugmenters: TextAugmenter
	//@namespace: mowa
	//@author: lifia
//::MoWA::

function TitleSectionAugmenter(){
	TextAugmenter.call(this);
    // Concrete class. This class is responsible for adding a formatted div to 
    // the document, within the text received as parameter will be shown.
    this.onOrientationChange = function(sensedOrientation){
        
        if(this.matchesAnyContextValue(sensedOrientation))
        	this.enable();
        else this.disable();
    };
    this.onLightLevelChange = function(sensedLux){
        //console.log(sensedLux);
        if(this.matchesAnyContextValue(sensedLux))
        	this.darkify();
        else this.lightify();
    };
    this.darkify = function(){	 //best name ever hahah
    	//console.log("darkifying", this.view);
	    this.applyStyle(
	    	this.view.firstChild, 
	    	this.getDarkStyleForContainer()
	    );
	};
	this.lightify = function(){	 //best name ever hahah
		//console.log("lightifying", this.view);
	    this.applyStyle(
	    	this.view.firstChild, 
	    	this.getLightStyleForContainer()
	    );
	};
	this.applyStyle = function(elem, style){	 

	    for (i in style){
	    	elem.style[i] = style[i];
	    }
	};
	this.getLightStyleForContainer = function(){	

		return {
			"color": "black",
			"background-color": ""
		}
	};
	this.getDarkStyleForContainer = function(){	

		return {
			"color": "white",
			"background-color": "black"
		}
	};
	this.buildText = function(text){	 

	    var span = document.createElement("span");
	    	span.innerHTML = text;
	    	span.style["font-size"] = "1.5em";
	    	span.style["font-weight"] = "bold";
	    return span;
	};
	this.createConfigurationInstance = function(){ //CONCRETE 
	    //TODO: use validationMethods for data validation in the app's view 
	    //If you want to prevent 'undefined', just add a value property with a blank string
	    var cfg = this.createBaseConfiguration();
		    cfg.addParam({"id": "description", "userDefined": true, "value": "",
				"displayName": this.getLocalized("param.description.display")});
	    return cfg;
	};
	///////////////////// HARCODING
	this.appendToLocale(this.getProperBundle({ //This should be replicated from augmenters that want's to use localization
		defLanguage: "es",
		bundles: {
			'en':{
				"augmenter.name":"Title section",
				"param.description.display": "Title"
			},
			'fr':{
				"augmenter.name":"Section de titre",
				"param.description.display": "Titre"
			},
			'es': {
				"augmenter.name":"Sección de título",
				"param.description.display": "Título"
			}
		}
	}));
	this.getTitle = function(){
	    return this.getLocalized("augmenter.name");
	};
    this.setClassType("concrete");
    this.setName(this.getLocalized("augmenter.name"));
    this.setClassName("TitleSectionAugmenter");
	///////////////////// END OF HARCODING
};