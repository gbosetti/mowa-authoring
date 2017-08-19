//Elegir nombres mas "alegres" para los estados...
function StageOne(){
    this.goPrevious = function(){
        appBuilder.navigateToPrevStepFromSensorForm();
    };
    this.setPreviousState = function(){};
    this.goNext = function(){
        MoWA.setProgressPoint("StageTwo");
        appBuilder.loadUriWithApi("digital-counterparts/digital-counterparts.html");
    };
    this.enableSteps = function(){

        var doneElems = document.querySelectorAll("#step1, #step2, #step3");
        for (i in doneElems) doneElems[i].className = "list-group-item done-item";

        var todoElems = document.querySelectorAll("#step4, #step5");
        for (i in todoElems) todoElems[i].className = "list-group-item todo-item";
    };
    this.updateProgressBarValue = function(){
        document.querySelector("#progress-bar").style.width = "30%";
    };
}
function StageTwo(){
    this.goPrevious = function(){
        //this.setPreviousState();
        appBuilder.loadUriWithApi("digital-counterparts/digital-counterparts.html");
    };
    this.setPreviousState = function(){
        MoWA.setProgressPoint("StageOne");
    };
    this.goNext = function(){
        MoWA.setProgressPoint("StageThree");
        appBuilder.loadUriWithApi("augmentations/augmentations.html");
    };
    this.enableSteps = function(){
        var doneElems = document.querySelectorAll("#step1, #step2, #step3, #step4");
        for (i in doneElems) doneElems[i].className = "list-group-item done-item";

        document.querySelector("#step5").className = "list-group-item todo-item";
    };
    this.updateProgressBarValue = function(){
        console.log(document.querySelector("#progress-bar"));
        document.querySelector("#progress-bar").style.width = "60%";
    };
}
function StageThree(){
    this.goPrevious = function(){
        appBuilder.loadUriWithApi("augmentations/augmentations.html");
    };
    this.setPreviousState = function(){
        MoWA.setProgressPoint("StageTwo");
    };
    this.goNext = function(){
        MoWA.setProgressPoint("StageOne");
        appBuilder.manageApplications();
    };
    this.enableSteps = function(){
        var doneElems = document.querySelectorAll("#step1, #step2, #step3, #step4, #step5");
        for (i in doneElems) doneElems[i].className = "list-group-item done-item";

        document.querySelector(".hidden-element").className = "list-group";

        document.querySelector(".next > a > i").className = "fa fa-hand-peace-o";
        console.log(document.querySelector(".next > a > span"));
        document.querySelector(".next > a > span").setAttribute("data-l10n-id", "finish");
        document.querySelector(".next > a > span").value = "Finish";
    };
    this.updateProgressBarValue = function(){
        document.querySelector("#progress-bar").style.width = "100%";
    };
}




function MHAppsBuilder(){}
MHAppsBuilder.prototype.loadOrientationSetup = function(){
    MoWA.loadChromeFileWithApiAccess("sensors/config-orientation.html");
}
MHAppsBuilder.prototype.loadLuxesSetup = function(){
    MoWA.loadChromeFileWithApiAccess("sensors/config-lux.html");
}
MHAppsBuilder.prototype.resizeIframeToForm = function(iframeSelector) {
    this.adaptIBrowserHeight([".navbar", ".pager", ".pager", ".pager", "#url-form-group"], iframeSelector);
}
MHAppsBuilder.prototype.adaptIBrowserHeight = function(uiElementsToSubstract, domId){try{

    var rectsToSubstract = this.getClientRects(uiElementsToSubstract),
        targetElement = document.querySelector(domId),
        accumHeight = this.getAccumulatedHeightFromrects(rectsToSubstract),
        docHeight = $(document).height();

    targetElement.style.height = (docHeight - accumHeight) + "px";

}catch(err){console.log(err.message);};}
MHAppsBuilder.prototype.loadAugmentationSetup = function(){
    MoWA.loadChromeFileWithApiAccess("augmentations/augmentation.html");
}
MHAppsBuilder.prototype.loadDcPropertySetup = function(){
    MoWA.loadChromeFileWithApiAccess("digital-counterparts/dc-property.html");
}
MHAppsBuilder.prototype.loadAugmentationLayerSetup = function(){
    MoWA.loadChromeFileWithApiAccess("augmentations/augmentation-layer.html");
}
MHAppsBuilder.prototype.manageAugmentations = function(){
    MoWA.loadChromeFileWithApiAccess("augmentations/augmentations.html");
}
MHAppsBuilder.prototype.manageApplications = function(){

    MoWA.loadChromeFileWithApiAccess("index.html");
}
MHAppsBuilder.prototype.setCurrentAugmentation = function(aug){

    MoWA.setCurrentAugmentation(aug);
}
MHAppsBuilder.prototype.setCurrentDcId = function(id){

    MoWA.setCurrentDcId(id);
}
MHAppsBuilder.prototype.setCurrentContextValueId = function(id){

    MoWA.setCurrentContextValueId(id);
}
MHAppsBuilder.prototype.setCurrentContextManager = function(id){

    MoWA.setCurrentContextManager(id);
}
MHAppsBuilder.prototype.setCurrentDigitalCounterpartValue = function(prop, value){

    MoWA.setCurrentDigitalCounterpartValue(prop, value);
}
MHAppsBuilder.prototype.loadDigitalCounterpartSetup = function(){

    MoWA.loadChromeFileWithApiAccess("digital-counterparts/digital-counterpart.html");
}
MHAppsBuilder.prototype.saveAppInSessionIntoFile = function(){

    MoWA.saveAppInSessionIntoFile();
}

/* WRAPPERS FOR DOM ELEMENTS */
function TextWrapper(domElem){
    this.elem = domElem;
}
TextWrapper.prototype.setValue = function(value) {

    this.elem.value = value;
};
function CheckboxWrapper(domElem){
    this.elem = domElem;
}
CheckboxWrapper.prototype.setValue = function(value) {

    this.elem.checked = value;
};

