// Make entire question options clickable
document.querySelectorAll('.question-option').forEach(option => {
    option.addEventListener('click', function() {
        const radioButton = this.querySelector('input[type="radio"]');
        radioButton.checked = true;
    });
});