// Blog Posts/blog-loader.js - For blog posts only
document.addEventListener('DOMContentLoaded', function() {
    // Load navigation (go up one level to root)
    fetch('../navigation.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            // Set blog link as active
            const navLinks = document.querySelectorAll('.nav-links a');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.href.includes('blog.html')) {
                    link.classList.add('active');
                }
            });
            // Init mobile menu
            initMobileMenu();
        })
        .catch(error => console.error('Error loading navigation:', error));
    
    // Load footer (go up one level to root)
    fetch('../footer.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
        })
        .catch(error => console.error('Error loading footer:', error));
    
    function initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', function() {
                navLinks.classList.toggle('active');
                const icon = this.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            });
        }
    }
});
