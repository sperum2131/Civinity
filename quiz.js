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
    
    // Here you can add the logic to process the quiz results
    alert('Quiz submitted successfully!');
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