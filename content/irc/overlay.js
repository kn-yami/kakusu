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
		this.initirc();
		if(kakusu.debug == true)
			kakusu.log("Initialized.");
		Services.tm.mainThread.dispatch(function() {
			kakusu.addicon(kakusu.gethwnd("irc:ambassador"));
		}, Components.interfaces.nsIThread.DISPATCH_NORMAL);
	},

	halt: function() {
		if(kakusu.debug == true)
			kakusu.log("Halted.");
	},

	observe: function(subject, topic, data) {
		let enable;
		if(topic == "nsPref:changed") {
			if(data == "extensions.yami.kakusu.statusbarpanel.enable") {
				enable = !Services.prefs.getBoolPref("extensions.yami.kakusu.statusbarpanel.enable");
				document.getElementById("kakusu-statusbarpanel").hidden = enable;
			}
		}
	},

	initirc: function() {
		let sb;
		sb = Services.strings.createBundle(
			"chrome://kakusu/locale/overlay.properties"
		);
		client.commandManager.defineCommands([
			[
				"kakusu-hide",
				yami.kakusu.irchide,
				0x20 | 0x01
			]
		]);
		client.menuSpecs["mainmenu:ambassador"].items.splice(
			client.menuSpecs["mainmenu:ambassador"].items.indexOf("exit") - 1,
			0,
			[
				"kakusu-hide",
				{
					accesskey:
						sb.GetStringFromName("yami.kakusu.menuitem.accesskey"),
					key: "kakusu-key",
					label: sb.GetStringFromName("yami.kakusu.menuitem.label")
				}
			],
			["-"]
		);
		client.updateMenus("mainmenu:ambassador");
	},

	irchide: function() {
		yami.kakusu.hide(yami.kakusu.gethwnd("irc:ambassador"));
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
