// تطبيق الوضع الداكن
function toggleDarkMode(isDark) {
    document.documentElement.classList.toggle('dark-mode', isDark);
    localStorage.setItem('darkMode', isDark);
}

// تطبيق الإعدادات المحفوظة
function applySavedTheme(isDark) {
    document.documentElement.classList.toggle('dark-mode', isDark);
}

// مساعد localStorage
window.localStorageHelper = {
    set: (key, value) => localStorage.setItem(key, value),
    get: (key) => localStorage.getItem(key)
};

// إخفاء شريط التحميل عند اكتمال التحميل
window.addEventListener('load', () => {
    setTimeout(() => {
        DotNet.invokeMethodAsync('YourProjectName', 'HideLoader');
    }, 500);
});