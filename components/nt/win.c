#include <windows.h>

#include "dat.h"

/* Hide specified window. */
__declspec(dllexport) BOOL
hidewin(HWND wnd)
{
	lastwin = wnd;
	return ShowWindow(wnd, SW_HIDE);
}

/* Restore secified window. */
__declspec(dllexport) BOOL
showwin(HWND wnd)
{
	return ShowWindow(wnd, SW_SHOW);
}
