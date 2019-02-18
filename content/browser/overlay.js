"use strict";

var yamiKakusu = typeof(yamiKakusu) == "undefined" ? {} : yamiKakusu;

yamiKakusu = {
	init: function() {
		Components.utils.import("resource://kakusu/kakusu.jsm");
		Components.utils.import("resource://gre/modules/Services.jsm");
		this.gethwnd = kakusu.gethwnd;
		this.hide = kakusu.hide;
		kakusu.debug = false;
		document.getElementById("kakusu-statusbarpanel").hidden = !Services.prefs.getBoolPref("extensions.yami.kakusu.statusbarpanel.enable");
		if(document.getElementById("windowMenu") != null) {
			document.getElementById("kakusu-separator").hidden = true;
			document.getElementById("kakusu-menuitem").hidden = true;
			if(document.getElementById("appmenu_kakusu-menuitem") != null)
				document.getElementById("appmenu_kakusu-menuitem").hidden = true;
		}
		Services.prefs.addObserver("extensions.yami.kakusu.statusbarpanel.enable", yamiKakusu, false);
		if(kakusu.debug == true)
			kakusu.log("Initialized.");
		Services.tm.mainThread.dispatch(function() {
			kakusu.addicon(kakusu.gethwnd("navigator:browser"));
		}, Components.interfaces.nsIThread.DISPATCH_NORMAL);
	},

	observe: function(_subject, topic, data) {
		let enable;
		if(topic == "nsPref:changed") {
			if(data == "extensions.yami.kakusu.statusbarpanel.enable") {
				enable = !Services.prefs.getBoolPref("extensions.yami.kakusu.statusbarpanel.enable");
				document.getElementById("kakusu-statusbarpanel").hidden = enable;
			}
		}
	}
};

window.addEventListener("load", function load() {
	window.removeEventListener("load", load, false);
	yamiKakusu.init();
}, false);
