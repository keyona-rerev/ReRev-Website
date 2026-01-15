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
    
async function loadRecentPosts(basePath) {
    console.log("📚 Loading recent posts by reusing blog.html cards...");
    
    try {
        // 1. Load the actual blog page
        const blogPageUrl = basePath + 'blog.html';
        console.log("Fetching blog page:", blogPageUrl);
        
        const response = await fetch(blogPageUrl);
        if (!response.ok) {
            console.error("Failed to load blog.html:", response.status);
            return;
        }
        
        const html = await response.text();
        console.log("Blog page loaded, size:", html.length, "chars");
        
        // 2. Extract blog cards using DOMParser
        const parser = new DOMParser();
        const blogPage = parser.parseFromString(html, 'text/html');
        const allCards = blogPage.querySelectorAll('.blog-card');
        
        console.log("Found", allCards.length, "blog cards on blog.html");
        
        if (allCards.length === 0) {
            console.warn("No .blog-card elements found in blog.html");
            return;
        }
        
        // 3. Get current post filename
        const currentPath = window.location.pathname;
        const currentFile = currentPath.split('/').pop();
        console.log("Current post file:", currentFile);
        
        // 4. Filter cards (exclude current post, limit to 3)
        const recentCards = [];
        for (const card of allCards) {
            if (recentCards.length >= 3) break;
            
            // Get the post link from this card
            const cardLink = card.querySelector('.blog-card-title a, .blog-card-image a');
            if (!cardLink) continue;
            
            const href = cardLink.getAttribute('href');
            const cardFile = href.split('/').pop();
            
            // Skip if it's the current post or blog.html itself
            if (cardFile === currentFile || cardFile === 'blog.html') {
                console.log("Skipping card (current post or blog.html):", cardFile);
                continue;
            }
            
            console.log("Including card:", cardFile);
            recentCards.push(card.outerHTML);
        }
        
        console.log("Selected", recentCards.length, "recent cards");
        
        // 5. Create and insert the section
        if (recentCards.length > 0) {
            const sectionHTML = createRecentPostsSection(recentCards);
            const article = document.querySelector('article');
            
            if (article) {
                article.insertAdjacentHTML('afterend', sectionHTML);
                console.log("✅ Recent posts section inserted");
                
                // Fix any relative paths in the inserted cards
                fixPathsInRecentPosts(basePath);
            } else {
                console.error("No <article> element found to insert after");
            }
        } else {
            console.log("No recent posts to show (all filtered out)");
        }
        
    } catch (error) {
        console.error("❌ Error loading recent posts:", error);
    }
}

function createRecentPostsSection(cardsHTML) {
    return `
    <section class="section bg-dark">
        <div class="container">
            <div class="section-header">
                <h2>Recent Posts</h2>
                <p>More insights and strategies</p>
            </div>
            <div class="blog-grid">
                ${cardsHTML.join('')}
            </div>
        </div>
    </section>
    `;
}

function fixPathsInRecentPosts(basePath) {
    console.log("🔧 Fixing paths in recent posts...");
    
    // The recent posts section is the last .bg-dark section
    const recentSection = document.querySelector('section.bg-dark:last-of-type');
    if (!recentSection) return;
    
    // Fix all links in the recent posts
    const links = recentSection.querySelectorAll('a[href]');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Skip external links
        if (href.startsWith('http') || href.startsWith('#') || 
            href.startsWith('mailto:') || href.startsWith('tel:')) {
            return;
        }
        
        // If it's a relative blog post link, make it root-based
        if (href.startsWith('blog/')) {
            const newHref = basePath + href;
            link.setAttribute('href', newHref);
            console.log("Fixed blog link:", href, "→", newHref);
        }
    });
    
    // Fix all image paths
    const images = recentSection.querySelectorAll('img[src]');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (!src) return;
        
        // If image path is relative (starts with Assets!/), add ../
        if (src.startsWith('Assets!/') && !src.startsWith('../Assets!/')) {
            const newSrc = '../' + src;
            img.setAttribute('src', newSrc);
            console.log("Fixed image path:", src, "→", newSrc);
        }
    });
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
