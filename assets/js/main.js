const PRODUCTS_DATA = {
    '401': {
        name: '401 内置乳液泵系列',
        images: []
    },
    '405': {
        name: '405 外置乳液泵系列',
        images: []
    }
};

const imageBase401 = 'assets/images/products/401/';
const imageBase405 = 'assets/images/products/405/';

const files401 = [];
const files405 = [];

async function loadProductImages() {
    try {
        const resp = await fetch('assets/images/products/401/');
        if (resp.ok) {
            const text = await resp.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            doc.querySelectorAll('a').forEach(a => {
                const href = a.getAttribute('href');
                if (href && href.match(/\.jpg$/i)) files401.push(href);
            });
        }
    } catch(e) {}

    try {
        const resp = await fetch('assets/images/products/405/');
        if (resp.ok) {
            const text = await resp.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            doc.querySelectorAll('a').forEach(a => {
                const href = a.getAttribute('href');
                if (href && href.match(/\.jpg$/i)) files405.push(href);
            });
        }
    } catch(e) {}

    renderProducts();
}

function getImageName(filename) {
    return filename.replace('副本.jpg', '').replace('.jpg', '');
}

function renderProducts() {
    const series401Grid = document.querySelector('[data-grid="401"] .product-grid');
    const series405Grid = document.querySelector('[data-grid="405"] .product-grid');

    if (series401Grid) {
        const images401 = files401.length > 0 ? files401 : generateFileList401();
        series401Grid.innerHTML = images401.map(f => {
            const name = getImageName(typeof f === 'string' ? f : f);
            const src = imageBase401 + (typeof f === 'string' ? f : f);
            return `
                <div class="product-card" data-img="${src}" data-name="${name}">
                    <img class="product-card-img" data-src="${src}" alt="${name}" loading="lazy">
                    <div class="product-card-info">
                        <div class="product-card-name">${name}</div>
                    </div>
                    <div class="product-card-overlay"><span>查看大图</span></div>
                </div>
            `;
        }).join('');
        const btn401 = document.querySelector('[data-target="401"]');
        if (btn401) btn401.querySelector('.series-toggle-count').textContent = images401.length + ' 款产品';
    }

    if (series405Grid) {
        const images405 = files405.length > 0 ? files405 : generateFileList405();
        series405Grid.innerHTML = images405.map(f => {
            const name = getImageName(typeof f === 'string' ? f : f);
            const src = imageBase405 + (typeof f === 'string' ? f : f);
            return `
                <div class="product-card" data-img="${src}" data-name="${name}">
                    <img class="product-card-img" data-src="${src}" alt="${name}" loading="lazy">
                    <div class="product-card-info">
                        <div class="product-card-name">${name}</div>
                    </div>
                    <div class="product-card-overlay"><span>查看大图</span></div>
                </div>
            `;
        }).join('');
        const btn405 = document.querySelector('[data-target="405"]');
        if (btn405) btn405.querySelector('.series-toggle-count').textContent = images405.length + ' 款产品';
    }

    initToggles();
    initLightbox();
}

function generateFileList401() {
    const prefixes28 = ['AF','AG','AZ','OD','OJ','OK','OO','OX','OY'];
    const prefixes33a = ['AL','AU','BB','BE','BP','BQ','BY','CB','CE','OI','OL','OM','ON','OR','OS','OW','OZ'];
    const prefixes33b = ['AB','AC','BM'];
    const prefixes33c = ['AN','OU'];
    const prefixes33d = ['AE','AI','AQ','AR','AS','BG','BU','BX','CF','OQ','OT'];
    const prefixes33c2 = ['BC','EK'];
    
    const files = [];
    prefixes28.forEach(s => files.push(`401-28,410A-A-${s}副本.jpg`));
    prefixes33a.forEach(s => files.push(`401-33,410A-A-${s}副本.jpg`));
    prefixes33b.forEach(s => files.push(`401-33,410A-B-${s}副本.jpg`));
    prefixes33c.forEach(s => files.push(`401-33,410A-C-${s}副本.jpg`));
    prefixes33d.forEach(s => files.push(`401-33,410A-D-${s}副本.jpg`));
    prefixes33c2.forEach(s => files.push(`401-33,410C-A-${s}副本.jpg`));
    return files;
}

