/**
 * Lau-PyDE Website
 * Modern interactive features and animations
 * Author: John Laurence Aramay, BSCpE2
 * Created: September 28, 2026
 */

// Theme Management
// Handles dark mode and light mode switching with localStorage

class ThemeManager {
    constructor() {
        this.themeKey = 'lau-pyde-theme';
        this.themeToggle = document.getElementById('themeToggle');
        this.html = document.documentElement;
        
        this.init();
    }

    init() {
        this.applyTheme(this.getSavedTheme());
        this.attachEventListeners();
    }

    getSavedTheme() {
        const saved = localStorage.getItem(this.themeKey);
        if (saved) {
            return saved;
        }

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }

        return 'dark';
    }

    applyTheme(theme) {
        if (theme === 'light') {
            this.html.setAttribute('data-theme', 'light');
            this.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            this.html.setAttribute('data-theme', 'dark');
            this.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        localStorage.setItem(this.themeKey, theme);
    }

    toggleTheme() {
        const currentTheme = this.html.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    attachEventListeners() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
}

// Mobile Menu Management
// Handles toggle and closing of mobile navigation menu

class MobileMenu {
    constructor() {
        this.menuToggle = document.getElementById('menuToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        this.attachEventListeners();
    }

    toggleMenu() {
        this.menuToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }

    closeMenu() {
        this.menuToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
    }

    attachEventListeners() {
        this.menuToggle.addEventListener('click', () => this.toggleMenu());

        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        document.addEventListener('click', (e) => {
            const navbar = document.querySelector('.navbar');
            if (!navbar.contains(e.target)) {
                this.closeMenu();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMenu();
            }
        });
    }
}

// Nav Active Underline Management
// Updates active navigation link based on scroll position

class NavActiveState {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');

        this.init();
    }

    init() {
        this.attachClickHandlers();
        this.observeSections();
        this.setActiveForCurrentPage();
    }

    setActive(link) {
        if (!link) return;
        this.navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    }

    attachClickHandlers() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (link.getAttribute('href').startsWith('#')) {
                    this.setActive(link);
                }
            });
        });
    }

    observeSections() {
        if (!this.sections.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const matchingLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    if (matchingLink) this.setActive(matchingLink);
                }
            });
        }, {
            rootMargin: '-40% 0px -55% 0px',
            threshold: 0
        });

        this.sections.forEach(section => observer.observe(section));
    }

    setActiveForCurrentPage() {
        const path = window.location.pathname.split('/').pop();
        if (path === 'support.html') {
            this.setActive(document.querySelector('.nav-link[href="support.html"]'));
        }
    }
}

// Hero title typing animation.

class TypewriterEffect {
    constructor(el, options = {}) {
        this.el = el;
        this.text = el.textContent.trim();
        this.typeSpeed = options.typeSpeed || 110;
        this.deleteSpeed = options.deleteSpeed || 60;
        this.holdFull = options.holdFull || 1800;
        this.holdEmpty = options.holdEmpty || 500;
    }

    start() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let i = 0;
        let deleting = false;

        const step = () => {
            this.el.textContent = this.text.slice(0, i);

            if (!deleting && i === this.text.length) {
                deleting = true;
                return setTimeout(step, this.holdFull);
            }
            if (deleting && i === 0) {
                deleting = false;
                return setTimeout(step, this.holdEmpty);
            }

            i += deleting ? -1 : 1;
            setTimeout(step, deleting ? this.deleteSpeed : this.typeSpeed);
        };

        step();
    }
}

// Lightbox for full-size logo and screenshot viewing.

class Lightbox {
    constructor() {
        this.box = document.getElementById('lightbox');
        if (!this.box) return;

        this.img = document.getElementById('lightboxImg');
        this.caption = document.getElementById('lightboxCaption');
        this.closeBtn = document.getElementById('lightboxClose');

        this.closeBtn.addEventListener('click', () => this.close());
        this.box.addEventListener('click', (e) => {
            if (e.target === this.box) this.close();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });
    }

    open(src, alt) {
        if (!this.box) return;
        this.img.src = src;
        this.img.alt = alt || '';
        this.caption.textContent = alt || '';
        this.box.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    close() {
        if (!this.box || !this.box.classList.contains('show')) return;
        this.box.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Expandable logo story details triggered by the run buttons.

class LogoStory {
    constructor(lightbox) {
        this.lightbox = lightbox;
        this.viewBtn = document.getElementById('viewLogoBtn');
        this.toggles = document.querySelectorAll('.part-toggle');

        this.init();
    }

    init() {
        if (this.viewBtn) {
            this.viewBtn.addEventListener('click', () => {
                this.lightbox.open('assets/lau-pyde_logo.jpg', 'The Lau-PyDE logo');
            });
        }

        this.toggles.forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.logo-part');
                const isOpen = item.classList.toggle('open');
                btn.setAttribute('aria-expanded', String(isOpen));
            });
        });
    }
}

// Download version picker for each OS tab.

class VersionPicker {
    constructor() {
        document.querySelectorAll('.version-select').forEach(select => {
            select.addEventListener('change', () => {
                const tab = select.closest('.tab-content');
                tab.querySelectorAll('.release-panel').forEach(panel => {
                    panel.classList.toggle('active', panel.dataset.version === select.value);
                });
            });
        });
    }
}

// Toggle for the detailed installation guide.

class GuideToggle {
    constructor() {
        this.btn = document.getElementById('guideToggle');
        this.panel = document.getElementById('windowsGuide');
        if (!this.btn || !this.panel) return;

        this.label = this.btn.querySelector('span');
        this.btn.addEventListener('click', () => {
            const isOpen = this.panel.classList.toggle('open');
            this.btn.setAttribute('aria-expanded', String(isOpen));
            this.label.textContent = isOpen
                ? 'Hide detailed installation guide'
                : 'Show detailed installation guide';
        });
    }
}

