document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements Mapping
    const targetAISelect = document.getElementById('targetAI');
    const promptStyleSelect = document.getElementById('promptStyle');
    const userRequestInput = document.getElementById('userRequest');
    const charCountSpan = document.getElementById('charCount');
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    
    const placeholderState = document.getElementById('placeholderState');
    const loadingState = document.getElementById('loadingState');
    const loadingStatusText = document.getElementById('loadingStatusText');
    const outputCode = document.getElementById('outputCode');
    const outputText = document.getElementById('outputText');
    const toast = document.getElementById('toast');
    const suggestionTags = document.querySelectorAll('.suggestion-tag');

    // Hide API configuration card section since it's no longer needed
    const apiKeySection = document.querySelector('.config-section');
    if (apiKeySection) apiKeySection.style.display = 'none';

    // Character counter
    userRequestInput.addEventListener('input', () => {
        const length = userRequestInput.value.length;
        charCountSpan.textContent = length;
    });

    // Handle suggestion chips
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', () => {
            userRequestInput.value = tag.getAttribute('data-text');
            charCountSpan.textContent = userRequestInput.value.length;
        });
    });

    // Copy to clipboard feature
    copyBtn.addEventListener('click', () => {
        const textToCopy = outputText.textContent;
        if (!textToCopy) return;

        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast('Prompt copied to clipboard successfully!', 'success');
        }).catch(err => {
            showToast('Failed to copy to clipboard.', 'error');
        });
    });

    // Local Generation Pipeline (Zero API Key, Instant Client-Side Processing)
    generateBtn.addEventListener('click', async () => {
        const userRequest = userRequestInput.value.trim();
        const targetAI = targetAISelect.value;
        const promptStyle = promptStyleSelect.value;

        if (!userRequest) {
            showToast('Please write down your objective or project request first.', 'error');
            userRequestInput.focus();
            return;
        }

        // Simulate short professional processing state for UX feedback
        setUIState('loading');
        loadingStatusText.textContent = 'Assembling local architecture patterns...';

        setTimeout(() => {
            const generatedPrompt = buildSmartPrompt(targetAI, promptStyle, userRequest);
            outputText.textContent = generatedPrompt;
            setUIState('success');
            showToast('Prompt architected locally!', 'success');
        }, 600);
    });

    // Helper to control view states inside the output box
    function setUIState(state) {
        placeholderState.classList.add('hidden');
        loadingState.classList.add('hidden');
        outputCode.classList.add('hidden');
        copyBtn.disabled = true;

        if (state === 'placeholder') {
            placeholderState.classList.remove('hidden');
        } else if (state === 'loading') {
            loadingState.classList.remove('hidden');
        } else if (state === 'success') {
            outputCode.classList.remove('hidden');
            copyBtn.disabled = false;
        }
    }

    // Toast notification utility
    function showToast(message, type = 'success') {
        toast.textContent = message;
        toast.className = `toast ${type}`;
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 4000);
    }

    // Algorithmic Local Prompt Synthesizer
    function buildSmartPrompt(targetAI, style, request) {
        return `### ROLE & CONTEXT
You are an elite expert AI assistant optimized specifically for ${targetAI}. Your goal is to process the user request with maximum precision, adhering strictly to production standards.

### CORE OBJECTIVE
${request}

### STRUCTURAL & EXECUTION FORMAT (${style})
1. **Analysis**: Break down the task requirements clearly before implementation.
2. **Execution**: Provide comprehensive, clean, and bug-free code or writing matching the requested parameters.
3. **Edge Cases**: Explicitly account for security considerations, boundary limits, and error handling.
4. **Verification**: Confirm that the output fully satisfies the requested objective without placeholders or truncated code.

### CONSTRAINTS
- Avoid unnecessary conversational filler; focus directly on clean delivery.
- Ensure all technical frameworks or style guidelines requested are fully integrated.`;
    }
});
