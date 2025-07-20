// Interactive Political Spectrum
document.addEventListener('DOMContentLoaded', function() {
    const spectrumBar = document.querySelector('.spectrum-bar');
    const spectrumMarker = document.getElementById('spectrumMarker');
    const spectrumPosition = document.getElementById('spectrumPosition');
    
    if (!spectrumBar || !spectrumMarker || !spectrumPosition) return;
    
    // Initialize marker at center
    let isDragging = false;
    let currentPosition = 50; // Start at center
    
    // Set initial position
    updateMarkerPosition(currentPosition);
    
    // Initialize the first label with proper class
    const initialSpan = document.createElement('span');
    initialSpan.textContent = 'Centrist';
    initialSpan.style.color = '#6b7280';
    initialSpan.className = 'current';
    spectrumPosition.innerHTML = '';
    spectrumPosition.appendChild(initialSpan);
    
    // Mouse events for dragging
    spectrumMarker.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
    
    // Touch events for mobile
    spectrumMarker.addEventListener('touchstart', startDragging);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', stopDragging);
    
    // Click on spectrum bar
    spectrumBar.addEventListener('click', handleSpectrumClick);
    spectrumBar.addEventListener('touchend', handleSpectrumClick);
    
    function startDragging(e) {
        isDragging = true;
        e.preventDefault();
        spectrumMarker.style.transition = 'none'; // Remove transition during drag
    }
    
    function stopDragging() {
        isDragging = false;
        spectrumMarker.style.transition = 'left 0.1s ease'; // Restore smooth transition
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        const rect = spectrumBar.getBoundingClientRect();
        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const position = ((clientX - rect.left) / rect.width) * 100;
        
        updateMarkerPosition(Math.max(0, Math.min(100, position)));
    }
    
    function handleSpectrumClick(e) {
        const rect = spectrumBar.getBoundingClientRect();
        const clientX = e.type === 'click' ? e.clientX : e.changedTouches[0].clientX;
        const position = ((clientX - rect.left) / rect.width) * 100;
        
        updateMarkerPosition(Math.max(0, Math.min(100, position)));
    }
    
    function updateMarkerPosition(position) {
        currentPosition = position;
        spectrumMarker.style.left = position + '%';
        
        // Update position label
        let label = '';
        let color = '';
        
        if (position < 20) {
            label = 'Strong Liberal';
            color = '#1e40af';
        } else if (position < 40) {
            label = 'Liberal';
            color = '#2563eb';
        } else if (position < 60) {
            label = 'Centrist';
            color = '#6b7280';
        } else if (position < 80) {
            label = 'Conservative';
            color = '#dc2626';
        } else {
            label = 'Strong Conservative';
            color = '#991b1b';
        }
        
        // Only animate if the label is actually changing
        const currentSpan = spectrumPosition.querySelector('.current');
        if (!currentSpan || currentSpan.textContent !== label) {
            animateLabelChange(label, color);
        }
    }
    
    function animateLabelChange(newLabel, newColor) {
        const currentSpan = spectrumPosition.querySelector('.current');
        const newSpan = document.createElement('span');
        
        // Set up new span
        newSpan.textContent = newLabel;
        newSpan.style.color = newColor;
        newSpan.className = 'sliding-in';
        spectrumPosition.appendChild(newSpan);
        
        // Trigger animation
        requestAnimationFrame(() => {
            if (currentSpan) {
                currentSpan.className = 'sliding-out';
            }
            newSpan.className = 'current';
            
            // Clean up old span after animation
            setTimeout(() => {
                if (currentSpan) {
                    currentSpan.remove();
                }
            }, 300);
        });
    }
    
    // Add smooth animation on page load
    setTimeout(() => {
        spectrumMarker.style.transition = 'left 0.2s ease';
    }, 1000);
});

// Add scroll animations for sections
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

// Observe all sections for animation
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.policy-card, .timeline-item, .misconception-card, .principle-card');
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});
