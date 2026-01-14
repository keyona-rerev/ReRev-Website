// load-components.js - Loads navigation and footer on all pages

document.addEventListener('DOMContentLoaded', function() {
    // Figure out if we're in a blog post
    const currentPath = window.location.pathname;
    const isBlogPost = currentPath.includes('Blog%20Posts') || 
                       currentPath.includes('Blog Posts') || 
                       window.location.href.includes('Blog Posts');
    
    // Set base path for includes
    const basePath = isBlogPost ? '../' : './';
    
    // Load navigation
    fetch(basePath + 'navigation.html')
        .then(response => response.text())
        .then(data => {
            // Insert navigation at the beginning of the body
            document.body.insertAdjacentHTML('afterbegin', data);
            // Set which nav link is active
            setActiveNavLink();
            // Make mobile menu work
            initMobileMenu();
        })
        .catch(error => console.error('Error loading navigation:', error));
    
    // Load footer
    fetch(basePath + 'footer.html')
        .then(response => response.text())
        .then(data => {
            // Insert footer at the end of the body
            document.body.insertAdjacentHTML('beforeend', data);
        })
        .catch(error => console.error('Error loading footer:', error));
    
    // Figure out which page we're on and highlight the right nav link
    function setActiveNavLink() {
        // Get current page filename (like "index.html" or "services.html")
        const currentPage = window.location.pathname.split('/').pop();
        
        // Find all nav links
        const navLinks = document.querySelectorAll('.nav-links a[data-page]');
        
        navLinks.forEach(link => {
            // Remove active class from all links first
            link.classList.remove('active');
            
            // Check if this link's data-page matches current page
            const linkPage = link.getAttribute('data-page');
            
            // Special case for index.html
            if (currentPage === '' || currentPage === 'index.html' || currentPage === '../index.html') {
                if (linkPage === 'index') {
                    link.classList.add('active');
                }
            }
            // Check other pages
            else if (currentPage.includes(linkPage)) {
                link.classList.add('active');
            }
        });
    }
    
    // Make mobile menu button work (same as your existing script.js)
    function initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', function() {
                navLinks.classList.toggle('active');
                // Change hamburger to X and back
                const icon = this.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            });
        }
    }
});
