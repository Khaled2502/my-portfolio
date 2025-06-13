// ======================================================
// ==================== helpers.js ======================
// ======================================================

// مدير الثيمات - مسؤول عن تطبيق وإدارة الوضع الداكن/الفاتح
const ThemeManager = {
  // دالة لتطبيق الوضع الداكن أو الفاتح
  apply(isDark) {
    // إضافة أو إزالة كلاس 'dark-mode' من العنصر الرئيسي في الصفحة
    document.documentElement.classList.toggle('dark-mode', isDark);
    // حفظ الإعداد في localStorage
    localStorage.setItem('darkMode', isDark);
  },
  
  // دالة لتهيئة الثيم عند تحميل الصفحة
  init() {
    // جلب إعداد الوضع الداكن من localStorage
    const isDark = localStorage.getItem('darkMode') === 'true';
    // تطبيق الوضع الداكن إذا كان مفعل
    document.documentElement.classList.toggle('dark-mode', isDark);
  }
};

// مساعد التخزين - يوفر واجهة مبسطة للتعامل مع localStorage
const StorageHelper = {
  // دالة لحفظ البيانات
  set(key, value) {
    // تحويل القيمة إلى JSON وحفظها
    localStorage.setItem(key, JSON.stringify(value));
  },
  
  // دالة لجلب البيانات
  get(key) {
    // جلب القيمة من localStorage
    const value = localStorage.getItem(key);
    // إرجاع القيمة بعد تحويلها من JSON إذا كانت موجودة، أو إرجاع null
    return value ? JSON.parse(value) : null;
  }
};

// حدث عند انتهاء تحميل الصفحة
window.addEventListener('load', () => {
  // تأخير إخفاء شريط التحميل لمدة 500 مللي ثانية
  setTimeout(() => {
    // استدعاء دالة من Blazor لإخفاء شريط التحميل
    DotNet.invokeMethodAsync('Portfolio', 'HideLoader');
  }, 500);
});

// تصدير الكائنات ليتم استخدامها في ملفات أخرى
export { ThemeManager, StorageHelper };

// جعل StorageHelper متاحًا لـ Blazor عبر window
window.localStorageHelper = StorageHelper;