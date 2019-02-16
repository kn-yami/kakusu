"use strict";

var yami = typeof(yami) == "undefined" ? {} : yami;

yami.kakusu = {
	init: function() {
		Components.utils.import("resource://kakusu/kakusu.jsm");
		Components.utils.import("resource://gre/modules/Services.jsm");
		this.gethwnd = kakusu.gethwnd;
		this.hide = kakusu.hide;
		kakusu.debug = false;
		document.getElementById("kakusu-statusbarpanel").hidden = !Services.prefs.getBoolPref("extensions.yami.kakusu.statusbarpanel.enable");
		Services.prefs.addObserver("extensions.yami.kakusu.statusbarpanel.enable", yami.kakusu, false);
		if(kakusu.debug == true)
			kakusu.log("Initialized.");
		Services.tm.mainThread.dispatch(function() {
			kakusu.addicon(kakusu.gethwnd("mail:3pane"));
		}, Components.interfaces.nsIThread.DISPATCH_NORMAL);
	},

	halt: function() {
		if(kakusu.debug == true)
			kakusu.log("halted");
	},

	observe: function(subject, topic, data) {
		let enable;
		if(topic == "nsPref:changed") {
			if(data == "extensions.yami.kakusu.statusbarpanel.enable") {
				enable = !Services.prefs.getBoolPref("extensions.yami.extensions.yami.kakusu.statusbarpanel.enable");
				document.getElementById("kakusu-statusbarpanel").hidden = enable;
			}
		}
	}
};

window.addEventListener("load", function load() {
	window.removeEventListener("load", load, false);
	yami.kakusu.init();
}, false);

/* window.addEventListener("unload", function unload() {
	window.removeEventListener("unload", unload, false);
	yami.kakusu.halt();
}, false); */
