ZIP=7za u -mx9 -tzip
M2X=m2x
CP=cp
CPD= cp -r
NAME=kakusu

CTNDIR=content
CONTENT=$CTNDIR/browser/overlay.js $CTNDIR/browser/overlay.xul $CTNDIR/irc/overlay.js $CTNDIR/irc/overlay.xul $CTNDIR/mailnews/overlay.js $CTNDIR/mailnews/overlay.xul
MODDIR=modules
MODULES=$MODDIR/kakusu.jsm
LOCDIR=locale
LANG=en-US
LOCALE=$LOCDIR/$LANG/overlay.dtd $LOCDIR/$LANG/overlay.properties
SKINDIR=skin
META=install.rdf chrome.manifest

xpi:V: $CONTENT $LOCALE $MODULES skin $META
	$ZIP ../!out/$NAME.xpi ../!out/$NAME/* > nul

%.js:V:
	$CP $stem.js ../!out/$NAME/$stem.js
%.jsm:V:
	$CP $stem.jsm ../!out/$NAME/$stem.jsm
%.css:V:
	$CP $stem.css ../!out/$NAME/$stem.css
%.manifest:V:
	$CP $stem.manifest ../!out/$NAME/$stem.manifest
%.properties:V:
	$CP $stem.properties ../!out/$NAME/$stem.properties
%: %.muu
	$M2X <$stem.muu >../!out/$NAME/$stem

skin:V:
	$CPD $SKINDIR ../!out/$NAME/

clean:V:
	rm ../!out/$NAME.xpi
	rm ../!out/$NAME/$APP/$CONTENT
	rm ../!out/$NAME/$LOCALE
	rm ../!out/$NAME/$SKINDIR/*
	rm ../!out/$NAME/$META
