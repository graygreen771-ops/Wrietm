document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements Mapping
    const apiKeyInput = document.getElementById('apiKey');
    const toggleKeyBtn = document.getElementById('toggleKeyBtn');
    const providerSelect = document.getElementById('providerSelect');
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

    // LocalStorage Synchronization
    const savedKey = localStorage.getItem('pa_api_key');
    if (savedKey) apiKeyInput.value = savedKey;

    apiKeyInput.addEventListener('input', () => {
        localStorage.setItem('pa_api_key', apiKeyInput.value.trim());
    });

    // Toggle API Key visibility
    toggleKeyBtn.addEventListener('click', () => {
        const type = apiKeyInput.getAttribute('type') === 'password' ? 'text' : 'password';
        apiKeyInput.setAttribute('type', type);
        toggleKeyBtn.innerHTML = type === 'password' ? '<i class="fa-solid fa-eye"></i>' : '<i class="fa-solid fa-eye-slash"></i>';
    });

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

    // Generate Request Pipeline
    generateBtn.addEventListener('click', async () => {
        const apiKey = apiKeyInput.value.trim();
        const userRequest = userRequestInput.value.trim();
        const provider = providerSelect.value;
        const targetAI = targetAISelect.value;
        const promptStyle = promptStyleSelect.value;

        if (!apiKey) {
            showToast('Please enter your API key in the configuration panel.', 'error');
            apiKeyInput.focus();
            return;
        }

        if (!userRequest) {
            showToast('Please write down your objective or project request first.', 'error');
            userRequestInput.focus();
            return;
        }

        // Set UI State to Loading
        setUIState('loading');

        try {
            loadingStatusText.textContent = 'Synthesizing expert framework...';
            const generatedPrompt = await fetchAIResponse(provider, apiKey, targetAI, promptStyle, userRequest);
            
            outputText.textContent = generatedPrompt;
            setUIState('success');
            showToast('Prompt architected successfully!', 'success');
        } catch (error) {
            console.error(error);
            showToast(error.message || 'An error occurred during generation.', 'error');
            setUIState('placeholder');
        }
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

    // AI API Request Router (Client-side fetch)
    async function fetchAIResponse(provider, apiKey, targetAI, promptStyle, userRequest) {
        const systemPrompt = `You are an elite Prompt Engineer. Your objective is to take user requests and convert them into structured, powerful, production-grade instructions designed specifically for execution by ${targetAI}.
Follow these strict architectural requirements:
- Use the following formatting style: ${promptStyle}.
- Provide clear context constraints, output formats, edge-case handling rules, and examples if applicable.
- Return ONLY the final output prompt text wrapped cleanly. Do not include introductory text like "Here is your prompt:".`;

        if (provider === 'gemini') {
            // Google Gemini Flash Free Tier API Call
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            const payload = {
                contents: [
                    { role: "user", parts: [{ text: `${systemPrompt}\n\nUser Request: ${userRequest}` }] }
                ]
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error?.message || `Gemini API Error: Status ${response.status}`);
            }

            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
        } 
        else if (provider === 'openrouter') {
            // OpenRouter Free Endpoint Call
            const url = 'https://openrouter.ai/api/v1/chat/completions';
            const payload = {
                model: 'google/gemini-flash-1.5', // Default robust free model router
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userRequest }
                ]
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'PromptArchitect AI'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error?.message || `OpenRouter API Error: Status ${response.status}`);
            }

            const data = await response.json();
            return data.choices?.[0]?.message?.content || 'No response generated.';
        } else {
            throw new Error('Selected AI provider is currently unsupported.');
        }
    }
});
