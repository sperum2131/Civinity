// AI Debate Chatbot with Groq API
const GROQ_API_KEY = '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'; // API key for Groq API
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'; // Base URL for Groq API

// Debate state
let currentTopic = '';
let userIdeology = '';
let debateHistory = [];

// 9 most controversial topics for the user to debate about
const topics = {
    healthcare: {
        name: 'Healthcare',
        description: 'Universal healthcare vs market-based solutions',
        liberalPosition: 'Universal healthcare ensures everyone has access to medical care regardless of income.',
        conservativePosition: 'Market-based solutions provide better quality and efficiency through competition.'
    },
    climate: {
        name: 'Climate Change',
        description: 'Government regulation vs innovation',
        liberalPosition: 'Government action is necessary to address climate change through regulations and incentives.',
        conservativePosition: 'Innovation and technology will solve climate issues better than government mandates.'
    },
    immigration: {
        name: 'Immigration',
        description: 'Pathways to citizenship vs border security',
        liberalPosition: 'Comprehensive immigration reform with pathways to citizenship for undocumented immigrants.',
        conservativePosition: 'Strong border security and enforcement of existing immigration laws.'
    },
    economy: {
        name: 'Economic Policy',
        description: 'Progressive taxation vs lower taxes',
        liberalPosition: 'Progressive taxation ensures the wealthy pay their fair share to fund social programs.',
        conservativePosition: 'Lower taxes stimulate economic growth and create more opportunities for everyone.'
    },
    education: {
        name: 'Education',
        description: 'Public funding vs school choice',
        liberalPosition: 'Strong public education system ensures equal opportunities for all students.',
        conservativePosition: 'School choice and competition improve education quality and outcomes.'
    },
    guns: {
        name: 'Gun Rights',
        description: 'Regulation vs Second Amendment rights',
        liberalPosition: 'Common-sense gun regulations help prevent violence while respecting rights.',
        conservativePosition: 'The Second Amendment protects the right to bear arms for self-defense.'
    },
    abortion: {
        name: 'Abortion',
        description: 'Reproductive rights vs fetal protection',
        liberalPosition: 'Women should have the right to make decisions about their own bodies and reproductive health.',
        conservativePosition: 'Life begins at conception and should be protected from the moment of fertilization.'
    },
    foreign: {
        name: 'Foreign Policy',
        description: 'International engagement vs isolationism',
        liberalPosition: 'Active international cooperation and diplomacy promote global stability and human rights.',
        conservativePosition: 'National sovereignty and strategic interests should guide foreign policy decisions.'
    },
    social: {
        name: 'Social Media',
        description: 'Platform regulation vs free expression',
        liberalPosition: 'Social media platforms should be regulated to prevent misinformation and protect users.',
        conservativePosition: 'Free speech should be protected online without government interference or censorship.'
    }
};

// When the page loads, get the user's political orientation and add event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load user's political orientation
    loadUserIdeology();
    
    // Add event listeners
    setupEventListeners();
    
    // Initialize debate interface
    initializeDebate();
});

// Check local storage for the user's political orientation
function loadUserIdeology() {
    const savedOrientation = localStorage.getItem('politicalOrientation');
    if (savedOrientation) {
        try {
            const orientation = JSON.parse(savedOrientation);
            userIdeology = orientation.category;
        } catch (error) {
            userIdeology = 'centrist';
        }
    } else {
        userIdeology = 'centrist'; // Default to centrist if nothing is found
    }
}

// Add event listeners to the topic buttons and message input
function setupEventListeners() {
    // CHoose a topic
    document.querySelectorAll('.topic-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const topic = this.dataset.topic;
            selectTopic(topic);
        });
    });
    
    // Message input box
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

// Select a topic
function selectTopic(topic) {
    currentTopic = topic;
    
    // Update the UI to show the debate interface
    document.getElementById('debateSetup').style.display = 'none';
    document.getElementById('debateInterface').style.display = 'block';
    
    // Update the topic title and description
    document.getElementById('currentTopic').textContent = topics[topic].name + ' Debate';
    document.getElementById('topicDescription').textContent = topics[topic].description;
    
    // Clear the chat
    document.getElementById('chatMessages').innerHTML = '';
    
    // Add welcome message to the chat
    addMessage('ai', getWelcomeMessage(topic));
    
    // Scroll to the debate interface
    document.getElementById('debateInterface').scrollIntoView({ behavior: 'smooth' });
}

