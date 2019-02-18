ZIP=7za u -mx9 -tzip
M2X=m2x
CP=cp
CPD=cp -r
TIDYFLAGS=-xml -b -e -q --indent-with-tabs yes --newline=LF --preserve-entities yes --input-xml yes --output-xml yes --mute UNKNOWN_ENTITY
NAME=kakusu

CTNDIR=content
CONTENT=$CTNDIR/browser/overlay.js\
	$CTNDIR/browser/overlay.xul\
	$CTNDIR/browser/options.xul\
	$CTNDIR/irc/overlay.js\
	$CTNDIR/irc/overlay.xul\
	$CTNDIR/irc/options.xul\
	$CTNDIR/mailnews/overlay.js\
	$CTNDIR/mailnews/overlay.xul\
	$CTNDIR/mailnews/options.xul\
	$CTNDIR/navigator/overlay.js\
	$CTNDIR/navigator/overlay.xul\
	$CTNDIR/navigator/options.xul\
	$CTNDIR/navigator/task.js\
	$CTNDIR/navigator/task.xul\
	$CTNDIR/navigator/util.js\
	$CTNDIR/navigator/util.xul
CMPDIR=components
COMPONENTS=$CMPDIR/nt/kakusu64.dll $CMPDIR/nt/kakusu32.dll
DEFAULTS=defaults/preferences/defaults.js
MODDIR=modules
MODULES=$MODDIR/kakusu.jsm
LOCDIR=locale
LOCALE=$LOCDIR/en-US/overlay.dtd $LOCDIR/en-US/options.dtd $LOCDIR/en-US/overlay.properties\
	$LOCDIR/pl-PL/overlay.dtd $LOCDIR/pl-PL/options.dtd $LOCDIR/pl-PL/overlay.properties
SKINDIR=skin
META=install.rdf chrome.manifest

xpi:V: $CONTENT $COMPONENTS $LOCALE $MODULES skin $META $DEFAULTS
	$ZIP ../!out/$NAME.xpi ../!out/$NAME/* > nul

%.js:V:
	$CP $stem.js ../!out/$NAME/$stem.js
%.jsm:V:
	$CP $stem.jsm ../!out/$NAME/$stem.jsm
%.css:V:
	$CP $stem.css ../!out/$NAME/$stem.css
%.dll:V:
	$CP $stem.dll ../!out/$NAME/$stem.dll
%.manifest:V:
	$CP $stem.manifest ../!out/$NAME/$stem.manifest
%.properties:V:
	$CP $stem.properties ../!out/$NAME/$stem.properties
%.xul:V:
	$M2X <$stem.xul.muu >../!out/$NAME/$stem.xul
%.dtd:V:
	$M2X <$stem.dtd.muu >../!out/$NAME/$stem.dtd
%.rdf:V:
	$M2X <$stem.rdf.muu >../!out/$NAME/$stem.rdf

skin:V:
	$CPD $SKINDIR ../!out/$NAME/

clean:V:
	rm ../!out/$NAME.xpi
	rm ../!out/$NAME/$APP/$CONTENT
	rm ../!out/$NAME/$LOCALE
	rm ../!out/$NAME/$SKINDIR/*
	rm ../!out/$NAME/$META
