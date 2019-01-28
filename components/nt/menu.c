#include <windows.h>

#include "dat.h"

/* Add a menu to popup. */
__declspec(dllexport) BOOL
addmenu(UINT_PTR id, LPCWSTR str)
{
	wins++;
	if(wins == 1)
		InsertMenuW(popup, 0, MF_BYPOSITION | MF_SEPARATOR, 0, 0);
	if(hide == TRUE && wins == 1)
		showicon();
	return InsertMenuW(popup, 0, MF_BYPOSITION | MF_STRING, id, str);
}

/* Remove specified menu form popup. */
__declspec(dllexport) BOOL
delmenu(UINT_PTR id)
{
	if(wins != 0)
		wins--;
	if(wins == 0)
		DeleteMenu(popup, 1, MF_BYPOSITION);
	if(hide == TRUE && wins == 0)
		hideicon();
	return DeleteMenu(popup, id, MF_BYCOMMAND);
}

/* Remove redundant menu entries. */
__declspec(dllexport) BOOL
syncmenu(HWND wnd)
{
	if(IsWindow(wnd) == TRUE && IsWindowVisible(wnd) == FALSE) {
		return FALSE;
	} else if(IsWindow(wnd) == TRUE && IsWindowVisible(wnd) == TRUE) {
		delmenu((UINT_PTR)wnd);
		return TRUE;
	} else if(IsWindow(wnd) == FALSE) {
		delmenu((UINT_PTR)wnd);
		return TRUE;
	} else {
		return FALSE;
	}
}