// Screenshot carousel control and auto-play behavior.

class ScreenshotCarousel {
    constructor(lightbox) {
        this.lightbox = lightbox;
        this.carouselInner = document.getElementById('carouselInner');
        if (!this.carouselInner) return;
        this.viewBtn = document.getElementById('carouselView');
        this.prevBtn = document.getElementById('carouselPrev');
        this.nextBtn = document.getElementById('carouselNext');
        this.dotsContainer = document.getElementById('carouselDots');
        this.items = document.querySelectorAll('.carousel-item');
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        
        this.init();
    }

    init() {
        this.createDots();
        this.attachEventListeners();
        this.startAutoPlay();
    }

    createDots() {
        this.items.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }

    updateCarousel() {
        const offset = -this.currentIndex * 100;
        this.carouselInner.style.transform = `translateX(${offset}%)`;
        
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }

    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
    }

    attachEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        if (this.viewBtn) {
            this.viewBtn.addEventListener('click', () => {
                const img = this.items[this.currentIndex].querySelector('img');
                this.lightbox.open(img.src, img.alt);
            });
        }
    }
}

// Download section tab management.

class DownloadManager {
    constructor() {
        this.osButtons = document.querySelectorAll('.os-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.showTab('windows');
    }

    showTab(osType) {
        this.tabContents.forEach(tab => {
            tab.classList.remove('active');
        });

        this.osButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        const activeTab = document.getElementById(`${osType}-tab`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        const activeBtn = document.querySelector(`[data-os="${osType}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    attachEventListeners() {
        this.osButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const osType = btn.getAttribute('data-os');
                this.showTab(osType);
            });
        });
    }
}

// Scroll-to-top button with an animated launch effect.

class ScrollToTopButton {
    constructor() {
        this.button = document.getElementById('scrollToTop');
        this.scrollThreshold = 300;
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        this.attachEventListeners();
    }

    toggleVisibility() {
        if (window.scrollY > this.scrollThreshold) {
            this.button.classList.add('show');
        } else {
            this.button.classList.remove('show');
        }
    }

    scrollToTop() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        // Add car starting animation
        this.button.style.animation = 'carStart 1s ease-out';
        
        // Delay the scroll by 1 second (car starting)
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            this.isAnimating = false;
            this.button.style.animation = 'none';
        }, 1000);
    }

    attachEventListeners() {
        window.addEventListener('scroll', () => this.toggleVisibility());
        this.button.addEventListener('click', () => this.scrollToTop());
    }
}

// Scroll-triggered reveal animation for sections.

class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideUp 0.6s ease-out';
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });
    }
}

// Click the logo to jump back to the top of the page.

class LogoNavigation {
    constructor() {
        this.logo = document.getElementById('logoHome');
        
        this.init();
    }

    init() {
        this.logo.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Smooth scrolling for in-page navigation links.

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add the keyframe used for the scroll-to-top car animation.

function addCarStartingAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes carStart {
            0% {
                transform: translateY(0) scale(1);
            }
            10% {
                transform: translateX(-3px) translateY(0) scale(1);
            }
            20% {
                transform: translateX(3px) translateY(0) scale(1);
            }
            30% {
                transform: translateX(-2px) translateY(0) scale(1);
            }
            40% {
                transform: translateX(2px) translateY(0) scale(1);
            }
            50% {
                transform: translateX(-1px) translateY(0) scale(1);
            }
            100% {
                transform: translateX(0) translateY(0) scale(1);
            }
        }
    `;
    document.head.appendChild(style);
}

// OS Guide Toggle Function
// Shows/hides OS-specific troubleshooting guides

function showOSGuide(osType) {
    const guides = document.querySelectorAll('.os-guide-content');
    guides.forEach(guide => guide.style.display = 'none');
    
    const selectedGuide = document.getElementById(osType + '-guide');
    if (selectedGuide) {
        selectedGuide.style.display = 'block';
    }
    
    const buttons = document.querySelectorAll('.os-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    const selectedBtn = document.querySelector(`.os-btn[data-os="${osType}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
}

// Initialize the interactive site behavior after the page loads.

document.addEventListener('DOMContentLoaded', () => {
    // Add car starting animation
    addCarStartingAnimation();
    
    // Initialize theme manager
    new ThemeManager();

    // Initialize mobile menu
    new MobileMenu();

    // Initialize nav active underline
    new NavActiveState();

    // Initialize hero title typing animation
    const heroTitleText = document.getElementById('heroTitleText');
    if (heroTitleText) {
        new TypewriterEffect(heroTitleText).start();
    }

    // Initialize lightbox (shared by carousel + logo story)
    const lightbox = new Lightbox();

    // Initialize screenshot carousel
    new ScreenshotCarousel(lightbox);

    // Initialize logo story
    new LogoStory(lightbox);

    // Initialize download version picker
    new VersionPicker();

    // Initialize detailed install guide toggle
    new GuideToggle();

    // Initialize download manager
    new DownloadManager();

    // Initialize scroll to top button
    new ScrollToTopButton();

    // Initialize scroll animations
    new ScrollAnimations();

    // Initialize logo navigation
    new LogoNavigation();

    // Setup smooth scroll
    setupSmoothScroll();

    console.log('Lau-PyDE website initialized with modern features');
});

// Keyboard shortcuts for navigation and closing menus.

document.addEventListener('keydown', (e) => {
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        if (navMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
    
    // Scroll to top with Home key
    if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});