function MHAppsViewManager(){
    this.originMarker;
    this.targetMarker;
    this.thumbnails = new Array();
}
MHAppsViewManager.prototype.adjustAugmentationFrame = function(params){

    var adaptedHeight = $(document).height();

    adaptedHeight = (adaptedHeight - 100);
    adaptedHeight = adaptedHeight - 60; /*pour les margins and padding */

    document.getElementById(params.frameId).height = adaptedHeight + 'px';
}
MHAppsViewManager.prototype.moveSelectorToDefaultPosition = function(selector){

    var self = this;
    $(selector).position({
        of: window,
        my: "center center",
        at: "center center",
        collision: 'none'
    });
}
MHAppsViewManager.prototype.isPreviewMode = function(){

    return this.previewMode;
}
MHAppsViewManager.prototype.setPreviewMode = function(value){

    this.previewMode = value;
}
MHAppsViewManager.prototype.loadPositioningDemoElements = function(){

    var xpi = new XPathInterpreter();
    var my_horizontal = xpi.getElementByXPath(".//*[@id='my_horizontal']/span[2]/select", document);
    var my_vertical = xpi.getElementByXPath(".//*[@id='my_vertical']/span[2]/select", document);
    var at_horizontal = xpi.getElementByXPath(".//*[@id='at_horizontal']/span[2]/select", document);
    var at_vertical = xpi.getElementByXPath(".//*[@id='at_vertical']/span[2]/select", document);

    var self = this;
    my_horizontal.onchange = function(){
        self.positionDOMDemoElements(
            my_horizontal.value,
            my_vertical.value,
            at_horizontal.value,
            at_vertical.value);
    };
    my_vertical.onchange = function(){
        self.positionDOMDemoElements(
            my_horizontal.value,
            my_vertical.value,
            at_horizontal.value,
            at_vertical.value);
    };
    at_horizontal.onchange = function(){
        self.positionDOMDemoElements(
            my_horizontal.value,
            my_vertical.value,
            at_horizontal.value,
            at_vertical.value);
    };
    at_vertical.onchange = function(){
        self.positionDOMDemoElements(
            my_horizontal.value,
            my_vertical.value,
            at_horizontal.value,
            at_vertical.value);
    };

    this.positionDOMDemoElements(
        my_horizontal.value,
        my_vertical.value,
        at_horizontal.value,
        at_vertical.value
    );
}
MHAppsViewManager.prototype.setControlsByClassAsReadOnly = function(classname){
    setTimeout(function(){
        var elems = document.getElementsByClassName(classname);
        for (var i = 0; i < elems.length; i++) {
            var cInput = elems[i].getElementsByTagName('input')[0];
            cInput.readOnly = true;
        };
    }, 200);
}
MHAppsViewManager.prototype.setControlAsReadOnly = function(xpath){
    /*  Had to do this cause xforms removes the value even after loading the xforms.
        Avoid using XSLTForms bind elements. They CAUSE ERROR on xsltforms engine reload
    */
    setTimeout(function(){
        var elem = new XPathInterpreter().getElementByXPath(xpath, document);
        if(elem) elem.readOnly = true;
    }, 200);
};
/*MHAppsViewManager.prototype.setControlAsReadOnly = function(xpath){

    setTimeout(function(){
        var result = new XPathInterpreter().getNodeByXPath(xpath, document);
        var oElement = result.iterateNext();
        console.log(result);
        while(oElement) {
            console.log(oElement);
            oElement.readOnly = true;
            oElement = result.iterateNext();
        }
    }, 200);
};  */
MHAppsViewManager.prototype.positionDOMDemoElements = function(my_horizontal, my_vertical, at_horizontal, at_vertical){

    var pos = {
        of: $( "#parent" ),
        my: my_horizontal + " " + my_vertical,
        at: at_horizontal + " " + at_vertical,
        collision: 'none'
    };
    $(".positionable").position(pos);
};
MHAppsViewManager.prototype.getDocumentMaxIndex = function(){

    var elems = document.getElementsByTagName('*');
    var highest = 0;
    for (var i = 0; i < elems .length; i++)
    {
        if (elems[i].style.zIndex > highest) {
            highest = elems[i].style.zIndex;
        }
    }
    return highest;
}
MHAppsViewManager.prototype.getOParams = function(tbnId){

    try{
        var poiId = new XSLTModelManager().getDataNodeValue(
            '/tmp/current-poi/@id', 'tmp', 'mobile-app-model'
        );
        var xmlAugmenter = new XSLTModelManager().getDataNode(
                "/application/main-poi/contained-pois/poi[@id='" + poiId + "']/augmenter-configs/" +
                "augmenter[@id='" + tbnId + "']", "application", "mobile-app-model"
            ),
            storedParams = xmlAugmenter.getElementsByTagName('params')[0];

        if(storedParams && storedParams.children) storedParams = storedParams.children;
        return storedParams;

    }catch(err){console.log(err.message);};
    return;
}
MHAppsViewManager.prototype.showRemoveThumbnailDialog = function(thumbnail, delAugCfg, locale){

    var dlg = new YesNoDialog();
        dlg.setData('title', locale['augmenter.removal']);
        dlg.setData('innerHTML', locale['augmenter.removal.question']);
        dlg.setData('no', locale['no']);
        dlg.setData('yes', locale['yes']);
        dlg.setData('yesCbk', function(){
            delAugCfg(thumbnail.id);
            $(thumbnail).remove();
        });
        dlg.openDialog();
}
MHAppsViewManager.prototype.getThumbnailPosition = function(id, divId){

    var poiId = new XSLTModelManager().getDataNodeValue(
        '/tmp/current-poi/@id', 'tmp', 'mobile-app-model'
    );
    var elemXpath = new XSLTModelManager().getDataNodeValue(
            "/application/main-poi/contained-pois/poi[@id='"+ poiId +"']/augmenter-configs/" +
            "augmenter[@id='" + id + "']/params/param[@id='xpath']/@value",
            "application", "mobile-app-model");
    var elemByXpath = (elemXpath)? new XPathInterpreter().getElementByXPath(elemXpath, document): document.getElementById(divId); //.firstChild sometimes doesn't work
    var myPos = new XSLTModelManager().getDataNodeValue(
            "/application/main-poi/contained-pois/poi[@id='"+ poiId +"']/augmenter-configs/augmenter[" +
            "@id='" + id + "']/params/param[@id='my_horizontal']/@value", "application", "mobile-app-model") + " " +
        new XSLTModelManager().getDataNodeValue(
            "/application/main-poi/contained-pois/poi[@id='"+ poiId +"']/augmenter-configs/augmenter[" +
            "@id='" + id + "']/params/param[@id='my_vertical']/@value", "application", "mobile-app-model");

    var atPos = new XSLTModelManager().getDataNodeValue(
                "/application/main-poi/contained-pois/poi[@id='"+ poiId +"']/augmenter-configs/augmenter[" +
                "@id='" + id + "']/params/param[@id='at_horizontal']/@value", "application", "mobile-app-model") + " " +
            new XSLTModelManager().getDataNodeValue(
                "/application/main-poi/contained-pois/poi[@id='"+ poiId +"']/augmenter-configs/augmenter[" +
                "@id='" + id + "']/params/param[@id='at_vertical']/@value", "application", "mobile-app-model");

    var position;
    if(myPos && myPos.trim().length>0 && atPos && atPos.trim().length>0){
        return {
            of: elemByXpath,
            my: myPos,
            at: atPos,
            collision: 'none'
        }
    }
    else{ //Default thumbnail position. Now, this should not be used, but still here just for caution

        position = this.getDefaultDomPosition();
        var my = position.my.split(" ");
        var at = position.at.split(" ");

        new XSLTModelManager().changeDataNodeValue(
            "/application/main-poi/contained-pois/poi[@id='"+ poiId +"']/augmenter-configs/" +
            "augmenter[@id='" + id + "']/params/param[@id='xpath']/@value",
            my[0], 'application', 'mobile-app-model'
        );
        new XSLTModelManager().changeDataNodeValue(
            "/application/main-poi/contained-pois/poi[@id='"+ poiId +"']/augmenter-configs/" +
            "augmenter[@id='" + id + "']/params/param[@id='xpath']/@value",
            my[1], 'application', 'mobile-app-model'
        );
        new XSLTModelManager().changeDataNodeValue(
            "/application/main-poi/contained-pois/poi[@id='"+ poiId +"']/augmenter-configs/" +
            "augmenter[@id='" + id + "']/params/param[@id='xpath']/@value",
            at[0], 'application', 'mobile-app-model'
        );
        new XSLTModelManager().changeDataNodeValue(
            "/application/main-poi/contained-pois/poi[@id='"+ poiId +"']/augmenter-configs/" +
            "augmenter[@id='" + id + "']/params/param[@id='xpath']/@value",
            at[1], 'application', 'mobile-app-model'
        );

        return position;
    }
}
MHAppsViewManager.prototype.getDefaultDomPosition = function(){

    return {
        of: window,
        my: "center top",
        at: "center center",
        collision: 'none'
    };
}
MHAppsViewManager.prototype.saveCentralPoint = function(lat, lon){
    //TODO: this should be done by dataManager

    var xm = new XSLTModelManager();
    xm.changeDataNodeValue(
        "/application/main-poi/space-representation/params/param[@id='centerLat']/@value",
        lat, 'application', 'mobile-app-model'
    );
    xm.changeDataNodeValue(
        "/application/main-poi/space-representation/params/param[@id='centerLon']/@value",
        lon, 'application', 'mobile-app-model'
    );
}
MHAppsViewManager.prototype.createMarkerInMap = function(params){

    var marker = params.spaceRep.createMarker(params.id, params.lat, params.lng);
    var vManager = this;
    var poiName = new XSLTModelManager().getDataNodeValue(
        '/application/main-poi/contained-pois/poi[@id="' +
        marker.markerId + '"]/@name', 'application', 'mobile-app-model'
    );
    this.saveCentralPoint(params.lat, params.lng);
    marker.bindPopup(poiName, {offset: new L.Point(0, -40)})

    $(marker).on("click", function(evt) {

        //if(navigator.vibrate) navigator.vibrate(25);
        var mkr = evt.originalEvent.target;
        vManager.saveCentralPoint(mkr._latlng.lat, mkr._latlng.lng);
        new XSLTModelManager().changeDataNodeValue(
            '/tmp/current-poi/@id', mkr.markerId, 'tmp', 'mobile-app-model'
        );
        mkr.openPopup();
    });
    $(marker).on("contextmenu", function(evt) {

        if(navigator.vibrate) navigator.vibrate(25);
        var mkr = evt.originalEvent.target;
        new XSLTModelManager().changeDataNodeValue(
            '/tmp/current-poi/@id', mkr.markerId, 'tmp', 'mobile-app-model'
        );
        vManager.saveCentralPoint(mkr._latlng.lat, mkr._latlng.lng);

        var dlg = new OptionsDialog();
        dlg.setData('title', params.locale['poi.edition.options']+ ": " + mkr._popup.getContent());
        dlg.createListGroup(params.locale['poi.extra.property.content']);

        dlg.createListItem(params.locale['poi.data'], function(){
            params.logPoiDataAccess(mkr.markerId);
            MoWA.loadSubform('MHPoiData.xml', 'subform');
        });
        dlg.createListItem(params.locale['poi.configure.augmenter'], function(){

            var urlToAdapt = new XSLTModelManager().getDataNode(
                '/application/main-poi/contained-pois/poi[@id="' +
                mkr.markerId + '"]', 'application', 'mobile-app-model'
            ).getAttribute('urlToAdapt');

            if(!urlToAdapt || urlToAdapt == '') {
                params.logCantManageAugmentation(mkr.markerId);
                MoWA.loadSubform('MHPoiData.xml', 'subform');
                console.log(params.locale['augmenter.undefined.url']);
            }
            else {
                params.logManageAugmentation(mkr.markerId);
                MoWA.loadSubform('ManageAugmentationLayers.xml', 'subform');
            }
        });

        var markers = params.spaceRep.getMarkers();
        if(markers.length > 1){
            dlg.createListItem(params.locale['poi.copy.augmenters'], function(){
                var copyAugmentersDlg = new OptionsDialog();
                copyAugmentersDlg.setData('title', params.locale['poi.copy.augmenters.title']);

                for (var i = 0; i < params.pois.length; i++) {
                    if(params.pois[i].getAttribute('id') != marker.markerId){

                        var tmpId = params.pois[i].getAttribute('id');
                        copyAugmentersDlg.createListItem(
                            params.locale['poi'] + ": " + params.pois[i].getAttribute('name'),
                            function(evt){
                                //'this' is window
                                params.copyAugmenters(evt.target.id, mkr.markerId);
                                params.logCopiedAugmenters(evt.target.id, mkr.markerId);
                                setTimeout(function(){
                                    console.log(params.locale['augmenters.sucesfully.copied']);
                                }, 1000);
                            },
                            params.pois[i].getAttribute('id')
                        );
                    }
                };
                copyAugmentersDlg.openDialog();
            });
        }
        dlg.createListItem(params.locale['poi.remove'], function(e){
            try{
                if(confirm(params.locale['poi.delete.msg'])){

                    mkr.removeOriginConnectors(); //removing the origin conector
                    mkr.clearConnectors();
                    params.logRemovedPoi(mkr.markerId);
                    new XSLTModelManager().removeNode(
                         '/application/main-poi/contained-pois/poi[@id="' + mkr.markerId + '"]',
                         'application', 'mobile-app-model'
                    ); //Remove POI from model
                    new XSLTModelManager().removeNode(
                        '/application/main-poi/space-representation/markers/marker[@relatedPoiId="' +
                         mkr.markerId + '"]', 'application', 'mobile-app-model'
                    ); //Remove marker from model
                    params.spaceRep.removeMarker(mkr.markerId); //Remove marker from DOM

                    new XSLTModelManager().changeDataNodeValue(
                    '/tmp/current-poi/@id', '', 'tmp', 'mobile-app-model'); //Remove curr poi id
                }
            }catch(err){console.log(err.message)}
        });

        dlg.createListGroup(params.locale['physical.navigation.order']);
        dlg.createListItem(params.locale['pois.connection.origin'], function(e){
            vManager.setMarkerAsOrigin(mkr, params.spaceRep);
            vManager.connectPois(params.spaceRep, params.saveWLDataCbk, params.locale, params.logBlockedPoiConnection, params.logPoiConnectionMade);
            params.logPoiAsOrigin(mkr.markerId);
        });
        dlg.createListItem(params.locale['pois.connection.target'], function(e){
            vManager.setMarkerAsTarget(mkr, params.spaceRep);
            vManager.connectPois(params.spaceRep, params.saveWLDataCbk, params.locale, params.logBlockedPoiConnection, params.logPoiConnectionMade);
            params.logPoiAsTarget(mkr.markerId);
        });
        //Has wl?? then
        dlg.createListItem(params.locale['pois.connection.clear'], function(e){

                params.removeWalkingLinks(mkr.markerId);
                mkr.clearConnectors();
                params.logPoiConnectionsCleared(mkr.markerId);
        });

        dlg.openDialog();

    });
    $(marker).on("dragend", function(evt) {
        params.onMkrPosChange(evt.originalEvent.target.markerId,
            "lat", evt.originalEvent.target._latlng.lat);
        params.onMkrPosChange(evt.originalEvent.target.markerId,
            "lng", evt.originalEvent.target._latlng.lng);
        params.logChangedPoiPosition(
            evt.originalEvent.target.markerId,
            evt.originalEvent.target._latlng.lat,
            evt.originalEvent.target._latlng.lng
        );
        evt.originalEvent.target.openPopup();
    });

    return marker;
}
MHAppsViewManager.prototype.setMarkerAsOrigin = function(marker, spaceRep){

    //Unhighlight the previous one
    if(this.originMarker && this.originMarker != marker)
        spaceRep.unhighlightMarker(this.originMarker);

    this.originMarker = marker;
    spaceRep.highlightMarker(this.originMarker);
}
MHAppsViewManager.prototype.setMarkerAsTarget = function(marker, spaceRep){

    //Unhighlight the previous one
    if(this.targetMarker && this.targetMarker != undefined && this.targetMarker != marker)
        spaceRep.unhighlightMarker(this.targetMarker);

    this.targetMarker = marker;
    spaceRep.highlightMarker(this.targetMarker);
}
MHAppsViewManager.prototype.hasTargetMarker = function(){

    return (this.targetMarker != null && this.targetMarker !== undefined)? true: false;
}
MHAppsViewManager.prototype.hasOriginMarker = function(){

    return (this.originMarker != null && this.originMarker !== undefined)? true: false;
}
MHAppsViewManager.prototype.clearOriginAndTarget = function(){

    this.originMarker = undefined;
    this.targetMarker = undefined;
}
MHAppsViewManager.prototype.connectPois = function(spaceRep, saveDataCbk, locale, logBlockedPoiConnection, logPoiConnectionMade){

    if(this.originMarker && this.originMarker == this.targetMarker){
        console.log(locale['pois.connection.error.samepoi']);
        logBlockedPoiConnection(this.originMarker.markerId)
        return;
    }

    if(this.hasTargetMarker() && this.hasOriginMarker()){

        var dlg = new YesNoDialog();
        dlg.setData('yes', locale['yes']);
        dlg.setData('no', locale['no']);
        dlg.setData('title', locale['pois.connection.title']);
        dlg.setData('innerHTML', locale['pois.connection.question']);
        var vManager = this;
        dlg.setData('yesCbk', function(){

            spaceRep.connectMarkers(vManager.originMarker, vManager.targetMarker);
            spaceRep.unhighlightMarker(vManager.originMarker);
            spaceRep.unhighlightMarker(vManager.targetMarker);
            saveDataCbk(vManager.originMarker.markerId, vManager.targetMarker.markerId);
            logPoiConnectionMade(vManager.originMarker.markerId, vManager.targetMarker.markerId);

            vManager.clearOriginAndTarget();
        });
        dlg.openDialog();
    }
}
MHAppsViewManager.prototype.loadWebContent = function(url, divId){

    MoWA.loadSubform(url, divId);
}
MHAppsViewManager.prototype.selectBrowsingBarText = function(id){

    var text_input = new XPathInterpreter().getElementByXPath(
        "//*[@id='" + id + "']/span/input", document); //document.getElementById(id);
    text_input.focus();
    text_input.select();
}


