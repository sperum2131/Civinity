// Make entire question options clickable
document.querySelectorAll('.question-option').forEach(option => {
    option.addEventListener('click', function() {
        const radioButton = this.querySelector('input[type="radio"]');
        radioButton.checked = true;
        
        // Remove unanswered class from all options in this question
        const question = this.closest('.question');
        const questionOptions = question.querySelectorAll('.question-option');
        questionOptions.forEach(option => {
            option.classList.remove('unanswered');
        });
    });
});

// Clear responses button functionality
document.getElementById('clearBtn').addEventListener('click', function() {
    const allRadioButtons = document.querySelectorAll('input[type="radio"]');
    allRadioButtons.forEach(radio => {
        radio.checked = false;
    });
    
    // Remove unanswered class from all question options
    document.querySelectorAll('.question-option').forEach(option => {
        option.classList.remove('unanswered');
    });
    
    // Scroll to top smoothly
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Submit quiz button functionality
document.getElementById('submitBtn').addEventListener('click', function() {
    const allRadioButtons = document.querySelectorAll('input[type="radio"]');
    const checkedButtons = document.querySelectorAll('input[type="radio"]:checked');
    
    if (checkedButtons.length < allRadioButtons.length / 3) {
        // Remove any existing unanswered classes first
        document.querySelectorAll('.question-option').forEach(option => {
            option.classList.remove('unanswered');
        });
        
        // Find unanswered questions and add unanswered class to their options
        const questions = document.querySelectorAll('.question');
        let firstUnansweredQuestion = null;
        
        questions.forEach(question => {
            const radioButtons = question.querySelectorAll('input[type="radio"]');
            const hasAnswer = Array.from(radioButtons).some(radio => radio.checked);
            
            if (!hasAnswer) {
                const questionOptions = question.querySelectorAll('.question-option');
                questionOptions.forEach(option => {
                    option.classList.add('unanswered');
                });
                
                // Store the first unanswered question for scrolling
                if (!firstUnansweredQuestion) {
                    firstUnansweredQuestion = question;
                }
            }
        });
        
        // Scroll to the first unanswered question if found
        if (firstUnansweredQuestion) {
            firstUnansweredQuestion.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
        
        return;
    }
    
    // Calculate political orientation
    const result = calculatePoliticalOrientation();
    
    if (result) {
        // Save to localStorage with reversed score
        const resultWithReversedScore = {
            ...result,
            score: result.score * -1
        };
        localStorage.setItem('politicalOrientation', JSON.stringify(resultWithReversedScore));
        
        // Display results
        displayResults(resultWithReversedScore);
    } else {
        alert('Error calculating results. Please try again.');
    }
});

// Remove unanswered class when any option is selected
document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const question = this.closest('.question');
        const questionOptions = question.querySelectorAll('.question-option');
        questionOptions.forEach(option => {
            option.classList.remove('unanswered');
        });
    });
});

// Question ideological leanings (1 = liberal, -1 = conservative)
const questionLeanings = {
    'question-1': 1,   // Universal healthcare - liberal
    'question-2': 1,   // Social media regulation - liberal
    'question-3': 1,   // Climate change action - liberal
    'question-4': 1,   // Abortion rights - liberal
    'question-5': -1,  // Free market - conservative
    'question-6': 1,   // Income inequality - liberal
    'question-7': -1,  // Traditional marriage - conservative
    'question-8': 1,   // Immigration - liberal
    'question-9': -1,  // Police funding - conservative
    'question-10': -1  // National interests - conservative
};

// Political orientation categories
const politicalCategories = {
    'strong-liberal': { range: [0.75, 1.00], label: 'Strong Liberal', description: 'Strong alignment with progressive/liberal views.' },
    'moderate-liberal': { range: [0.25, 0.74], label: 'Moderate Liberal', description: 'Generally liberal, but with some moderate or mixed views.' },
    'centrist': { range: [-0.24, 0.24], label: 'Centrist / Moderate', description: 'Balanced or mixed views across the political spectrum.' },
    'moderate-conservative': { range: [-0.74, -0.25], label: 'Moderate Conservative', description: 'Generally conservative, but with some moderate or liberal leanings.' },
    'strong-conservative': { range: [-1.00, -0.75], label: 'Strong Conservative', description: 'Strong alignment with traditional/conservative values.' }
};