function generateFileList405() {
    const suffixes = ['OA','OB','OC','OE','OG','OI','OJ','OK','OP','WF'];
    return suffixes.map(s => `R405-33,410C-A-${s}副本.jpg`);
}

// ========== SERIES TOGGLES ==========
function initToggles() {
    const toggles = document.querySelectorAll('.series-toggle');
    toggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            const wrapper = document.querySelector(`[data-grid="${target}"]`);
            if (!wrapper) return;
            const textEl = btn.querySelector('.series-toggle-text');
            const isOpen = btn.classList.contains('open');
            if (isOpen) {
                btn.classList.remove('open');
                wrapper.classList.remove('open');
                textEl.textContent = '展开产品图库';
            } else {
                btn.classList.add('open');
                wrapper.classList.add('open');
                textEl.textContent = '收起产品图库';
                loadImagesInWrapper(wrapper);
            }
        });
    });
}

function loadImagesInWrapper(wrapper) {
    const imgs = wrapper.querySelectorAll('img[data-src]');
    imgs.forEach(img => {
        if (!img.src || img.src === '' || img.src === window.location.href) {
            img.src = img.dataset.src;
        }
        img.removeAttribute('data-src');
    });
}

// ========== NAVBAR ==========
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 100;
        if (window.scrollY >= top) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ========== HERO PARTICLES ==========
function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.classList.add('hero-particle');
        p.style.left = Math.random() * 100 + '%';
        p.style.top = (80 + Math.random() * 20) + '%';
        p.style.animationDuration = (6 + Math.random() * 10) + 's';
        p.style.animationDelay = Math.random() * 8 + 's';
        p.style.width = (2 + Math.random() * 3) + 'px';
        p.style.height = p.style.width;
        container.appendChild(p);
    }
}
createParticles();

// ========== BACK TO TOP ==========
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========== STATS COUNTER ==========
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(target * eased);
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        }
        requestAnimationFrame(update);
    });
}

let countersAnimated = false;
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });
    observer.observe(statsSection);
}

// ========== PRODUCT FILTER ==========
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const series = btn.dataset.series;
        const allSeries = document.querySelectorAll('.product-series');
        allSeries.forEach(s => {
            if (series === 'all' || s.dataset.series === series) {
                s.classList.remove('hidden');
            } else {
                s.classList.add('hidden');
            }
        });
    });
});

// ========== LIGHTBOX ==========
let lightboxImages = [];
let lightboxIndex = 0;

function initLightbox() {
    const cards = document.querySelectorAll('.product-card');
    lightboxImages = [];
    
    cards.forEach((card, idx) => {
        lightboxImages.push({
            src: card.dataset.img,
            name: card.dataset.name
        });
        card.addEventListener('click', () => {
            lightboxIndex = idx;
            openLightbox();
        });
    });
}

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

function openLightbox() {
    if (lightboxImages[lightboxIndex]) {
        lightboxImg.src = lightboxImages[lightboxIndex].src;
        lightboxCaption.textContent = lightboxImages[lightboxIndex].name;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.getElementById('lightboxPrev').addEventListener('click', () => {
    lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    openLightbox();
});

document.getElementById('lightboxNext').addEventListener('click', () => {
    lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
    openLightbox();
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
        lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        openLightbox();
    }
    if (e.key === 'ArrowRight') {
        lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
        openLightbox();
    }
});

// ========== SCROLL ANIMATIONS ==========
const animElements = document.querySelectorAll('.advantage-card, .contact-card, .factory-card, .about-content, .section-header, .contact-form-wrapper');

const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

animElements.forEach(el => {
    el.classList.add('fade-in');
    animObserver.observe(el);
});

// ========== LAZY BACKGROUND IMAGES ==========
const lazyBgs = document.querySelectorAll('.lazy-bg');
const bgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.backgroundImage = `url('${entry.target.dataset.bg}')`;
            bgObserver.unobserve(entry.target);
        }
    });
}, { rootMargin: '200px 0px' });
lazyBgs.forEach(el => bgObserver.observe(el));

// ========== CONTACT FORM ==========
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('感谢您的询盘！我们会尽快与您联系。');
    e.target.reset();
});

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});
