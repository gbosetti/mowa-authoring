var SDK = {
  Cc: Components.classes,
  Ci: Components.interfaces,
  utils: Components.utils
}
var extension;

function loadIntoWindow(window) {

	if (!window) return;

		// MoWA modules are loaded
		SDK.utils.import("resource://gre/modules/Services.jsm");
		var charset = "ISO-8859-1";
		Services.scriptloader.loadSubScript("chrome://MoWA/content/ExtensionManager.js",
			window, charset);

    //Instantiating the ExtensionManager
		extension = new window["ExtensionManager"](window,charset);
};

function unloadFromWindow(window) {
  if (!window)
	return;
	try{
    // Removing UI elements and cleanup
    extension.unloadModules();
		window.NativeWindow.menu.remove(extension.getMainMenu());
	}catch(err){window.NativeWindow.toast.show(err.message, "long");}
};

// Generic methods for extension installation and initialization
var windowListener = {
  onOpenWindow: function(aWindow) {
	// Wait for the window to finish loading
	let domWindow = aWindow.QueryInterface(SDK.Ci.nsIInterfaceRequestor).getInterface(SDK.Ci.nsIDOMWindowInternal || SDK.Ci.nsIDOMWindow);
	domWindow.addEventListener("load", function() {
	  domWindow.removeEventListener("load", arguments.callee, false);
	  loadIntoWindow(domWindow);
	}, false);
  },

  onCloseWindow: function(aWindow) {
  	unloadFromWindow();
  },
  onWindowTitleChange: function(aWindow, aTitle) {}
};
function startup(aData, aReason) {
  let wm = SDK.Cc["@mozilla.org/appshell/window-mediator;1"].getService(SDK.Ci.nsIWindowMediator);

  // Load into any existing windows
  let windows = wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
	let domWindow = windows.getNext().QueryInterface(SDK.Ci.nsIDOMWindow);
	loadIntoWindow(domWindow);
  }

  // Load into any new windows
  wm.addListener(windowListener);
};
function shutdown(aData, aReason) {
  // When the application is shutting down we normally don't have to clean
  // up any UI changes made
  if (aReason == APP_SHUTDOWN)
	return;

  let wm = SDK.Cc["@mozilla.org/appshell/window-mediator;1"].getService(SDK.Ci.nsIWindowMediator);

  // Stop listening for new windows
  wm.removeListener(windowListener);

  // Unload from any existing windows
  let windows = wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
	let domWindow = windows.getNext().QueryInterface(SDK.Ci.nsIDOMWindow);
	unloadFromWindow(domWindow);
  }
};
function install(aData, aReason) {};
function uninstall(aData, aReason) {}; 