function Localizator(){
    this.locale;
    this.loadLocalizedBundle();
}
Localizator.prototype.loadLocalizedBundle = function(){

    var bundleContent = this.getLanguageBundle(this.getBaseLang());
    if(!bundleContent) bundleContent = this.getDefaultLanguageBundle();
    this.locale = JSON.parse(bundleContent);
}
Localizator.prototype.getDefaultLanguageBundle = function(){

    return this.getLanguageBundle('en');
}
Localizator.prototype.getLanguageBundle = function(lang){
    return MoWA.retrieveRelativeFile('locale/' + lang + '/bundle.json', false);
}
Localizator.prototype.getBaseLang = function(){

    var baseLang = (window.navigator.userLanguage)? window.navigator.userLanguage: window.navigator.language;
    return baseLang.substring(0,2).toLowerCase();
}
Localizator.prototype.loadFromLocale = function(domElemXpath, locStrId){

    var elem = new XPathInterpreter().getElementByXPath(domElemXpath, document);
    if(elem) elem.innerHTML = this.locale[locStrId];
}
Localizator.prototype.localize = function(){

    var elements = new XPathInterpreter().getElementsByXPath('//*[@data-l10n-id]', document);

    for (var i = elements.length - 1; i >= 0; i--) {
        if(elements[i].getAttribute("data-l10n-id").trim() != "")
            elements[i].innerHTML = this.locale[elements[i].getAttribute("data-l10n-id")];
    }
}

function LoadingControlsDataStrategy(){}
LoadingControlsDataStrategy.prototype.loadControlsData = function(){}

