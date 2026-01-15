// load-components.js - ROOT-BASED PATHS ONLY
document.addEventListener('DOMContentLoaded', function() {
    console.log("🌐 load-components.js - Using root-based paths");
    
    // ALWAYS use root path for GitHub Pages
    const basePath = '/ReRev-Website/';
    
    // ALWAYS load from root (never use ../ or ./)
    const navPath = basePath + 'navigation.html';
    const footerPath = basePath + 'footer.html';
    
    console.log("Base path:", basePath);
    console.log("Navigation path:", navPath);
    console.log("Footer path:", footerPath);
    
    // 1. Load Navigation from ROOT
    fetch(navPath)
        .then(response => {
            console.log("Navigation status:", response.status);
            if (!response.ok) throw new Error(`Navigation: ${response.status}`);
            return response.text();
        })
        .then(html => {
            document.body.insertAdjacentHTML('afterbegin', html);
            console.log("✅ Navigation loaded from root");
            
            // Make ALL navigation links root-based too
            fixLinksToRoot(basePath);
            setActiveNavLink();
            initMobileMenu();
        })
        .catch(error => {
            console.error("❌ Navigation failed:", error);
            // Show visible error
            document.body.insertAdjacentHTML('afterbegin', 
                '<div style="background:darkred;color:white;padding:10px;text-align:center;">' +
                'Navigation failed to load. Please check console for errors.</div>');
        });
    
    // 2. Load Footer from ROOT
    fetch(footerPath)
        .then(response => {
            console.log("Footer status:", response.status);
            if (!response.ok) throw new Error(`Footer: ${response.status}`);
            return response.text();
        })
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
            console.log("✅ Footer loaded from root");
            
            // Fix footer links too
            fixLinksToRoot(basePath);
        })
        .catch(error => {
            console.error("❌ Footer failed:", error);
        });
    
    // 3. Check if blog post and load components
    const path = window.location.pathname;
    const isBlogPost = path.includes('/blog/') && path.endsWith('.html') && !path.includes('blog.html');
    
    if (isBlogPost) {
        console.log("📝 Loading blog post components from root...");
        loadBlogComponents(basePath);
    }
    
    // ===== HELPER: Convert ALL links to root-based =====
    function fixLinksToRoot(basePath) {
        const allLinks = document.querySelectorAll('a[href]');
        let fixedCount = 0;
        
        allLinks.forEach(link => {
            let href = link.getAttribute('href');
            if (!href) return;
            
            // Skip external links
            if (href.startsWith('http') || href.startsWith('#') || 
                href.startsWith('mailto:') || href.startsWith('tel:')) {
                return;
            }
            
            // Convert to root-based path
            if (href.startsWith('./')) {
                // ./file.html → /ReRev-Website/file.html
                link.setAttribute('href', basePath + href.substring(2));
                fixedCount++;
            } else if (href.startsWith('../')) {
                // ../file.html → /ReRev-Website/file.html
                link.setAttribute('href', basePath + href.substring(3));
                fixedCount++;
            } else if (!href.startsWith('/') && !href.startsWith(basePath)) {
                // file.html → /ReRev-Website/file.html
                link.setAttribute('href', basePath + href);
                fixedCount++;
            }
            // Links already starting with / or basePath are fine
        });
        
        console.log(`🔗 Fixed ${fixedCount} links to root-based paths`);
    }
    
    // ===== BLOG COMPONENTS =====
    function loadBlogComponents(basePath) {
        // Load CTA
        const ctaElement = document.querySelector('[data-blog-cta]');
        if (ctaElement) {
            const ctaType = ctaElement.getAttribute('data-blog-cta') || 'default';
            const ctaPath = basePath + 'components/ctas/' + ctaType + '.html';
            
            fetch(ctaPath)
                .then(response => {
                    if (!response.ok && ctaType !== 'default') {
                        console.log("Falling back to default CTA");
                        return fetch(basePath + 'components/ctas/default.html');
                    }
                    return response.text();
                })
                .then(html => {
                    ctaElement.innerHTML = html;
                    fixLinksToRoot(basePath); // Fix CTA links
                })
                .catch(error => {
                    console.error("CTA failed:", error);
                    ctaElement.style.display = 'none';
                });
        }
        
        // Load recent posts
        loadRecentPosts(basePath);
    }
    
   function loadRecentPosts(basePath) {
    const blogListPath = basePath + 'blog/blog-list.json';
    console.log("📂 Loading recent posts from:", blogListPath);
    
    fetch(blogListPath)
        .then(response => {
            console.log("📄 Blog list response:", response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status}`);
            }
            return response.json();
        })
        .then(posts => {
            console.log("✅ Blog list loaded, found", posts.length, "posts");
            console.log("All posts:", posts);
            
            const currentFile = window.location.pathname.split('/').pop();
            console.log("📝 Current file:", currentFile);
            
            const recentPosts = posts
                .filter(post => {
                    console.log(`Checking post: ${post.file} vs current: ${currentFile}`);
                    return post.file !== currentFile && post.file !== 'blog.html';
                })
                .slice(0, 3);
            
            console.log("🎯 Filtered to", recentPosts.length, "recent posts:", recentPosts);
            
            if (recentPosts.length > 0) {
                const html = createRecentPostsHTML(recentPosts, basePath);
                const article = document.querySelector('article');
                if (article) {
                    article.insertAdjacentHTML('afterend', html);
                    console.log("✅ Recent posts HTML inserted");
                } else {
                    console.log("❌ No <article> element found");
                }
            } else {
                console.log("⚠️ No recent posts to show (filtered out all or empty list)");
            }
        })
        .catch(error => {
            console.error("❌ Recent posts error:", error);
            console.error("Full error:", error.message);
        });
}
    
    function createRecentPostsHTML(posts, basePath) {
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
                            <a href="${basePath + post.url}">
                                <img src="${basePath + post.image}" alt="${post.title}">
                            </a>
                            <div class="blog-card-category">${post.category}</div>
                        </div>
                        <div class="blog-card-content">
                            <h3 class="blog-card-title">
                                <a href="${basePath + post.url}">${post.title}</a>
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
    
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && (href.includes(currentPage) || 
                (currentPage === 'index.html' && href === basePath))) {
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
    
    console.log("✅ load-components.js setup complete");
});
