// Header loader function
function loadHeader() {
    const headerHTML = `
    <header class="header">
        <div class="container">
            <nav class="nav">
                <div class="logo">
                    <img src="images/kgkonyarkinvlogo.png" alt="KG Konyark Logo" class="logo-img">
                    <div class="logo-text">
                        <h2>KG Konyark</h2>
                        <span>Investment Ltd</span>
                    </div>
                </div>
                <ul class="nav-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="about.html">About</a></li>
                    <li><a href="services.html">Services</a></li>
                    <li><a href="categories.html">Our Work</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
                <div class="nav-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </nav>
        </div>
    </header>
    `;
    
    // Insert header at the beginning of body
    const body = document.body;
    body.insertAdjacentHTML('afterbegin', headerHTML);
    
    // Set active link based on current page
    setActiveNavLink();
    
    // Initialize mobile menu toggle
    initializeMobileMenu();
}

// Set active navigation link
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop();
    
    // Remove active class from all links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page link
    let activeLink;
    if (currentFile === '' || currentFile === 'index.html') {
        activeLink = document.querySelector('a[href="index.html"]');
    } else if (currentFile === 'about.html') {
        activeLink = document.querySelector('a[href="about.html"]');
    } else if (currentFile === 'services.html') {
        activeLink = document.querySelector('a[href="services.html"]');
    } else if (currentFile === 'gallery.html') {
        activeLink = document.querySelector('a[href="gallery.html"]');
    } else if (currentFile === 'categories.html') {
        activeLink = document.querySelector('a[href="categories.html"]');
    } else if (currentFile === 'contact.html') {
        activeLink = document.querySelector('a[href="contact.html"]');
    }
    
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Initialize mobile menu toggle
function initializeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
}

// Initialize header hide/show on scroll (desktop only)
function initializeHeaderScroll() {
    // Header scroll behavior disabled - keeping header sticky at all times
    // Previously this function hid the header on scroll, but now we keep it visible
}

// Load header when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    initializeHeaderScroll();
});
