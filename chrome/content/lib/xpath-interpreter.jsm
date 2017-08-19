var EXPORTED_SYMBOLS = ["XPathInterpreter"];

function XPathInterpreter(){} //TODO: this is repeated in app-builder
XPathInterpreter.prototype.getElementXPath = function (element) {
  return this.getPathThroughId(element) || this.getElementTreeXPath(element);
};
XPathInterpreter.prototype.getPathThroughId = function(element){

    if (element && element.id)
        return "//*[@id='" + element.id + "']";
}
XPathInterpreter.prototype.getElementByXPath = function(xpath, doc){
	try{
		if(!xpath || !xpath.length || xpath.length == 0 || !doc) return;

		var res = doc.evaluate( xpath, doc,  null, 9, null);
		if(res) return res.singleNodeValue;
  }catch(err){doc.defaultView.console.log(err.message)}
    return;
}
XPathInterpreter.prototype.getElementTreeXPath = function(element){

    var paths = [];
    // Use nodeName (instead of localName) so namespace prefix is included (if any).
    for (; element && element.nodeType == 1; element = element.parentNode){
        var index = 0;
        for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling){

            // Ignore document type declaration.
            if (sibling.nodeType == element.ownerDocument.defaultView.Node.DOCUMENT_TYPE_NODE)
                continue;

            if (sibling.nodeName == element.nodeName)
            ++index;
        }

        var tagName = element.nodeName.toLowerCase();
        var pathIndex = (index ? "[" + (index+1) + "]" : "");
        paths.splice(0, 0, tagName + pathIndex);
    }
    var path = ("/" + paths.join("/")).replace("/html/body", "/");
    return paths.length ? path : null;
}
XPathInterpreter.prototype.getValuesFrom = function(xpaths, window, callback){
    
    var winwin = Components.utils.waiveXrays(me.window.BrowserApp.selectedBrowser.contentWindow);

    var ifr = winwin.document.createElement("iframe");
        ifr.setAttribute("style", "display: none");
        ifr.addEventListener("load", function retrieveContent(event){
            me.notifyWhenFullContentIsLoaded(this, xpath, callback, winwin);
        });
        ifr.setAttribute("src", query);
        winwin.document.body.appendChild(ifr);
}
XPathInterpreter.prototype.getPathTroughCssData = function(element){

    var paths = [];

    for (; element && element.nodeType == 1; element = element.parentNode)
    {
        var selector = this.getElementCSSSelector(element);
        paths.splice(0, 0, selector);
    }

    if(paths.length)
        return paths.join(" ");
    else return;
};
XPathInterpreter.prototype.getElementCSSSelector = function(element){
    if (!element || !element.localName)
        return null;

    var label = element.localName.toLowerCase();
    if (element.id)
    label += "#" + element.id;

    if (element.classList && element.classList.length > 0)
    label += "." + element.classList.item(0);

    return label;
};
