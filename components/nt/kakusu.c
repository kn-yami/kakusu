#include <stdio.h>
#include <windows.h>
#include <windowsx.h>

#include "dat.h"
#include "fns.h"
#include "menu.h"

/* Process dummy window events. */
LRESULT CALLBACK
wndproc(HWND wnd, UINT msg, WPARAM wparam, LPARAM lparam)
{
	POINT p;
	if(msg == WM_TASKBARCREATED) {
		addicon();
		return 0;
	}
	switch(msg) {
	case WM_APP:
		if(LOWORD(lparam) == WM_LBUTTONUP) {
			delmenu((UINT_PTR)lastwin);
			showwin(lastwin);
		}
		if(LOWORD(lparam) == WM_RBUTTONUP) {
			GetCursorPos(&p);
			SetForegroundWindow(dwnd);
			TrackPopupMenu(popup, TPM_CENTERALIGN | TPM_BOTTOMALIGN,
				p.x, p.y, 0, wnd, NULL);
		}
		break;
	case WM_COMMAND:
		switch(LOWORD(wparam)) {
			case IDM_EXIT:
				exitapplication();
				break;
			default:
				delmenu(wparam);
				showwin((HWND)wparam);
				break;
		}
		break;
	case WM_DESTROY:
		delicon();
		DestroyWindow(dwnd);
		UnregisterClassW((LPCWSTR)L"kakusudwin", mod);
		PostQuitMessage(0);
		break;
	default:
		return DefWindowProc(wnd, msg, wparam, lparam);
	}
	return 0;
}

/* 
 * Process main thread messages.
 * Also create dummy window and notification icon.
 */
DWORD WINAPI
threadproc(LPVOID lparam)
{
	MSG msg;
	WNDCLASSW wc;
	DWORD err;
	/* mod = GetModuleHandleW(L"kakusu.dll"); */
	wc.style = CS_HREDRAW | CS_VREDRAW;
	wc.cbClsExtra = 0;
	wc.cbWndExtra = 0;
	wc.lpszClassName = (LPCWSTR)L"kakusudwin";
	wc.hInstance = mod;
	wc.hbrBackground = GetSysColorBrush(COLOR_3DFACE);
	wc.lpszMenuName = NULL;
	wc.lpfnWndProc = &wndproc;
	wc.hIcon = LoadIcon(NULL, IDI_APPLICATION);
	wc.hCursor = LoadCursor(NULL, IDC_ARROW);
	if(RegisterClassW(&wc) == FALSE)
		return 1;
	dwnd = CreateWindowW(wc.lpszClassName, (LPCWSTR)"kakusu dummy window",
		WS_OVERLAPPEDWINDOW, 0, 0, 800, 500, NULL, NULL, mod, NULL);
	ni.cbSize = sizeof(ni);
	ni.hWnd = dwnd;
	ni.uID = 1;
	ni.uFlags = NIF_ICON | NIF_TIP | NIF_SHOWTIP | NIF_MESSAGE;
	ni.hIcon = LoadIcon(NULL, IDI_APPLICATION);
	ni.uCallbackMessage = WM_APP;
	ni.uVersion = NOTIFYICON_VERSION_4;
	lstrcpyW(ni.szTip, tip);
	/* ShowWindow(dwnd, SW_SHOWNORMAL);
	addicon(); */
	menu = LoadMenuW(mod, MAKEINTRESOURCEW(IDM_POPUPMENU));
	popup = GetSubMenu(menu, 0);
	if(popup == NULL)
		Beep(200, 500);
	WM_TASKBARCREATED = RegisterWindowMessageW(L"TaskbarCreated");
	while(GetMessage(&msg, NULL, 0, 0)) {
		TranslateMessage(&msg);
		DispatchMessage(&msg);
	}
	return 1;
}

/* Allow the libarary to start using rundll32. */
__declspec(dllexport) void CALLBACK
rundllW(HWND wnd, HINSTANCE inst, LPWSTR cmdline, int cmdshow) {
	mod = inst;
	threadproc((LPVOID)L"test");
}

/* Initialize the library after attaching it to a process. */
BOOL APIENTRY
DllMain(HMODULE module, DWORD reason, LPVOID reserved)
{
	if(reason == DLL_PROCESS_ATTACH) {
		mod = module;
		CreateThread(0, 0, threadproc, (LPVOID)L"test", 0, NULL);
	} else if(reason == DLL_PROCESS_DETACH) {
		delicon();
		quit();
		Sleep(200);
	}
	return TRUE;
}
