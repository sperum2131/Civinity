// Make entire question options clickable
document.querySelectorAll('.question-option').forEach(option => {
    option.addEventListener('click', function() {
        const radioButton = this.querySelector('input[type="radio"]');
        radioButton.checked = true;
    });
});

// Clear responses button functionality
document.getElementById('clearBtn').addEventListener('click', function() {
    const allRadioButtons = document.querySelectorAll('input[type="radio"]');
    allRadioButtons.forEach(radio => {
        radio.checked = false;
    });
});

// Submit quiz button functionality
document.getElementById('submitBtn').addEventListener('click', function() {
    const allRadioButtons = document.querySelectorAll('input[type="radio"]');
    const checkedButtons = document.querySelectorAll('input[type="radio"]:checked');
    
    if (checkedButtons.length < allRadioButtons.length / 3) {
        alert('Please answer all questions before submitting.');
        return;
    }
    
    // Here you can add the logic to process the quiz results
    alert('Quiz submitted successfully!');
});