// Get the welcome message for the debate
function getWelcomeMessage(topic) {
    const topicConfig = topics[topic];
    const oppositePosition = getOppositePosition(userIdeology, topic);
    
    return `Hello! I'm your AI debate partner. I'll be arguing the <strong>${oppositePosition}</strong> position on ${topicConfig.name.toLowerCase()} to help you practice respectful political discourse. 

I'm here to engage in healthy debate, so I'll:
• Present evidence and facts
• Respect your viewpoint
• Avoid personal attacks
• Look for common ground when possible

What's your stance on ${topicConfig.name.toLowerCase()}?`;
}

// Get the opposite position for the user to debate about
function getOppositePosition(userIdeology, topic) {
    const topicConfig = topics[topic];
    
    // If the user is liberal, the AI will be conservative
    if (userIdeology.includes('liberal')) {
        return 'conservative';
    } else if (userIdeology.includes('conservative')) {
        return 'liberal';
    } else {
        // CHoose between the 2 positions randomly for centrists
        return Math.random() > 0.5 ? 'liberal' : 'conservative';
    }
}

// Send a message to the AI
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage('user', message);
    
    // Clear input
    messageInput.value = '';
    
    // Show loading
    showLoading();
    
    // Send to Groq API
    sendToGroq(message);
}

// Add a message to the chat
function addMessage(sender, content) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    
    // Use Google Fonts SVGs for avatars
    if (sender === 'user') {
        avatar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/>
        </svg>`;
    } else {
        avatar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="M160-360q-50 0-85-35t-35-85q0-50 35-85t85-35v-80q0-33 23.5-56.5T240-760h120q0-50 35-85t85-35q50 0 85 35t35 85h120q33 0 56.5 23.5T800-680v80q50 0 85 35t35 85q0 50-35 85t-85 35v160q0 33-23.5 56.5T720-120H240q-33 0-56.5-23.5T160-200v-160Zm200-80q25 0 42.5-17.5T420-500q0-25-17.5-42.5T360-560q-25 0-42.5 17.5T300-500q0 25 17.5 42.5T360-440Zm240 0q25 0 42.5-17.5T660-500q0-25-17.5-42.5T600-560q-25 0-42.5 17.5T540-500q0 25 17.5 42.5T600-440ZM320-280h320v-80H320v80Z"/>
        </svg>`;
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Format AI messages with proper HTML structure
    if (sender === 'ai') {
        contentDiv.innerHTML = formatAIResponse(content);
    } else {
        contentDiv.innerHTML = `<p>${content}</p>`;
    }
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add to history
    debateHistory.push({ role: sender === 'user' ? 'user' : 'assistant', content });
}

