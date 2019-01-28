LRESULT CALLBACK winproc(HWND, UINT, WPARAM, LPARAM);

BOOL hidewin(HWND wnd);
BOOL showwin(HWND wnd);

BOOL addicon(void);
BOOL delicon(void);
BOOL hideicon(void);
BOOL modicon(void);
BOOL showicon(void);
BOOL seticon(HWND wnd, LPWSTR str);

BOOL addmenu(UINT_PTR id, LPCWSTR str);
BOOL delmenu(UINT_PTR id);
BOOL syncmenu(HWND wnd);

void sethide(BOOL enable);

void quit(void);

BOOL CALLBACK ewcb(HWND wnd, LPARAM lparam);
void exitapplication(void);
