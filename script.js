const drawer = document.getElementById('drawer');
let canMoveDrawer = false;
let currentY = 0;
let targetY = 0;
let startY = 0;
let startDrawerY = 0;

function getPeekHeight() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (width <= 480 && height <= 700) return 70;
    if (width <= 480) return 85;
    if (width <= 1024) return 105;
    if (width <= 1920) return 110;
    if (width <= 2560) return 130;
    return 180;
}

function getMin() { return drawer.offsetHeight - drawer.scrollHeight; }
function getMax() { return drawer.offsetHeight - getPeekHeight(); }

// ТВОЯ ОРИГИНАЛЬНАЯ АНИМАЦИЯ ПОДПРЫГИВАНИЯ
function initDrawer() {
    const peekPos = getMax();
    currentY = peekPos;
    targetY = peekPos;
    drawer.style.transition = 'none';
    drawer.style.transform = `translateY(${peekPos}px)`;

    setTimeout(() => {
        drawer.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        drawer.style.transform = `translateY(${peekPos - 50}px)`;
        setTimeout(() => {
            drawer.style.transform = `translateY(${peekPos}px)`;
            setTimeout(() => {
                drawer.style.transition = 'none';
            }, 600);
        }, 400);
    }, 100);
}

// Управление скроллом (мышь)
window.addEventListener('wheel', e => {
    if (!canMoveDrawer) return;
    targetY -= e.deltaY * 0.8;
    targetY = Math.max(getMin(), Math.min(getMax(), targetY));
    drawer.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    drawer.style.transform = `translateY(${targetY}px)`;
    currentY = targetY;
}, { passive: true });

// Тач-события
drawer.addEventListener('touchstart', e => {
    if (!canMoveDrawer) return;
    startY = e.touches[0].clientY;
    startDrawerY = currentY;
    drawer.style.transition = 'none';
});

drawer.addEventListener('touchmove', e => {
    if (!canMoveDrawer) return;
    const delta = e.touches[0].clientY - startY;
    currentY = Math.max(getMin(), Math.min(getMax(), startDrawerY + delta));
    drawer.style.transform = `translateY(${currentY}px)`;
}, { passive: true });

drawer.addEventListener('touchend', () => { targetY = currentY; });

window.addEventListener('resize', () => {
    currentY = Math.max(getMin(), Math.min(getMax(), currentY));
    targetY = currentY;
    drawer.style.transform = `translateY(${currentY}px)`;
});

// --- ГЛАВНЫЙ БЛОК: ЖДЕМ ПОЛНУЮ ЗАГРУЗКУ (Картинки + Стили) ---
const loader = document.getElementById('loading-screen');
const boat = document.getElementById('loader-boat');
const text = document.getElementById('loader-text');
const dots = document.getElementById('loader-dots');
const headment = document.getElementById('loader-headment');

setTimeout(() => { boat.style.opacity = "1"; }, 200);
setTimeout(() => { text.style.opacity = "1"; }, 800);

let dotState = 0;
const dotInterval = setInterval(() => {
    dotState = (dotState + 1) % 4;
    dots.innerText = ".".repeat(dotState);
}, 400);

window.addEventListener('load', () => {
    const heroImage = document.querySelector('.hero__image');
    const socialItems = document.querySelectorAll('.social__item');
    socialItems.forEach(item => { item.style.opacity = '0'; });

    const minDelay = 3200;
    const elapsed = performance.now();
    const wait = Math.max(0, minDelay - elapsed);

    setTimeout(() => {
        clearInterval(dotInterval);
        boat.style.transform = "translateY(-80px)"; boat.style.opacity = "0";
        text.style.transform = "translateY(-80px) rotate(7deg)"; text.style.opacity = "0";
        headment.style.opacity = "1"; headment.style.transform = "translateY(0)";

        setTimeout(() => {
            loader.classList.add('is-sliding-down');
            if (heroImage) {
                heroImage.style.transition = 'transform 1.1s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.8s ease';
                heroImage.style.transform = 'scale(1)'; heroImage.style.opacity = '1';
            }
            setTimeout(() => {
                loader.style.display = "none";
                document.getElementById('page').classList.add('is-loaded');
                if (document.querySelector('.header')) {
                    document.querySelector('.header').classList.add('header--visible');
                }
                socialItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.5s ease';
                        item.style.opacity = '1';
                    }, index * 80);
                });
                setTimeout(() => {
                    canMoveDrawer = true;
                    initDrawer();
                }, 500);
            }, 1200);
        }, 2000);
    }, wait);
});
