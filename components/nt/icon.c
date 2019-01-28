#include <windows.h>

#include "dat.h"

/* Remove the notification icon. */
__declspec(dllexport) BOOL
delicon(void)
{
	return Shell_NotifyIconW(NIM_DELETE, &ni);
}

/* Create the notification icon. */
__declspec(dllexport) BOOL
addicon(void)
{
	return Shell_NotifyIconW(NIM_ADD, &ni) ||
		Shell_NotifyIconW(NIM_SETVERSION, &ni);
}

/* Modify the notification icon. */
__declspec(dllexport) BOOL
modicon(void)
{
	return Shell_NotifyIconW(NIM_MODIFY, &ni);
}

/* Hide the notification icon. */
__declspec(dllexport) BOOL
hideicon(void)
{
	ni.uFlags = NIF_STATE;
	ni.dwState = NIS_HIDDEN;
	ni.dwStateMask = NIS_HIDDEN;
	return modicon();
}

/* Show the notification icon. */
__declspec(dllexport) BOOL
showicon(void)
{
	ni.uFlags = NIF_ICON | NIF_TIP | NIF_SHOWTIP | NIF_MESSAGE | NIF_STATE;
	ni.dwState = 0;
	ni.dwStateMask = NIS_HIDDEN;
	return modicon();
}

/* Set the notification icon icon. */
__declspec(dllexport) BOOL
seticon(HWND wnd, LPWSTR str)
{
	ni.hIcon = (HICON)GetClassLongPtrW(wnd, GCLP_HICONSM);
	lstrcpyW(ni.szTip, str);
	return modicon();
}
