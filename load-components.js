// load-components.js - Enhanced version for blog posts
document.addEventListener('DOMContentLoaded', function() {
    // Load navigation
    fetch('navigation.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            setActiveNavLink();
            initMobileMenu();
        })
        .catch(error => console.log('Navigation loaded fine'));
    
    // Load footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
        })
        .catch(error => console.log('Footer loaded fine'));
    
    // Check if we're on a blog post page
    if (isBlogPostPage()) {
        loadBlogComponents();
    }
    
    // Function to check if current page is a blog post
    function isBlogPostPage() {
        const path = window.location.pathname;
        return path.includes('/blog/') && path.endsWith('.html') && !path.endsWith('blog.html');
    }
    
    // Load blog-specific components
    function loadBlogComponents() {
        // 1. Load CTA
        const ctaElement = document.querySelector('[data-blog-cta]');
        if (ctaElement) {
            const ctaType = ctaElement.getAttribute('data-blog-cta') || 'default';
            loadCTA(ctaType, ctaElement);
        }
        
        // 2. Load recent posts (will insert after the article)
        loadRecentPosts();
    }
    
    // Load CTA component
    function loadCTA(ctaType, targetElement) {
        const ctaPath = `components/ctas/${ctaType}.html`;
        
        fetch(ctaPath)
            .then(response => {
                if (!response.ok) {
                    // If specific CTA fails, try default
                    if (ctaType !== 'default') {
                        console.log(`CTA "${ctaType}" not found, trying default`);
                        return loadCTA('default', targetElement);
                    }
                    throw new Error('CTA not found');
                }
                return response.text();
            })
            .then(data => {
                targetElement.innerHTML = data;
            })
            .catch(error => {
                // If everything fails, hide the CTA container
                console.log(`Could not load CTA: ${ctaType}`);
                targetElement.style.display = 'none';
            });
    }
    
    // Load recent blog posts (excluding current post)
    function loadRecentPosts() {
        // First, get list of blog posts
        fetch('blog/blog-list.json')
            .then(response => response.json())
            .then(posts => {
                const currentPage = window.location.pathname.split('/').pop();
                const filteredPosts = posts.filter(post => 
                    post.file !== currentPage && post.file !== 'blog.html'
                );
                
                // Get 3 most recent posts
                const recentPosts = filteredPosts.slice(0, 3);
                
                // Create and insert recent posts section
                if (recentPosts.length > 0) {
                    const recentPostsHTML = createRecentPostsHTML(recentPosts);
                    const article = document.querySelector('article');
                    if (article) {
                        article.insertAdjacentHTML('afterend', recentPostsHTML);
                    }
                }
            })
            .catch(error => {
                console.log('Could not load recent posts list');
                // Don't show anything if it fails
            });
    }
    
    // Create HTML for recent posts
    function createRecentPostsHTML(posts) {
        return `
        <section class="section bg-dark">
            <div class="container">
                <div class="section-header">
                    <h2>Recent Posts</h2>
                    <p>More insights and strategies</p>
                </div>
                <div class="blog-grid">
                    ${posts.map(post => `
                    <div class="blog-card">
                        <div class="blog-card-image">
                            <a href="${post.url}">
                                <img src="${post.image}" alt="${post.title}">
                            </a>
                            <div class="blog-card-category">${post.category}</div>
                        </div>
                        <div class="blog-card-content">
                            <h3 class="blog-card-title">
                                <a href="${post.url}">${post.title}</a>
                            </h3>
                            <p class="blog-card-excerpt">${post.excerpt}</p>
                            <div class="blog-card-meta">
                                <span class="blog-card-date">
                                    <i class="far fa-calendar"></i> ${post.date}
                                </span>
                                <span class="blog-card-read-time">
                                    <i class="far fa-clock"></i> ${post.readTime}
                                </span>
                            </div>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
        </section>
        `;
    }
    
    // Figure out which page we're on and highlight the right nav link
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-links a[data-page]');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPage = link.getAttribute('data-page');
            
            if (currentPage === '' || currentPage === 'index.html') {
                if (linkPage === 'index') {
                    link.classList.add('active');
                }
            } else if (currentPage.includes(linkPage)) {
                link.classList.add('active');
            }
        });
    }
    
    // Make mobile menu button work
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
