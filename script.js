// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const body = document.body;
const navbar = document.querySelector('.navbar');

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.bindEvents();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.updateToggleIcon();
    }

    updateToggleIcon() {
        const icon = themeToggle.querySelector('i');
        if (this.currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Add a nice transition effect
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    bindEvents() {
        themeToggle?.addEventListener('click', () => this.toggleTheme());
    }
}

// Mobile Navigation
class MobileNavigation {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    toggle() {
        this.isOpen = !this.isOpen;
        navMenu?.classList.toggle('active', this.isOpen);
        this.animateHamburger();
        this.toggleBodyScroll();
    }

    close() {
        this.isOpen = false;
        navMenu?.classList.remove('active');
        this.animateHamburger();
        this.toggleBodyScroll();
    }

    animateHamburger() {
        const bars = hamburger?.querySelectorAll('.bar');
        if (!bars) return;

        if (this.isOpen) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = '';
            bars[1].style.opacity = '';
            bars[2].style.transform = '';
        }
    }

    toggleBodyScroll() {
        if (this.isOpen) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    }

    bindEvents() {
        hamburger?.addEventListener('click', () => this.toggle());
        
        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.close());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger?.contains(e.target) && !navMenu?.contains(e.target) && this.isOpen) {
                this.close();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
}

// Scroll Effects
class ScrollEffects {
    constructor() {
        this.scrollTop = null;
        this.init();
    }

    init() {
        this.createScrollTopButton();
        this.bindEvents();
        this.handleScroll();
    }

    createScrollTopButton() {
        this.scrollTop = document.createElement('button');
        this.scrollTop.className = 'scroll-top';
        this.scrollTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        this.scrollTop.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(this.scrollTop);

        this.scrollTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        // Navbar scroll effect
        if (scrollY > 100) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        // Scroll to top button
        if (scrollY > 300) {
            this.scrollTop?.classList.add('visible');
        } else {
            this.scrollTop?.classList.remove('visible');
        }
    }

    bindEvents() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
}

// Smooth Scrolling
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    scrollTo(target) {
        const element = document.querySelector(target);
        if (!element) return;

        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    bindEvents() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                if (target === '#') return;
                this.scrollTo(target);
            });
        });
    }
}

// Intersection Observer for Animations
class AnimationObserver {
    constructor() {
        this.init();
    }

    init() {
        this.createObserver();
        this.observeElements();
    }

    createObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, options);
    }

    observeElements() {
        // Add animation class to elements that should animate on scroll
        const elementsToAnimate = [
            '.service-card',
            '.feature-card',
            '.gallery-item',
            '.contact-card',
            '.section-header'
        ];

        elementsToAnimate.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.classList.add('animate-on-scroll');
                el.style.animationDelay = `${index * 0.1}s`;
                this.observer.observe(el);
            });
        });
    }
}

// Welcome Overlay (replaces plain loading spinner)
class WelcomeOverlay {
    constructor() {
        this.overlay = null;
        this.hidden = false;
        this.init();
    }

    init() {
        this.createOverlay();
        // Keep overlay visible for at least ~2.6s for a premium welcome feel
        setTimeout(() => this.hide(), 2600);
    }

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'welcome-overlay';
        overlay.innerHTML = `
            <div class="welcome-card">
                <img class="welcome-dp" src="Meyha Dp/dp.jpg" alt="Meyha Meyha DP" width="130" height="130"/>
                <div class="welcome-title">Welcome to Beauty Salon Meyha Meyha <span class="verified-badge" aria-label="Verified"><svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#1877F2"/><path d="M10.5 16.5L6 12L7.5 10.5L10.5 13.5L16.5 7.5L18 9L10.5 16.5Z" fill="white"/></svg></span></div>
                <div class="welcome-subtitle">Transforming beauty with elegance and care</div>
            </div>
        `;
        document.body.appendChild(overlay);
        this.overlay = overlay;
    }

    hide() {
        if (this.hidden) return;
        this.hidden = true;
        this.overlay?.classList.add('fade-out');
        setTimeout(() => this.overlay?.remove(), 350);
    }
}

