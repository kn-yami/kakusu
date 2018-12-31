"use strict";

var yami = typeof(yami) == "undefined" ? {} : yami;

yami.kakusu = {
	init: function() {
		Components.utils.import("resource://kakusu/kakusu.jsm");
		this.gethwnd = kakusu.gethwnd;
		this.hide = kakusu.hide;
		kakusu.debug = false;
		if(kakusu.debug == true)
			kakusu.log("Initialized.");
	},

	halt: function() {
		if(kakusu.debug == true)
			kakusu.log("Halted.");
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
