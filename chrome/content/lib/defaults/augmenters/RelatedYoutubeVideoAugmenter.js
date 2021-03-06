//::MoWA::
	//@scriptType: MobileWebAugmenter
	//@className: RelatedYoutubeVideoAugmenter
	//@classType: concrete
	//@requiredAugmenters: SingleContainerBasedAugmenter
	//@namespace: mowa
	//@author: lifia
//::MoWA::

function RelatedYoutubeVideoAugmenter(){
    SingleContainerBasedAugmenter.call(this);

    this.onOrientationChange = function(sensedOrientation){
        
        console.log("aug receiving orientation ", sensedOrientation);
        for (var i in this.dc.contextValues) {

        	if(this.dc.contextValues[i].matches(sensedOrientation)){
        		this.enable();
        		console.log("matching");
        		return;
        	}
        }

        console.log("NOT matching");
        this.disable();
		//this.view.getElementsByClassName("mowa-video-at-augmenter")[0].contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
    };
	this.buildExpectedView = function(params){

		var container = this.buildContainer(params.id);
			container.appendChild(this.buildVideoSection(params));
		return container;
	};
	this.checkUserDefinedParameters = function(params){ 

		return (this.areKeywordsDefined(params.dynamicKeywords) || this.areKeywordsDefined(params.fixedKeywords));
	};
	this.areKeywordsDefined = function(keywords){

		return (keywords != undefined && keywords && keywords.length>0);
	};
	this.checkId = function(id){
	    
	    return (id && typeof id === 'string' && id.length>0)? true: false;
	};
	this.checkDomPositioning = function(xpath, position, order){

	    if (xpath && position && order && 
	    	xpath != 'undefined' && position != 'undefined' && order != 'undefined') 
	        return true;

	    return false;
	};
	this.buildVideoSection = function(params){
	  
	    var videoContainer = this.createVideoContainer();
	    var keywords = this.processKeywords(params);

		var message = document.createTextNode("Searching for «" + keywords + "»");
	    var video = this.createVideo();

		videoContainer.appendChild(message);
		videoContainer.appendChild(video);

		this.asyncLoadRecommendedVideoURL(video, message, keywords);

	    return videoContainer;
	};
	this.createVideoContainer = function(){
		var videoContainer = document.createElement("div");
	    	videoContainer.style.color = "#fff";
		    videoContainer.style["background-color"] = "black";
		    videoContainer.style["display"] = "grid";
		    videoContainer.style["align-items"] = "center";
		    videoContainer.style["justify-content"] = "center";
		    videoContainer.style.width = "100%";
		    videoContainer.style.overflow = "hidden";
		return videoContainer;
	}
	this.createVideo = function(){
		var me=this;
		var video = document.createElement("iframe");
	    	video.style.id = "video-" + Date.now();
	    	video.className = "mowa-video-at-augmenter";
		    video.style.height = "94%";
		    video.style.width = "94%";
		    video.setAttribute("height", "94%");
		    video.setAttribute("width", "94%");
		    video.setAttribute("frameborder", 0);
		return video;
	}
	this.asyncLoadRecommendedVideoURL = function(video, message, keywords){

		var query = "https://www.youtube.com/results?sp=EgIQAQ%253D%253D&q=" + keywords + "trailer";
		var xpath = "//a[contains(@href, '/watch')]/@href";

		this.request(query, xpath, function(result){

			var firstVideoId = result.replace("/watch?v=", "");
			video.setAttribute("src", "https://www.youtube.com/embed/" + firstVideoId);
			message.remove();
		});
	};
	this.processKeywords = function(params){
		var keywords ="";
		if(this.areKeywordsDefined(params.dynamicKeywords)) keywords += params.dynamicKeywords + " ";
		if(this.areKeywordsDefined(params.fixedKeywords)) keywords += params.fixedKeywords;
		return keywords;
	};
	this.checkVideoSrc = function(src){
	    
	    return this.dataValidator.validate({
	        data:src, 
	        required: true, 
	        type:"url"
	    }).value;
	};
	this.checkVideoType = function(type){
	    
	    return this.dataValidator.validate({
	        data:type, 
	        required: true, 
	        type:"string"
	    }).value;
	};
	
	this.appendToLocale(this.getProperBundle({ 
		defLanguage: "es",
		bundles: {
			'en':{
				"augmenter.name":"Related video"
			}
		}
	}));
	this.getTitle = function(){
	    return this.getLocalized("augmenter.name");
	};

	///////////////////// HARCODING
    this.setClassType("concrete");
    this.setName(this.getLocalized("augmenter.name"));
    this.setClassName("RelatedYoutubeVideoAugmenter");
	///////////////////// END OF HARCODING
};