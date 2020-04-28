ZIP=7za
ZIPFLAGS=a -mx9 -tzip kakusu.xpi
M2X=m2x

CONTENT=\
	content/browser/overlay.js\
	content/browser/overlay.xul\
	content/browser/options.xul\
	\
	content/irc/overlay.js\
	content/irc/overlay.xul\
	content/irc/options.xul\
	\
	content/mailnews/overlay.js\
	content/mailnews/overlay.xul\
	content/mailnews/options.xul\
	\
	content/navigator/overlay.js\
	content/navigator/overlay.xul\
	content/navigator/options.xul\
	content/navigator/task.js\
	content/navigator/task.xul\
	content/navigator/util.js\
	content/navigator/util.xul\

COMPONENTS=\
	components/nt/kakusu64.dll\
	components/nt/kakusu32.dll\

DEFAULTS=defaults/preferences/defaults.js

MODULES=\
	modules/kakusu.jsm\

LOCALE=\
	locale/en-US/overlay.dtd\
	locale/en-US/options.dtd\
	locale/en-US/overlay.properties\
	\
	locale/pl-PL/overlay.dtd\
	locale/pl-PL/options.dtd\
	locale/pl-PL/overlay.properties\

META=\
	install.rdf\
	chrome.manifest\
	README\

SKIN=\
	skin/overlay.css\
	skin/icon10.png\
	skin/icon16.png\
	skin/icon24.png\
	skin/icon32.png\
	skin/icon48.png\
	skin/icon64.png\

xpi:V: $CONTENT $COMPONENTS $LOCALE $MODULES $META $SKIN $DEFAULTS
	;

%.js:V:
	$ZIP $ZIPFLAGS -si$stem.js <$stem.js >nul
%.jsm:V:
	$ZIP $ZIPFLAGS -si$stem.jsm <$stem.jsm >nul
%.css:V:
	$ZIP $ZIPFLAGS -si$stem.css <$stem.css >nul
%.png:V:
	$ZIP $ZIPFLAGS -si$stem.png <$stem.png >nul
%.dll:V:
	$ZIP $ZIPFLAGS -si$stem.dll <$stem.dll >nul
%.manifest:V:
	$ZIP $ZIPFLAGS -si$stem.manifest <$stem.manifest >nul
%.properties:V:
	$ZIP $ZIPFLAGS -si$stem.properties <$stem.properties >nul
%.xul:V:
	$M2X <$stem.xul.muu | $ZIP $ZIPFLAGS -si$stem.xul >nul
%.dtd:V:
	$M2X <$stem.dtd.muu | $ZIP $ZIPFLAGS -si$stem.dtd >nul
%.rdf:V:
	$M2X <$stem.rdf.muu | $ZIP $ZIPFLAGS -si$stem.rdf >nul

README:V:
	$ZIP $ZIPFLAGS -siREADME <README >nul

clean:V:
	rm kakusu.xpi
