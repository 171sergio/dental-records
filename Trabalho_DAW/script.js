// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Sticky note effect
    const stickyNote = document.querySelector('.sticky-note');
    if (stickyNote) {
        // Add a slight random rotation on page load
        const randomRotation = Math.random() * 10 - 5;
        stickyNote.style.transform = `rotate(${randomRotation}deg)`;

        // Make the sticky note draggable
        let isDragging = false;
        let offsetX, offsetY;

        stickyNote.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - stickyNote.getBoundingClientRect().left;
            offsetY = e.clientY - stickyNote.getBoundingClientRect().top;
            stickyNote.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                stickyNote.style.left = (e.clientX - offsetX) + 'px';
                stickyNote.style.top = (e.clientY - offsetY) + 'px';
                stickyNote.style.right = 'auto'; // Clear the right property when moving
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            stickyNote.style.cursor = 'grab';
        });

        // Add hover effect
        stickyNote.addEventListener('mouseover', function() {
            this.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
        });

        stickyNote.addEventListener('mouseout', function() {
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        });
    }

    // Add animation to feature cards on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    
    function checkScroll() {
        featureCards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (cardTop < windowHeight * 0.8) {
                card.classList.add('animate-fade-in');
                card.style.opacity = 1;
                card.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial state for cards
    featureCards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll);
    // Initial check in case elements are already in view on page load
    checkScroll();

    // Mobile navigation toggle (placeholder for future expansion)
    // This could be expanded with actual mobile menu functionality
    function handleMobileNavigation() {
        // Add mobile navigation implementation here
        console.log('Mobile navigation functionality placeholder');
    }
}); 