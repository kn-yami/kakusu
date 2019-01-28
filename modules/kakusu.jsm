"use strict";

// eslint-disable-next-line no-unused-vars
var EXPORTED_SYMBOLS = [
	"kakusu"
];

var kakusu = {};
let lib;
let path;
let wnds;
wnds = new Map();
let prefs = {};
prefs.enable = true;
prefs.hide = false;
prefs.statusbar = true;

kakusu.debug = false;
Components.utils.import("resource://gre/modules/AddonManager.jsm");
Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/ctypes.jsm");
Components.utils.import("resource://gre/modules/Timer.jsm");
kakusu.logger = Components.classes["@mozilla.org/consoleservice;1"]
	.getService(Components.interfaces.nsIConsoleService);
kakusu.log = function(str) {
	this.logger.logStringMessage(Date.now() + "\tkakusu: " + str);
};

path = Services.dirsvc.get("ProfD", Components.interfaces.nsIFile).path;
if(Services.appinfo.is64Bit == true)
	lib = ctypes.open(path + "\\extensions\\kakusu@kurosu\\components\\nt\\kakusu64.dll");
else
	lib = ctypes.open(path + "\\extensions\\kakusu@kurosu\\components\\nt\\kakusu32.dll");

setInterval(function() {
	kakusu.remove();
}, 10000);

kakusu.observe = function(subject, topic, data) {
	if(topic == "nsPref:changed") {
		switch(data) {
		case "extensions.yami.kakusu.icon.enable":
			prefs.enable = Services.prefs.getBoolPref("extensions.yami.kakusu.icon.enable");
			break;
		case "extensions.yami.kakusu.icon.hide":
			prefs.hide = Services.prefs.getBoolPref("extensions.yami.kakusu.icon.hide");
			kakusu.sethide(prefs.hide);
			break;
		default:
			break;
		}
	} else if(topic == "profile-before-change") {
		lib.Close();
	}
};

function encode(str)
{
	let len;
	let ret;
	let rune;

	len = str.length;
	str = str.trim();
	str = str.slice(0, 32);
	ret = "";
	for(rune of str) {
		if(rune == "&")
			ret += "&&";
		else
			ret += rune;
	}
	ret = ret.trim();
	if(len > 32)
		ret += "...";
	return ret;
}

kakusu.gethwnd = function(uri) {
	let current;
	let hwnd;
	let title;

	current = Services.wm.getMostRecentWindow(uri);
	if(current == false)
		return false;
	hwnd = current
		.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
		.getInterface(Components.interfaces.nsIWebNavigation)
		.QueryInterface(Components.interfaces.nsIDocShellTreeItem)
		.treeOwner
		.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
		.getInterface(Components.interfaces.nsIBaseWindow)
		.nativeHandle;
	title = current
		.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
		.getInterface(Components.interfaces.nsIWebNavigation)
		.QueryInterface(Components.interfaces.nsIDocShellTreeItem)
		.treeOwner
		.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
		.getInterface(Components.interfaces.nsIBaseWindow)
		.title;
	return [ctypes.UInt64(hwnd), title];
};

kakusu.hide = function(hwnd) {
	let addmenu;
	let delmenu;
	let hidewin;

	if(hwnd[0] == false)
		return;
	if(kakusu.debug == true)
		kakusu.log("hiding window " + hwnd[0].toString(16));
	hidewin = lib.declare("hidewin", ctypes.default_abi,
		ctypes.bool, ctypes.voidptr_t);
	addmenu = lib.declare("addmenu", ctypes.default_abi,
		ctypes.bool, ctypes.voidptr_t, ctypes.char16_t.ptr);
	delmenu = lib.declare("delmenu", ctypes.default_abi,
		ctypes.bool, ctypes.voidptr_t);
	if(wnds.has(hwnd[0]) == true) {
		delmenu(ctypes.voidptr_t(hwnd[0]));
		wnds.delete(hwnd[0]);
	}
	hidewin(ctypes.voidptr_t(hwnd[0]));
	wnds.set(hwnd[0], null);
	addmenu(ctypes.voidptr_t(hwnd[0]), encode(hwnd[1]));
};

kakusu.addicon = function(hwnd) {
	let addicon;
	let seticon;

	seticon = lib.declare("seticon", ctypes.default_abi,
		ctypes.bool, ctypes.voidptr_t, ctypes.char16_t.ptr);
	addicon = lib.declare("addicon", ctypes.default_abi, ctypes.bool);
	seticon(ctypes.voidptr_t(hwnd[0]), Services.appinfo.name);
	if(prefs.enable == true)
		addicon();
	if(prefs.hide == true && wnds.size == 0)
		kakusu.hideicon();
};

kakusu.hideicon = function() {
	let hideicon;

	hideicon = lib.declare("hideicon", ctypes.default_abi, ctypes.bool);
	hideicon();
};

kakusu.showicon = function() {
	let showicon;

	showicon = lib.declare("showicon", ctypes.default_abi, ctypes.bool);
	showicon();
};

kakusu.sethide = function(enable) {
	let sethide;

	sethide = lib.declare("sethide", ctypes.default_abi, ctypes.void_t, ctypes.bool);
	sethide(enable);
};

kakusu.remove = function() {
	let ok;
	let remove;

	remove = lib.declare("syncmenu", ctypes.default_abi,
		ctypes.bool, ctypes.voidptr_t);
	wnds.forEach(function(_, wnd) {
		ok = remove(ctypes.voidptr_t(wnd));
		if(ok == true) {
			wnds.delete(wnd);
			if(kakusu.debug == true)
				kakusu.log("autoremoving window " + wnd.toString(16));
		}
	});
};

prefs.enable = Services.prefs.getBoolPref("extensions.yami.kakusu.icon.enable");
prefs.hide = Services.prefs.getBoolPref("extensions.yami.kakusu.icon.hide");
prefs.statusbar = Services.prefs.getBoolPref("extensions.yami.kakusu.statusbarpanel.enable");
kakusu.sethide(prefs.hide);
if(prefs.hide == true && wnds.size > 0) {
	kakusu.hideicon();
} else {
	kakusu.showicon();
}
Services.prefs.addObserver("extensions.yami.kakusu.", kakusu, false);
