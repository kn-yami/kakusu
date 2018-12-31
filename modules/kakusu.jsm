"use strict";

// eslint-disable-next-line no-unused-vars
var EXPORTED_SYMBOLS = [
	"kakusu"
];

var kakusu = {};
kakusu.debug = false;
Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/ctypes.jsm");
kakusu.logger = Components.classes["@mozilla.org/consoleservice;1"]
	.getService(Components.interfaces.nsIConsoleService);
kakusu.log = function(str) {
	this.logger.logStringMessage(Date.now() + "\tkakusu: " + str);
};

kakusu.gethwnd = function(uri) {
	let current;
	let hwnd;

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
	return ctypes.UInt64(hwnd);
};

kakusu.hide = function(hwnd) {
	let user32;
	let SetWindowPos;

	if(hwnd == false)
		return;
	if(kakusu.debug == true)
		kakusu.log("hiding window " + hwnd.toString(16) + ".");
	user32 = ctypes.open("user32.dll");
	SetWindowPos = user32.declare("SetWindowPos", ctypes.winapi_abi,
		ctypes.bool, ctypes.voidptr_t, ctypes.voidptr_t, ctypes.int,
		ctypes.int, ctypes.int, ctypes.int, ctypes.unsigned_int);
	SetWindowPos(ctypes.voidptr_t(hwnd), ctypes.voidptr_t(ctypes.UInt64(0)),
		0, 0, 0, 0, 0x0080 | 0x0010 | 0x0002 | 0x0001 | 0x0004);
	user32.close();
};

kakusu.show = function(hwnd) {
	let user32;
	let SetWindowPos;

	if(hwnd == false)
		return;
	if(kakusu.debug == true)
		kakusu.log("recalling window " + hwnd.toString(16) + ".");
	user32 = ctypes.open("user32.dll");
	SetWindowPos = user32.declare("SetWindowPos", ctypes.winapi_abi,
		ctypes.bool, ctypes.voidptr_t, ctypes.voidptr_t, ctypes.int,
		ctypes.int, ctypes.int, ctypes.int, ctypes.unsigned_int);
	SetWindowPos(ctypes.voidptr_t(hwnd), ctypes.voidptr_t(ctypes.UInt64(0)),
		0, 0, 0, 0, 0x0040 | 0x0010 | 0x0002 | 0x0001 | 0x0004);
	user32.close();
};

kakusu.tray = function(uri) {
	let LoadIcon;
	let nid;
	let NOTIFYICONDATA;
	let shell32;
	let ShellNotifyIcon;
	let user32;

	NOTIFYICONDATA = new ctypes.StructType("NOTIFYICONDATA", [
		{"cbSize": ctypes.uint32_t},
		{"hWnd": ctypes.voidptr_t},
		{"uID": ctypes.unsigned_int},
		{"uFlags": ctypes.unsigned_int},
		{"uCallbackMessage": ctypes.unsigned_int},
		{"hIcon": ctypes.voidptr_t}
	]);
	user32 = ctypes.open("user32.dll");
	LoadIcon = user32.declare("LoadIconA", ctypes.winapi_abi,
		ctypes.voidptr_t, ctypes.voidptr_t, ctypes.voidptr_t);
	shell32 = ctypes.open("shell32.dll");
	ShellNotifyIcon = shell32.declare("Shell_NotifyIconW",
		ctypes.winapi_abi, ctypes.bool, ctypes.uint32_t,
		NOTIFYICONDATA.ptr);
	nid = new NOTIFYICONDATA();
	nid.cbSize = ctypes.uint32_t(NOTIFYICONDATA.size);
	nid.hWnd = ctypes.voidptr_t(kakusu.gethwnd(uri));
	nid.uID = 8;
	nid.uFlags = 0x00000002;
	nid.uCallbackMessage = 0x8001;
	nid.hIcon = LoadIcon(ctypes.voidptr_t(0), ctypes.voidptr_t(32512));
	user32.close();
	ShellNotifyIcon(ctypes.uint32_t(0), nid.address());
	shell32.close();
};
