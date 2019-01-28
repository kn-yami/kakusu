#pragma comment(lib, "shell32.lib")
#pragma comment(lib, "user32.lib")

#ifdef _M_AMD64
#pragma comment(linker, "/out:kakusu64.dll")
#endif
#ifdef _M_IX86
#pragma comment(linker, "/out:kakusu32.dll")
#endif

HINSTANCE mod;
HMENU menu;
HMENU popup;
HWND dwnd;
DWORD pid;
NOTIFYICONDATAW ni;
UINT WM_TASKBARCREATED;
HWND lastwin = NULL;
LPWSTR tip = L"kakusu";
BOOL hide = FALSE;
unsigned int wins = 0;