MHAppsBuilder.prototype.initialize = function(loadingDataStrategy) {

    this.stageState = new window[MoWA.getProgressPoint()]();
    this.localizator = new Localizator();
    this.localize();

    this.loadingDataStrategy = loadingDataStrategy || new LoadingControlsDataStrategy();
    this.loadingDataStrategy.loadControlsData();

    this.viewManager = new MHAppsViewManager();
    this.currentFieldValue;
};
MHAppsBuilder.prototype.loadPoiDataAccordingToLocMethod = function(){
    MoWA.loadSubform(
        "MHPoiDataFor" + this.dataManager.getCurrentLocationClass() + ".xml", "subform"
    );
}
MHAppsBuilder.prototype.startBuildingProcess = function(callback){

    //Wait for MoWA API to be loaded
    var showFirstStep = setTimeout(function(){
        if(MoWA){
            callback();
        }
    }, 1500);
}
MHAppsBuilder.prototype.createCheckbox = function(itemId, cssClass, displayName, data, parentId, dataModelPath, onCheck, onUncheck){

    var ul = document.getElementById(parentId);
    var li = this.createItemForCkecking(
        itemId, //not the css
        displayName,
        data,
        dataModelPath,
        function(){

            if(this.checked && onCheck)
                onCheck(this);
            else if(onUncheck) onUncheck(this);
        },
        cssClass
    );
    ul.appendChild(li);
}
MHAppsBuilder.prototype.createContextValueForChecking = function(itemId, displayName, data, parentId){

    var aug = MoWA.getCurrentAugmentation();
    var ctp = aug.getFirstDigitalCounterpart();
    var ctpId = (ctp)? ctp.id: "";

    this.createCheckbox(itemId, "cvs", displayName, data, parentId,
        "application.digitalCounterparts." + ctpId + ".contextValues." + itemId + ".checked",
        function(elem){
            MoWA.addContextValueToTheCurrentDC({id: elem.spec.id, checked: elem.checked});
        },
        function(elem){
            MoWA.removeContextValueFromTheCurrentDC(elem.spec);
        }
    );
}
MHAppsBuilder.prototype.createDigitalCounterpartForChecking = function(itemId, displayName, data, parentId, checked){
    
    data.checked = checked;
    this.createCheckbox(itemId, "dcs", displayName, data, parentId,
        undefined,
        function(elem){
            MoWA.addDCToTheCurrentAugmentation({
                id: elem.spec.id,
                name: elem.spec.name,
                checked: elem.checked
            });
        },
        function(elem){
            MoWA.removeDCToTheCurrentAugmentation(elem.spec);
        }
    );
}
MHAppsBuilder.prototype.loadAvailableSpaceReps = function(){

    var mowaSpacesData = MoWA.getConcreteSpaceRepsData();
    var select = document.getElementById("contextTypeRepresentation");

    if( mowaSpacesData && mowaSpacesData.length > 0){
        for (var i=0; mowaSpacesData.length>i; i++) {
            var opt = document.createElement('option');
                opt.value = mowaSpacesData[i].className;
                opt.innerHTML = mowaSpacesData[i].displayName;
            select.appendChild(opt);
        }
    }
}
MHAppsBuilder.prototype.loadSelectedSensorsConfigs = function(){

    var filename = MoWA.getNextSensorCogForm();
    MoWA.loadChromeFileWithApiAccess(filename); //qr-based-location-sensor.html
}
MHAppsBuilder.prototype.getLoggedData = function(){

    var logsBlock =
        '<authoring-tool-logs>' +
            MoWA.getLoggedData() +
        '</authoring-tool-logs>';

    //if(plainEntries) logs = new DOMParser().parseFromString(plainEntries, "text/xml");
    //.getElementsByTagName("application")[0];
    return logsBlock;
}
MHAppsBuilder.prototype.logUserAction = function(action){
    this.logAction(action, "User");
}
MHAppsBuilder.prototype.getClientRects = function(elemsIds){

    var clientRects = [];
    for (var i = elemsIds.length - 1; i >= 0; i--) {
        clientRects.push(document.querySelector(elemsIds[i]).getClientRects()[0]);
    }
    return clientRects;
}
MHAppsBuilder.prototype.getAccumulatedHeightFromrects = function(rects){
    var accum = 0;
    for (var i = rects.length - 1; i >= 0; i--) {
        accum += rects[i].height;
    }
    return accum;
}
MHAppsBuilder.prototype.logSystemAction = function(action){
    //this.logAction(action, "System");
}
MHAppsBuilder.prototype.logAction = function(action, originator){
    try{
        var xmlAction = document.createElement('action');
            xmlAction.setAttribute("datetime", Date());
            xmlAction.setAttribute("description", action);
            xmlAction.setAttribute("originator", originator);
        var sourceCode = new XMLSerializer().serializeToString(xmlAction);
        if(sourceCode){
            //MoWA.logAction(sourceCode);
        }
        return true;
    }catch(err){console.log('Logging error: ' + err.message);}
}
MHAppsBuilder.prototype.createUserDefValueBox = function(className){
    var cont = document.createElement("li");
        cont.className = className;
    return cont;
}
MHAppsBuilder.prototype.getConcatenatedObjectProp = function(prop, collection){
    var concatDCs = "";
    for(var elem in collection){
        concatDCs = collection[elem][prop] + ", " + concatDCs;
    }
    return concatDCs.substring(0, concatDCs.length - 2);
};
MHAppsBuilder.prototype.createUserDefBoxControls = function(onClick){
    var remove = document.createElement("span");
        remove.className = "badge";
        remove.style.padding = "5px 10px";
        remove.style.background = "lightgray";
        remove.onclick = onClick;

        removeLabel = document.createElement("span");
        removeLabel.className = "glyphicon glyphicon-remove";
        remove.appendChild(removeLabel);

    return remove;
}
MHAppsBuilder.prototype.append = function(elem, at){
    document.querySelector(at).appendChild(elem);
}
MHAppsBuilder.prototype.createUserDefValueItem = function(value){
    var elem = document.createElement("p");
        elem.innerHTML = value;
        elem.className = "list-group-item-text";
    return elem;
}
MHAppsBuilder.prototype.createUserDefValueTitle = function(value){
    var elem = document.createElement("h4");
        elem.innerHTML = value;
        elem.className = "list-group-item-heading";
    return elem;
}
MHAppsBuilder.prototype.createNoItemBox = function(message){
    var item = document.createElement("div");
        item.className = "alert alert-warning";
    var infoSpan = document.createElement("span");
        infoSpan.className = "glyphicon glyphicon-exclamation-sign";

        item.innerHTML = infoSpan.innerHTML + " " + message;
    return item;
}
MHAppsBuilder.prototype.getCurrentUrl = function(){

    var urlToAdapt, currId = new XSLTModelManager().getDataNodeValue(
        '/tmp/current-poi/@id', 'tmp', 'mobile-app-model'
    );
    if(currId){
        urlToAdapt = new XSLTModelManager().getDataNodeValue(
            '/application/main-poi/contained-pois/poi[@id="' + currId + '"]/@urlToAdapt',
            'application', 'mobile-app-model'
        );
    }
    return urlToAdapt;
}
MHAppsBuilder.prototype.closeAuthoringTool = function(){
    MoWA.closeAuthoringTool();
}
MHAppsBuilder.prototype.createSensorForChecking = function(data){

    var ul = document.getElementById("availableSensors");
    var li = this.createItemForCkecking(
        data.className,
        data.displayName,
        data,
        data.checked,
        function(evt){
            this.spec.checked = this.checked;
            if(this.checked)
                MoWA.addSensorSpec(this.spec);
            else MoWA.removeSensorSpec(this.spec);
        }
    );
    ul.appendChild(li);
}
MHAppsBuilder.prototype.createItemForCkecking = function(className, displayName, spec, checked, onChange, cssClass){

    var li = document.createElement("li");
        li.className = (cssClass)? "list-group-item " + cssClass: "list-group-item";
        li.appendChild(document.createTextNode(displayName));
        li.onclick = function(evt){

            evt.stopImmediatePropagation(); evt.preventDefault();

            var domElem = this.getElementsByTagName("input")[0];
                domElem.checked = !domElem.checked;
                domElem.onchange();
        }

    var swtch = document.createElement("div");
        swtch.className = "material-switch pull-right";

    var input = document.createElement("input");
        input.id= className;
        input.setAttribute("name", className);
        input.setAttribute("type", "checkbox");
        input.checked = spec.checked;
        input.spec = spec;
        input.onchange = onChange;

        swtch.appendChild(input);
    var label = document.createElement("label");
        label.className = "label-success";
        label.setAttribute("for", className);
        swtch.appendChild(label);

    li.appendChild(swtch);
    return li;
}
MHAppsBuilder.prototype.manageDigitalCounterparts = function(){

    this.loadUriWithApi("digital-counterparts/digital-counterparts.html");
}
MHAppsBuilder.prototype.autocompleteAppName = function(){

    this.dataManager.autocompleteAppName(this.getLocalString('no.named.app') + ' (' + Date.now() + ')');
}
MHAppsBuilder.prototype.loadAugmentationWebpageTarget = function(divId){

    var dManager = this.dataManager;
    this.viewManager.loadWebContent(
        dManager.getCurrentPoi().getAttribute('urlToAdapt'),
        divId
    );
}
MHAppsBuilder.prototype.executeAugmenters = function(divId){

    var dManager = this.dataManager;
    this.viewManager.loadWebContent(
        dManager.getCurrentPoi().getAttribute('urlToAdapt'),
        divId
    );
}
MHAppsBuilder.prototype.drawImageFromVideo = function(video){

    var canvas = document.createElement('canvas');
    var nheight = video.videoHeight;
    var nwidth = video.videoWidth;

    if(nwidth*nheight>this.maxImgSize)
    {
        var ir = nwidth/nheight;
        nheight = Math.sqrt(this.maxImgSize/ir);
        nwidth = ir*nheight;
    }

    canvas.width = nwidth;
    canvas.height = nheight;

    var context = canvas.getContext('2d');
    context.clearRect(0, 0, nwidth, nheight);
    context.drawImage(video, 0, 0, nwidth, nheight);

    return canvas;
}
MHAppsBuilder.prototype.scrollTop = function(){

    /*  For some -unknown- reason, some subforms doesn't load and move to
        the top of the webpage, even if you trigger a window.scrollTo(0,0).
        I think the reason is related to that mobile "text edition menu"
        that can't be shown in mobile
    */
    var scrollToTop = setTimeout(function(){
        document.body.click();
        window.scrollTo(0,0);
    }, 200);
}
MHAppsBuilder.prototype.toggleDescription = function(){

    $('.help').toggle(500);

    var div = $(".help")[0];
    if (!div.shown || div.shown == false) {
        div.shown = true;
    }else{
        div.shown = false;
    }
}
MHAppsBuilder.prototype.exportAppDefinition = function(){

    var results = document.createElement('mowa-experiment-results');
        results.appendChild(this.getMobileDeviceSpec());
        results.appendChild(this.dataManager.getAppDefinition());

    var logs = this.getLoggedData();
        var xlogs = new DOMParser().parseFromString(logs, "application/xml");
        if(xlogs && xlogs.activeElement)
            results.appendChild(xlogs.activeElement);

    var content = new XMLSerializer().serializeToString(results);
    this.postToServer({
        url: "http://www.devel-open.org/upload_x_result.php",
        filename: MoWA.getAppData("filename"),
        content: content
    });
}
MHAppsBuilder.prototype.getMobileDeviceSpec = function() {

    var spec = document.createElement('mobile-device');
        spec.setAttribute('userAgent', this.getNavigatorUserAgent());
        spec.setAttribute('navigatorLanguage', this.getNavigatorLanguage());
    return spec;
}
MHAppsBuilder.prototype.getNavigatorUserAgent = function() {

    return (window.navigator && window.navigator.userAgent)? window.navigator.userAgent: '';
};
MHAppsBuilder.prototype.getNavigatorLanguage = function() {

    return (window.navigator.userLanguage)? window.navigator.userLanguage: window.navigator.language;
};
MHAppsBuilder.prototype.navigateToPrevStepFromSensorForm = function(){

    var prevSensorUrl = MoWA.getPrevSensorCogForm();
    if(!prevSensorUrl) prevSensorUrl = "sensors-selection.html";

    MoWA.loadChromeFileWithApiAccess(prevSensorUrl);
}
MHAppsBuilder.prototype.navigateToNextStepFromSensorForm = function(){

    var nextSensorUrl = MoWA.getNextSensorCogForm();
    if(!nextSensorUrl) nextSensorUrl = "progress-point.html"; //"digital-counterparts/digital-counterparts.html";

    MoWA.loadChromeFileWithApiAccess(nextSensorUrl);
}
MHAppsBuilder.prototype.goBackAStage = function(params) {

    this.stageState.setPreviousState();
}
MHAppsBuilder.prototype.postToServer = function(params) {
    try{
        //Loading effect
        var ldn = document.body.appendChild(document.createElement('div'));
            ldn.className='loading';

        //Request
        var request = new XMLHttpRequest();
            request.open("POST", params.url);

        var formData = new FormData();
            formData.append("code", "mowa.upload.x.result");
            formData.append("filename_in_tool", params.filename);
            formData.append("content", params.content);

        var aBuilder = this;
        request.onreadystatechange = function() {
            if(request.readyState == 4){
                if(request.status == 200) {
                    //console.log(aBuilder.getLocalString('sucessfully.saved.in.server'));
                    MoWA.closeAuthoringTool();
                }
                else {
                    MoWA.downloadAppDefinition(params.content, params.filename);
                    //console.log(aBuilder.getLocalString('error.saving.in.server'));
                    MoWA.closeAuthoringTool();
                }
            }
        }
        request.send(formData);
    }catch(err){
        MoWA.downloadAppDefinition(params.content, params.filename);
        console.log(this.getLocalString('error.saving.in.server'));
        MoWA.closeAuthoringTool();
    }
}
MHAppsBuilder.prototype.checkSRRequiredParams = function(){

    var spaceRep = new window[this.dataManager.getSelectedSRClassName()];//var spaceRep = MoWA.getSpaceForAuthoring(
    var params = this.dataManager.getDefaultSRParameters();
    return (spaceRep.checkRequiredConfiguration(params))? true:false;
}
MHAppsBuilder.prototype.createNewMarker = function(id, lat, lng, spaceRep){

    var newMarker = this.dataManager.createNewMarker();
    this.dataManager.saveInitMarkerData(newMarker, id, lat, lng);
    this.dataManager.getMarkers().appendChild(newMarker);

    var pois = this.dataManager.getPois();
    if(pois && pois.hasChildNodes) pois = pois.children;

    var builder = this;
    this.viewManager.createMarkerInMap({
        spaceRep:spaceRep, id: id, lat:lat, lng:lng, pois:pois,
        saveWLDataCbk: builder.dataManager.saveWLinkInDataModel,
        onMkrPosChange: builder.dataManager.changeMarkerCoordinate,
        copyAugmenters: function(oId,tId) {builder.dataManager.copyAugmenters(oId,tId)},
        locale: builder.localizator.locale,
        removeWalkingLinks: function(id) {builder.dataManager.removeWalkingLinks(id); },
        logPoiAsOrigin: function(id){ builder.logUserAction('User has selected POI «' + id + '» as origin'); },
        logPoiAsTarget: function(id){ builder.logUserAction('User has selected POI «' + id + '» as target'); },
        logPoiConnectionsCleared: function(id){ builder.logUserAction('User has cleared the POI «' + id + '» connections'); },
        logPoiConnectionMade: function(oId, tId){ builder.logUserAction('User has connected the origin POI «' +
            oId + '» with the target POI «' + tId + '»'); },
        logBlockedPoiConnection: function(id){ builder.logUserAction('User tryed to connect the same POI ' +
            '«' + id + "» as origin and target. Connection wasn't made"); },
        logPoiDataAccess: function(id){ builder.logUserAction('User has requested to configure the POI «' + id + '». Loading file: MHPoiData.xml'); },
        logManageAugmentation: function(id){ builder.logUserAction('User has requested to configure the POI «' + id + '» augmenters. Loading file: ManageAugmentationLayers.xml'); },
        logCantManageAugmentation: function(id){ builder.logUserAction('User has requested to configure the POI «' + id + '» augmenters, but there is no augmentation URL defined yet. Loading file: MHPoiData.xml'); },
        logCopiedAugmenters: function(oId, tId){ builder.logUserAction('User has copied augmenters from POI «' +
            oId + '» to POI «' + tId + '»'); },
        logRemovedPoi: function(id){ builder.logUserAction('User has removed POI «' + id + '»'); },
        logChangedPoiPosition: function(id){ builder.logUserAction('User has changed the marker position of POI «' + id + '»'); }
    });
}
MHAppsBuilder.prototype.hackLeafletElements = function(id){

    var xp = new XPathInterpreter();
    var attribution = xp.getElementByXPath(
        ".//*[@id='" + id + "']/div[2]/div[4]/div/a", document);
        attribution.onclick = function(e){
            e.preventDefault();
        }
}
MHAppsBuilder.prototype.loadExistingMarkers = function(spaceRep){

    var xmlMarkers = this.dataManager.getMarkers();
    if(xmlMarkers && xmlMarkers.children)
        xmlMarkers = xmlMarkers.children;

    this.createMarkersForExistingPois(spaceRep, xmlMarkers);
    this.connectExistingMarkers(spaceRep, xmlMarkers);
}
MHAppsBuilder.prototype.createMarkersForExistingPois = function(spaceRep, xmlMarkers){

    for (var i = 0; i < xmlMarkers.length; i++) {

        var params = {}, locParams = xmlMarkers[i].getElementsByTagName("digital-location")[0].children;
        for (var j = 0; j < locParams.length; j++) {
            params[locParams[j].getAttribute('id')] = locParams[j].getAttribute('value');
        };

        var builder = this, pois = this.dataManager.getPois();
        if(pois && pois.hasChildNodes) pois = pois.children;

        this.viewManager.createMarkerInMap({
            spaceRep:spaceRep,
            id:xmlMarkers[i].getAttribute('relatedPoiId'),
            lat: params.lat, lng: params.lng, pois:pois,
            saveWLDataCbk: builder.dataManager.saveWLinkInDataModel,
            onMkrPosChange: builder.dataManager.changeMarkerCoordinate,
            copyAugmenters: function(oId,tId) {builder.dataManager.copyAugmenters(oId,tId)},
            locale: builder.localizator.locale,
            removeWalkingLinks: function(id) { builder.dataManager.removeWalkingLinks(id); },
            logPoiAsOrigin: function(id){ builder.logUserAction('User has selected POI «' + id + '» as origin'); },
            logPoiAsTarget: function(id){ builder.logUserAction('User has selected POI «' + id + '» as target'); },
            logPoiConnectionsCleared: function(id){ builder.logUserAction('User has cleared the POI «' + id + '» connections'); },
            logPoiConnectionMade: function(oId, tId){ builder.logUserAction('User has connected the origin POI «' +
                oId + '» with the target POI «' + tId + '»'); },
            logBlockedPoiConnection: function(id){ builder.logUserAction('User tryed to connect the same POI ' +
                '«' + id + "» as origin and target. Connection wasn't made"); },
            logPoiDataAccess: function(id){ builder.logUserAction('User has requested to configure the POI «' + id + '». Loading file: MHPoiData.xml'); },
            logManageAugmentation: function(id){ builder.logUserAction('User has requested to configure the POI «' + id + '» augmenters. Loading file: ManageAugmentationLayers.xml'); },
            logCantManageAugmentation: function(id){ builder.logUserAction('User has requested to configure the POI «' + id + '» augmenters, but there is no augmentation URL defined yet. Loading file: MHPoiData.xml'); },
            logCopiedAugmenters: function(oId, tId){ builder.logUserAction('User has copied augmenters from POI «' +
                oId + '» to POI «' + tId + '»'); },
            logRemovedPoi: function(id){ builder.logUserAction('User has removed POI «' + id + '»'); },
            logChangedPoiPosition: function(id){ builder.logUserAction('User has changed the marker position of POI «' + id + '»'); }
        });
    };
}
MHAppsBuilder.prototype.connectExistingMarkers = function(spaceRep, xmlMarkers){

    for (var i = 0; i < xmlMarkers.length; i++) {
        var currentMarkerId = xmlMarkers[i].getAttribute('relatedPoiId');
        var wLinks = this.dataManager.getWalkingLinks(currentMarkerId);
        if(wLinks && wLinks.children) {
            wLinks = wLinks.children;
            for (var j = 0; j < wLinks.length; j++) {
                var oMrk = spaceRep.getMarker(currentMarkerId);
                var tMrk = spaceRep.getMarker(wLinks[j].getAttribute("poiId"));
                spaceRep.connectMarkers(oMrk, tMrk);
            };
        }
    };
}
//Artifacts Management.
/* TODO: this section for a 'super manager'...
    but be careful, it is neccesary to ensure that required libs are loaded (e.g.
    Carousel is used 'externally' by MHAppsBuilder but not always available at
    AuthiringManager level
*/
MHAppsBuilder.prototype.loadMowaArtifacts = function(divId){

    var artifacts = MoWA.getBuildingArtifacts();
    var container = document.getElementById(divId);
    var dManager = this.dataManager;

    for (var i = 0; i < artifacts.length; i++) {

        var a = document.createElement('a');
            a.innerHTML = '<i class="fa fa-caret-right"></i> ' + artifacts[i].name;
            a.href="#";
            a.className='list-group-item';
            a.filename = artifacts[i].filename;
            a.onclick = function(event){
                //MoWA.loadSubform(this.filename, 'subform');
                event.preventDefault();
            }
        container.appendChild(a);
    };
};
MHAppsBuilder.prototype.getLocalString = function(id){
    //TODO: change all appBuilder.localizator.locale references in all authoring files with getLocalString
    return this.localizator.locale[id];
}
MHAppsBuilder.prototype.localize = function(url, divId){

    this.localizator.localize();
}

