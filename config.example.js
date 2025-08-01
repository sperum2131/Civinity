// Example API Configuration
// Copy this file to config.js and add your actual API keys
const config = {
    GROQ_API_KEY: 'your-groq-api-key-here',
    GROQ_API_URL: 'https://api.groq.com/openai/v1/chat/completions'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} 