// ======================================================
// ==================== interop.js =====================
// ======================================================

// كائن مساعد للتعامل مع Blazor (للتكامل بين JavaScript و .NET)
const BlazorHelpers = {
  // دالة لتغيير عنوان صفحة الويب
  setDocumentTitle(title) {
    // تغيير عنوان الصفحة في المتصفح
    document.title = title;
  },

  // دالة لإنشاء وإظهار شريط التحميل
  initLoader() {
    // إنشاء عنصر div جديد لشريط التحميل
    const loader = document.createElement('div');
    
    // تعيين خصائص العنصر:
    loader.id = 'blazor-loader'; // معرف العنصر
    loader.className = 'progress-bar'; // كلاس CSS للشريط الرئيسي
    loader.innerHTML = '<div class="progress"></div>'; // محتوى الشريط (الشريط الداخلي)
    
    // إضافة شريط التحميل في بداية body الصفحة
    document.body.prepend(loader);
  }
};

// جعل الكائن متاحًا بشكل عام في المتصفح تحت اسم blazorHelpers
// حتى يمكن الوصول إليه من أي مكان في الكود أو من Blazor
window.blazorHelpers = BlazorHelpers;