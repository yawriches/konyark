// Mobile Navigation - FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeLightbox();
    initializeImageHandling();
    initializeSmoothScrolling();
});

// Navigation Functionality - FIXED
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            // Use class toggle instead of inline styles
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            });
        });
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navLinks) {
            navLinks.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        }
    });
}

// Image Error Handling
function initializeImageHandling() {
    // Handle broken images with better error messages
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            console.warn('Image failed to load:', this.src);
            
            // Create a fallback visual for broken images
            const parent = this.parentElement;
            if (parent && (parent.classList.contains('gallery-item') || 
                parent.classList.contains('project-image'))) {
                
                this.style.display = 'none';
                
                // Create placeholder
                const placeholder = document.createElement('div');
                placeholder.style.cssText = `
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #6c757d;
                    font-size: 14px;
                    text-align: center;
                    padding: 20px;
                    border: 2px dashed #dee2e6;
                    border-radius: 8px;
                `;
                placeholder.innerHTML = `
                    <div>
                        <i class="fas fa-image" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i>
                        <div>Image Not Available</div>
                        <small>${this.alt || 'Project Image'}</small>
                    </div>
                `;
                
                parent.appendChild(placeholder);
            }
        });

        img.addEventListener('load', function() {
            console.log('Image loaded successfully:', this.src);
        });
    });
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Lightbox Gallery Functionality
function initializeLightbox() {
    // Only initialize if we're on a page with galleries
    if (!document.querySelector('.image-gallery')) return;

    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const currentImageSpan = document.getElementById('currentImage');
    const totalImagesSpan = document.getElementById('totalImages');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    // Check if lightbox elements exist
    if (!lightboxModal || !lightboxImage) return;

    let currentIndex = 0;
    let images = [];

    // Collect all gallery images
    function collectImages() {
        const galleryItems = document.querySelectorAll('.gallery-item img');
        images = Array.from(galleryItems)
            .filter(img => img.complete && img.naturalHeight !== 0 && img.src)
            .map((img, index) => ({
                src: img.src,
                alt: img.alt || 'Project Image',
                index: index
            }));
        
        if (totalImagesSpan) totalImagesSpan.textContent = images.length;
        return images.length > 0;
    }

    // Open lightbox
    function openLightbox(index) {
        if (!collectImages() || index >= images.length) return;
        
        currentIndex = index;
        updateLightbox();
        lightboxModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Close lightbox
    function closeLightbox() {
        lightboxModal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Update lightbox content
    function updateLightbox() {
        if (images.length === 0) return;
        
        const currentImage = images[currentIndex];
        
        // Show loading state
        lightboxImage.style.opacity = '0';
        
        // Preload image
        const img = new Image();
        img.onload = () => {
            lightboxImage.src = currentImage.src;
            lightboxImage.alt = currentImage.alt;
            if (lightboxCaption) lightboxCaption.textContent = currentImage.alt;
            if (currentImageSpan) currentImageSpan.textContent = currentIndex + 1;
            lightboxImage.style.opacity = '1';
        };
        
        img.onerror = () => {
            if (lightboxCaption) lightboxCaption.textContent = 'Image failed to load: ' + currentImage.alt;
            lightboxImage.style.opacity = '0';
        };
        
        img.src = currentImage.src;
    }

    // Next image
    function nextImage() {
        if (images.length === 0) return;
        currentIndex = (currentIndex + 1) % images.length;
        updateLightbox();
    }

    // Previous image
    function prevImage() {
        if (images.length === 0) return;
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightbox();
    }

    // Event listeners for gallery images
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', (e) => {
            if (e.target.tagName !== 'IMG') return;
            openLightbox(index);
        });
    });

    // Lightbox controls
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', prevImage);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightboxModal.style.display !== 'block') return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });

    // Close when clicking on backdrop
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });
}

// WhatsApp Integration
function openWhatsApp(service) {
    const message = `Hello Kg Konyark Investment, I'm interested in ${service} services. Could you please provide more information and a quote?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/233535294218?text=${encodedMessage}`, '_blank');
}

// Contact Form Handling
if (document.getElementById('contactForm')) {
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.name || !data.email || !data.message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(data.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission success
        showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
        this.reset();
    });
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 5px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transition: all 0.3s ease;
        max-width: 400px;
    `;
    
    notification.style.background = type === 'success' ? '#4CAF50' : '#f44336';
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Performance optimization: Lazy loading enhancement
if ('IntersectionObserver' in window) {
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lazyImage = entry.target;
                if (lazyImage.dataset.src) {
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                }
                lazyImageObserver.unobserve(lazyImage);
            }
        });
    });

    document.querySelectorAll('img[loading="lazy"]').forEach(lazyImage => {
        lazyImageObserver.observe(lazyImage);
    });
}

// Add loading states for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Remove any initial loading states after page load
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});