MHAppsBuilder.prototype.getDocumentHeight = function(){

    var body = document.body,
        html = document.documentElement;

    var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
    return height;
}
MHAppsBuilder.prototype.enableLoadingEffect = function(divId){

    var loadingEffect = document.createElement("div");
        loadingEffect.className = "loading";
    document.body.appendChild(loadingEffect);
}
MHAppsBuilder.prototype.disableLoadingEffect = function(divId){

    var loading = document.querySelector(".loading");
        if(loading) loading.remove();
}
MHAppsBuilder.prototype.loadAuthoredAppsNotFound = function(divId){
    try{
        this.createAppListItem({
            description: this.localizator.locale['no.apps.found'],
            styleClasses: 'list-group-item disabled',
            parentId: divId
        });
    }catch(err){console.log(err.message);}
}
MHAppsBuilder.prototype.loadCorruptedAuthoredApp = function(params){
    try{
        this.createAppListItem({
            description: params.description,
            filename: params.filename,
            styleClasses: 'list-group-item disabled',
            parentId: params.divId,
            content: params.content
        });
    }catch(err){console.log(err.message);}
}
MHAppsBuilder.prototype.createAppListItem = function(params){

    var container = document.getElementById(params.parentId);
    var aManager = this;
    var a = document.createElement('a');
        a.innerHTML = params.description;
        a.href="#";
        a.className = params.styleClasses;
        a.filename = params.filename;

    $(a).on("contextmenu", function(evt) {
        try{
            evt.preventDefault(); evt.stopImmediatePropagation();

            var self = this;
            var dialog = new window.tingle.modal({
                closeMethods: ['overlay', 'button', 'escape'],
                footer: true,
                stickyFooter: true
            });
            dialog.setContent("<h2>" + this.innerText + "</h2>");

            dialog.addFooterBtn(
                aManager.getLocalString('authored.apps.delete.action'),
                'tingle-btn tingle-btn--primary tingle-btn--pull-right',
                function(){

                    dialog.close();
                    MoWA.removeAuthoredApp(self.filename);
                    a.remove();
                    aManager.reloadAvailableApps();
            });

            dialog.addFooterBtn(
                aManager.getLocalString('authored.apps.edit.source'),
                'tingle-btn tingle-btn--primary tingle-btn--pull-right',
                function(){
                    if(self.filename) {
                        MoWA.setAppData("filename", self.filename);
                        aManager.loadUriWithApi('source-editor.html');
                    }
            });

            dialog.open();

        }catch(err){console.log(err.message);}
    });
    container.appendChild(a);
    return a;
}
MHAppsBuilder.prototype.checkEmptyPropName = function(){


}
MHAppsBuilder.prototype.checkEmptyPropName = function(){

    var prop = this.dataManager.getCurrentProperty();
    if(prop){
        if(this.dataManager.stringIsBlank(prop.getAttribute('displayName'))){
            console.log(this.getLocalString('blank.property'));
        }
    }
}
MHAppsBuilder.prototype.getElemsStartingWith = function(key, node){

    var el, attr, i, j, arr = [],
        reg = new RegExp('^' + key, 'i'),
        els = node.getElementsByTagName('*');

    for (i = 0; i < els.length; i++) {
        el = els[i];
        attr = el.attributes;
        dance: for (j = 0; j < attr.length; j++) {
            if (reg.test(attr[j].name)) {
                arr.push(el);
                break dance;
            }
        }
    }
    return arr;
}
MHAppsBuilder.prototype.changeSelectorValues = function(params){

    this.dataManager.changeSelectorValues(params);
    this.logUserAction('User has changed the referenced content of an external property «' +
        this.dataManager.getCurrentProperty().getAttribute('id') + '»: ' + params.value + ' (xpath: ' +
        params.xpath + ')');
}

