// ======================================================
// ==================== site.js ========================
// ======================================================

// استيراد الأدوات المساعدة من ملف helpers.js
import { ThemeManager, StorageHelper } from './helpers.js';

// ==================== إدارة الثيم (الوضع الداكن/الفاتح) ====================
const SiteTheme = {
  // تطبيق الثيم المحدد
  apply(isDark) {
    // استخدام ThemeManager لتطبيق الثيم
    ThemeManager.apply(isDark);
    // حفظ الإعداد في localStorage
    StorageHelper.set('theme', isDark ? 'dark' : 'light');
  },
  
  // تهيئة الثيم عند تحميل الصفحة
  init() {
    // جلب الثيم المحفوظ
    const savedTheme = StorageHelper.get('theme');
    // التحقق من تفضيلات النظام للوضع الداكن
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // تحديد الثيم بناء على الإعدادات المحفوظة أو تفضيل النظام
    const isDark = savedTheme ? savedTheme === 'dark' : systemPrefersDark;
    // تطبيق الثيم المحدد
    this.apply(isDark);
  }
};

// ==================== تأثير الكتابة الآلية ====================
// دالة لإنشاء تأثير الكتابة الآلية
const createTypingAnimation = (config) => {
  // حالة التأثير
  const state = {
    phraseIndex: 0,       // مؤشر الجملة الحالية
    charIndex: 0,         // مؤشر الحرف الحالي
    isDeleting: false,    // هل في مرحلة المسح؟
    isActive: true,       // هل التأثير نشط؟
    timeoutRef: null,     // مؤقت التأثير
    currentLanguage: 'EN' // اللغة الحالية
  };

  let textElement = null; // العنصر الذي يعرض النص

  // دالة تنفيذ التأثير
  const type = () => {
    if (!state.isActive || !textElement) return;

    // جلب الجمل الخاصة باللغة الحالية
    const phrases = config.phrases[state.currentLanguage] || config.phrases.EN;
    const currentPhrase = phrases[state.phraseIndex];
    
    // بناء النص المرئي بناء على مرحلة الكتابة/المسح
    let visibleText = state.isDeleting
      ? currentPhrase.substring(0, state.charIndex - 1)
      : currentPhrase.substring(0, state.charIndex + 1);

    // عرض النص مع مؤشر الكتابة
    textElement.textContent = visibleText + config.cursorChar;
    // تحديث مؤشر الحرف
    state.charIndex += state.isDeleting ? -1 : 1;

    // التحكم في توقيت التأثير
    if (!state.isDeleting && state.charIndex === currentPhrase.length) {
      // الانتظار قبل البدء في المسح
      state.timeoutRef = setTimeout(() => {
        state.isDeleting = true;
        type();
      }, config.pauseBeforeDelete);
    } else if (state.isDeleting && state.charIndex === 0) {
      // الانتظار قبل البدء في جملة جديدة
      state.timeoutRef = setTimeout(() => {
        state.isDeleting = false;
        state.phraseIndex = (state.phraseIndex + 1) % phrases.length;
        type();
      }, config.pauseBeforeType);
    } else {
      // تحديد السرعة بناء على مرحلة الكتابة/المسح
      const speed = state.isDeleting ? config.deletingSpeed : config.typingSpeed;
      state.timeoutRef = setTimeout(type, speed);
    }
  };

  // واجهة الاستخدام
  return {
    // تهيئة التأثير
    init(lang = 'EN') {
      // الحصول على العنصر الذي يعرض النص
      textElement = document.getElementById(config.elementId);
      if (!textElement) return;

      // إعادة تعيين الحالة
      clearTimeout(state.timeoutRef);
      Object.assign(state, {
        phraseIndex: 0,
        charIndex: 0,
        isDeleting: false,
        isActive: true,
        currentLanguage: lang
      });
      
      // بدء التأثير
      type();
    },
    
    // تغيير اللغة
    setLanguage(lang) {
      if (lang !== state.currentLanguage) {
        state.currentLanguage = lang;
        this.init(lang);
      }
    }
  };
};

