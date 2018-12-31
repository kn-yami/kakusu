"use strict";

var yami = typeof(yami) == "undefined" ? {} : yami;

yami.kakusu = {
	init: function() {
		Components.utils.import("resource://kakusu/kakusu.jsm");
		this.gethwnd = kakusu.gethwnd;
		this.hide = kakusu.hide;
		kakusu.debug = false;
		this.initirc();
		if(kakusu.debug == true)
			kakusu.log("Initialized.");
	},

	halt: function() {
		if(kakusu.debug == true)
			kakusu.log("Halted.");
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
			]
		);
		client.updateMenus("mainmenu:ambassador");
	},

	irchide: function() {
		yami.kakusu.hide(yami.kakusu.gethwnd());
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
