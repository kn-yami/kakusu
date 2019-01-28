#include <windows.h>

#include "dat.h"

/* Set hide value. */
__declspec(dllexport) void
sethide(BOOL enable)
{
	hide = enable;
	if(enable == TRUE && wins == 0)
		hideicon();
	if(enable == FALSE && wins == 0)
		showicon();
}

/* Shutdown threadproc. */
__declspec(dllexport) void
quit(void)
{
	PostQuitMessage(0);
}

BOOL CALLBACK
ewcb(HWND wnd, LPARAM lparam)
{
	DWORD lpid;
	lpid = 0;
	GetWindowThreadProcessId(wnd, &lpid);
	if(lparam == lpid)
		PostMessageW(wnd, WM_CLOSE, 0, 0);
	return TRUE;
}

/* Close the application. */
__declspec(dllexport) void
exitapplication(void)
{
	GetWindowThreadProcessId(dwnd, &pid);
	EnumWindows(ewcb, pid);
}