function calculatePoliticalOrientation() {
    let totalScore = 0;
    let answeredQuestions = 0;
    
    // Calculate score for each answered question
    Object.keys(questionLeanings).forEach(questionName => {
        const radioButtons = document.querySelectorAll(`input[name="${questionName}"]`);
        const checkedButton = document.querySelector(`input[name="${questionName}"]:checked`);
        
        if (checkedButton) {
            answeredQuestions++;
            const questionIndex = Array.from(radioButtons).indexOf(checkedButton);
            let answerScore;
            
            // Convert answer to score: Agree = +1, Neutral = 0, Disagree = -1
            if (questionIndex === 0) answerScore = 1;      // Agree
            else if (questionIndex === 1) answerScore = 0;  // Neutral
            else answerScore = -1;                          // Disagree
            
            // Multiply by question leaning
            const questionLeaning = questionLeanings[questionName];
            const questionScore = answerScore * questionLeaning;
            totalScore += questionScore;
        }
    });
    
    if (answeredQuestions === 0) {
        return null;
    }
    
    // Normalize score between -1 and +1
    const normalizedScore = totalScore / answeredQuestions;
    
    // Determine category
    for (const [category, data] of Object.entries(politicalCategories)) {
        const [min, max] = data.range;
        if (normalizedScore >= min && normalizedScore <= max) {
            return {
                category: category,
                label: data.label,
                description: data.description,
                score: normalizedScore
            };
        }
    }
    
    return null;
}

