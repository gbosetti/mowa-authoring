//::MoWA::
	//@name: Text Augmenter
	//@scriptType: MobileWebAugmenter
	//@className: TextAugmenter
	//@classType: concrete
	//@requiredAugmenters: SingleContainerBasedAugmenter
	//@namespace: mowa
	//@author: lifia
//::MoWA::

function TextAugmenter(){
	SingleContainerBasedAugmenter.call(this);
    // Concrete class. This class is responsible for adding a formatted div to 
    // the document, within the text received as parameter will be shown.
	this.buildExpectedView = function(params){ //SUGGESTED  

		var container = this.buildContainer(params.id);
			container.appendChild(this.buildText(params.description));

		return container;
	};
	this.buildText = function(text){	    
	    return document.createTextNode(text);
	};
	this.checkUserDefinedParameters = function(params){ //CONCRETE 

		return (params.description && 
	    	params.description.length &&
	    	params.description.length > 0);
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
				"augmenter.name":"Text",
				"param.description.display": "Description"
			},
			'fr':{
				"augmenter.name":"Texte",
				"param.description.display": "Description"
			},
			'es': {
				"augmenter.name":"Texto",
				"param.description.display": "Descripción"
			}
		}
	}));
    this.setClassType("concrete");
    this.setName(this.getLocalized("augmenter.name"));
    this.setClassName("TextAugmenter");
	///////////////////// END OF HARCODING
};