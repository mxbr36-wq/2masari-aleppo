// يُحمَّل في <head> قبل أول رسم كي لا تومض الصفحة بالوضع الخاطئ.
// المنطق نفسه في AppUtilities.initTheme (app.js): اختيار الطالب المحفوظ ثم تفضيل النظام.
(function () {
    try {
        var saved = localStorage.getItem('masari_theme');
        var dark = saved
            ? saved === 'dark'
            : window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (dark) document.documentElement.classList.add('dark');
    } catch (e) {}
})();
