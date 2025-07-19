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
        questions.forEach(question => {
            const radioButtons = question.querySelectorAll('input[type="radio"]');
            const hasAnswer = Array.from(radioButtons).some(radio => radio.checked);
            
            if (!hasAnswer) {
                const questionOptions = question.querySelectorAll('.question-option');
                questionOptions.forEach(option => {
                    option.classList.add('unanswered');
                });
            }
        });
        return;
    }
    
    // Calculate political orientation
    const result = calculatePoliticalOrientation();
    
    if (result) {
        // Save to localStorage
        localStorage.setItem('politicalOrientation', JSON.stringify(result));
        
        // Display results
        displayResults(result);
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
    // Create results modal
    const modal = document.createElement('div');
    modal.className = 'results-modal';
    modal.innerHTML = `
        <div class="results-content">
            <h2>Your Political Orientation</h2>
            <div class="result-category">
                <h3>${result.label}</h3>
                <p>${result.description}</p>
                <div class="score-display">
                    <span>Score: ${(result.score * 100).toFixed(0)}%</span>
                    <div class="spectrum-bar">
                        <div class="spectrum-fill" style="left: ${((result.score + 1) / 2) * 100}%"></div>
                    </div>
                    <div class="spectrum-labels">
                        <span>Conservative</span>
                        <span>Liberal</span>
                    </div>
                </div>
            </div>
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