MHAppsBuilder.prototype.saveCurrentAppSource = function(){

    var filename = MoWA.getAppData("filename");
    var content = document.getElementById('source-code').value;
    return MoWA.saveCurrentArtifactData(content, filename);
}
MHAppsBuilder.prototype.loadPoisManagementView = function(){

    var nextStepFilename = 'MHPoisManagement.xml';
    //MoWA.saveCurrentArtifactData();

    if(this.checkSRRequiredParams()){
        MoWA.loadSubform(nextStepFilename, 'subform');
    } else{
        console.log(this.getLocalString('not.well.configured.space'));

        var relConfigFilename = MoWA.getSessionStorage().application.contextRepresentation + 'Config.html';
        this.logUserAction("The Space Representation is not well configured, " +
            "so its associated configuration file is being loaded: " + relConfigFilename);

        window.location.href = relConfigFilename;
    }
}
MHAppsBuilder.prototype.checkAndBuildUrlString = function(url){

    if(url) {
        url = url.trim();
        if(url.length>0){
            if(url.indexOf(".") == -1) {
                url = "https://www.google.com/search?q=" + url;
            }
            else if(!url.startsWith("http")) {
                if(url.indexOf("www") == -1)
                    url = "www." + url;
                url = "http://" + url;
            }
        }
    }
    return url;
}
MHAppsBuilder.prototype.getUrlForSearching = function(typedValue){

    if(typedValue !== '')
        return this.checkAndBuildUrlString(typedValue);

    return this.checkAndBuildUrlString(" ");
}
MHAppsBuilder.prototype.loadUriWithApi = function(filename){
    MoWA.loadUriWithApi("chrome://mowa/content/data/" + filename);
}
/*MHAppsBuilder.prototype.loadPoiPropsForAugmentersParams = function(divId){

    var poi = this.dataManager.getCurrentPoi(),
        appBaseXpath = this.dataManager.getPoiBaseXpath(poi.getAttribute("id")),
        builder = this;

    //UI: loading APP attrs (1 mandatory fields in form)
    this.addTemporalPoiProperty({
        id: "appName", desc: this.getLocalString("app.setup.name"),
        xpath: "/application/@className",
        parentId:divId
    });

    //UI: loading POI attrs (2 mandatory fields in form)
    this.addTemporalPoiProperty({
        id: "name", desc: this.getLocalString("poi.config.name"),
        xpath:appBaseXpath + "/@name",
        parentId:divId
    });
    this.addTemporalPoiProperty({
        id: "urlToAdapt", desc: this.getLocalString("poi.config.url"),
        xpath: appBaseXpath + "/@urlToAdapt", parentId:divId
    });

    //UI: loading POI extra attrs (dynamic collection)
    var extraProps = poi.getElementsByTagName("extraProps")[0];
    if(extraProps) this.addMultipleTemporalPoiProps(
        extraProps.children,
        appBaseXpath + "/extraProps",
        divId
    );

    //UI: loading POI external attrs (dynamic collection)
    var externalProps = poi.getElementsByTagName("externalProps")[0];
    if(externalProps) this.addMultipleTemporalPoiProps(
        externalProps.children,
        appBaseXpath + "/externalProps",
        divId
    );

    var opts = document.getElementById(divId).getElementsByTagName('input');
    this.checkSelectedPoiProperty(opts);
}
MHAppsBuilder.prototype.checkSelectedPoiProperty = function(domOptions){ //literally html options

    var paramToWorkWith = this.dataManager.getCurrentParameter(); //to change relPropXpath
    var existingXpath = paramToWorkWith.getAttribute('relPropXpath');

    if(existingXpath && existingXpath.length>1){
        for (var i = 0; i < domOptions.length; i++) {
            if(domOptions[i].value == existingXpath){
                domOptions[i].checked = true;
                break;
            }
        };
    }
}
MHAppsBuilder.prototype.addTemporalPoiProperty = function(params){

    var item = document.getElementById(params.parentId).appendChild(
        document.createElement('div'));
        item.className = 'list-group-item';

    var opt = item.appendChild(document.createElement('input'));
        opt.id = params.id;
        opt.type = "radio";
        opt.name = "props";
        opt.value = params.xpath;
        opt.className = "radio-list-control";

    var lbl = item.appendChild(document.createElement('label'));
        lbl.innerHTML = params.desc;
        lbl.className="radio-list-label";
        lbl.htmlFor = opt.id;

    var builder = this;
}
MHAppsBuilder.prototype.addMultipleTemporalPoiProps = function(props, appBaseXpath, divId){

    for (var i = 0; i < props.length; i++) {
        this.addTemporalPoiProperty({
            id: props[i].getAttribute("id"),
            desc: props[i].getAttribute("displayName"),
            xpath: appBaseXpath + "/prop[@id='" + props[i].getAttribute("id") + "']/@value",
            parentId: divId
        });
    };
}
MHAppsBuilder.prototype.loadLeafletCustomMapCfg = function(id){

    var cfgMap = new window['LeafletOutdoorMap'](); //MoWA.getSpaceForAuthoring("LeafletOutdoorMap");
    if(!cfgMap)
        return undefined;

    //TODO: get from dataModel
    var params = {};
        params.divId = id;
        //params.zoom =
    cfgMap.execute(params);

    var self = this;
    var dlg, representation = cfgMap.getRepresentation();
    $(representation).on("contextmenu", function(evt) {
        if(cfgMap.getMarkers().length >= 2){

            dlg = new AlertDialog({
                'title': self.localizator.locale['custom.map.georef.title'],
                'message': self.localizator.locale['custom.map.georef.markers.exceeded']
            });
            dlg.openDialog();
            return;
        }

        if(cfgMap.getMarker('swc')){
            self.createBoundingMarker('nec',
                self.localizator.locale['custom.map.bl.corner'],'mapNELat',
                evt.originalEvent.latlng.lat, 'mapNELon',
                evt.originalEvent.latlng.lng, cfgMap
            );
        }
        else self.createBoundingMarker('swc',
            self.localizator.locale['custom.map.tr.corner'], 'mapSWLat',
            evt.originalEvent.latlng.lat, 'mapSWLon',
            evt.originalEvent.latlng.lng, cfgMap
        );
    });
    $(representation).on("zoomend", function(evt) {

        self.dataManager.saveLeafletSRMapZoom(evt.originalEvent.target._zoom);
        self.logUserAction('User has changed the 2D Map zoom value to: ' + evt.originalEvent.target._zoom);
    });

    this.hackLeafletElements(id);
    return cfgMap;
}
MHAppsBuilder.prototype.loadLeafletOutdoorMapCfg = function(id){

    var spaceRep = MoWA.getSpaceForAuthoring("LeafletOutdoorMap");
    if(!spaceRep) return undefined;

    //TODO: get from dataManager
    var params = {};
        params.divId = id;
        //params.zoom = new XSLTModelManager()
    spaceRep.execute(params);

    var self = this, representation = spaceRep.getRepresentation();
    $(representation).on("zoomend", function(evt) {
        self.dataManager.saveLeafletSRMapZoom(evt.originalEvent.target._zoom);
        self.logUserAction('User has changed the Outdoor Map zoom value to: ' + evt.originalEvent.target._zoom);
    });
    $(representation).on("contextmenu", function(evt) {
        evt.preventDefault();
    });
    $(representation).on("dragend", function(evt) {
        var chagedPos = evt.originalEvent.target.getCenter();
        self.dataManager.changeDefaultCoordinates(chagedPos.lat, chagedPos.lng);
        self.logUserAction('User has changed the Outdoor Map default coordinates values to: ' +
            '{lat:' + chagedPos.lat + ', lon:' + chagedPos.lng + '}');
    });
    this.hackLeafletElements(id);
    return spaceRep;
}
MHAppsBuilder.prototype.setDefaultMarker = function(id, latlng, spaceRep){

    //TODO: move part of this to ViewManager
    var marker = spaceRep.getMarker(id);
    if(marker) marker.setLatLng(latlng);
    else marker = spaceRep.createMarker(id, latlng.lat, latlng.lng);

    this.dataManager.changeDefaultCoordinates(latlng.lat, latlng.lng);
    return marker;
}
MHAppsBuilder.prototype.stopQrReader = function(params){
    try{
        var qrVideo = document.getElementById(params.video);
            qrVideo.pause();
            qrVideo.mozSrcObject=null;
    }catch(err){ console.log(err.message); }
}*/
MHAppsBuilder.prototype.initQrReader = function(params){

    window.navigator.getMedia = window.navigator.getUserMedia || window.navigator.mozGetUserMedia;

    if(window.navigator.getMedia){
        var video = document.getElementById(params.video);
        var mediaStream = window.navigator.getMedia(
            {video: true, audio: false},
            function(stream) {
                video.mozSrcObject = stream;
                video.play();
                //window.qrVideo = video;
            },
            function(err) {
                console.log(err.message);
            }
        );

        var aManager = this;
        document.getElementById(params.triggerElemId).ontouchend = function(){

            var ldn = document.body.appendChild(document.createElement('div'));
                ldn.className='loading';

            var canvas = appBuilder.drawImageFromVideo(video);
            var encodedImg = canvas.toDataURL('image/png');
            var qrcode = MoWA.decodeQR(encodedImg, function(response){
                try{
                    aManager.dataManager.changeQRUrlValue(response);
                    var finalUrl = MoWA.checkUrlRedirection(response);
                    aManager.dataManager.saveCurrentUrlToAdapt(finalUrl);
                    appBuilder.logUserAction('User has changed the POI «' + appBuilder.dataManager.getCurrentPoiId() +
                        '» augmentation-URL to «' + finalUrl + '», by scanning a QR code.');
                    aManager.viewManager.setControlAsReadOnly("//*[@id='url']//input");
                    $(ldn).remove();
                }catch(err){
                    console.log(err.message);
                    $(ldn).remove();
                }
            });
        };
    }
}
MHAppsBuilder.prototype.loadExistingBoundingMarkers = function(spaceRep){

    //Loading vars

    if(mapSWLat && mapSWLon){
        this.createBoundingMarker('swc',
            this.localizator.locale['custom.map.bl.corner'],
            'mapSWLat', mapSWLat,
            'mapSWLon', mapSWLon, spaceRep);
    }
    if(mapNELat && mapNELon){
        this.createBoundingMarker('nec',
            this.localizator.locale['custom.map.tr.corner'],
            'mapNELat', mapNELat,
            'mapNELon', mapNELon, spaceRep);
    }
}
MHAppsBuilder.prototype.createBoundingMarker = function(id, lbl, latId, lat, lngId, lng, spaceRep){

    var marker = spaceRep.createMarker(id, lat, lng);
    if(marker){

        marker.latId = latId;
        marker.lngId = lngId;
        marker.bindPopup(lbl, {offset: new L.Point(0, -30)});
        marker.openPopup();

        this.dataManager.changeBoundingCoordinate(latId, lat);
        this.dataManager.changeBoundingCoordinate(lngId, lng);

        var dManager = this.dataManager;
        $(marker).on("contextmenu", function(evt) {

            if(navigator.vibrate) navigator.vibrate(25);

            var mkr = evt.originalEvent.target;
            var dlg = new OptionsDialog();
                dlg.setData('title', 'Marker options');

            dlg.createListItem('Remove', function(){
                dManager.changeBoundingCoordinate(mkr.latId, "");
                dManager.changeBoundingCoordinate(mkr.lngId, "");
                spaceRep.removeMarker(mkr.markerId);
            });
            dlg.openDialog();
        });
        $(marker).on("dragend", function(evt) {
            dManager.changeBoundingCoordinate(
                evt.originalEvent.target.latId,
                evt.originalEvent.target._latlng.lat);
            dManager.changeBoundingCoordinate(
                evt.originalEvent.target.lngId,
                evt.originalEvent.target._latlng.lng);
        });
    }

    return marker;
}

