document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements Mapping
    const targetAISelect = document.getElementById('targetAI');
    const instructionFlowSelect = document.getElementById('instructionFlow');
    const outputPersonaSelect = document.getElementById('outputPersona');
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

    // Character counter
    userRequestInput.addEventListener('input', () => {
        charCountSpan.textContent = userRequestInput.value.length;
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
            showToast('Master instruction copied to clipboard!', 'success');
        }).catch(() => {
            showToast('Failed to copy to clipboard.', 'error');
        });
    });

    // Local Generation Pipeline
    generateBtn.addEventListener('click', () => {
        const userRequest = userRequestInput.value.trim();
        const targetAI = targetAISelect.value;
        const instructionFlow = instructionFlowSelect.value;
        const outputPersona = outputPersonaSelect.value;

        if (!userRequest) {
            showToast('Please type your core project request or objective first.', 'error');
            userRequestInput.focus();
            return;
        }

        setUIState('loading');
        loadingStatusText.textContent = `Optimizing instruction blueprint for ${targetAI}...`;

        setTimeout(() => {
            const generatedPrompt = buildAdvancedMasterPrompt(targetAI, instructionFlow, outputPersona, userRequest);
            outputText.textContent = generatedPrompt;
            setUIState('success');
            showToast('Master prompt architected successfully!', 'success');
        }, 500);
    });

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

    function showToast(message, type = 'success') {
        toast.textContent = message;
        toast.className = `toast ${type}`;
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 4000);
    }

    // Advanced Prompt Architectural Engine
    function buildAdvancedMasterPrompt(targetAI, flowStyle, persona, request) {
        return `### SYSTEM ROLE & PERSONA
You are acting as a ${persona}, fine-tuned explicitly for maximum performance on **${targetAI}**. Your mission is to parse the instructions below with absolute technical rigor and produce production-ready output.

### CORE OBJECTIVE
${request}

### METHODOLOGY & INSTRUCTION FLOW (${flowStyle})
Depending on your selected execution style, adhere to the following sequence:
- **Phase 1 (Decomposition)**: Analyze prerequisites, dependencies, and expected constraints before proceeding.
- **Phase 2 (Execution)**: Produce clean, complete, high-grade artifacts or code matching standard frameworks without using shortcuts or placeholders like "code goes here".
- **Phase 3 (Validation & Edge Cases)**: Explicitly handle edge conditions, security implications, error-handling logic, and performance trade-offs.

### CONSTRAINTS & OUTPUT GUIDELINES
- Eliminate conversational filler; deliver directly useful, professional material.
- If writing code, ensure robust syntax correctness, modern layout structures, and precise naming conventions.`;
    }
});
