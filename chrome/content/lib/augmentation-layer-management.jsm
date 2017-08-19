var EXPORTED_SYMBOLS = ["AugmentationLayerManager"];
var console;
function AugmentationLayerManager(win, charset){

	this.window = win;
	this.charset = charset;
	console = this.window.console;
	this.messages;
	this.frameworkBaseDir = "chrome://MoWA/content/lib/";

	Components.utils.import("chrome://mowa/content/lib/session-manager.jsm");
	Components.utils.import("chrome://mowa/content/lib/xpath-interpreter.jsm");
	Components.utils.import("chrome://mowa/content/lib/FilesManagementModule.jsm");

	this.sessionManager = new SessionManager(this);
	this.filesManager = new JsonFileManager(win, ["MoWA", "authoring", "applications"]);
	this.loadParamClasses();

	var me = this;
	this.onThumbDragStart = function(){
		
	};
	this.onThumbDragging = function(evt){
		evt.stopImmediatePropagation(); evt.preventDefault();
		var pointed = evt.target.ownerDocument.elementFromPoint(evt.touches[0].clientX, evt.touches[0].clientY);
		if(pointed && me.sessionManager.getLastHighlightedElem() != pointed){
			pointed.classList.add("mowa-highlighted-dom-element");

			var elem = me.sessionManager.getLastHighlightedElem();
			if (elem && elem.classList.contains("mowa-highlighted-dom-element")) {
				elem.classList.remove("mowa-highlighted-dom-element");
			}
			me.sessionManager.setLastHighlightedElem(pointed);
			//console.log("over elem ", pointed);
		}
	};
	this.onThumbDropped = function(evt){

		//Removing highlighting and showing the thumbnail
		me.disableAugmenterPositioning(evt.target.ownerDocument);

		var ct = me.sessionManager.getCurrentThumbnail();
		ct.style.display = "";
        me.showPositioningMenu(evt.target); //me.sessionManager.getLastHighlightedElem());
	};
}
AugmentationLayerManager.prototype.loadParamClasses = function(){

	function Parameter(data){
	    this.data = data;
	    this.getValue; //Abstract
	}

	var man = this;
	this.paramClasses = {
		TextualParameter: function(data){
		    Parameter.call(this, data);
		    this.getValue = function(){
		        return this.data.value;
		    }
		},
		PropertyBindedParameter: function(data){
		    Parameter.call(this, data);

		    this.getValue = function(){

		    	var dc = man.sessionManager.getDigitalCounterpartById(this.data.dc);
		    	if(dc){
		    		var props = dc.getAvailableProperties();
		    		for (i in props){
			            if (i == this.data.value)
			                return props[i];
			        }
		    	}
		    }
		}
	};
}
AugmentationLayerManager.prototype.getWindow = function(){

	return this.window;
}
AugmentationLayerManager.prototype.clearPositioningMenu = function(){
	try{ this.uPositioningMenu.remove(); }catch(err){}
    this.uPositioningMenu = undefined;
};
AugmentationLayerManager.prototype.getAbsolutePosition = function(elem) {

	elem = Components.utils.waiveXrays(elem);

    var xPosition = 0, yPosition = 0;
    while(elem) {
        xPosition += (elem.offsetLeft - elem.scrollLeft + elem.clientLeft);
        yPosition += (elem.offsetTop - elem.scrollTop + elem.clientTop);
        elem = elem.offsetParent;
    }
    return { x: xPosition, y: yPosition };
};
AugmentationLayerManager.prototype.saveAppInSessionIntoFile = function(){

	var parsedAppData = this.sessionManager.getApplicationSpec();
	var appData = JSON.stringify(parsedAppData, null, 4);

	if(appData){
		this.filesManager.writeFile(
				["MoWA", "authoring", "applications"],
				parsedAppData.filename,
				appData,
				this.charset
		);
	}
};
AugmentationLayerManager.prototype.showPositioningMenu = function(elem){

	elem = Components.utils.waiveXrays(elem);
	var me=this, unsafeWindow = this.getUnsafeWindow();

	var modalButtonOnly = new unsafeWindow.tingle.modal({
        closeMethods: ['overlay', 'button', 'escape'],
        footer: true,
        stickyFooter: true
    });

    modalButtonOnly.setContent(this.locale['augmenter.move.here']);

    modalButtonOnly.addFooterBtn(
    	this.locale['augmenter.move.above'], // MOVE ABOVE
    	'tingle-btn tingle-btn--primary tingle-btn--pull-right',
    	function(){
	    		modalButtonOnly.close();
		    	me.moveAboveSelectedAugmenter();
					me.moveSelectedAugmenter("above");
    });

    modalButtonOnly.addFooterBtn(
    	this.locale['augmenter.move.below'],  //MOVEBELOW
    	'tingle-btn tingle-btn--primary tingle-btn--pull-right',
    	function(){
    		modalButtonOnly.close();
	    	me.moveBelowSelectedAugmenter();
	    	me.moveSelectedAugmenter( "below");
    });

    modalButtonOnly.open();
};
AugmentationLayerManager.prototype.moveSelectedAugmenter = function(at){

	var lastWaivedElem = this.sessionManager.getLastHighlightedElem();

	if(lastWaivedElem){
		var elem = Components.utils.waiveXrays(lastWaivedElem);

		this.unhighlightElement(elem);
		this.clearPositioningMenu();

		var thumb = Components.utils.waiveXrays(this.sessionManager.getCurrentThumbnail());
		var xpath = new XPathInterpreter().getElementXPath(elem);

		var augmenter = Components.utils.waiveXrays(this.sessionManager.getCurrentAugmentation().getAugmenter(thumb));
			augmenter.setXpath(xpath);
			augmenter.setPosition(at);
			
		this.saveAppInSessionIntoFile();
	}
}
AugmentationLayerManager.prototype.createThumbnail = function(params, doc, contentWindow) {

	var	thumbnail = doc.createElement("div");
		thumbnail.setAttribute("mowa-cog-file", params.cog);
		thumbnail.setAttribute("mowa-aug-class", params.augmenter)
    	thumbnail.id = params.id;
    	thumbnail.previewMode = false;
    	thumbnail.selected = false;
    	thumbnail.className ='mowa-augmenter-thumbnail';

    var me = this;
	var thumbHeader = doc.createElement("div");
		thumbHeader.className='mowa-augmenter-thumbnail-header';
		thumbHeader.ontouchstart = function(e){
    		e.stopImmediatePropagation();
			
			me.sessionManager.clearAugmentationBrowserValues();
			me.sessionManager.setCurrentThumbnail(this.parentElement);

			me.enableAugmenterPositioning(e.target.ownerDocument);
		};

		var aug = new this.augmenters[params.augmenter]();

		thumbHeader.textContent = aug.getTitle();
		thumbnail.appendChild(thumbHeader);

	var thumbOptions = doc.createElement("div");
		thumbOptions.className='mowa-augmenter-thumbnail-options';
		thumbnail.appendChild(thumbOptions);
	
	try{
		if(params.position && params.xpath){

			var relElement = new XPathInterpreter().getElementByXPath(params.xpath, doc);
			if(params.position == "above")
				this.moveAugmenterAbove(thumbnail, relElement);
			else this.moveAugmenterBelow(thumbnail, relElement);
		}
		else {
			doc.body.appendChild(thumbnail);
			thumbnail.classList.add("mowa-augmenter-thumbnail-default");
		}
	} catch(err){
		doc.body.appendChild(thumbnail);
		thumbnail.classList.add("mowa-augmenter-thumbnail-default");
		console.log(err)
	}

	return thumbnail;
}
AugmentationLayerManager.prototype.getUnsafeWindow = function() { //onAugmenterExecution

	return Components.utils.waiveXrays(this.getWindow().BrowserApp.selectedBrowser.contentWindow);
}
AugmentationLayerManager.prototype.getAugmenterClassByName = function(className){

	return this.augmenters[className];
}
AugmentationLayerManager.prototype.loadAugmenterBuilders = function(){

	this.augmenters = this.loadAugmentersModule(this.getOrderedAugmentersFiles()); //cambiar esto, pero ojo que no siempre deberían asignarse
}
AugmentationLayerManager.prototype.loadAugmenterBuilder = function(className){

	//Por alguna razón, si esto lo hace el augmentation manager, se arma M-A-L
	return this.loadAugmentersModule(this.getOrderedAugmentersFiles())[className];
}
AugmentationLayerManager.prototype.instantiateDigitalCounterpart = function(){

	var dcWrapper = this.sessionManager.getDigitalCounterpartWrapperBeingAugmented();
	this.loadDigitalCounterpartForAugmentationLayer(dcWrapper);
}	
AugmentationLayerManager.prototype.loadDigitalCounterpartForAugmentationLayer = function(dcWrapper){

	try{
		var req = new this.window.XMLHttpRequest();
		    req.open("GET", this.frameworkBaseDir + "defaults/DigitalCounterpart.js", false);
		    req.send(null);
		Components.utils.evalInSandbox(req.responseText, this.ctx);

		//the following lines is product of data and app layers being so tied
		var contextValues = Components.utils.waiveXrays(new this.ctx["Array"]());
		var cvWrappers = this.sessionManager.getContextValuesByIds(dcWrapper.getContextValues());	
		for (var i = cvWrappers.length - 1; i >= 0; i--) {
			contextValues.push(cvWrappers[i].createWrapeeInstance(this.ctx));
		}	
		console.log(dcWrapper.getAvailableProperties(this.ctx));
		this.dc = dcWrapper.createWrapeeInstance(this.ctx, contextValues); 

	}catch(err){console.log(err);}

    return this.dc;
}
AugmentationLayerManager.prototype.evaluateInSandbox = function(src){
	var req = new this.window.XMLHttpRequest();
	    req.open("GET", this.frameworkBaseDir + src, false);
	    req.send(null);

	Components.utils.evalInSandbox(req.responseText, this.ctx);
}
AugmentationLayerManager.prototype.loadUserSelectedSensors = function(selectedSensors){

	this.sensors = {};

	this.evaluateInSandbox("defaults/sensors/AbstractSensor.js");
	for (var i in selectedSensors) {  
		try{
			this.evaluateInSandbox(selectedSensors[i].src);

			var className = selectedSensors[i].className + "Sensor";
			this.sensors[className] = Components.utils.waiveXrays(new this.ctx[className]());
			
		}catch(err){console.log(err);}
	};

    return this.sensors;
}
AugmentationLayerManager.prototype.loadSandboxForAugmentationElements = function(win){

	this.ctx = new Components.utils.Sandbox(win,{
		'sandboxPrototype': win,
		'wantXrays': true
	});
}
AugmentationLayerManager.prototype.loadAugmentersModule = function(orderedModules){

	var augs = {};

	for (var i = 0; i < orderedModules.length; i++) {  try{
		var req = new this.window.XMLHttpRequest();
		    req.open("GET", this.frameworkBaseDir + orderedModules[i].src, false);
		    req.send(null);
		Components.utils.evalInSandbox(req.responseText, this.ctx);

		if(orderedModules[i].concrete){
			augs[this.ctx[orderedModules[i].augmenter].name] = Components.utils.waiveXrays(this.ctx[orderedModules[i].augmenter]);
		}
	}catch(err){console.log(err.message);}};

    return augs;
}
AugmentationLayerManager.prototype.getOrderedAugmentersFiles = function(win){

	return [
		{ 
			src: "ScriptInstance.js"
		},
		{ 
			src: "defaults/augmenters/MobileWebAugmenter.js"
		},
		{ 
			src: "defaults/augmenters/SingleContainerBasedAugmenter.js"
		},
		{ 
			src: "defaults/augmenters/TextAugmenter.js"
		},
		{ 
			src: "defaults/augmenters/TitleSectionAugmenter.js",	
			label: "Title Section",
	        augmenter: "TitleSectionAugmenter",
	        cog: "TitleSectionAugmenter.html",
	        concrete: true
		},	
		{ 
			src: "defaults/augmenters/RelatedYoutubeVideoAugmenter.js",
			label: "Related video",
	        augmenter: "RelatedYoutubeVideoAugmenter",
	        cog: "RelatedYoutubeVideoAugmenter.html",
	        concrete: true
		},
		{ 
			src: "defaults/augmenters/RelatedGoogleImagesVideoAugmenter.js",
			label: "Related images",
	        augmenter: "RelatedYoutubeVideoAugmenter",
	        cog: "RelatedYoutubeVideoAugmenter.html",
	        concrete: true
		}
	];
}
AugmentationLayerManager.prototype.getConcreteAugmentersData = function(params){

	var augmenters = this.getOrderedAugmentersFiles(), concreteAugmenters = [];
	for (var i = augmenters.length - 1; i >= 0; i--) {
		if(augmenters[i].concrete)
			concreteAugmenters.push(augmenters[i]);
	}
	return concreteAugmenters;
}
AugmentationLayerManager.prototype.configureAugmenter = function(thumbnail) { //onAugmenterExecution

	var filename = thumbnail.getAttribute("mowa-cog-file");
	this.getUnsafeWindow().MoWA.loadUriWithApi("chrome://mowa/content/data/augmenters/" + filename);
}
AugmentationLayerManager.prototype.setCurrentAugmenter = function(aug){

	this.sessionManager.setCurrentAugmenter(aug);
}
AugmentationLayerManager.prototype.addThumbnailCogButton = function(thumbOptions){

	var	me=this;
	this.addThumbnailOption(
		"mowa-configure-icon", thumbOptions, function(e){
		try{
            e.stopImmediatePropagation(); e.preventDefault();

            var elem = Components.utils.waiveXrays(e.target.parentElement.parentElement.parentElement);
    		me.setCurrentAugmenter(elem);
    		me.configureAugmenter(elem);

    	}catch(err){console.log(err.message)}
    });
}
AugmentationLayerManager.prototype.addThumbnailRemoveButton = function(thumbOptions){

	var	me=this;
	this.addThumbnailOption(
    	"mowa-remove-icon", thumbOptions, function(e){
        e.stopImmediatePropagation();
		var elem = e.target.parentElement.parentElement.parentElement;
		elem.parentElement.removeChild(elem);
		me.sessionManager.getCurrentAugmentation().removeAugmenter(elem);
		me.sessionManager.clearCurrentThumbnail();
		me.saveAppInSessionIntoFile();
    });
}
AugmentationLayerManager.prototype.addThumbnailClosePreviewButton = function(thumbnail, augPreview, augmenter){

	var	me=this;
	var bottomBar = augPreview.appendChild(uDoc.createElement('div'));
	this.addThumbnailOption(
		"mowa-close-preview-icon mowa-executed-augmenter-button", bottomBar, function(e){
		
		e.stopImmediatePropagation();
		me.removeAsSensorsListener(augmenter);
		me.stopSensorsDetection();

		var elem = Components.utils.waiveXrays(e.target.parentElement.parentElement.parentElement);
        	elem.remove();
			thumbnail.style['display'] = thumbnail.ownDisplay;
			if(thumbnail.classList.contains("mowa-hidden-dom-element"))
				thumbnail.classList.remove("mowa-hidden-dom-element");
	});
}
AugmentationLayerManager.prototype.notifyWhenFullContentIsLoaded = function(iframe, xpath, callback, winwin){
	var maxNumberOfTries = 10;
	var numberOfTries = 0;

	var checkFullContentLoaded = winwin.setTimeout(function(){ 

		winwin.clearTimeout(checkFullContentLoaded); //just in case
		numberOfTries++;
		var res = iframe.contentDocument.evaluate(xpath,iframe.contentDocument, null, 9, null ).singleNodeValue;
		
		if(res)	{
			callback(res.innerHTML || res.value);
			iframe.remove();
		}
		else if (numberOfTries <= maxNumberOfTries) {
			checkFullContentLoaded();
		}
		else iframe.remove();

	}, 1500);
}
AugmentationLayerManager.prototype.addThumbnailPreviewButton = function(thumbnail){

	var	me=this;
    this.addThumbnailOption(
    	"mowa-preview-icon", thumbnail.lastChild, function(e){
    	//try{
    		e.stopImmediatePropagation();
    		var elem = Components.utils.waiveXrays(e.target.parentElement.parentElement.parentElement),
	        	augMode = elem.previewMode;

	        	if(!thumbnail.classList.contains("mowa-hidden-dom-element"))
					thumbnail.classList.add("mowa-hidden-dom-element");

		        var augmenterInstance = me.getAugmenterInstance({ className: thumbnail.getAttribute("mowa-aug-class") })
		        var execParams = me.getAugmenterExecutionParameters({id: elem.id}, e.target.ownerDocument.defaultView);
		    	
		    	//This can not be included in the constructor, otherwise it can not be clonned. BUT you can attach a function later
			    augmenterInstance.setRequester(function(query, xpath, callback){ 
	    						    	
			    	var winwin = Components.utils.waiveXrays(me.window.BrowserApp.selectedBrowser.contentWindow);

			    	var ifr = winwin.document.createElement("iframe");
			    		ifr.setAttribute("style", "display: none");
			    		ifr.addEventListener("load", function retrieveContent(event){
			    			me.notifyWhenFullContentIsLoaded(this, xpath, callback, winwin);
			    		});
			    		ifr.setAttribute("src", query);
			    		winwin.document.body.appendChild(ifr);
			    });
			    
			    augmenterInstance.setDigitalCounterpart(me.dc);

			    //Then execute and use the "API" from the augmenters
			    var augPreview = augmenterInstance.execute(execParams);
	        	me.addAsSensorsListener(augmenterInstance);
	        	me.startSensorsDetection();

	        	if(!augPreview.classList.contains("mowa-augmenter-preview"))
	        		augPreview.classList.add("mowa-augmenter-preview");

	        	me.addThumbnailClosePreviewButton(thumbnail, augPreview, augmenterInstance);
	});
}
AugmentationLayerManager.prototype.addAsSensorsListener = function(augmenter) { 

	console.log("sensors:", this.sensors);
	for (i in this.sensors) {
		this.sensors[i].addListener(augmenter);
	}
}
AugmentationLayerManager.prototype.removeAsSensorsListener = function(augmenter) { 

	for (i in this.sensors) {
		this.sensors[i].removeListener(augmenter);
	}
}
AugmentationLayerManager.prototype.startSensorsDetection = function() { 

	for (i in this.sensors) {
		this.sensors[i].startSensing();
	}
}
AugmentationLayerManager.prototype.stopSensorsDetection = function() { 

	for (i in this.sensors) {
		this.sensors[i].stopSensing();
	}
}
AugmentationLayerManager.prototype.getAugmenterExecutionParameters = function(aug, win) { //onAugmenterExecution

		var augData = this.sessionManager.getCurrentAugmentation().getAugmenter(aug); // xpath positiion order
        var storedParams = augData.getParameters(); //this.getUnrestricted(augData.getParameters()); Otherwise there is a problem with permissions that you cannot solve from the augmenter's side
        var execParams = new win.Object();

        for(var i in storedParams){
	 		execParams[i] = this.getParameterInstance(storedParams[i]).getValue();		
	    }

	    return execParams;
};
AugmentationLayerManager.prototype.createDefaultThumbnail = function(params, doc) { //onAugmenterExecution

		var uFrame = doc.querySelector(params.iframeSelector);
			uDoc = uFrame.contentWindow.document;
	    var	me=this, thumbnail = this.createThumbnail(params, uDoc, uFrame.contentWindow);

    	this.addThumbnailCogButton(thumbnail.lastChild);
	    this.addThumbnailPreviewButton(thumbnail);
	    this.addThumbnailRemoveButton(thumbnail.lastChild);
	    this.sessionManager.setCurrentThumbnail(thumbnail);

	    return thumbnail;
};