// Contact Form Handler (for future use)
class ContactFormHandler {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        // Show success message (you can integrate with your backend here)
        this.showMessage('Thank you for your message! We will get back to you soon.', 'success');
        form.reset();
    }

    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.className = `toast toast-${type}`;
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            message.style.transform = 'translateX(100%)';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    bindEvents() {
        const contactForm = document.getElementById('contactForm');
        contactForm?.addEventListener('submit', (e) => this.handleSubmit(e));
    }
}

// Utility Functions
const utils = {
    // Debounce function for better performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Check if device is mobile
    isMobile() {
        return window.innerWidth <= 768;
    },

    // Format phone number for links
    formatPhoneLink(phone) {
        return `tel:${phone.replace(/\D/g, '')}`;
    },

    // Format WhatsApp link
    formatWhatsAppLink(phone, message = '') {
        const cleanPhone = phone.replace(/\D/g, '');
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${cleanPhone}${message ? `?text=${encodedMessage}` : ''}`;
    }
};

// Enhanced Mobile Experience
class MobileEnhancements {
    constructor() {
        this.init();
    }

    init() {
        if (utils.isMobile()) {
            this.addMobileOptimizations();
        }
        this.bindEvents();
    }

    addMobileOptimizations() {
        // Add touch-friendly styles
        const mobileStyles = document.createElement('style');
        mobileStyles.textContent = `
            @media (max-width: 768px) {
                .btn { min-height: 48px; }
                .contact-card { min-height: 120px; }
                .service-card { padding: 1.5rem; }
                .nav-link { padding: 0.75rem 1rem; }
                
                /* Improve touch targets */
                .theme-toggle, .scroll-top { 
                    min-width: 48px; 
                    min-height: 48px; 
                }
                
                /* Better spacing on mobile */
                .hero { padding: 120px 0 4rem; }
                .section-header { margin-bottom: 2rem; }
                
                /* Optimize text for mobile reading */
                .hero-title { line-height: 1.2; }
                .service-description { font-size: 0.95rem; }
            }
        `;
        document.head.appendChild(mobileStyles);
    }

    handleTouchEvents() {
        // Add touch feedback for interactive elements
        const touchElements = document.querySelectorAll('.btn, .service-card, .contact-card, .gallery-item');
        
        touchElements.forEach(el => {
            el.addEventListener('touchstart', () => {
                el.style.transform = 'scale(0.98)';
            });
            
            el.addEventListener('touchend', () => {
                el.style.transform = '';
            });
        });
    }

    bindEvents() {
        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 100);
        });

        // Add touch events after DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.handleTouchEvents();
        });
    }
}

// Performance Optimizations
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.optimizeAnimations();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    optimizeAnimations() {
        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all classes
    const themeManager = new ThemeManager();
    const mobileNav = new MobileNavigation();
    const scrollEffects = new ScrollEffects();
    const smoothScroll = new SmoothScroll();
    const animationObserver = new AnimationObserver();
    const welcomeOverlay = new WelcomeOverlay();
    const contactFormHandler = new ContactFormHandler();
    const mobileEnhancements = new MobileEnhancements();
    const performanceOptimizer = new PerformanceOptimizer();

    // Add global event listeners
    window.addEventListener('resize', utils.debounce(() => {
        // Handle responsive changes
        if (mobileNav.isOpen && !utils.isMobile()) {
            mobileNav.close();
        }
    }, 250));
});


// Add some custom animations for better UX
const customAnimations = {
    // Stagger animation for cards
    staggerCards(selector, delay = 100) {
        const cards = document.querySelectorAll(selector);
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * delay}ms`;
        });
    },

    // Typewriter effect for hero title
    typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    },

    // Counter animation for statistics
    animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            element.textContent = Math.floor(start);
            
            if (start < target) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        updateCounter();
    }
};

// Export for use in other files
window.BeautyEsalonUtils = {
    utils,
    customAnimations,
    ThemeManager,
    MobileNavigation
};