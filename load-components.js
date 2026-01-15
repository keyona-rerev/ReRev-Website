// load-components.js - FIXED FOR YOUR STRUCTURE
document.addEventListener('DOMContentLoaded', function() {
    console.log("=== LOADER STARTED ===");
    
    // 1. Load navigation
    fetch('../navigation.html')
        .then(response => {
            console.log("Navigation fetch:", response.status);
            if (!response.ok) throw new Error(`Navigation: ${response.status}`);
            return response.text();
        })
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            setActiveNavLink();
            initMobileMenu();
            console.log("Navigation LOADED");
        })
        .catch(error => {
            console.error("Navigation FAILED:", error);
            // Don't crash - just show content without nav
        });
    
    // 2. Load footer
    fetch('../footer.html')
        .then(response => {
            console.log("Footer fetch:", response.status);
            if (!response.ok) throw new Error(`Footer: ${response.status}`);
            return response.text();
        })
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
            console.log("Footer LOADED");
        })
        .catch(error => {
            console.error("Footer FAILED:", error);
            // Don't crash - just show content without footer
        });
    
    // 3. Check if blog post
    const path = window.location.pathname;
    const isBlogPost = path.includes('/blog/') && 
                       path.includes('.html') && 
                       !path.includes('blog.html');
    
    console.log("Path analysis:", {
        fullPath: path,
        isBlogPost: isBlogPost,
        isBlogPage: path.includes('blog.html')
    });
    
    if (isBlogPost) {
        console.log("Loading blog components...");
        loadBlogComponents();
    }
    
    // ===== BLOG COMPONENTS =====
    function loadBlogComponents() {
        // A. Load CTA
        const ctaElement = document.querySelector('[data-blog-cta]');
        if (ctaElement) {
            const ctaType = ctaElement.getAttribute('data-blog-cta') || 'default';
            console.log("Loading CTA type:", ctaType);
            loadCTA(ctaType, ctaElement);
        } else {
            console.log("No CTA element found");
        }
        
        // B. Load recent posts (optional - won't crash if fails)
        setTimeout(() => loadRecentPosts(), 100); // Small delay
    }
    
    function loadCTA(ctaType, targetElement) {
        const ctaPath = `../components/ctas/${ctaType}.html`;
        console.log("CTA path:", ctaPath);
        
        fetch(ctaPath)
            .then(response => {
                console.log(`CTA ${ctaType} status:`, response.status);
                if (!response.ok) {
                    if (ctaType !== 'default') {
                        console.log(`Falling back to default CTA`);
                        return loadCTA('default', targetElement);
                    }
                    throw new Error(`CTA ${ctaType} not found (${response.status})`);
                }
                return response.text();
            })
            .then(data => {
                targetElement.innerHTML = data;
                console.log(`CTA ${ctaType} LOADED`);
            })
            .catch(error => {
                console.error("CTA FAILED:", error);
                targetElement.style.display = 'none';
            });
    }
    
    function loadRecentPosts() {
        console.log("Loading recent posts...");
        fetch('../blog/blog-list.json')
            .then(response => {
                console.log("Blog list status:", response.status);
                if (!response.ok) throw new Error(`Blog list: ${response.status}`);
                return response.json();
            })
            .then(posts => {
                console.log("Found", posts.length, "posts in list");
                
                // Get current filename
                const currentPath = window.location.pathname;
                const currentFile = currentPath.split('/').pop();
                console.log("Current file:", currentFile);
                
                // Filter out current post and blog.html
                const filtered = posts.filter(post => {
                    const isCurrent = post.file === currentFile;
                    const isBlogPage = post.file === 'blog.html';
                    if (isCurrent) console.log("Filtering out current post:", post.file);
                    if (isBlogPage) console.log("Filtering out blog.html");
                    return !isCurrent && !isBlogPage;
                });
                
                // Get 3 most recent
                const recentPosts = filtered.slice(0, 3);
                console.log("Recent posts to show:", recentPosts.length);
                
                if (recentPosts.length > 0) {
                    const html = createRecentPostsHTML(recentPosts);
                    const article = document.querySelector('article');
                    if (article) {
                        article.insertAdjacentHTML('afterend', html);
                        console.log("Recent posts ADDED");
                    }
                }
            })
            .catch(error => {
                console.error("Recent posts FAILED:", error);
                // Don't show error - just don't show recent posts
            });
    }
    
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
                            <a href="../${post.url}">
                                <img src="../${post.image}" alt="${post.title}">
                            </a>
                            <div class="blog-card-category">${post.category}</div>
                        </div>
                        <div class="blog-card-content">
                            <h3 class="blog-card-title">
                                <a href="../${post.url}">${post.title}</a>
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
    
    // ===== NAVIGATION HELPERS =====
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === 'index.html' && href === './') ||
                (currentPage.includes('blog') && href === 'blog.html')) {
                link.classList.add('active');
            }
        });
    }
    
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
    
    console.log("=== LOADER FINISHED SETUP ===");
});
