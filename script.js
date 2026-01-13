// script.js - FORM HANDLING AND PAGE-SPECIFIC JAVASCRIPT ONLY
// Mobile menu code is now in load-components.js

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // REMOVE FORM VALIDATION IF USING PHP
    // ============================================
    // If you're using form-handler.php, COMMENT OUT or DELETE this entire section:
    
    /*
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // Basic validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const interest = document.getElementById('interest').value;
            
            if (!name || !email || !interest) {
                alert('Please fill in all required fields.');
                event.preventDefault();
                return;
            }
            
            alert('Thank you! Your message has been sent.');
            contactForm.reset();
        });
    }
    */
    
    // ============================================
    // DROPDOWN STYLING FIX
    // ============================================
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.style.backgroundColor = 'rgba(5, 27, 47, 0.8)';
        select.style.color = '#ffffff';
        
        select.addEventListener('focus', function() {
            this.style.backgroundColor = 'rgba(5, 27, 47, 0.9)';
        });
        
        select.addEventListener('blur', function() {
            this.style.backgroundColor = 'rgba(5, 27, 47, 0.8)';
        });
    });
    
    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                event.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