function displayResults(result) {
    const scorePercent = (result.score * 100).toFixed(0);
    
    // Generate shareable link with results
    const resultData = {
        score: result.score, // This is already the reversed score from above
        label: result.label,
        category: result.category,
        description: result.description
    };
    const encodedResult = btoa(JSON.stringify(resultData));
    const shareableLink = `${window.location.origin}${window.location.pathname}?result=${encodedResult}`;
    
    const redditTitle = encodeURIComponent(`My Civinity Quiz Result: ${scorePercent}%. Apparently, I'm a ${result.label}.`);
    const redditBody = encodeURIComponent(shareableLink);
    const redditURL = `https://www.reddit.com/submit?url=${redditBody}&title=${redditTitle}`;

    const tweetText = `I just took the Civinity quiz and got a score of ${scorePercent}%! Apparently I'm a ${result.label}. Check it out at ${shareableLink}`;
    const encodedTweetText = encodeURIComponent(tweetText);
    const twitterURL = `https://twitter.com/intent/tweet?text=${encodedTweetText}`;

    const whatsappText = `I just took the Civinity quiz and got a score of ${scorePercent}%! Apparently I'm a ${result.label}. Check it out at ${shareableLink}`;
    const encodedWhatsappText = encodeURIComponent(whatsappText);
    const whatsappURL = `https://wa.me/?text=${encodedWhatsappText}`;

    const modal = document.createElement('div');
    modal.className = 'results-modal';
    modal.innerHTML = `
        <div class="results-content">
            <h2>Your Political Orientation</h2>
            <div class="result-category">
                <h3>${result.label}</h3>
                <p>${result.description}</p>
                <div class="score-display">
                    <span>Score: ${scorePercent}%</span>
                    <div class="spectrum-bar">
                        <div class="spectrum-fill" style="left: ${((result.score + 1) / 2) * 100}%"></div>
                    </div>
                    <div class="spectrum-labels">
                        <span>Liberal</span>
                        <span>Conservative</span>
                    </div>
                </div>
                <div class="share-buttons">
                    <a href="${twitterURL}" target="_blank" class="share-button">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="50" height="50" viewBox="0 0 256 256" xml:space="preserve">
<g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
	<polygon points="24.89,23.01 57.79,66.99 65.24,66.99 32.34,23.01 " style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
	<path d="M 45 0 L 45 0 C 20.147 0 0 20.147 0 45 v 0 c 0 24.853 20.147 45 45 45 h 0 c 24.853 0 45 -20.147 45 -45 v 0 C 90 20.147 69.853 0 45 0 z M 56.032 70.504 L 41.054 50.477 L 22.516 70.504 h -4.765 L 38.925 47.63 L 17.884 19.496 h 16.217 L 47.895 37.94 l 17.072 -18.444 h 4.765 L 50.024 40.788 l 22.225 29.716 H 56.032 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
</g>
</svg>
                    </a>
                    <a href="${redditURL}" target="_blank" class="share-button">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="50" height="50" viewBox="0 0 256 256" xml:space="preserve">
<g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
	<circle cx="45" cy="45" r="45" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,69,0); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
	<path d="M 75.011 45 c -0.134 -3.624 -3.177 -6.454 -6.812 -6.331 c -1.611 0.056 -3.143 0.716 -4.306 1.823 c -5.123 -3.49 -11.141 -5.403 -17.327 -5.537 l 2.919 -14.038 l 9.631 2.025 c 0.268 2.472 2.483 4.262 4.955 3.993 c 2.472 -0.268 4.262 -2.483 3.993 -4.955 s -2.483 -4.262 -4.955 -3.993 c -1.421 0.145 -2.696 0.973 -3.4 2.204 L 48.68 17.987 c -0.749 -0.168 -1.499 0.302 -1.667 1.063 c 0 0.011 0 0.011 0 0.022 l -3.322 15.615 c -6.264 0.101 -12.36 2.025 -17.55 5.537 c -2.64 -2.483 -6.801 -2.36 -9.284 0.291 c -2.483 2.64 -2.36 6.801 0.291 9.284 c 0.515 0.481 1.107 0.895 1.767 1.186 c -0.045 0.66 -0.045 1.32 0 1.98 c 0 10.078 11.745 18.277 26.23 18.277 c 14.485 0 26.23 -8.188 26.23 -18.277 c 0.045 -0.66 0.045 -1.32 0 -1.98 C 73.635 49.855 75.056 47.528 75.011 45 z M 30.011 49.508 c 0 -2.483 2.025 -4.508 4.508 -4.508 c 2.483 0 4.508 2.025 4.508 4.508 s -2.025 4.508 -4.508 4.508 C 32.025 53.993 30.011 51.991 30.011 49.508 z M 56.152 62.058 v -0.179 c -3.199 2.405 -7.114 3.635 -11.119 3.468 c -4.005 0.168 -7.919 -1.063 -11.119 -3.468 c -0.425 -0.515 -0.347 -1.286 0.168 -1.711 c 0.447 -0.369 1.085 -0.369 1.544 0 c 2.707 1.98 6.007 2.987 9.362 2.83 c 3.356 0.179 6.667 -0.783 9.407 -2.74 c 0.492 -0.481 1.297 -0.47 1.779 0.022 C 56.655 60.772 56.644 61.577 56.152 62.058 z M 55.537 54.34 c -0.078 0 -0.145 0 -0.224 0 l 0.034 -0.168 c -2.483 0 -4.508 -2.025 -4.508 -4.508 s 2.025 -4.508 4.508 -4.508 s 4.508 2.025 4.508 4.508 C 59.955 52.148 58.02 54.239 55.537 54.34 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
</g>
</svg>
                    </a>
                    <a href="${whatsappURL}" target="_blank" class="share-button">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="50" height="50" viewBox="0 0 256 256" xml:space="preserve">
<g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
	<circle cx="45" cy="45" r="45" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(42,181,64); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
	<path d="M 16.138 44.738 c -0.002 5.106 1.332 10.091 3.869 14.485 l -4.112 15.013 l 15.365 -4.029 c 4.233 2.309 8.999 3.525 13.85 3.527 h 0.012 c 15.973 0 28.976 -12.999 28.983 -28.974 c 0.003 -7.742 -3.01 -15.022 -8.481 -20.498 c -5.472 -5.476 -12.749 -8.494 -20.502 -8.497 C 29.146 15.765 16.145 28.762 16.138 44.738 M 25.288 58.466 l -0.574 -0.911 c -2.412 -3.834 -3.685 -8.266 -3.683 -12.816 c 0.005 -13.278 10.811 -24.081 24.099 -24.081 c 6.435 0.003 12.482 2.511 17.031 7.062 c 4.548 4.552 7.051 10.603 7.05 17.037 C 69.205 58.036 58.399 68.84 45.121 68.84 h -0.009 c -4.323 -0.003 -8.563 -1.163 -12.261 -3.357 l -0.88 -0.522 l -9.118 2.391 L 25.288 58.466 z M 45.122 73.734 L 45.122 73.734 L 45.122 73.734 C 45.122 73.734 45.121 73.734 45.122 73.734" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
	<path d="M 37.878 32.624 c -0.543 -1.206 -1.113 -1.23 -1.63 -1.251 c -0.422 -0.018 -0.905 -0.017 -1.388 -0.017 c -0.483 0 -1.268 0.181 -1.931 0.906 c -0.664 0.725 -2.535 2.477 -2.535 6.039 c 0 3.563 2.595 7.006 2.957 7.49 c 0.362 0.483 5.01 8.028 12.37 10.931 c 6.118 2.412 7.362 1.933 8.69 1.812 c 1.328 -0.121 4.285 -1.751 4.888 -3.442 c 0.604 -1.691 0.604 -3.14 0.423 -3.443 c -0.181 -0.302 -0.664 -0.483 -1.388 -0.845 c -0.724 -0.362 -4.285 -2.114 -4.948 -2.356 c -0.664 -0.241 -1.147 -0.362 -1.63 0.363 c -0.483 0.724 -1.87 2.355 -2.292 2.838 c -0.422 0.484 -0.845 0.544 -1.569 0.182 c -0.724 -0.363 -3.057 -1.127 -5.824 -3.594 c -2.153 -1.92 -3.606 -4.29 -4.029 -5.015 c -0.422 -0.724 -0.045 -1.116 0.318 -1.477 c 0.325 -0.324 0.724 -0.846 1.087 -1.268 c 0.361 -0.423 0.482 -0.725 0.723 -1.208 c 0.242 -0.483 0.121 -0.906 -0.06 -1.269 C 39.929 37.637 38.522 34.056 37.878 32.624" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
</g>
</svg>
                    </a>
                    <button class="share-button copy-link-btn" onclick="copyShareableLink('${shareableLink}')" title="Copy link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <a href="dashboard.html" style="text-decoration: none;">
                <button class="btn btn-secondary">Go to Dashboard</button>
            </a>
            <button class="btn btn-primary" onclick="closeResults()">Close</button>
        </div>
    `;

    document.body.appendChild(modal);
}

function closeResults() {
    const modal = document.querySelector('.results-modal');
    if (modal) {
        modal.remove();
    }
}

// Copy shareable link to clipboard
function copyShareableLink(link) {
    navigator.clipboard.writeText(link).then(() => {
        // Show success feedback
        const copyBtn = document.querySelector('.copy-link-btn');
        if (copyBtn) {
            const originalTitle = copyBtn.getAttribute('title');
            copyBtn.setAttribute('title', 'Copied!');
            copyBtn.style.background = '#374151';
            copyBtn.style.borderColor = '#374151';
            
            setTimeout(() => {
                copyBtn.setAttribute('title', originalTitle);
                copyBtn.style.background = '#6b7280';
                copyBtn.style.borderColor = '#6b7280';
            }, 2000);
        }
    }).catch(err => {
        console.error('Failed to copy link: ', err);
    });
}

// Check for shared results on page load
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const resultParam = urlParams.get('result');
    
    if (resultParam) {
        try {
            const resultData = JSON.parse(atob(resultParam));
            displayResults(resultData);
        } catch (error) {
            console.error('Error parsing shared result:', error);
        }
    }
});