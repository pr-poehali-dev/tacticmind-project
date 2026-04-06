import { useState } from "react";
import type { AiProduct } from "@/components/AiSelector";

const STORAGE_KEY = "tacticmind_products";

const IMG = {
  backpack: "https://cdn.poehali.dev/projects/600da521-22fd-451e-8c82-59b152c1d165/files/e36b36f6-28e7-40d1-b2b2-842f39d434ea.jpg",
  knife: "https://cdn.poehali.dev/projects/600da521-22fd-451e-8c82-59b152c1d165/files/8ea21448-585e-4cc6-8bdf-15653a06e9ca.jpg",
  boots: "https://cdn.poehali.dev/projects/600da521-22fd-451e-8c82-59b152c1d165/files/b272a69e-e2fc-459d-92b6-1eedea70a0f9.jpg",
};

export const DEFAULT_PRODUCTS: AiProduct[] = [
  { id: 1, name: "Рюкзак ASSAULT PRO", category: "Экипировка", price: "8 490 ₽", rating: 97, image: IMG.backpack, tag: "ТОП ВЫБОР ИИ", aiReason: "Оптимальное соотношение веса и объёма (45л / 1.8кг). Совместим с системой MOLLE. Водонепроницаемое покрытие 3000мм.", specs: ["45 литров", "Кордура 1000D", "MOLLE", "IP65"] },
  { id: 2, name: "Мультитул FORCE-7", category: "Инструменты", price: "4 200 ₽", rating: 94, image: IMG.knife, tag: "ВЫБОР ЭКСПЕРТОВ", aiReason: "19 функций в одном корпусе из нержавеющей стали 420HC. Одноручное открытие. Гарантия 25 лет.", specs: ["19 функций", "Сталь 420HC", "156 гр", "25 лет"] },
  { id: 3, name: "Берцы GRUNT X2", category: "Обувь", price: "12 800 ₽", rating: 91, image: IMG.boots, tag: "БЕСТСЕЛЛЕР", aiReason: "Мембрана Gore-Tex, защита 100%. Подошва Vibram до −40°C. Идеальны для длительных маршей.", specs: ["Gore-Tex", "Vibram sole", "−40°C", "Тактический носок"] },
  { id: 4, name: "Фонарь NIGHTHAWK", category: "Свет", price: "3 500 ₽", rating: 89, image: IMG.backpack, tag: "ВЫБОР ИИ", aiReason: "1000 люмен при весе 98г. Ударопрочный корпус, защита IP68. 5 режимов, 12 часов работы.", specs: ["1000 люмен", "IP68", "5 режимов", "12 ч"] },
  { id: 5, name: "Перчатки IRONGRIP", category: "Защита", price: "2 800 ₽", rating: 86, image: IMG.boots, tag: "ПОПУЛЯРНЫЙ", aiReason: "Кевларовая защита костяшек выдерживает удар 80 Дж. Антискользящее покрытие. Совместимы с сенсорами.", specs: ["Кевлар", "Полупалец", "Антипорез", "XS-XXL"] },
  { id: 6, name: "Бронежилет ГРАНИТ-4", category: "Защита", price: "54 990 ₽", rating: 96, image: IMG.backpack, tag: "МАКСИМАЛЬНАЯ ЗАЩИТА", aiReason: "Класс защиты Бр4. Керамические пластины, вес 9.2кг. Покрывает грудь, спину и боки. Сертифицирован ГОСТ.", specs: ["Бр4", "9.2 кг", "Керамика", "ГОСТ"] },
  { id: 7, name: "Шлем КИРАСА-Ш", category: "Защита", price: "23 490 ₽", rating: 93, image: IMG.knife, tag: "ТОП ЗАЩИТА", aiReason: "Класс Бр3, вес всего 1.4кг. Титановая основа. Крепления NVG, слоты MOLLE. Совместим с гарнитурой.", specs: ["Бр3", "1.4 кг", "Титан", "NVG крепления"] },
  { id: 8, name: "Разгрузка МОЛОТ-М", category: "Экипировка", price: "18 990 ₽", rating: 92, image: IMG.backpack, tag: "ВЫБОР ЭКСПЕРТОВ", aiReason: "8 карманов, система быстрого сброса за 1 секунду. Совместима с бронепластинами. Регулируется по фигуре.", specs: ["8 карманов", "Быстросброс", "MOLLE", "Унисекс"] },
  { id: 9, name: "Аптечка СТОП-КРОВЬ", category: "Медицина", price: "3 500 ₽", rating: 98, image: IMG.boots, tag: "ТОП ВЫБОР ИИ", aiReason: "Турникет CAT Gen7 + израильский бандаж + гемостатик. Всё что нужно при ранении в первые 3 минуты.", specs: ["Турникет", "Бандажи", "Гемостатик", "Инструкция"] },
  { id: 10, name: "Рация СВЯЗИСТ-ПРО", category: "Средства связи", price: "8 900 ₽", rating: 88, image: IMG.backpack, tag: "ПОПУЛЯРНЫЙ", aiReason: "Дальность связи до 10км на открытой местности. Влагозащита IP67. Шифрование сигнала. Аккумулятор 72 часа.", specs: ["10 км", "IP67", "Шифрование", "72 ч"] },
  { id: 11, name: "Тактические очки HAWK", category: "Защита", price: "4 200 ₽", rating: 87, image: IMG.boots, tag: "ВЫБОР ИИ", aiReason: "Поляризованные линзы блокируют 99.9% УФ. Ударопрочный поликарбонат. Защита от осколков и ветра.", specs: ["Поляризация", "Ударопрочные", "UV400", "Антицарапин"] },
  { id: 12, name: "Накидка ЛЕСОВИК", category: "Экипировка", price: "5 900 ₽", rating: 85, image: IMG.backpack, tag: "МАСКИРОВКА", aiReason: "Маскхалат для любого времени года. Ткань имитирует лесную подстилку. Дышащий материал, вес 400г.", specs: ["Лето/зима", "400 г", "Дышащий", "Унисекс"] },
  { id: 13, name: "Нож ВИТЯЗЬ", category: "Инструменты", price: "3 200 ₽", rating: 90, image: IMG.knife, tag: "ВЫБОР ЭКСПЕРТОВ", aiReason: "Сталь 440C, фиксированный клинок 15см. Рукоять G10. Ножны MOLLE-совместимые. Многофункциональный.", specs: ["Сталь 440C", "15 см", "Фиксация", "G10"] },
  { id: 14, name: "Навигатор СТРАЖ-GPS", category: "Инструменты", price: "15 900 ₽", rating: 84, image: IMG.backpack, tag: "НАВИГАЦИЯ", aiReason: "Многоконстелляционный GPS+ГЛОНАСС. Топографические карты РФ. Батарея 48ч. Работает без сотовой сети.", specs: ["GPS+ГЛОНАСС", "48 ч", "Карты РФ", "IP67"] },
  { id: 15, name: "Куртка АРКТИК-М", category: "Одежда", price: "18 500 ₽", rating: 93, image: IMG.boots, tag: "ЗИМНЯЯ ЗАЩИТА", aiReason: "Мембрана Gore-Tex 3L, утеплитель Primaloft 200г. Работает от −30°C. Съёмный капюшон, система MOLLE на рукавах.", specs: ["Gore-Tex 3L", "−30°C", "Primaloft", "MOLLE рукав"] },
  { id: 16, name: "Штаны СПЕЦНАЗ-ТК", category: "Одежда", price: "9 800 ₽", rating: 88, image: IMG.knife, tag: "УСИЛЕННЫЕ", aiReason: "Двойное усиление колен и ягодиц накладками Cordura. 8 карманов. Артикулированный крой не стесняет движения.", specs: ["Cordura накладки", "8 карманов", "Стрейч", "XS-4XL"] },
  { id: 17, name: "Флис ТЕПЛОВОЙ-ПРО", category: "Одежда", price: "5 400 ₽", rating: 86, image: IMG.backpack, tag: "ВЫБОР ИИ", aiReason: "Полар-флис 300г/м², быстро сохнет. Молния по всей длине. Отлично работает как средний слой в системе слоёв.", specs: ["300 г/м²", "Быстросохнущий", "Полная молния", "XS-XXXL"] },
  { id: 18, name: "Пончо ПРИЗРАК", category: "Одежда", price: "3 200 ₽", rating: 82, image: IMG.boots, tag: "МАСКИРОВКА", aiReason: "Двусторонний дождевик: цифровой камуфляж / оливковый. Укрывает с рюкзаком. Вес 320г, пакуется в кулак.", specs: ["Двусторонний", "320 г", "Камуфляж", "Универсальный"] },
  { id: 19, name: "Гидропак ПОТОК-3Л", category: "Питание и гидратация", price: "2 900 ₽", rating: 87, image: IMG.backpack, tag: "ВЫБОР ИИ", aiReason: "Резервуар 3 литра с широкой горловиной для льда. Трубка с клапаном прикуса. Вставка в любой рюкзак с MOLLE.", specs: ["3 литра", "Антибактер.", "Клапан", "MOLLE"] },
  { id: 20, name: "Паёк СУТОЧНЫЙ-Б", category: "Питание и гидратация", price: "1 200 ₽", rating: 80, image: IMG.knife, tag: "БАЗОВЫЙ", aiReason: "3200 ккал на сутки. 5 приёмов пищи, не требует варки. Срок хранения 5 лет. Соответствует ГОСТ Р 54033.", specs: ["3200 ккал", "5 блюд", "5 лет", "Без варки"] },
  { id: 21, name: "Котелок ПОЛЕВОЙ-Т", category: "Питание и гидратация", price: "1 800 ₽", rating: 83, image: IMG.boots, tag: "УНИВЕРСАЛЬНЫЙ", aiReason: "Набор: котелок 1.2л + кружка 0.6л + крышка-сковорода. Анодированный алюминий, вес 320г. Совместим с горелками.", specs: ["1.2 л", "320 г", "Анод.алюминий", "Горелка"] },
  { id: 22, name: "Гарнитура СКРЫТНИК-Х", category: "Средства связи", price: "12 500 ₽", rating: 91, image: IMG.backpack, tag: "ВЫБОР ЭКСПЕРТОВ", aiReason: "Активная шумозащита, подавляет выстрелы до 22 дБ. PTT-кнопка, совместима с рациями Kenwood/Baofeng. Шлемное крепление.", specs: ["22 дБ", "PTT", "Kenwood/Baofeng", "Шлем крепление"] },
  { id: 23, name: "Антенна ДАЛЬНИЙ-КВ", category: "Средства связи", price: "3 700 ₽", rating: 79, image: IMG.knife, tag: "ДАЛЬНОБОЙ", aiReason: "Увеличивает дальность рации на 40–60%. Разъём SMA-Female, универсальная. Компактно складывается, вес 85г.", specs: ["SMA-F", "+60% дальность", "85 г", "VHF/UHF"] },
  { id: 24, name: "Аптечка ГРУППА-10", category: "Медицина", price: "8 900 ₽", rating: 95, image: IMG.boots, tag: "ТОП ВЫБОР ИИ", aiReason: "На 10 человек: 3 турникета, перевязочный пакет ППМ, 10 бандажей, гемостатик. Прошита согласно стандартам NFAK.", specs: ["3 турникета", "10 бандажей", "NFAK", "Чемодан"] },
  { id: 25, name: "Турникет ТАК-ПРО", category: "Медицина", price: "1 400 ₽", rating: 92, image: IMG.backpack, tag: "СПАСАЕТ ЖИЗНИ", aiReason: "Аналог CAT Gen7, одноручное наложение за 25 секунд. Пластиковая пряжка, не ржавеет. Военная атрибуция по ГОСТ.", specs: ["1 рука", "25 сек", "ГОСТ", "Пластик"] },
  { id: 26, name: "Повязка ХЕМОСТОП", category: "Медицина", price: "890 ₽", rating: 88, image: IMG.knife, tag: "ГЕМОСТАТИК", aiReason: "Импрегнирована каолином, останавливает кровотечение за 3 минуты. Стерильная упаковка, 5-летний срок хранения.", specs: ["Каолин", "3 минуты", "Стерильная", "5 лет"] },
  { id: 27, name: "Лопатка САПЁР-М", category: "Инструменты", price: "2 600 ₽", rating: 85, image: IMG.boots, tag: "ПОЛЕВОЙ", aiReason: "Складная малая сапёрная лопатка, сталь 65Г. Пила на обухе, рукоять прорезинена. Чехол MOLLE включён. Вес 520г.", specs: ["Сталь 65Г", "Пила", "520 г", "MOLLE чехол"] },
  { id: 28, name: "Мультитул ТЯЖЁЛЫЙ-19", category: "Инструменты", price: "6 800 ₽", rating: 89, image: IMG.knife, tag: "ВЫБОР ЭКСПЕРТОВ", aiReason: "Плоскогубцы с проволокорезом, 19 функций. Нержавейка 420HC, рукояти G10. Включает пилу по металлу и стропорез.", specs: ["Плоскогубцы", "Стропорез", "420HC", "G10 рукоять"] },
  { id: 29, name: "Пояс ШТУРМОВОЙ-Р", category: "Экипировка", price: "4 500 ₽", rating: 87, image: IMG.backpack, tag: "БЫСТРЫЙ ДОСТУП", aiReason: "Тактический пояс Rigger с застёжкой-монтажом. 8 слотов MOLLE, ширина 45мм. Сертифицирован для страховки.", specs: ["MOLLE", "45 мм", "Страховка", "Быстрая пряжка"] },
  { id: 30, name: "Чехол МУЛЬТИКАМ-ПТ", category: "Экипировка", price: "7 200 ₽", rating: 84, image: IMG.boots, tag: "МАСКИРОВКА", aiReason: "Внешний чехол на бронежилет в расцветке Multicam. Усиление Cordura 500D. Три дополнительных кармана под магазины.", specs: ["Multicam", "Cordura 500D", "3 кармана", "Размеры S-XL"] },
];

function loadProducts(): AiProduct[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return DEFAULT_PRODUCTS;
}

function saveProducts(products: AiProduct[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function useProducts() {
  const [products, setProducts] = useState<AiProduct[]>(loadProducts);

  const updateProduct = (updated: AiProduct) => {
    setProducts(prev => {
      const next = prev.map(p => p.id === updated.id ? updated : p);
      saveProducts(next);
      return next;
    });
  };

  const addProduct = (product: Omit<AiProduct, "id">) => {
    setProducts(prev => {
      const maxId = Math.max(0, ...prev.map(p => p.id));
      const next = [...prev, { ...product, id: maxId + 1 }];
      saveProducts(next);
      return next;
    });
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => {
      const next = prev.filter(p => p.id !== id);
      saveProducts(next);
      return next;
    });
  };

  const resetToDefaults = () => {
    saveProducts(DEFAULT_PRODUCTS);
    setProducts(DEFAULT_PRODUCTS);
  };

  return { products, updateProduct, addProduct, deleteProduct, resetToDefaults };
}