function CustomDialog(){

    this.jqueryDialog; //The $() jqueryDialog, not the div
}
CustomDialog.prototype.setData = function(key, value){

    this.data[key] = value;
}
CustomDialog.prototype.openDialog = function(){} //Abstract
CustomDialog.prototype.closeDialog = function(){
    this.jqueryDialog.dialog('destroy');
    this.jqueryDialog.remove();
}

function YesNoDialog(params){

    var title = (params && params.title)? params.title: undefined,
        content = (params && params.title)? params.title: undefined,
        yesCbk = (params && params.innerHTML)? params.innerHTML: undefined,
        noCbk = (params && params.noCbk)? params.noCbk: undefined,
        yes = (params && params.yes)? params.yes: 'Yes',
        no = (params && params.no)? params.no: 'No';

    this.data = { 'title': title,
        'innerHTML': content,
        'yes': yes,
        'yesCbk':yesCbk,
        'no': no,
        'noCbk': noCbk
    }
}
YesNoDialog.prototype = new CustomDialog();
YesNoDialog.prototype.openDialog = function(){

    var contentDlg = document.createElement('div');
        contentDlg.innerHTML = this.data.innerHTML;
    var self = this;

    this.jqueryDialog = $(contentDlg);
    this.jqueryDialog.dialog({
        autoOpen: true,
        title: self.data.title,
        height: "auto",
        width: "90%",
        resizable: false,
        draggable: false,
        modal: true,
        position: {
            my: "center center",
            at: "center center",
            of: window,
            collision: 'none'
        },
        buttons: [
            {
                text: self.data.no,
                click: function (ev) {
                    if(self.data.noCbk) self.data.noCbk(ev);
                    self.closeDialog();
                }
            },
            {
                text: self.data.yes,
                click: function (ev) {
                    if(self.data.yesCbk) self.data.yesCbk(ev);
                    self.closeDialog();
                }
            }
        ],
        open: function(){
            $('.ui-widget-overlay').bind('touchleave',function(){
                self.closeDialog();
            })
        }
    });
    return this.jqueryDialog;
}

