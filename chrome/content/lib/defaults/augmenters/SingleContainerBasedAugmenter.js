//::MoWA::
	//@name: Single Container Augmenter
	//@scriptType: MobileWebAugmenter
	//@className: SingleContainerBasedAugmenter
	//@classType: abstract
	//@requiredAugmenters: MobileWebAugmenter
	//@namespace: mowa
	//@author: lifia
//::MoWA::

/**
 * A MobileWebAugmenter is an abstract adaptation component based on 
 * the manipulation of DOM by adding div containers. 
 * Users should extend this class without forgetting to rename the 
 * subclass constructor with the same subclass name.
 * @constructor
 */
function SingleContainerBasedAugmenter(){

	MobileWebAugmenter.call(this);

	this.locale = {};
	this.getLocalized = function(id){ //CONCRETE, PRIVATE
    	return this.locale[id];
    }
    this.enable = function(){ //m
    	this.view.firstChild.style.display = "";
    };
    this.disable = function(){
    	this.view.firstChild.style.display = "none";
    };
	this.appendToLocale = function(bundle){ //CONCRETE, PRIVATE
		//This method should be used by assigning a proper language bundle 
		//for the augmenter. There srings shoud be defined in metadata, 
		//and a default language should be provided, in case navigator be using
		//a language that the augmenter has no bundle defined for.
		//Scripting manager should process this info and provide the data as JSON

		if(this.checkLocale(bundle)) {
			for (var prop in bundle) {
			    if (bundle.hasOwnProperty(prop)) {
			        this.locale[prop] = bundle[prop];
			    }
			}
			return true;
		}
		else {
			alert('Warning: there was a problem loading the language bundle');
			return false;
		}
	}
	this.checkLocale = function(bundle){ //CONCRETE, PRIVATE
		return true;
	}
	this.createBaseConfiguration = function(){
		var cfg = new AugmenterConfig();    
		    cfg.addParam({"id": "id", "displayName": "DOM element ID"});		 
		    cfg.addParam({"id": "xpath", "displayName": "Xpath for positioning", "value": ""});
		    cfg.addParam({"id": "position", "displayName": "Position", "value": "absolute"});
		    cfg.addParam({"id": "order", "displayName": "Order", "value": "after"});
	    return cfg;
	};
	this.createConfigurationInstance = function(){
		return this.createBaseConfiguration();
	};
	this.execute= function(params){
	    this.view = this.showView({
	    	container: this.build(params), 
		    position: {
		    	xpath: params.xpath, 
		    	position: params.position,
		    	order: params.order
		    }
		});
		if(this.callback) this.callback(params, this.view);
		return this.view;
	};
	this.build = function(params){
		try{
			if(this.checkUserDefinedParameters(params))
				return this.buildExpectedView(params);
			else return this.buildBadConfigurationMsg(params);
		}catch(err){ 
			return this.buildExecutionErrorMsg(params, err); 
		};	
		
	};
	this.undo = function(params){
		
		var container = document.getElementById(params.elemId);
		this.removeContainer(container);
	};
	/**
	 * Private method. This method is responsible for clearing all the contents of 
	 * the HTML div element which id matches with the string received as parameter.
	 * @method
	 * @private 
	 * @memberof SingleContainerBasedAugmenter
	 */
	this.removeContainer = function(container){

		if(container)
			container.remove();
	};
	/**
	 * Private method. This method is responsible for clearing all the contents of 
	 * the HTML div element which id matches with the string received as parameter.
	 * @method
	 * @private 
	 * @memberof SingleContainerBasedAugmenter
	 */
	this.clearContainer = function(container){

		if(container)
			container.innerHTML = "";
	};
	this.buildBadConfigurationMsg = function(params){

		var container = this.buildContainer(params.id);
	    
	    var div = container.appendChild(document.createElement("div"));
	        div.style.color = "black";
	        div.style.fontSize = "1em";
	        div.style.borderColor = "#3DB7BC";

	    div.appendChild(document.createTextNode(
	    	this.getLocalized('not.well.configured.augmenter')));
	    return container;
	};
	this.buildExecutionErrorMsg = function(params, error){

		var container = this.buildContainer(params.id);
	    var div = container.appendChild(document.createElement("div"));
	        div.style.color = "black";
	        div.style.fontSize = "1em";
	        div.style.borderColor = "#3DB7BC";

	    div.appendChild(document.createTextNode(
	    	this.getLocalized('error.executing.augmenter')));
	    div.appendChild(document.createElement("br"));
	    div.appendChild(document.createTextNode(error.message));
	    return container;
	};
	/**
	 * Hook method. This method displays the generated container by the augmenter within 
	 * the page to adapt, placing it above the DOM element that has the same that 
	 * "xpathOfRelatedElem". Since it is not the only way to insert divs in the document, 
	 * the behavior of this method can be modified.
	 * @method
	 * @private 
	 * @memberof SingleContainerBasedAugmenter
	 */
	this.showView = function(params){ //container, position

		var relElem = this.getElementByXpath(params.position.xpath, params.container.ownerDocument);
		if(!relElem){ 
		    params.container.style.position = 'fixed'; 
		    document.body.appendChild(params.container);
		    params.container.style.top = '50%';
		    params.container.style.left = '50%';
		    params.container.style.transform = 'translate(-50%, -50%)';
		}else{
			params.container.style.position = params.position.position; 

			//console.log("receiving: ", params.position.order);
			//TODO: change this for a Positioning class (one for each value) //above/below
			if(params.position.order == 'below') { 
				//console.log("executing: below");
				if(relElem.parentNode.lastchild == relElem) 
					relElem.parentNode.appendChild(params.container);
				else relElem.parentNode.insertBefore(params.container, relElem.nextSibling);	
			}
			else { /*console.log("executing: above");*/ 
				relElem.parentNode.insertBefore(params.container, relElem);
			}
		}
		return params.container;
	};
	this.getAbsolutePosition = function(element) { //I know this is a crime!
	    var xPosition = 0, yPosition = 0;
	    while(element) {
	        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
	        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
	        element = element.offsetParent;
	    }
	    return { x: xPosition, y: yPosition };
	}
	/**
	 * Builds a generic HTML div container with a default style.
	 * @method
	 * @protected 
	 * @memberof SingleContainerBasedAugmenter
	 */
	this.buildContainer = function(elemId){ 

		var container = document.createElement("div");
			container.id = elemId;
			container.style.height = 'auto';
			container.style.width = '90%';
			container.style.backgroundColor = '#F5EDDB';
			container.style.margin = '10px';
			container.style.padding = '10px';
			container.style.color = 'black';
			container.style.textAlign = 'center';
			container.style.borderStyle = 'solid';
			container.style.borderWidth = '1px';
			container.style.borderColor = '#B3ADA1';
			container.style.borderRadius = '5px';
			container.style.boxShadow = '0px 0px 10px #F3F3F3';

		return container;
	};
	/*this.createHover = function(){
		var hover = document.createElement("div");
			hover.className = "mowa-preview-disabled";
		    hover.style["position"] = "absolute";
		    hover.style["top"] = "0";
		    hover.style["left"] = "0";
		    hover.style["right"] = "0";
		    hover.style["bottom"] = "0";
		    hover.style["background-color"] = "rgba(65,65,65,0.8)";
		return hover;
	};*/
	this.checkDomId = function(id){
		
		return (this.dataValidator.validate({
			data:id, 
			required: true, 
			type:"string"
		}) && document.getElementById(id));
	};

	///////////////////// HARDCODING
	//This shoudn't exist. The manager externally will 
	//instantiate the augmenters, read the metadata and choose 
	//which language bundle to build. Mayby from separate files (think's better) 
	//or this same. Under consideration!
	this.getProperBundle = function(params){ //HARDCODING
		//bundles, defLanguage
		//HARDCODED: this should be done externally
		var languages = ""; //e.g. "en,es,fr,"
		    for (var prop in params.bundles) {
			    if (params.bundles.hasOwnProperty(prop)) {
			        languages = languages + prop + ",";
			    }
			}
	    var baseLang = ((window.navigator.userLanguage)? window.navigator.userLanguage: window.navigator.language).substring(0,2).toLowerCase();
	    var lang = (languages.indexOf(baseLang) == -1)? params.defLanguage: baseLang;
	    return params.bundles[lang];
	};
	this.appendToLocale(this.getProperBundle({ //This should be replicated from augmenters that want's to use localization
		defLanguage: "es",
		bundles: {
			'en':{
				"not.well.configured.augmenter": "This augmenter is not well configured and can't be shown.",
				"error.executing.augmenter": "Error during augmenter execution:"
			},
			'fr':{
				"not.well.configured.augmenter": "Cet augmenteur n'est pas bien configuré et ne peut pas être représenté.",
				"error.executing.augmenter": "Erreur pendant l'exécution d'augmenteur:"
			},
			'es': {
				"not.well.configured.augmenter": "Este augmenter no ha sido correctamente configurado y no puede ser representado.",
				"error.executing.augmenter": "Error durante la ejecución del augmenter:"
			}
		}
	}));
	///////////////////// END OF HARCODING
};