// إنشاء تأثير الكتابة الآلية مع الإعدادات المحددة
const CodeTypingAnimation = createTypingAnimation({
  elementId: 'code-typing-text', // ID العنصر المستهدف
  phrases: { // الجمل المعروضة لكل لغة
    EN: [
      "console.log('Building the future of AEC with code and intelligence.');",
      "print('Automating design workflows...');",
      "RevitApi.CreateElement(Wall.BasicWall);",
      "TeklaOpenAPI.Model.Model.CommitChanges();",
      "print('Crafting elegant software solutions.');"
    ],
    AR: [
      "console.log('بناء مستقبل صناعة البناء بالبرمجة والذكاء.');",
      "print('أتمتة سير عمل التصميم...');",
      "RevitApi.CreateElement(Wall.BasicWall);",
      "TeklaOpenAPI.Model.Model.CommitChanges();",
      "print('صنع حلول برمجية أنيقة.');"
    ]
  },
  typingSpeed: 100,       // سرعة الكتابة
  deletingSpeed: 50,      // سرعة المسح
  pauseBeforeDelete: 1500, // وقت الانتظار قبل المسح
  pauseBeforeType: 500,    // وقت الانتظار قبل الكتابة
  cursorChar: '▌'         // شكل مؤشر الكتابة
});

// ==================== إدارة التنقل ====================
const NavigationManager = {
  // إضافة مستمع لإغلاق القائمة عند النقر خارجها
  addCloseListener(dotNetRef) {
    const handler = (event) => {
      const nav = document.querySelector('.site-nav'); // القائمة
      const toggle = document.querySelector('.navbar-toggler'); // زر التبديل

      // إذا تم النقر خارج القائمة وزر التبديل
      if (nav && toggle && 
          !nav.contains(event.target) && 
          !toggle.contains(event.target)) {
        // إغلاق القائمة عبر Blazor
        dotNetRef.invokeMethodAsync('CloseNav');
        // إزالة المستمع
        document.removeEventListener('click', handler);
      }
    };
    // إضافة المستمع للنقر
    document.addEventListener('click', handler);
  }
};

// ==================== محاكاة التحميل ====================
const LoadingSimulator = {
  // محاكاة شريط التقدم
  simulate(dotNetRef) {
    let progress = 0;
    const interval = setInterval(() => {
      // زيادة التقدم بنسبة 10% كل 200 مللي ثانية
      progress = Math.min(progress + 10, 100);
      // تحديث شريط التقدم عبر Blazor
      dotNetRef.invokeMethodAsync('UpdateLoadingProgress', progress);
      // إيقاف المحاكاة عند اكتمال التحميل
      if (progress >= 100) clearInterval(interval);
    }, 200);
  }
};

// ==================== وظائف الموقع العامة ====================
window.siteFunctions = {
  initDefaults: function () {
    // فقط امسح إعدادات الثيم، ولا تلمس اللغة
    localStorage.removeItem('darkMode');
    // Detect system theme
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    localStorage.setItem('darkMode', prefersDark);
  },

  applyDarkMode: function (isDark) {
    // طبّق الكلاس على document.documentElement وليس body فقط
    if (isDark) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  },

  // إصلاح initTheme ليكون دالة آمنة لا تعتمد على this
  initTheme: function() {
    try {
      SiteTheme.init();
    } catch (e) {
      console.warn('Theme init error:', e);
    }
  },
  addNavCloseListener: NavigationManager.addCloseListener,
  simulateLoadingProgress: LoadingSimulator.simulate,
  initCodeTypingEffect: (lang) => CodeTypingAnimation.init(lang),
  setCodeTypingLanguage: (lang) => CodeTypingAnimation.setLanguage(lang)
};

// جعل initCodeTypingEffect متاحًا لاستدعاء Blazor التقليدي
window.initCodeTypingEffect = window.siteFunctions.initCodeTypingEffect;

// ==================== تهيئة الصفحة ====================
window.addEventListener('DOMContentLoaded', () => {
  // تهيئة الثيم بناءً على القيمة المحفوظة في localStorage
  ThemeManager.init();
  
  // جلب اللغة المحفوظة أو استخدام الإنجليزية افتراضيًا
  const savedLang = StorageHelper.get('lang') || 'EN';
  // بدء تأثير الكتابة إذا كان العنصر موجودًا
  if (document.getElementById('code-typing-text')) {
    CodeTypingAnimation.init(savedLang);
  }
  
  // إعادة تشغيل تأثير الكتابة عند عودة المستخدم للتبويب
  document.addEventListener('visibilitychange', () => {
    CodeTypingAnimation.init();
  });
});

StorageHelper.get = function(key) {
  const value = localStorage.getItem(key);
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return value; // fallback: return raw value
  }
};