(function() {
    if (window.N8nChatWidgetLoaded) return;
    window.N8nChatWidgetLoaded = true;

    // Load Google Fonts for Poppins
    const fontElement = document.createElement('link');
    fontElement.rel = 'stylesheet';
    fontElement.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
    document.head.appendChild(fontElement);

    // Load marked.js for Markdown parsing
    const markedScript = document.createElement('script');
    markedScript.src = 'https://cdn.jsdelivr.net/npm/marked@4.0.12/marked.min.js';
    document.head.appendChild(markedScript);

    // Define widget styles
    const widgetStyles = document.createElement('style');
    widgetStyles.textContent = `
        .chat-assist-widget {
            --chat-color-primary: var(--chat-widget-primary, #854fff);
            --chat-color-secondary: var(--chat-widget-secondary, #6b3fd4);
            --chat-color-tertiary: var(--chat-widget-tertiary, #5a35b5);
            --chat-color-light: var(--chat-widget-light, #e5d5ff);
            --chat-color-surface: var(--chat-widget-surface, #ffffff);
            --chat-color-text: var(--chat-widget-text, #1f2937);
            --chat-color-text-light: var(--chat-widget-text-light, #6b7280);
            --chat-color-border: var(--chat-widget-border, #e5e7eb);
            --chat-shadow-sm: 0 1px 3px rgba(133, 79, 255, 0.1);
            --chat-shadow-md: 0 4px 6px rgba(133, 79, 255, 0.15);
            --chat-shadow-lg: 0 10px 15px rgba(133, 79, 255, 0.2);
            --chat-radius-sm: 8px;
            --chat-radius-md: 12px;
            --chat-radius-lg: 20px;
            --chat-radius-full: 9999px;
            --chat-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'Poppins', sans-serif;
            z-index: 1000;
        }
        .chat-assist-widget * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            outline: none;
        }
        .chat-assist-widget .chat-window {
            position: fixed;
            bottom: 90px;
            width: 360px;
            height: 540px;
            background: var(--chat-color-surface);
            border-radius: var(--chat-radius-lg);
            box-shadow: var(--chat-shadow-lg);
            display: none;
            flex-direction: column;
            overflow: hidden;
        }
        .chat-assist-widget .chat-window.right-side {
            right: 24px;
        }
        .chat-assist-widget .chat-window.left-side {
            left: 24px;
        }
        .chat-assist-widget .chat-window.visible {
            display: flex;
        }
        .chat-assist-widget .chat-header {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: #ffffff;
        }
        .chat-assist-widget .chat-header-logo {
            width: 32px;
            height: 32px;
            border-radius: var(--chat-radius-sm);
        }
        .chat-assist-widget .chat-header-title {
            font-size: 16px;
            font-weight: 600;
            flex: 1;
        }
        .chat-assist-widget .chat-close-btn {
            background: none;
            border: none;
            color: #ffffff;
            font-size: 24px;
            cursor: pointer;
            transition: var(--chat-transition);
        }
        .chat-assist-widget .chat-close-btn:hover {
            opacity: 0.8;
        }
        .chat-assist-widget .chat-welcome {
            padding: 24px;
            text-align: center;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 16px;
        }
        .chat-assist-widget .chat-welcome-title {
            font-size: 20px;
            font-weight: 600;
            color: var(--chat-color-text);
        }
        .chat-assist-widget .chat-start-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: #ffffff;
            border: none;
            border-radius: var(--chat-radius-md);
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: var(--chat-transition);
        }
        .chat-assist-widget .chat-start-btn:hover {
            opacity: 0.9;
        }
        .chat-assist-widget .chat-start-btn svg {
            width: 20px;
            height: 20px;
        }
        .chat-assist-widget .chat-response-time {
            font-size: 14px;
            color: var(--chat-color-text-light);
        }
        .chat-assist-widget .user-registration {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--chat-color-surface);
            padding: 24px;
            display: none;
            flex-direction: column;
            gap: 16px;
            transition: var(--chat-transition);
        }
        .chat-assist-widget .user-registration.active {
            display: flex;
        }
        .chat-assist-widget .registration-title {
            font-size: 20px;
            font-weight: 600;
            color: var(--chat-color-text);
            text-align: center;
        }
        .chat-assist-widget .registration-form {
            display: flex;
            flex-direction: column;
            gap: 16px;
            flex: 1;
        }
        .chat-assist-widget .form-field {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .chat-assist-widget .form-label {
            font-size: 14px;
            font-weight: 500;
            color: var(--chat-color-text);
        }
        .chat-assist-widget .form-input {
            padding: 12px 14px;
            border: 1px solid var(--chat-color-border);
            border-radius: var(--chat-radius-md);
            font-family: inherit;
            font-size: 14px;
            transition: var(--chat-transition);
            color: var(--chat-color-text); /* Fix for input text visibility */
        }
        .chat-assist-widget .form-input:focus {
            outline: none;
            border-color: var(--chat-color-primary);
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
        }
        .chat-assist-widget .form-input::placeholder {
            color: var(--chat-color-text-light);
        }
        .chat-assist-widget .form-input.error {
            border-color: #ef4444;
        }
        .chat-assist-widget .error-text {
            font-size: 12px;
            color: #ef4444;
            min-height: 16px;
        }
        .chat-assist-widget .submit-registration {
            padding: 12px;
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: #ffffff;
            border: none;
            border-radius: var(--chat-radius-md);
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: var(--chat-transition);
        }
        .chat-assist-widget .submit-registration:hover {
            opacity: 0.9;
        }
        .chat-assist-widget .chat-body {
            display: none;
            flex-direction: column;
            height: 100%;
        }
        .chat-assist-widget .chat-body.active {
            display: flex;
        }
        .chat-assist-widget .chat-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .chat-assist-widget .chat-bubble {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: var(--chat-radius-md);
            font-size: 14px;
            line-height: 1.5;
        }
        .chat-assist-widget .chat-bubble.bot-bubble {
            align-self: flex-start;
            background: var(--chat-color-light);
            color: var(--chat-color-text);
            border-bottom-left-radius: 0;
        }
        .chat-assist-widget .chat-bubble.user-bubble {
            align-self: flex-end;
            background: var(--chat-color-primary);
            color: #ffffff;
            border-bottom-right-radius: 0;
        }
        .chat-assist-widget .chat-bubble .chat-link {
            color: var(--chat-color-primary);
            text-decoration: underline;
        }
        .chat-assist-widget .chat-bubble .chat-link:hover {
            opacity: 0.8;
        }
        .chat-assist-widget .typing-indicator {
            display: flex;
            gap: 6px;
            align-self: flex-start;
            padding: 12px 16px;
        }
        .chat-assist-widget .typing-dot {
            width: 8px;
            height: 8px;
            background: var(--chat-color-primary);
            border-radius: var(--chat-radius-full);
            animation: dot-blink 1.4s infinite both;
        }
        .chat-assist-widget .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        .chat-assist-widget .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }
        @keyframes dot-blink {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-4px);
            }
            60% {
                transform: translateY(-2px);
            }
        }
        .chat-assist-widget .suggested-questions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 8px 0;
        }
        .chat-assist-widget .suggested-question-btn {
            padding: 8px 16px;
            background: var(--chat-color-surface);
            border: 1px solid var(--chat-color-border);
            border-radius: var(--chat-radius-full);
            font-size: 14px;
            color: var(--chat-color-text);
            cursor: pointer;
            transition: var(--chat-transition);
        }
        .chat-assist-widget .suggested-question-btn:hover {
            background: var(--chat-color-light);
        }
        .chat-assist-widget .chat-controls {
            display: flex;
            gap: 12px;
            padding: 16px;
            border-top: 1px solid var(--chat-color-border);
        }
        .chat-assist-widget .chat-textarea {
            flex: 1;
            padding: 12px 14px;
            border: 1px solid var(--chat-color-border);
            border-radius: var(--chat-radius-md);
            font-family: inherit;
            font-size: 14px;
            resize: none;
            color: var(--chat-color-text);
            line-height: 1.5;
            max-height: 120px;
            overflow-y: auto;
        }
        .chat-assist-widget .chat-textarea:focus {
            outline: none;
            border-color: var(--chat-color-primary);
        }
        .chat-assist-widget .chat-textarea::placeholder {
            color: var(--chat-color-text-light);
        }
        .chat-assist-widget .chat-submit {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            border: none;
            border-radius: var(--chat-radius-full);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: var(--chat-transition);
        }
        .chat-assist-widget .chat-submit:hover {
            opacity: 0.9;
        }
        .chat-assist-widget .chat-submit svg {
            width: 20px;
            height: 20px;
            stroke: #ffffff;
        }
        .chat-assist-widget .chat-footer {
            padding: 8px 16px;
            text-align: center;
            border-top: 1px solid var(--chat-color-border);
        }
        .chat-assist-widget .chat-footer-link {
            font-size: 12px;
            color: var(--chat-color-text-light);
            text-decoration: none;
        }
        .chat-assist-widget .chat-footer-link:hover {
            color: var(--chat-color-primary);
        }
        .chat-assist-widget .chat-launcher {
            position: fixed;
            bottom: 24px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            border: none;
            border-radius: var(--chat-radius-full);
            box-shadow: var(--chat-shadow-md);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: var(--chat-transition);
        }
        .chat-assist-widget .chat-launcher.right-side {
            right: 24px;
        }
        .chat-assist-widget .chat-launcher.left-side {
            left: 24px;
        }
        .chat-assist-widget .chat-launcher:hover {
            transform: scale(1.05);
        }
        .chat-assist-widget .chat-launcher svg {
            width: 28px;
            height: 28px;
            stroke: #ffffff;
        }
        .chat-assist-widget .chat-launcher-text {
            position: absolute;
            right: 72px;
            background: var(--chat-color-tertiary);
            color: #ffffff;
            padding: 8px 16px;
            border-radius: var(--chat-radius-full);
            font-size: 14px;
            white-space: nowrap;
            box-shadow: var(--chat-shadow-sm);
            display: none;
        }
        .chat-assist-widget .chat-launcher:hover .chat-launcher-text {
            display: block;
        }
        @media (max-width: 480px) {
            .chat-assist-widget .chat-window {
                width: 100%;
                height: 100%;
                bottom: 0;
                left: 0;
                right: 0;
                border-radius: 0;
            }
            .chat-assist-widget .chat-launcher {
                bottom: 16px;
            }
            .chat-assist-widget .chat-launcher.right-side {
                right: 16px;
            }
            .chat-assist-widget .chat-launcher.left-side {
                left: 16px;
            }
            .chat-assist-widget .chat-launcher-text {
                display: none !important;
            }
        }
        /* Add styles for Markdown-rendered content */
        .chat-bubble strong {
            font-weight: 600;
        }
        .chat-bubble em {
            font-style: italic;
        }
    `;
    document.head.appendChild(widgetStyles);

    // Default settings for the widget
    const defaultSettings = {
        webhook: {
            url: '',
            route: ''
        },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: {
                text: 'Powered by AnovoxLabs',
                link: 'https://anovoxlabs.com'
            }
        },
        style: {
            primaryColor: '#854fff',
            secondaryColor: '#6b3fd4',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#1f2937'
        },
        suggestedQuestions: []
    };

    // Utility to validate URLs
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Merge user-provided settings with defaults
    const settings = window.ChatWidgetConfig ? 
        {
            webhook: { ...defaultSettings.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { 
                ...defaultSettings.branding, 
                ...window.ChatWidgetConfig.branding,
                logo: window.ChatWidgetConfig.branding?.logo && isValidUrl(window.ChatWidgetConfig.branding.logo) ? window.ChatWidgetConfig.branding.logo : defaultSettings.branding.logo
            },
            style: { 
                ...defaultSettings.style, 
                ...window.ChatWidgetConfig.style
            },
            suggestedQuestions: window.ChatWidgetConfig.suggestedQuestions || defaultSettings.suggestedQuestions
        } : defaultSettings;

    // Validate required settings
    if (!settings.webhook.url || !isValidUrl(settings.webhook.url)) {
        console.error('Chat Widget Error: Webhook URL is required and must be a valid URL.');
        return;
    }

    if (!settings.webhook.route) {
        console.error('Chat Widget Error: Webhook route is required.');
        return;
    }

    // Initialize conversation state
    let conversationId = '';
    let isWaitingForResponse = false;

    // Create the widget root element
    const widgetRoot = document.createElement('div');
    widgetRoot.className = 'chat-assist-widget';
    widgetRoot.style.setProperty('--chat-widget-primary', settings.style.primaryColor);
    widgetRoot.style.setProperty('--chat-widget-secondary', settings.style.secondaryColor);
    widgetRoot.style.setProperty('--chat-widget-tertiary', settings.style.secondaryColor);
    widgetRoot.style.setProperty('--chat-widget-surface', settings.style.backgroundColor);
    widgetRoot.style.setProperty('--chat-widget-text', settings.style.fontColor);

    // Create the chat window
    const chatWindow = document.createElement('div');
    chatWindow.className = `chat-window ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;
    
    // Welcome screen HTML
    const welcomeScreenHTML = `
        <div class="chat-header">
            <img class="chat-header-logo" src="${settings.branding.logo}" alt="${settings.branding.name}" onerror="this.style.display='none';">
            <span class="chat-header-title">${settings.branding.name}</span>
            <button class="chat-close-btn">×</button>
        </div>
        <div class="chat-welcome">
            <h2 class="chat-welcome-title">${settings.branding.welcomeText}</h2>
            <button class="chat-start-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M8 10h8"></path>
                    <path d="M8 14h8"></path>
                    <path d="M4 4h16v16H4z"></path>
                </svg>
                Start chatting
            </button>
            <p class="chat-response-time">${settings.branding.responseTimeText}</p>
        </div>
        <div class="user-registration">
            <h2 class="registration-title">Please enter your details to start chatting</h2>
            <form class="registration-form">
                <div class="form-field">
                    <label class="form-label" for="chat-user-name" style="color: black;">Name</label>
                    <input type="text" id="chat-user-name" class="form-input" placeholder="Your name" required>
                    <div class="error-text" id="name-error"></div>
                </div>
                <div class="form-field">
                    <label class="form-label" for="chat-user-email" style="color: black;">Email</label>
                    <input type="email" id="chat-user-email" class="form-input" placeholder="Your email address" required>
                    <div class="error-text" id="email-error"></div>
                </div>
                <button type="submit" class="submit-registration">Continue to Chat</button>
            </form>
        </div>
    `;

    // Chat interface HTML
    const chatInterfaceHTML = `
        <div class="chat-body">
            <div class="chat-messages"></div>
            <div class="chat-controls">
                <textarea class="chat-textarea" placeholder="Type your message here..." rows="1"></textarea>
                <button class="chat-submit">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 2L11 13"></path>
                        <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                    </svg>
                </button>
            </div>
            <div class="chat-footer">
                <a class="chat-footer-link" href="${settings.branding.poweredBy.link}" target="_blank">${settings.branding.poweredBy.text}</a>
            </div>
        </div>
    `;
    
    chatWindow.innerHTML = welcomeScreenHTML + chatInterfaceHTML;
    
    // Create the launcher button
    const launchButton = document.createElement('button');
    launchButton.className = `chat-launcher ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;
    launchButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <span class="chat-launcher-text">Need help?</span>`;
    
    widgetRoot.appendChild(chatWindow);
    widgetRoot.appendChild(launchButton);
    document.body.appendChild(widgetRoot);

    // Select DOM elements
    const startChatButton = chatWindow.querySelector('.chat-start-btn');
    const chatBody = chatWindow.querySelector('.chat-body');
    const messagesContainer = chatWindow.querySelector('.chat-messages');
    const messageTextarea = chatWindow.querySelector('.chat-textarea');
    const sendButton = chatWindow.querySelector('.chat-submit');
    const registrationForm = chatWindow.querySelector('.registration-form');
    const userRegistration = chatWindow.querySelector('.user-registration');
    const chatWelcome = chatWindow.querySelector('.chat-welcome');
    const nameInput = chatWindow.querySelector('#chat-user-name');
    const emailInput = chatWindow.querySelector('#chat-user-email');
    const nameError = chatWindow.querySelector('#name-error');
    const emailError = chatWindow.querySelector('#email-error');

    // Utility functions
    function createSessionId() {
        return crypto.randomUUID ? crypto.randomUUID() : 
            'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    }

    function createTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        return indicator;
    }

    function linkifyText(text) {
        const urlPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        return text.replace(urlPattern, function(url) {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="chat-link">${url}</a>`;
        });
    }

    function renderMarkdown(text) {
        // Wait for marked to load
        if (typeof marked === 'undefined') {
            return linkifyText(text); // Fallback if marked isn't loaded
        }
        // Parse Markdown to HTML and then linkify any URLs
        const html = marked.parse(text, { breaks: true }); // breaks: true ensures \n is converted to <br>
        return linkifyText(html);
    }

    function showRegistrationForm() {
        chatWelcome.style.display = 'none';
        userRegistration.classList.add('active');
        nameInput.focus();
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async function handleRegistration(event) {
        event.preventDefault();
        
        nameError.textContent = '';
        emailError.textContent = '';
        nameInput.classList.remove('error');
        emailInput.classList.remove('error');
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        
        let isValid = true;
        
        if (!name) {
            nameError.textContent = 'Please enter your name';
            nameInput.classList.add('error');
            isValid = false;
        }
        
        if (!email) {
            emailError.textContent = 'Please enter your email';
            emailInput.classList.add('error');
            isValid = false;
        } else if (!isValidEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailInput.classList.add('error');
            isValid = false;
        }
        
        if (!isValid) return;
        
        conversationId = createSessionId();
        
        const sessionData = [{
            action: "loadPreviousSession",
            sessionId: conversationId,
            route: settings.webhook.route,
            metadata: {
                userId: email,
                userName: name
            }
        }];

        try {
            userRegistration.classList.remove('active');
            chatBody.classList.add('active');
            
            const typingIndicator = createTypingIndicator();
            messagesContainer.appendChild(typingIndicator);
            
            const sessionResponse = await fetch(settings.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sessionData)
            });
            
            if (!sessionResponse.ok) {
                throw new Error(`HTTP error! status: ${sessionResponse.status}`);
            }
            
            const sessionResponseData = await sessionResponse.json();
            
            const userInfoMessage = `Name: ${name}\nEmail: ${email}`;
            
            const userInfoData = {
                action: "sendMessage",
                sessionId: conversationId,
                route: settings.webhook.route,
                chatInput: userInfoMessage,
                metadata: {
                    userId: email,
                    userName: name,
                    isUserInfo: true
                }
            };
            
            const userInfoResponse = await fetch(settings.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userInfoData)
            });
            
            if (!userInfoResponse.ok) {
                throw new Error(`HTTP error! status: ${userInfoResponse.status}`);
            }
            
            const userInfoResponseData = await userInfoResponse.json();
            
            messagesContainer.removeChild(typingIndicator);
            
            const botMessage = document.createElement('div');
            botMessage.className = 'chat-bubble bot-bubble';
            let messageText = "Sorry, I couldn't process the response. Please try again.";
            if (Array.isArray(userInfoResponseData) && userInfoResponseData[0]?.output) {
                messageText = userInfoResponseData[0].output;
            } else if (userInfoResponseData?.output) {
                messageText = userInfoResponseData.output;
            }
            botMessage.innerHTML = renderMarkdown(messageText);
            messagesContainer.appendChild(botMessage);
            
            if (settings.suggestedQuestions && Array.isArray(settings.suggestedQuestions) && settings.suggestedQuestions.length > 0) {
                const suggestedQuestionsContainer = document.createElement('div');
                suggestedQuestionsContainer.className = 'suggested-questions';
                
                settings.suggestedQuestions.forEach(question => {
                    const questionButton = document.createElement('button');
                    questionButton.className = 'suggested-question-btn';
                    questionButton.textContent = question;
                    questionButton.addEventListener('click', () => {
                        submitMessage(question);
                        if (suggestedQuestionsContainer.parentNode) {
                            suggestedQuestionsContainer.parentNode.removeChild(suggestedQuestionsContainer);
                        }
                    });
                    suggestedQuestionsContainer.appendChild(questionButton);
                });
                
                messagesContainer.appendChild(suggestedQuestionsContainer);
            }
            
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Registration error:', error);
            messagesContainer.removeChild(messagesContainer.querySelector('.typing-indicator'));
            const errorMessage = document.createElement('div');
            errorMessage.className = 'chat-bubble bot-bubble';
            errorMessage.textContent = error.message.includes('Failed to fetch') ?
                "Sorry, I couldn't connect to the server due to a network issue. Please check your connection and try again." :
                "Sorry, I couldn't connect to the server. Please try again later.";
            messagesContainer.appendChild(errorMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    async function submitMessage(messageText) {
        if (isWaitingForResponse) return;
        
        isWaitingForResponse = true;
        
        const name = nameInput ? nameInput.value.trim() : "";
        const email = emailInput ? emailInput.value.trim() : "";
        
        const requestData = {
            action: "sendMessage",
            sessionId: conversationId,
            route: settings.webhook.route,
            chatInput: messageText,
            metadata: {
                userId: email,
                userName: name
            }
        };

        const userMessage = document.createElement('div');
        userMessage.className = 'chat-bubble user-bubble';
        userMessage.textContent = messageText;
        messagesContainer.appendChild(userMessage);
        
        const typingIndicator = createTypingIndicator();
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Add timeout for slow responses
        const timeoutMessage = setTimeout(() => {
            messagesContainer.removeChild(typingIndicator);
            const delayMessage = document.createElement('div');
            delayMessage.className = 'chat-bubble bot-bubble';
            delayMessage.textContent = "This is taking a bit longer than expected. Please wait a moment!";
            messagesContainer.appendChild(delayMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 3000); // Show message after 3 seconds

        try {
            const response = await fetch(settings.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            clearTimeout(timeoutMessage);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const responseData = await response.json();
            
            messagesContainer.removeChild(typingIndicator);
            
            const botMessage = document.createElement('div');
            botMessage.className = 'chat-bubble bot-bubble';
            let responseText = "Sorry, I couldn't process the response. Please try again.";
            if (Array.isArray(responseData) && responseData[0]?.output) {
                responseText = responseData[0].output;
            } else if (responseData?.output) {
                responseText = responseData.output;
            }
            botMessage.innerHTML = renderMarkdown(responseText);
            messagesContainer.appendChild(botMessage);
            
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            clearTimeout(timeoutMessage);
            console.error('Message submission error:', error);
            messagesContainer.removeChild(typingIndicator);
            const errorMessage = document.createElement('div');
            errorMessage.className = 'chat-bubble bot-bubble';
            errorMessage.textContent = error.message.includes('Failed to fetch') ?
                "Sorry, I couldn't connect to the server due to a network issue. Please check your connection and try again." :
                "Sorry, I couldn't send your message. Please try again.";
            messagesContainer.appendChild(errorMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } finally {
            isWaitingForResponse = false;
        }
    }

    function autoResizeTextarea() {
        messageTextarea.style.height = 'auto';
        const scrollHeight = messageTextarea.scrollHeight;
        messageTextarea.style.height = (scrollHeight > 120 ? 120 : scrollHeight) + 'px';
    }

    // Event listeners
    startChatButton.addEventListener('click', showRegistrationForm);
    registrationForm.addEventListener('submit', handleRegistration);
    
    sendButton.addEventListener('click', () => {
        const messageText = messageTextarea.value.trim();
        if (messageText && !isWaitingForResponse) {
            submitMessage(messageText);
            messageTextarea.value = '';
            messageTextarea.style.height = 'auto';
        }
    });
    
    messageTextarea.addEventListener('input', autoResizeTextarea);
    
    messageTextarea.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            const messageText = messageTextarea.value.trim();
            if (messageText && !isWaitingForResponse) {
                submitMessage(messageText);
                messageTextarea.value = '';
                messageTextarea.style.height = 'auto';
            }
        }
    });
    
    launchButton.addEventListener('click', () => {
        chatWindow.classList.toggle('visible');
    });

    const closeButtons = chatWindow.querySelectorAll('.chat-close-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatWindow.classList.remove('visible');
        });
    });

    // Initialize widget
    if (settings.branding.welcomeText && settings.branding.name) {
        chatWindow.classList.add('visible');
    }
})();