AugmentationLayerManager.prototype.execute = function() {

	var winwin = Components.utils.waiveXrays(this.window.BrowserApp.selectedBrowser.contentWindow);
	var winIframe = winwin.document.querySelector("#augmentation-browser").contentWindow;
	
	var video = winIframe.document.createElement("iframe");
		video.setAttribute("width", "100px");
		video.setAttribute("height", "100px");
		video.setAttribute("src", "https://www.youtube.com/embed/XGSy3_Czz8k");

	var container = winIframe.document.querySelector("#section_0");

	container = Components.utils.waiveXrays(container);
	container.appendChild(video);
}
AugmentationLayerManager.prototype.cloneInto = function(waived, ctx) {

	return Components.utils.cloneInto(waived, ctx, {
        cloneFunctions: true
    });
}; 
AugmentationLayerManager.prototype.getParameterInstance = function(paramData) {

	//console.log("paramData", paramData);
	return new this.paramClasses[paramData.className](paramData);
};
AugmentationLayerManager.prototype.waiveXrays = function(waived) {

	return Components.utils.waiveXrays(waived);
};
AugmentationLayerManager.prototype.getAugmenterInstance = function(requiredAugmenter) {

	return new (this.getAugmenterClassByName(requiredAugmenter.className))(); //Components.utils.waiveXrays(params.augmenterInstance);
};
AugmentationLayerManager.prototype.addThumbnailOption = function(iconStyleClass, div, callback){

	var options = Components.utils.waiveXrays(div),
		btnDiv = options.appendChild(options.ownerDocument.createElement("div"));
    	btnDiv.className = 'mowa-augmenter-grouped-option';

    var btn = btnDiv.appendChild(options.ownerDocument.createElement("button"));
    	btn.className = iconStyleClass;
        btn.onclick = Components.utils.waiveXrays(callback);
}
AugmentationLayerManager.prototype.moveAboveSelectedAugmenter = function(){

	var relElem = Components.utils.waiveXrays(this.sessionManager.getLastHighlightedElem());
	var thumb = Components.utils.waiveXrays(this.sessionManager.getCurrentThumbnail());
	if(thumb && thumb.classList.contains("mowa-augmenter-thumbnail-default"))
	thumb.classList.remove("mowa-augmenter-thumbnail-default");
	relElem.parentNode.insertBefore(thumb, relElem);
};
AugmentationLayerManager.prototype.moveAugmenterAbove = function(thumb, relElem){

	relElem.parentNode.insertBefore(thumb, relElem);
}
AugmentationLayerManager.prototype.moveAugmenterBelow = function(thumb, relElem){

	if(relElem.parentNode.lastchild == relElem)
		relElem.parentNode.appendChild(thumb);
	else relElem.parentNode.insertBefore(thumb, relElem.nextSibling);
}
AugmentationLayerManager.prototype.moveBelowSelectedAugmenter = function(){
	try{
		//Remove thumb default CSS class
		var relElem = Components.utils.waiveXrays(this.sessionManager.getLastHighlightedElem());
		var thumb = Components.utils.waiveXrays(this.sessionManager.getCurrentThumbnail());
		if(thumb && thumb.classList.contains("mowa-augmenter-thumbnail-default"))
		thumb.classList.remove("mowa-augmenter-thumbnail-default");
		if(relElem.parentNode.lastchild == relElem)
			relElem.parentNode.appendChild(thumb);
		else relElem.parentNode.insertBefore(thumb, relElem.nextSibling);

	}catch(err){console.log(err.message);}
};
AugmentationLayerManager.prototype.loadPositioningBehaviourIntoDomElements = function(domElems){

	//Loading all DOM elements the ability to move augmenters above/below them
    this.disableDomElementsDefaultBehaviour(domElems);
}
AugmentationLayerManager.prototype.disableDomElementsDefaultBehaviour = function(domElems){

	for (var i = 0; i < domElems.length; i++) {
        domElems[i].onclick = function(e){
        	e.preventDefault(); e.stopImmediatePropagation();
        }
    };
}
AugmentationLayerManager.prototype.highlightElement = function(elem){
	elem = Components.utils.waiveXrays(elem);
	this.sessionManager.setLastHighlightedElem(elem);
	if(!elem.classList.contains("mowa-highlighted-dom-element"))
    	elem.classList.add("mowa-highlighted-dom-element");
}
AugmentationLayerManager.prototype.unhighlightElement = function(elem){

	elem = Components.utils.waiveXrays(elem);
    if(elem && elem.classList.contains("mowa-highlighted-dom-element"))
    	elem.classList.remove("mowa-highlighted-dom-element");
};
AugmentationLayerManager.prototype.getTargetElementFromSelection = function(elem){
	//we should move it to the session manager
	return this.getParentNodeIfElemIsTheThumbnail(elem,
		['mowa-augmenter-thumbnail', 'mowa-augmenter-preview']);
};
AugmentationLayerManager.prototype.enableAugmenterPositioning = function(ownerDocument){

	this.sessionManager.getCurrentThumbnail().style.display = "none";

	//ownerDocument.body.addEventListener("touchmove", this.onThumbDragStart, false);
	ownerDocument.body.addEventListener("touchmove", this.onThumbDragging, false);
	ownerDocument.body.addEventListener("touchend", this.onThumbDropped, false);
}
AugmentationLayerManager.prototype.disableAugmenterPositioning = function(ownerDocument){

	//ownerDocument.body.removeEventListener("touchmove", this.onThumbDragStart, false);
	ownerDocument.body.removeEventListener("touchmove", this.onThumbDragging, false);
	ownerDocument.body.removeEventListener("touchend", this.onThumbDropped, false);
}
AugmentationLayerManager.prototype.setLocaleBundle = function(messages){

	this.locale = messages;
}
AugmentationLayerManager.prototype.getParentNodeIfElemIsTheThumbnail = function (element, thumbClasses) {

	//If the elements has any of the classes
	elem = Components.utils.waiveXrays(element);
	for (var i = thumbClasses.length - 1; i >= 0; i--) {
		if(elem.classList.contains(thumbClasses[i])){
			return elem;
		}
	}

	//if any parent has any of the classes
    var potentialParents = [];
	while(elem.parentNode) {
	    potentialParents.push(elem.parentNode);
	    elem = elem.parentNode;
	}
    if(potentialParents && potentialParents.length > 0){
    	for (var i = 0; i < potentialParents.length; i++) {
    		for (var j = thumbClasses.length - 1; j >= 0; j--) {
	    		if(potentialParents[i].classList && potentialParents[i].classList.contains(thumbClasses[j])){
		        	return potentialParents[i];
		    	}
		    }
    	};
    }

    //Otherwise, the selected element is right
    return element;
};
