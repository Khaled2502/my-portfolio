// ==================== Theme Management ====================
window.siteFunctions = window.siteFunctions || {};

// Apply dark mode theme
siteFunctions.applyDarkMode = function (isDark) {
    document.documentElement.classList.toggle('dark-mode', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

// Initialize theme from storage or system preference
siteFunctions.initTheme = function () {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme ? savedTheme === 'dark' : systemPrefersDark;
    siteFunctions.applyDarkMode(isDark);
};

// ==================== Initialization ====================
window.addEventListener('load', function () {
    // Initialize theme
    siteFunctions.initTheme();

    // Initialize typing effect with default language
    const savedLang = localStorage.getItem('lang') || 'EN';
    if (typeof CodeTypingAnimation !== 'undefined') {
        CodeTypingAnimation.init(savedLang);
    }
});

// ==================== Code Typing Animation ====================
const CodeTypingAnimation = (function () {
    // Configuration
    const config = {
        elementId: 'code-typing-text',
        phrases: {
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
        typingSpeed: 100,
        deletingSpeed: 50,
        pauseBeforeDelete: 1500,
        pauseBeforeType: 500,
        cursorChar: '▌'
    };

    // State
    let state = {
        phraseIndex: 0,
        charIndex: 0,
        isDeleting: false,
        isActive: true,
        timeoutRef: null,
        currentLanguage: 'EN'
    };

    // DOM Element
    let textElement = null;

    // Initialize
    function init(lang = 'EN') {
        textElement = document.getElementById(config.elementId);
        if (!textElement) return;

        // Clear existing animation
        clearTimeout(state.timeoutRef);

        // Reset state
        state = {
            phraseIndex: 0,
            charIndex: 0,
            isDeleting: false,
            isActive: true,
            timeoutRef: null,
            currentLanguage: lang
        };

        // Start animation
        type();
    }

    // Change language
    function setLanguage(lang) {
        if (lang !== state.currentLanguage) {
            state.currentLanguage = lang;
            // Restart animation with new phrases
            init(lang);
        }
    }

    // Typing function
    function type() {
        if (!state.isActive || !textElement) return;

        const phrases = config.phrases[state.currentLanguage] || config.phrases.EN;
        const currentPhrase = phrases[state.phraseIndex];
        if (!currentPhrase) return;

        let visibleText = state.isDeleting
            ? currentPhrase.substring(0, state.charIndex - 1)
            : currentPhrase.substring(0, state.charIndex + 1);

        // Add cursor
        visibleText += config.cursorChar;

        textElement.textContent = visibleText;

        // Update character position
        state.charIndex = state.isDeleting ? state.charIndex - 1 : state.charIndex + 1;

        // Determine timing for next step
        let currentSpeed;
        if (!state.isDeleting && state.charIndex === currentPhrase.length) {
            // Finished typing - pause before deleting
            currentSpeed = config.pauseBeforeDelete;
            state.isDeleting = true;
        } else if (state.isDeleting && state.charIndex === 0) {
            // Finished deleting - move to next phrase
            state.isDeleting = false;
            state.phraseIndex = (state.phraseIndex + 1) % phrases.length;
            currentSpeed = config.pauseBeforeType;
        } else {
            // Continue typing/deleting
            currentSpeed = state.isDeleting ? config.deletingSpeed : config.typingSpeed;
        }

        // Schedule next step
        state.timeoutRef = setTimeout(type, currentSpeed);
    }

    // Handle visibility changes
    function handleVisibilityChange() {
        state.isActive = !document.hidden;
        if (state.isActive) type();
    }

    // Initialize visibility handler
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Public API
    return {
        init: init,
        setLanguage: setLanguage
    };
})();

// ==================== Navigation Management ====================
siteFunctions.addNavCloseListener = function (dotNetRef) {
    function handleDocumentClick(event) {
        const nav = document.querySelector('.site-nav');
        const toggle = document.querySelector('.navbar-toggler');

        if (nav && toggle &&
            !nav.contains(event.target) &&
            !toggle.contains(event.target)) {
            dotNetRef.invokeMethodAsync('CloseNav');
            document.removeEventListener('click', handleDocumentClick);
        }
    }

    // Add new listener
    document.addEventListener('click', handleDocumentClick);
};

// ==================== Loading Progress ====================
siteFunctions.simulateLoadingProgress = function (dotNetRef) {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        dotNetRef.invokeMethodAsync('UpdateLoadingProgress', progress);
        if (progress >= 100) clearInterval(interval);
    }, 200);
};

// ==================== LocalStorage Helpers ====================
window.localStorageHelper = {
    set: (key, value) => localStorage.setItem(key, value),
    get: (key) => localStorage.getItem(key)
};

// ==================== Blazor Integration ====================
siteFunctions.initCodeTypingEffect = function (lang) {
    CodeTypingAnimation.init(lang);
};

siteFunctions.setCodeTypingLanguage = function (lang) {
    CodeTypingAnimation.setLanguage(lang);
};