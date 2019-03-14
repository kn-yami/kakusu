#include <windows.h>

#include "dat.h"

/* Hide specified window. */
__declspec(dllexport) BOOL
hidewin(HWND wnd)
{
	lastwin = wnd;
	return ShowWindow(wnd, SW_HIDE);
}

/* Restore specified window. */
__declspec(dllexport) BOOL
showwin(HWND wnd)
{
	return ShowWindow(wnd, SW_SHOW);
}

/* Restore specified window and brings it to front. */
__declspec(dllexport) BOOL
frontwin(HWND wnd)
{
	return SetWindowPos(wnd, HWND_TOP, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE |
	    SWP_SHOWWINDOW);
}
