// Typing animation module
const CodeTypingAnimation = (function () {
    // Configuration
    const config = {
        elementId: 'code-typing-text',
        phrases: [
            "console.log('Building the future of AEC with code and intelligence.');",
            "print('Automating design workflows...');",
            "RevitApi.CreateElement(Wall.BasicWall);",
            "TeklaOpenAPI.Model.Model.CommitChanges();",
            "print('Crafting elegant software solutions.');"
        ],
        typingSpeed: 100,
        deletingSpeed: 50,
        pauseBeforeDelete: 1500,
        pauseBeforeType: 500,
        cursorBlinkSpeed: 500
    };

    // State
    let state = {
        phraseIndex: 0,
        charIndex: 0,
        isDeleting: false,
        isActive: true,
        timeoutRef: null,
        cursorVisible: true
    };

    // DOM Element
    let textElement = null;

    // Initialize
    function init() {
        textElement = document.getElementById(config.elementId);
        if (!textElement) {
            console.error(`Element with ID '${config.elementId}' not found`);
            return;
        }

        // Start cursor blinking
        setInterval(() => {
            if (state.isActive) {
                state.cursorVisible = !state.cursorVisible;
                updateDisplay();
            }
        }, config.cursorBlinkSpeed);

        // Start typing animation
        type();

        // Handle page visibility changes
        document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    // Typing function
    function type() {
        if (!state.isActive || !textElement) return;

        const currentPhrase = config.phrases[state.phraseIndex];
        let visibleText = state.isDeleting
            ? currentPhrase.substring(0, state.charIndex - 1)
            : currentPhrase.substring(0, state.charIndex + 1);

        // Add cursor if visible
        if (state.cursorVisible) {
            visibleText += '_';
        }

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
            state.phraseIndex = (state.phraseIndex + 1) % config.phrases.length;
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
        if (document.hidden) {
            pause();
        } else {
            resume();
        }
    }

    // Pause animation
    function pause() {
        state.isActive = false;
        clearTimeout(state.timeoutRef);
    }

    // Resume animation
    function resume() {
        if (!state.isActive) {
            state.isActive = true;
            type();
        }
    }

    // Update display
    function updateDisplay() {
        if (!textElement) return;

        const currentPhrase = config.phrases[state.phraseIndex];
        const visibleText = currentPhrase.substring(0, state.charIndex);
        textElement.textContent = state.cursorVisible ? visibleText + '_' : visibleText;
    }

    // Public API
    return {
        init: init,
        pause: pause,
        resume: resume
    };
})();

// Blazor integration
window.initCodeTypingEffect = function () {
    CodeTypingAnimation.init();
};