function AlertDialog(params){

    this.data = {
        'title': params.title || undefined,
        'message': params.message || undefined
    }
}
AlertDialog.prototype = new CustomDialog();
AlertDialog.prototype.openDialog = function(){

    var contentDlg = document.createElement('div');
        contentDlg.innerHTML = this.data.message;

    var self = this;
    this.jqueryDialog = $(contentDlg);
    this.jqueryDialog.dialog({
        autoOpen: true,
        title: self.data.title,
        height: "auto",
        width: "90%",
        resizable: false,
        draggable: false,
        modal: true,
        position: {
            my: "center center",
            at: "center center",
            of: window,
            collision: 'none'
        },
        open: function(){
            $('.ui-widget-overlay').bind('touchleave',function(){
                self.closeDialog();
            })
        }
    });
}

function OptionsDialog(){

    this.data = {
        'title': undefined,
        'innerHTML': undefined
    }
    this.contentDialog = document.createElement('div');
    this.contentDialog.innerHTML = '';
    this.lastGroup;
}
OptionsDialog.prototype = new CustomDialog();
OptionsDialog.prototype.openDialog = function(){

    var self = this;
    this.jqueryDialog = $(this.contentDialog);
    this.jqueryDialog.dialog({
        autoOpen: true,
        title: self.data.title,
        minHeight: 30,
        height: "auto",
        width: "90%",
        resizable: false,
        draggable: false,
        modal: true,
        position: {
            my: "center center",
            at: "center center",
            of: window,
            collision: 'none'
        },
        open: function(){
            $('.ui-widget-overlay').bind('touchleave',function(){
                self.closeDialog();
            });
            $('.list-group-item').blur(); //Avoid first option t be selected
        }
    });
}
OptionsDialog.prototype.createListGroup= function(label){

    var edOptions = this.contentDialog.appendChild(document.createElement('div'));
        if(label) {
            var spanTag = edOptions.appendChild(document.createElement('span'));
                spanTag.innerHTML = label;
                spanTag.className = "";
        }
        edOptions.className = 'list-group options-dialog-group';

    this.lastGroup = edOptions;
}
OptionsDialog.prototype.createListItem = function(desc, callback, id){

    if(!this.lastGroup){
        this.createListGroup();
    }
    var self = this;
    var a = window.content.document.createElement('a');
        a.innerHTML = desc;
        a.href="#";
        a.className='list-group-item';
        a.id = id || 'auto-' + Date.now();
    a.ontouchend = function(evt){
        callback(evt);
        self.closeDialog();
        evt.preventDefault();
    }
    a.onclick = function(evt){
        evt.preventDefault();
    }
    if(this.lastGroup) this.lastGroup.appendChild(a);
    return a;
}


function XPathInterpreter(){} //TODO: make part of the manager which uses it or load from external file both sides
XPathInterpreter.prototype.getElementXPath = function(element){

    if (element && element.id)
        return "//*[@id='" + element.id + "']";
    else
        return this.getElementTreeXPath(element);
}
XPathInterpreter.prototype.getElementByXPath = function(xpath, doc){

    return  doc.evaluate(
        xpath,
        doc,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null ).singleNodeValue;
}
XPathInterpreter.prototype.getElementsByXPath = function(xpath, doc) {

    var results = doc.evaluate( xpath, doc, null, 4, null ); //4 = UNORDERED_NODE_ITERATOR_TYPE

    var nodes = [], res = results.iterateNext(), i=0;
    while (res) {
        nodes.push(res);
        res = results.iterateNext();
    }
    return nodes;
}
XPathInterpreter.prototype.getElementTreeXPath = function(element){

    var paths = [];
    // Use nodeName (instead of localName) so namespace prefix is included (if any).
    for (; element && element.nodeType == 1; element = element.parentNode){
        var index = 0;
        for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling){

            // Ignore document type declaration.
            if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
                continue;

            if (sibling.nodeName == element.nodeName)
            ++index;
        }

        var tagName = element.nodeName.toLowerCase();
        var pathIndex = (index ? "[" + (index+1) + "]" : "");
        paths.splice(0, 0, tagName + pathIndex);
    }

    return paths.length ? "/" + paths.join("/") : null;
}
