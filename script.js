const drawer = document.getElementById('drawer');
let canMoveDrawer = false;
// Функция, которая подстраивает высоту "выглядывающей" части под твой CSS (clamp)
function getPeekHeight() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    if (width <= 480 && height <= 700) return 70;  // iPhone SE
    if (width <= 480) return 85;
    if (width <= 1024) return 105;
    if (width <= 1920) return 110;
    
    // Новые значения для 2K и 4K
    if (width <= 2560) return 130; // Для 2K мониторов
    return 180; // Для 4K мониторов (соцсети крупные, нужно место)
}

let currentY = 0;
let targetY = 0;

function getMin() {
    return drawer.offsetHeight - drawer.scrollHeight;
}

function getMax() {
    return drawer.offsetHeight - getPeekHeight();
}

// Задаем корректное стартовое положение при загрузке
function initDrawer() {
    // Получаем точку, где шторка должна просто "выглядывать"
    const peekPos = getMax();
    
    // Сначала ставим её на место без анимаций
    currentY = peekPos;
    targetY = peekPos;
    drawer.style.transition = 'none';
    drawer.style.transform = `translateY(${peekPos}px)`;

    // Через миг даем "пинок" вверх
    setTimeout(() => {
        // Включаем мягкую пружинистую анимацию
        drawer.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        // Поднимаем на 50px выше нормы
        drawer.style.transform = `translateY(${peekPos - 50}px)`;

        // И через полсекунды возвращаем обратно
        setTimeout(() => {
            drawer.style.transform = `translateY(${peekPos}px)`;
            
            // Важно: после завершения прыжка выключаем transition, 
            // чтобы основной скролл не тормозил и не дергался
            setTimeout(() => {
                drawer.style.transition = 'none';
            }, 600);
        }, 400);
    }, 100);
}

// initDrawer();

window.addEventListener('wheel', e => {
    if (!canMoveDrawer) return; //
    targetY -= e.deltaY * 0.8;
    targetY = Math.max(getMin(), Math.min(getMax(), targetY));
    
    drawer.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    drawer.style.transform = `translateY(${targetY}px)`;
    currentY = targetY;
}, { passive: true });

let startY = 0;
let startDrawerY = 0;

drawer.addEventListener('touchstart', e => {
    if (!canMoveDrawer) return; // Если нельзя — ничего не делаем
    startY = e.touches[0].clientY;
    startDrawerY = currentY;
    drawer.style.transition = 'none';
});

drawer.addEventListener('touchmove', e => {
    if (!canMoveDrawer) return; // Если нельзя — ничего не делаем
    const delta = e.touches[0].clientY - startY;
    const y = Math.max(getMin(), Math.min(getMax(), startDrawerY + delta));
    
    currentY = y;
    drawer.style.transform = `translateY(${y}px)`;
}, { passive: true });

drawer.addEventListener('touchend', e => {
    targetY = currentY;
});

window.addEventListener('resize', () => {
    currentY = Math.max(getMin(), Math.min(getMax(), currentY));
    targetY = currentY;
    drawer.style.transform = `translateY(${currentY}px)`;
});
window.addEventListener('resize', () => {
    currentY = Math.max(getMin(), Math.min(getMax(), currentY));
    targetY = currentY;
    drawer.style.transform = `translateY(${currentY}px)`;
});

document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById('loading-screen');
    const boat = document.getElementById('loader-boat');
    const text = document.getElementById('loader-text');
    const dots = document.getElementById('loader-dots');
    const headment = document.getElementById('loader-headment');

    // --- Начальные состояния для анимаций страницы ---
    const heroImage = document.querySelector('.hero__image');
    const socialItems = document.querySelectorAll('.social__item');

    // Соцсети: сразу ставим opacity 0, transition — без анимации
    socialItems.forEach(item => {
        item.style.transition = 'none';
        item.style.opacity = '0';
    });

    // 1. Плавное появление кораблика
    setTimeout(() => {
        boat.style.opacity = "1";
    }, 300);

    // 2. Через 1.5 секунды появляется текст
    setTimeout(() => {
        text.style.opacity = "1";
    }, 1500);

    // Анимация точек
    let dotState = 0;
    let forward = true;
    const dotInterval = setInterval(() => {
        if (forward) {
            dotState++;
            if (dotState >= 3) forward = false;
        } else {
            dotState--;
            if (dotState <= 0) forward = true;
        }
        dots.innerText = ".".repeat(dotState);
    }, 400);

    // 3. Кораблик и текст летят вверх и исчезают, появляется Headment
    setTimeout(() => {
        clearInterval(dotInterval);
        
        boat.style.transform = "translateY(-80px)";
        boat.style.opacity = "0";
        
        text.style.transform = "translateY(-80px) rotate(7deg)";
        text.style.opacity = "0";
        
        headment.style.opacity = "1";
        headment.style.transform = "translateY(0)";
    }, 4500);

    // 4. Убираем весь экран загрузки
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        if (loader) {
            loader.classList.add('is-sliding-down');

            // --- Герой растёт ОДНОВРЕМЕННО с опусканием фона ---
            if (heroImage) {
                heroImage.style.transition = 'transform 1.1s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.8s ease';
                heroImage.style.transform = 'scale(1)';
                heroImage.style.opacity = '1';
            }

            // После того как фон уехал — показываем header и соцсети
            setTimeout(() => {
                loader.style.display = "none";
                document.getElementById('page').classList.add('is-loaded');
                // canMoveDrawer = true;
                const header = document.querySelector('.header');
                if (header) {
                    header.classList.add('header--visible');
                }

                // --- Соцсети появляются после ---
                socialItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.5s ease';
                        item.style.opacity = '1';
                    }, index * 80);
                });
                setTimeout(() => {
                    canMoveDrawer = true;
                    if (typeof initDrawer === 'function') {
                        initDrawer();
                    }
                }, 800); // 500мс = полсекунды задержки перед появлением шторки
                // ===================================
            }, 1200);
        }
    }, 6500);
});