// Format the AI response
function formatAIResponse(content) {
    // Convert markdown-style formatting to HTML
    let formatted = content;
    
    // Bold text
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Headers
    formatted = formatted.replace(/^### (.*$)/gm, '<h4>$1</h4>');
    formatted = formatted.replace(/^## (.*$)/gm, '<h3>$1</h3>');
    
    // Bullet points
    formatted = formatted.replace(/^• (.*$)/gm, '<li>$1</li>');
    formatted = formatted.replace(/^- (.*$)/gm, '<li>$1</li>');
    
    // Wrap lists in ul tags
    formatted = formatted.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    
    // Statistics (numbers in parentheses)
    formatted = formatted.replace(/\((\d+)\)/g, '<span class="stat">($1)</span>');
    
    // Source citations
    formatted = formatted.replace(/\((.*?)\)/g, '<span class="source">($1)</span>');
    
    // Fact check sections
    formatted = formatted.replace(/<h4>(.*?)<\/h4>/g, '<div class="fact-check"><h4>$1</h4>');
    formatted = formatted.replace(/<\/div><div class="fact-check">/g, '</div><div class="fact-check">');
    
    // Section dividers
    formatted = formatted.replace(/\n\n/g, '<div class="section"></div>');
    
    // Highlight important terms
    formatted = formatted.replace(/\b(universal healthcare|market-based|regulation|innovation)\b/gi, '<span class="highlight">$1</span>');
    
    // Wrap in paragraphs
    const lines = formatted.split('\n');
    const paragraphs = lines.map(line => {
        if (line.trim() === '') return '';
        if (line.startsWith('<h') || line.startsWith('<ul') || line.startsWith('</ul') || 
            line.startsWith('<div') || line.startsWith('</div') || line.startsWith('<li>')) {
            return line;
        }
        return `<p>${line}</p>`;
    });
    
    return paragraphs.join('');
}

// Show the loading dots
function showLoading() {
    const chatMessages = document.getElementById('chatMessages');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message ai-message loading-message';
    loadingDiv.id = 'loadingMessage';
    
    loadingDiv.innerHTML = `
        <div class="message-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                <path d="M160-360q-50 0-85-35t-35-85q0-50 35-85t85-35v-80q0-33 23.5-56.5T240-760h120q0-50 35-85t85-35q50 0 85 35t35 85h120q33 0 56.5 23.5T800-680v80q50 0 85 35t35 85q0 50-35 85t-85 35v160q0 33-23.5 56.5T720-120H240q-33 0-56.5-23.5T160-200v-160Zm200-80q25 0 42.5-17.5T420-500q0-25-17.5-42.5T360-560q-25 0-42.5 17.5T300-500q0 25 17.5 42.5T360-440Zm240 0q25 0 42.5-17.5T660-500q0-25-17.5-42.5T600-560q-25 0-42.5 17.5T540-500q0 25 17.5 42.5T600-440ZM320-280h320v-80H320v80Z"/>
            </svg>
        </div>
        <div class="message-content">
            <div class="loading">
                <span>AI is thinking</span>
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Main function to send message to Groq API
async function sendToGroq(userMessage) {
    try {
        const topicConfig = topics[currentTopic];
        const oppositePosition = getOppositePosition(userIdeology, currentTopic);
        
        const systemPrompt = `You are an AI debate partner focused on healthy political discourse. You are arguing the ${oppositePosition} position on ${topicConfig.name.toLowerCase()}.

IMPORTANT RULES:
1. Always be respectful and civil
2. Use facts and evidence to support your arguments
3. Acknowledge valid points from the user
4. Avoid personal attacks or inflammatory language
5. Look for areas of common ground when possible
6. Keep responses concise but substantive (2-3 sentences)
7. Ask follow-up questions to encourage deeper discussion
8. Use markdown formatting: **bold** for emphasis, ### for headers, • for bullet points

Current topic: ${topicConfig.name}
Your position: ${oppositePosition}
User's position: ${userIdeology.includes('liberal') ? 'liberal' : userIdeology.includes('conservative') ? 'conservative' : 'centrist'}

Remember: The goal is healthy debate, not winning arguments.`;

        // Send the message to Groq API
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...debateHistory.slice(-6), // 6 last messages for context for the AI to know the conversation
                    { role: 'user', content: userMessage }
                ],
                max_tokens: 400,
                temperature: 0.7
            })
        });

        // If the response is not ok, throw an error
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        // Remove loading message
        const loadingMessage = document.getElementById('loadingMessage');
        if (loadingMessage) {
            loadingMessage.remove();
        }

        // Add AI response
        addMessage('ai', aiResponse);

    } catch (error) {
        console.error('Error calling Groq API:', error);
        
        // Remove loading message
        const loadingMessage = document.getElementById('loadingMessage');
        if (loadingMessage) {
            loadingMessage.remove();
        }

        // Add error message
        addMessage('ai', 'I apologize, but I\'m having trouble responding right now. Please try again in a moment.');
    }
}

// Fact check button
function requestFactCheck() {
    const factCheckPrompt = `Please provide a fact check for the current debate topic: ${topics[currentTopic].name}. Include reliable sources and data that support both perspectives. Format your response with headers (###) for each section and bullet points (•) for key facts.`;
    
    addMessage('user', 'Can you fact check this topic?');
    showLoading();
    sendToGroq(factCheckPrompt);
}

// Common ground button
function requestCommonGround() {
    const commonGroundPrompt = `What are some areas of potential common ground between liberal and conservative positions on ${topics[currentTopic].name}? Focus on shared values and goals. Use bullet points (•) to list common areas.`;
    
    addMessage('user', 'Can you help us find common ground?');
    showLoading();
    sendToGroq(commonGroundPrompt);
}

// Explanation button
function requestExplanation() {
    const explanationPrompt = `Please explain the key concepts and terminology related to ${topics[currentTopic].name} in simple terms that someone new to this topic would understand. Use headers (###) for different concepts and bullet points (•) for key points.`;
    
    addMessage('user', 'Can you explain the basics of this topic?');
    showLoading();
    sendToGroq(explanationPrompt);
}

// Start a new debate
function startNewDebate() {
    // Reset to topic selection
    document.getElementById('debateInterface').style.display = 'none';
    document.getElementById('debateSetup').style.display = 'block';
    
    // Clear state
    currentTopic = '';
    debateHistory = [];
    
    // Scroll to top
    document.getElementById('debateSetup').scrollIntoView({ behavior: 'smooth' });
}

// Start the debate interface
function initializeDebate() {
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Add success animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.topic-btn, .setup-card, .debate-interface').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}
