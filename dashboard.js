// Get DOM elements
const editButton = document.getElementById('editZipCode');
const zipCodeInput = document.getElementById('zipCodeInput');

// Load zip code from localStorage or use default
function loadZipCode() {
    const savedZipCode = localStorage.getItem('zipCode');
    if (savedZipCode) {
        zipCodeInput.value = savedZipCode;
    } else {
        zipCodeInput.value = '12345';
        localStorage.setItem('zipCode', '12345');
    }
}

// Initialize zip code on page load
loadZipCode();

// Load political orientation from localStorage
function loadPoliticalOrientation() {
    const savedOrientation = localStorage.getItem('politicalOrientation');
    const politicalOrientationInput = document.getElementById('politicalOrientationInput');
    
    if (savedOrientation) {
        try {
            const orientation = JSON.parse(savedOrientation);
            politicalOrientationInput.value = orientation.label;
        } catch (error) {
            politicalOrientationInput.value = 'Not Available';
        }
    } else {
        politicalOrientationInput.value = 'Not Available';
    }
}

// Initialize political orientation on page load
loadPoliticalOrientation();

// Load quiz score from localStorage
function loadQuizScore() {
    const savedOrientation = localStorage.getItem('politicalOrientation');
    const quizScoreInput = document.getElementById('quizScoreInput');
    
    if (savedOrientation) {
        try {
            const orientation = JSON.parse(savedOrientation);
            const scorePercentage = (orientation.score * 100).toFixed(0);
            quizScoreInput.value = `${scorePercentage}%`;
        } catch (error) {
            quizScoreInput.value = 'Not Available';
        }
    } else {
        quizScoreInput.value = 'Not Available';
    }
}

// Initialize quiz score on page load
loadQuizScore();

function loadDescription() {
    const savedDescription = localStorage.getItem('politicalOrientation');
    const descriptionInput = document.getElementById('descriptionInput');

    if (savedDescription) {
        try {
            const description = JSON.parse(savedDescription);
            const descriptionText = description.description;
            descriptionInput.value = descriptionText;
        } catch (error) {
            descriptionInput.value = 'Not Available';
        }
    } else {
        descriptionInput.value = 'Not Available';
    }
}

// Initialize description on page load
loadDescription();

// Toggle edit functionality
function toggleEdit() {
    const isReadOnly = zipCodeInput.readOnly;
    
    if (isReadOnly) {
        // Switch to edit mode
        zipCodeInput.readOnly = false;
        zipCodeInput.focus();
        editButton.textContent = 'Save';
        editButton.classList.add('primary');
    } else {
        // Switch to read-only mode
        zipCodeInput.readOnly = true;
        editButton.textContent = 'Edit';
        editButton.classList.remove('primary');
        
        // Save to localStorage
        localStorage.setItem('zipCode', zipCodeInput.value);
    }
}

// Click event
editButton.addEventListener('click', toggleEdit);

// Enter key event
zipCodeInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        toggleEdit();
    }
});
