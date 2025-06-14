// ======================================================
// ==================== helpers.js ======================
// ======================================================

// مدير الثيمات - مسؤول عن تطبيق وإدارة الوضع الداكن/الفاتح
const ThemeManager = {
  // دالة لتطبيق الوضع الداكن أو الفاتح
  apply(isDark) {
    document.documentElement.classList.toggle('dark-mode', isDark);
    // حفظ الإعداد في localStorage كنص صريح
    localStorage.setItem('darkMode', isDark ? 'true' : 'false');
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
    // دائمًا خزّن كنص صريح
    localStorage.setItem(key, value.toString());
  },
  
  // دالة لجلب البيانات مع معالجة أفضل للقيم المنطقية
  get(key) {
    const value = localStorage.getItem(key);
    // إذا كانت القيمة null، أرجع null
    if (value === null || value === undefined) return null;
    // إذا كانت القيمة تمثل boolean، أرجع القيمة المنطقية
    if (value === 'true' || value === 'false') {
      return value === 'true';
    }
    // في باقي الحالات، أرجع القيمة كما هي
    return value;
  }
};

// دالة للتحقق من جاهزية Blazor
function blazorReady() {
    return new Promise((resolve) => {
        if (window.Blazor && window.Blazor._internal) {
            resolve();
        } else {
            window.addEventListener('blazor-load', () => resolve());
        }
    });
}

// حدث عند انتهاء تحميل الصفحة
window.addEventListener('load', async () => {
    // انتظار جاهزية Blazor
    await blazorReady();
    
    // تأخير إخفاء شريط التحميل لمدة 500 مللي ثانية
    setTimeout(() => {
        try {
            // استدعاء دالة من Blazor لإخفاء شريط التحميل
            DotNet.invokeMethodAsync('Portfolio', 'HideLoader');
        } catch (error) {
            console.warn('Error hiding loader:', error);
            // إخفاء شريط التحميل يدويًا في حالة الخطأ
            document.querySelector('.loading-progress')?.remove();
            document.querySelector('.loading-progress-text')?.remove();
        }
    }, 500);
});

// تصدير الكائنات ليتم استخدامها في ملفات أخرى
export { ThemeManager, StorageHelper };

// جعل StorageHelper متاحًا لـ Blazor عبر window
window.localStorageHelper = StorageHelper;