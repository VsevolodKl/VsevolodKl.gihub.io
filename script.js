
const drawer = document.getElementById('drawer');

// Функция, которая подстраивает высоту "выглядывающей" части под твой CSS (clamp)
function getPeekHeight() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    if (width <= 480 && height <= 700) return 70;  // ← iPhone SE
    if (width <= 480) return 85;
    if (width <= 1024) return 100;
    if (width <= 1920) return 110;
    return 180;
}

let currentY = 0;
let targetY = 0;

function getMin() {
    // Максимальный скролл ВВЕРХ (шторка полностью открыта).
    // Формула: (физическая высота окна шторки) - (общая высота контента).
    // Это гарантирует, что дно контента ровно упрется в дно экрана.
    return drawer.offsetHeight - drawer.scrollHeight;
}

function getMax() {
    // Максимальный скролл ВНИЗ (шторка закрыта).
    // Формула: (физическая высота шторки) - (высота выглядывающего кусочка).
    return drawer.offsetHeight - getPeekHeight();
}

// Задаем корректное стартовое положение при загрузке
function initDrawer() {
    currentY = getMax();
    targetY = currentY;
    
    // 1. Ставим шторку чуть выше (на 60px) ДО того, как пользователь ее увидит
    drawer.style.transition = 'none';
    drawer.style.transform = `translateY(${currentY - 60}px)`;
    
    // 2. Делаем небольшую паузу и плавно опускаем шторку на место
    setTimeout(() => {
        // Добавляем пружинистый кубик-безье для красивого "падения"
        drawer.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'; 
        drawer.style.transform = `translateY(${currentY}px)`;
    }, 400); // 400мс задержки после загрузки скрипта
}

initDrawer();

window.addEventListener('wheel', e => {
    targetY -= e.deltaY * 0.8;
    // Жестко ограничиваем рамки
    targetY = Math.max(getMin(), Math.min(getMax(), targetY));
    
    drawer.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    drawer.style.transform = `translateY(${targetY}px)`;
    currentY = targetY;
}, { passive: true });

let startY = 0;
let startDrawerY = 0;

drawer.addEventListener('touchstart', e => {
    startY = e.touches[0].clientY;
    startDrawerY = currentY;
    drawer.style.transition = 'none';
});

drawer.addEventListener('touchmove', e => {
    // Вычисляем дельту (разницу) движения пальца
    const delta = e.touches[0].clientY - startY;
    
    // Прибавляем дельту к стартовой позиции. Теперь палец и шторка двигаются синхронно.
    const y = Math.max(getMin(), Math.min(getMax(), startDrawerY + delta));
    
    currentY = y;
    drawer.style.transform = `translateY(${y}px)`;
}, { passive: true });

drawer.addEventListener('touchend', e => {
    targetY = currentY;
});

window.addEventListener('resize', () => {
    // При изменении размера окна (или перевороте телефона) пересчитываем позицию
    currentY = Math.max(getMin(), Math.min(getMax(), currentY));
    targetY = currentY;
    drawer.style.transform = `translateY(${currentY}px)`;
});
window.addEventListener('resize', () => {
    currentY = Math.max(getMin(), Math.min(getMax(), currentY));
    targetY = currentY;
    drawer.style.transform = `translateY(${currentY}px)`;
});
