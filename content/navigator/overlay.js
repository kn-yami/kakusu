"use strict";

var yamiKakusu = typeof(yamiKakusu) == "undefined" ? {} : yamiKakusu;

yamiKakusu = {
	init: function() {
		Components.utils.import("resource://kakusu/kakusu.jsm");
		Components.utils.import("resource://gre/modules/Services.jsm");
		this.gethwnd = kakusu.gethwnd;
		this.hide = kakusu.hide;
		kakusu.debug = false;
		if(kakusu.debug == true)
			kakusu.log("Initialized.");
		Services.tm.mainThread.dispatch(function() {
			kakusu.addicon(kakusu.gethwnd("navigator:browser"));
		}, Components.interfaces.nsIThread.DISPATCH_NORMAL);
	}
};

window.addEventListener("load", function load() {
	window.removeEventListener("load", load, false);
	yamiKakusu.init();
}, false);
