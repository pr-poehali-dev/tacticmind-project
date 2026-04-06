import { useState, useCallback } from "react";
import Icon from "@/components/ui/icon";
import AiSelector from "@/components/AiSelector";
import CartModal from "@/components/CartModal";
import AddedToast from "@/components/AddedToast";
import { useCart } from "@/hooks/useCart";

const IMG = {
  backpack: "https://cdn.poehali.dev/projects/600da521-22fd-451e-8c82-59b152c1d165/files/e36b36f6-28e7-40d1-b2b2-842f39d434ea.jpg",
  knife: "https://cdn.poehali.dev/projects/600da521-22fd-451e-8c82-59b152c1d165/files/8ea21448-585e-4cc6-8bdf-15653a06e9ca.jpg",
  boots: "https://cdn.poehali.dev/projects/600da521-22fd-451e-8c82-59b152c1d165/files/b272a69e-e2fc-459d-92b6-1eedea70a0f9.jpg",
};

const PRODUCTS = [
  {
    id: 1,
    name: "Рюкзак ASSAULT PRO",
    category: "Экипировка",
    price: "8 490 ₽",
    rating: 97,
    image: IMG.backpack,
    tag: "ТОП ВЫБОР ИИ",
    aiReason: "Оптимальное соотношение веса и объёма (45л / 1.8кг). Совместим с системой MOLLE. Водонепроницаемое покрытие 3000мм.",
    specs: ["45 литров", "Кордура 1000D", "MOLLE", "IP65"],
  },
  {
    id: 2,
    name: "Мультитул FORCE-7",
    category: "Инструменты",
    price: "4 200 ₽",
    rating: 94,
    image: IMG.knife,
    tag: "ВЫБОР ЭКСПЕРТОВ",
    aiReason: "19 функций в одном корпусе из нержавеющей стали 420HC. Одноручное открытие. Гарантия 25 лет.",
    specs: ["19 функций", "Сталь 420HC", "156 гр", "25 лет"],
  },
  {
    id: 3,
    name: "Берцы GRUNT X2",
    category: "Обувь",
    price: "12 800 ₽",
    rating: 91,
    image: IMG.boots,
    tag: "БЕСТСЕЛЛЕР",
    aiReason: "Мембрана Gore-Tex, защита 100%. Подошва Vibram до −40°C. Идеальны для длительных маршей.",
    specs: ["Gore-Tex", "Vibram sole", "−40°C", "Тактический носок"],
  },
  {
    id: 4,
    name: "Фонарь NIGHTHAWK",
    category: "Свет",
    price: "3 500 ₽",
    rating: 89,
    image: IMG.backpack,
    tag: "ВЫБОР ИИ",
    aiReason: "1000 люмен при весе 98г. Ударопрочный корпус, защита IP68. 5 режимов, 12 часов работы.",
    specs: ["1000 люмен", "IP68", "5 режимов", "12 ч"],
  },
  {
    id: 5,
    name: "Перчатки IRONGRIP",
    category: "Защита",
    price: "2 800 ₽",
    rating: 86,
    image: IMG.boots,
    tag: "ПОПУЛЯРНЫЙ",
    aiReason: "Кевларовая защита костяшек выдерживает удар 80 Дж. Антискользящее покрытие. Совместимы с сенсорами.",
    specs: ["Кевлар", "Полупалец", "Антипорез", "XS-XXL"],
  },
  {
    id: 6,
    name: "Бронежилет ГРАНИТ-4",
    category: "Защита",
    price: "54 990 ₽",
    rating: 96,
    image: IMG.backpack,
    tag: "МАКСИМАЛЬНАЯ ЗАЩИТА",
    aiReason: "Класс защиты Бр4. Керамические пластины, вес 9.2кг. Покрывает грудь, спину и боки. Сертифицирован ГОСТ.",
    specs: ["Бр4", "9.2 кг", "Керамика", "ГОСТ"],
  },
  {
    id: 7,
    name: "Шлем КИРАСА-Ш",
    category: "Защита",
    price: "23 490 ₽",
    rating: 93,
    image: IMG.knife,
    tag: "ТОП ЗАЩИТА",
    aiReason: "Класс Бр3, вес всего 1.4кг. Титановая основа. Крепления NVG, слоты MOLLE. Совместим с гарнитурой.",
    specs: ["Бр3", "1.4 кг", "Титан", "NVG крепления"],
  },
  {
    id: 8,
    name: "Разгрузка МОЛОТ-М",
    category: "Экипировка",
    price: "18 990 ₽",
    rating: 92,
    image: IMG.backpack,
    tag: "ВЫБОР ЭКСПЕРТОВ",
    aiReason: "8 карманов, система быстрого сброса за 1 секунду. Совместима с бронепластинами. Регулируется по фигуре.",
    specs: ["8 карманов", "Быстросброс", "MOLLE", "Унисекс"],
  },
  {
    id: 9,
    name: "Аптечка СТОП-КРОВЬ",
    category: "Экипировка",
    price: "3 500 ₽",
    rating: 98,
    image: IMG.boots,
    tag: "ТОП ВЫБОР ИИ",
    aiReason: "Турникет CAT Gen7 + израильский бандаж + гемостатик. Всё что нужно при ранении в первые 3 минуты.",
    specs: ["Турникет", "Бандажи", "Гемостатик", "Инструкция"],
  },
  {
    id: 10,
    name: "Рация СВЯЗИСТ-ПРО",
    category: "Инструменты",
    price: "8 900 ₽",
    rating: 88,
    image: IMG.knife,
    tag: "ПОПУЛЯРНЫЙ",
    aiReason: "Дальность связи до 10км на открытой местности. Влагозащита IP67. Шифрование сигнала. Аккумулятор 72 часа.",
    specs: ["10 км", "IP67", "Шифрование", "72 ч"],
  },
  {
    id: 11,
    name: "Тактические очки",
    category: "Защита",
    price: "4 200 ₽",
    rating: 87,
    image: IMG.backpack,
    tag: "ВЫБОР ИИ",
    aiReason: "Поляризованные линзы блокируют 99.9% УФ. Ударопрочный поликарбонат. Защита от осколков и ветра.",
    specs: ["Поляризация", "Ударопрочные", "UV400", "Антицарапин"],
  },
  {
    id: 12,
    name: "Накидка ЛЕСОВИК",
    category: "Экипировка",
    price: "5 900 ₽",
    rating: 85,
    image: IMG.boots,
    tag: "МАСКИРОВКА",
    aiReason: "Маскхалат для любого времени года. Ткань имитирует лесную подстилку. Дышащий материал, вес 400г.",
    specs: ["Лето/зима", "400 г", "Дышащий", "Унисекс"],
  },
  {
    id: 13,
    name: "Нож ВИТЯЗЬ",
    category: "Инструменты",
    price: "3 200 ₽",
    rating: 90,
    image: IMG.knife,
    tag: "ВЫБОР ЭКСПЕРТОВ",
    aiReason: "Сталь 440C, фиксированный клинок 15см. Рукоять G10. Ножны MOLLE-совместимые. Многофункциональный.",
    specs: ["Сталь 440C", "15 см", "Фиксация", "G10"],
  },
  {
    id: 14,
    name: "Навигатор GPS",
    category: "Инструменты",
    price: "15 900 ₽",
    rating: 84,
    image: IMG.backpack,
    tag: "НАВИГАЦИЯ",
    aiReason: "Многоконстелляционный GPS+ГЛОНАСС. Топографические карты РФ. Батарея 48ч. Работает без сотовой сети.",
    specs: ["GPS+ГЛОНАСС", "48 ч", "Карты РФ", "IP67"],
  },
];

const ALL_RATINGS = [
  ...PRODUCTS.map(p => ({ rank: 0, name: p.name, score: p.rating, cat: p.category, trend: "+0" })),
].sort((a, b) => b.score - a.score).map((r, i) => ({
  ...r,
  rank: i + 1,
  trend: i % 3 === 0 ? `+${i + 1}` : i % 3 === 1 ? `+${i}` : i === 0 ? "0" : `−${(i % 2) + 1}`,
}));

const STEPS = [
  { num: "01", icon: "MessageSquare", title: "Опишите задачу", desc: "Расскажите ИИ о вашей миссии: условия, нагрузка, климат, бюджет." },
  { num: "02", icon: "Cpu", title: "ИИ анализирует", desc: "Алгоритм обрабатывает 10 000+ единиц снаряжения по 47 параметрам за секунды." },
  { num: "03", icon: "Target", title: "Получаете подборку", desc: "Каждый товар сопровождается блоком «Почему именно он» с конкретным AI-обоснованием." },
  { num: "04", icon: "ShoppingCart", title: "Заказываете", desc: "Оформляете заказ прямо в интерфейсе. Доставка по России от 1 дня." },
];

const CATS = ["Все", "Экипировка", "Защита", "Обувь", "Инструменты", "Свет"];
const RATING_FILTERS = [{ label: "Любой", val: 0 }, { label: "80+", val: 80 }, { label: "85+", val: 85 }, { label: "90+", val: 90 }, { label: "95+", val: 95 }];
const SORT_OPTIONS = [
  { label: "По умолчанию", val: "default" },
  { label: "Цена: сначала дешёвые", val: "price_asc" },
  { label: "Цена: сначала дорогие", val: "price_desc" },
  { label: "Рейтинг (высокий)", val: "rating_desc" },
];

function parsePrice(price: string) {
  return parseInt(price.replace(/\D/g, ""), 10) || 0;
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [activeProduct, setActiveProduct] = useState<number | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const [filterCat, setFilterCat] = useState("Все");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [filterMinRating, setFilterMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("default");

  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useState<ReturnType<typeof setTimeout> | null>(null);

  const { items, totalCount, totalPrice, addItem, removeItem, changeQty, clear } = useCart();

  const showToast = useCallback((msg: string) => {
    if (toastTimer[0]) clearTimeout(toastTimer[0]);
    setToastMsg(msg);
    setToastVisible(true);
    toastTimer[0] = setTimeout(() => setToastVisible(false), 2000);
  }, [toastTimer]);

  const handleAddToCart = (p: typeof PRODUCTS[0]) => {
    addItem({ id: p.id, name: p.name, price: p.price, image: p.image, category: p.category });
    showToast(`${p.name} добавлен в корзину`);
  };

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  let filtered = PRODUCTS.filter(p => {
    if (filterCat !== "Все" && p.category !== filterCat) return false;
    if (filterMaxPrice && parsePrice(p.price) > parseInt(filterMaxPrice, 10)) return false;
    if (filterMinRating && p.rating < filterMinRating) return false;
    return true;
  });

  if (sortBy === "price_asc") filtered = [...filtered].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  if (sortBy === "price_desc") filtered = [...filtered].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  if (sortBy === "rating_desc") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen bg-[#0d0f0a] text-[#d8dcc8] font-roboto">

      <AddedToast message={toastMsg} visible={toastVisible} />

      <CartModal
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        totalCount={totalCount}
        totalPrice={totalPrice}
        onRemove={removeItem}
        onChangeQty={changeQty}
        onClear={clear}
      />

      {/* NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d0f0a]/95 backdrop-blur-sm border-b border-[#2d3620]">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="hex-badge w-9 h-10">
              <Icon name="Crosshair" size={16} className="text-white" />
            </div>
            <div>
              <div className="font-oswald text-xl font-bold text-white tracking-widest">TACTICMIND</div>
              <div className="text-[9px] text-[#d4681a] tracking-[0.3em] uppercase font-roboto">AI-Система подбора</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {[
              { id: "home", label: "Главная" },
              { id: "ai-selector", label: "AI-подбор" },
              { id: "catalog", label: "Каталог" },
              { id: "rating", label: "Рейтинг" },
              { id: "how", label: "Как работает" },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-4 py-2 font-oswald text-sm tracking-widest uppercase transition-all duration-200 ${
                  activeSection === item.id
                    ? "text-[#d4681a] border-b-2 border-[#d4681a]"
                    : "text-[#7a8a6a] hover:text-[#d8dcc8]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Cart button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 border border-[#2d3620] hover:border-[#d4681a] text-[#7a8a6a] hover:text-[#d4681a] px-4 py-2 transition-all duration-200 group"
          >
            <Icon name="ShoppingCart" size={18} />
            <span className="font-oswald uppercase tracking-widest text-sm hidden sm:block">Корзина</span>
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#d4681a] text-white text-[10px] font-oswald w-5 h-5 flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center camo-bg scanlines overflow-hidden pt-16">
        <div className="tactical-grid absolute inset-0 opacity-40" />
        <div className="absolute top-32 right-0 w-96 h-96 bg-[#d4681a]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-[#4a5a30]/20 rounded-full blur-2xl" />

        <div className="absolute top-20 left-0 right-0 border-y border-[#2d3620]/50 bg-[#141810]/60 py-2 z-10">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-[10px] tracking-[0.25em] uppercase text-[#4a5a30] font-roboto">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4a5a30] animate-pulse" />
              СИСТЕМА АКТИВНА
            </span>
            <span>ИИ-АНАЛИЗ: 10 847 ЕДИНИЦ СНАРЯЖЕНИЯ</span>
            <span className="hidden md:block">ВЕРСИЯ 2.4.1 // БОЕВАЯ ГОТОВНОСТЬ</span>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-4xl">
            <div className="sec-badge anim-fade anim-delay-1">
              <span className="w-1.5 h-1.5 bg-[#d4681a] rounded-full animate-pulse" />
              Искусственный интеллект × Тактическое снаряжение
            </div>
            <h1 className="font-oswald text-6xl md:text-8xl font-bold text-white leading-none mb-2 anim-fade anim-delay-2">
              ПРАВИЛЬНОЕ
              <br />
              <span className="text-[#d4681a] text-glow">СНАРЯЖЕНИЕ</span>
              <br />
              СПАСАЕТ ЖИЗНИ
            </h1>
            <div className="tac-divider my-8 anim-fade anim-delay-3" />
            <p className="text-[#7a8a6a] text-lg max-w-2xl leading-relaxed anim-fade anim-delay-3 font-roboto font-light">
              TacticMind анализирует вашу задачу и подбирает снаряжение с точным AI-обоснованием по каждой позиции.
            </p>
            <div className="flex flex-wrap gap-4 mt-10 anim-fade anim-delay-4">
              <button className="btn-combat text-base" onClick={() => scrollTo("ai-selector")}>
                Запустить AI-подбор
              </button>
              <button
                className="border border-[#2d3620] hover:border-[#d4681a] text-[#7a8a6a] hover:text-[#d4681a] font-oswald uppercase tracking-widest text-sm px-8 py-3 transition-all duration-200"
                onClick={() => scrollTo("catalog")}
              >
                Смотреть каталог
              </button>
            </div>
            <div className="flex flex-wrap gap-8 mt-16 anim-fade anim-delay-5">
              {[
                { val: "10 847", label: "единиц в базе" },
                { val: "47", label: "параметров анализа" },
                { val: "< 3 сек", label: "время подбора" },
                { val: "98%", label: "точность рекомендаций" },
              ].map((s, i) => (
                <div key={i} className="border-l-2 border-[#d4681a] pl-4">
                  <div className="font-oswald text-2xl font-bold text-white">{s.val}</div>
                  <div className="text-[11px] text-[#4a5a30] uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#2d3620] animate-bounce">
          <Icon name="ChevronDown" size={28} />
        </div>
      </section>

      <AiSelector onAddToCart={(p) => handleAddToCart(p as typeof PRODUCTS[0])} />

      {/* CATALOG */}
      <section id="catalog" className="py-24 bg-[#0d0f0a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <div className="sec-badge">Каталог снаряжения</div>
            <h2 className="font-oswald text-5xl font-bold text-white">
              ОТОБРАНО <span className="text-[#d4681a]">ИИ</span>
            </h2>
            <p className="text-[#7a8a6a] mt-2 font-light">Каждая позиция прошла многоуровневый анализ по 47 параметрам</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8 items-end p-5 border border-[#2d3620] bg-[#141810]">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-[#4a5a30] uppercase tracking-widest">Категория</label>
              <select
                value={filterCat}
                onChange={e => setFilterCat(e.target.value)}
                className="bg-[#0d0f0a] border border-[#2d3620] text-[#d8dcc8] text-sm px-3 py-2 font-oswald uppercase tracking-wider focus:border-[#d4681a] outline-none transition-colors"
              >
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-[#4a5a30] uppercase tracking-widest">Макс. цена, ₽</label>
              <input
                type="number"
                value={filterMaxPrice}
                onChange={e => setFilterMaxPrice(e.target.value)}
                placeholder="Без ограничений"
                className="bg-[#0d0f0a] border border-[#2d3620] text-[#d8dcc8] text-sm px-3 py-2 focus:border-[#d4681a] outline-none transition-colors w-44 placeholder-[#3d4a2b]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-[#4a5a30] uppercase tracking-widest">AI-рейтинг</label>
              <select
                value={filterMinRating}
                onChange={e => setFilterMinRating(Number(e.target.value))}
                className="bg-[#0d0f0a] border border-[#2d3620] text-[#d8dcc8] text-sm px-3 py-2 font-oswald uppercase tracking-wider focus:border-[#d4681a] outline-none transition-colors"
              >
                {RATING_FILTERS.map(r => <option key={r.val} value={r.val}>{r.label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-[#4a5a30] uppercase tracking-widest">Сортировка</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-[#0d0f0a] border border-[#2d3620] text-[#d8dcc8] text-sm px-3 py-2 focus:border-[#d4681a] outline-none transition-colors"
              >
                {SORT_OPTIONS.map(s => <option key={s.val} value={s.val}>{s.label}</option>)}
              </select>
            </div>
            {(filterCat !== "Все" || filterMaxPrice || filterMinRating > 0 || sortBy !== "default") && (
              <button
                onClick={() => { setFilterCat("Все"); setFilterMaxPrice(""); setFilterMinRating(0); setSortBy("default"); }}
                className="text-[10px] text-[#d4681a] hover:text-[#e8890a] uppercase tracking-widest font-oswald border border-[#d4681a]/30 hover:border-[#d4681a] px-3 py-2 transition-colors self-end"
              >
                Сбросить
              </button>
            )}
            <div className="ml-auto self-end text-[10px] text-[#4a5a30] uppercase tracking-widest font-roboto">
              Найдено: <span className="text-[#d4681a] font-bold">{filtered.length}</span>
            </div>
          </div>

          {/* Products grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#2d3620] text-center">
              <Icon name="Search" size={32} className="text-[#2d3620] mb-3" />
              <div className="font-oswald text-xl text-[#2d3620] uppercase tracking-widest mb-2">Ничего не найдено</div>
              <p className="text-[#3d4a2b] text-sm">Попробуйте изменить фильтры</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((p, i) => (
                <div
                  key={p.id}
                  className="card-tac group"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141810] via-transparent to-transparent" />
                    <div className="absolute top-2 left-2 ai-tag text-[9px]">{p.tag}</div>
                    <div className="absolute top-2 right-2 bg-[#0d0f0a]/80 border border-[#2d3620] px-2 py-0.5">
                      <span className="font-oswald text-base font-bold text-[#d4681a]">{p.rating}</span>
                      <span className="text-[9px] text-[#4a5a30]">/100</span>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-[#2d3620]">
                    <div className="rating-bar h-full" style={{ width: `${p.rating}%` }} />
                  </div>
                  <div className="p-4">
                    <div className="text-[9px] text-[#4a5a30] tracking-[0.2em] uppercase mb-1">{p.category}</div>
                    <h3 className="font-oswald text-base font-bold text-white mb-2 leading-tight">{p.name}</h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.specs.slice(0, 3).map(s => (
                        <span key={s} className="text-[9px] border border-[#2d3620] text-[#7a8a6a] px-1.5 py-0.5 uppercase tracking-wider">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-oswald text-xl font-bold text-white">{p.price}</span>
                      <button
                        onClick={() => setActiveProduct(activeProduct === p.id ? null : p.id)}
                        className="text-[#d4681a] hover:text-[#e8890a] transition-colors flex items-center gap-1 text-xs font-oswald uppercase tracking-wider"
                      >
                        Почему он?
                        <Icon name={activeProduct === p.id ? "ChevronUp" : "ChevronDown"} size={12} />
                      </button>
                    </div>
                    {activeProduct === p.id && (
                      <div className="mb-3 border-t border-[#2d3620] pt-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Icon name="Cpu" size={12} className="text-[#d4681a]" />
                          <span className="text-[9px] text-[#d4681a] tracking-[0.2em] uppercase font-oswald">AI-обоснование</span>
                        </div>
                        <p className="text-[#7a8a6a] text-xs leading-relaxed font-light">{p.aiReason}</p>
                      </div>
                    )}
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="w-full btn-combat text-xs py-2 flex items-center justify-center gap-2"
                    >
                      <Icon name="ShoppingCart" size={13} />
                      В корзину
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* RATING */}
      <section id="rating" className="py-24 bg-[#141810] border-y border-[#2d3620]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="sec-badge">Рейтинг</div>
              <h2 className="font-oswald text-5xl font-bold text-white mb-2">
                ТОП <span className="text-[#d4681a]">СНАРЯЖЕНИЯ</span>
              </h2>
              <p className="text-[#7a8a6a] font-light mb-6">ИИ обновляет рейтинг еженедельно</p>
              <div className="space-y-1">
                {ALL_RATINGS.map(r => (
                  <div
                    key={r.rank}
                    className="flex items-center gap-3 px-4 py-3 border border-[#2d3620] hover:border-[#d4681a]/40 hover:bg-[#1e2418] transition-all duration-200 group"
                  >
                    <span className="font-oswald text-2xl font-bold text-[#2d3620] group-hover:text-[#d4681a]/25 transition-colors w-8 shrink-0 leading-none">
                      {String(r.rank).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-oswald text-sm font-bold text-white truncate">{r.name}</div>
                      <div className="text-[9px] text-[#4a5a30] uppercase tracking-widest">{r.cat}</div>
                      <div className="mt-1 h-0.5 bg-[#2d3620]">
                        <div className="h-full bg-gradient-to-r from-[#d4681a] to-[#e8890a]" style={{ width: `${r.score}%` }} />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-oswald text-lg font-bold text-white">{r.score}</div>
                      <div className={`text-[10px] ${r.trend.startsWith("+") ? "text-green-500" : r.trend === "0" ? "text-[#4a5a30]" : "text-red-500"}`}>
                        {r.trend}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="border border-[#2d3620] p-6 relative overflow-hidden">
                <div className="counter-num">AI</div>
                <div className="sec-badge">Принцип оценки</div>
                <h3 className="font-oswald text-3xl font-bold text-white mb-4">Как ИИ считает рейтинг?</h3>
                <div className="space-y-4">
                  {[
                    { label: "Полевые отзывы пользователей", val: 35 },
                    { label: "Технические характеристики", val: 28 },
                    { label: "Надёжность производителя", val: 20 },
                    { label: "Соотношение цена/качество", val: 17 },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1">
                        <span className="text-[#7a8a6a] text-sm">{item.label}</span>
                        <span className="text-[#d4681a] font-oswald font-bold">{item.val}%</span>
                      </div>
                      <div className="h-1 bg-[#2d3620]">
                        <div className="h-full bg-gradient-to-r from-[#d4681a] to-[#e8890a]" style={{ width: `${item.val * 2.86}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#d4681a]/10 border border-[#d4681a]/30 p-6">
                <div className="flex items-start gap-3">
                  <Icon name="Zap" size={20} className="text-[#d4681a] mt-0.5 shrink-0" />
                  <div>
                    <div className="font-oswald text-lg text-white mb-1">ЕЖЕНЕДЕЛЬНОЕ ОБНОВЛЕНИЕ</div>
                    <p className="text-[#7a8a6a] text-sm font-light leading-relaxed">
                      Рейтинг пересчитывается каждый понедельник. Следующее обновление через 3 дня.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 bg-[#0d0f0a] relative overflow-hidden">
        <div className="tactical-grid absolute inset-0 opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <div className="inline-flex sec-badge">Принцип работы</div>
            <h2 className="font-oswald text-5xl font-bold text-white">
              КАК РАБОТАЕТ <span className="text-[#d4681a]">TACTICMIND</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="card-tac p-6 relative overflow-hidden corner-bracket">
                <div className="counter-num">{step.num}</div>
                <div className="mb-4 w-12 h-12 border border-[#d4681a]/40 flex items-center justify-center bg-[#d4681a]/10">
                  <Icon name={step.icon as "MessageSquare"} size={22} className="text-[#d4681a]" />
                </div>
                <h3 className="font-oswald text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-[#7a8a6a] text-sm leading-relaxed font-light">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 border border-[#d4681a]/30 bg-[#d4681a]/5 p-10 relative overflow-hidden">
            <div className="absolute inset-0 tactical-grid opacity-30" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="font-oswald text-4xl font-bold text-white mb-2">ГОТОВ К МИССИИ?</div>
                <p className="text-[#7a8a6a] font-light">Опишите вашу задачу — ИИ подберёт снаряжение за 3 секунды</p>
              </div>
              <button className="btn-combat text-base px-10" onClick={() => scrollTo("ai-selector")}>
                Начать подбор
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#141810] border-t border-[#2d3620] py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="hex-badge w-8 h-9">
              <Icon name="Crosshair" size={14} className="text-white" />
            </div>
            <span className="font-oswald text-lg tracking-widest text-white">TACTICMIND</span>
          </div>
          <div className="flex gap-6 text-[11px] text-[#4a5a30] uppercase tracking-widest font-roboto">
            <a href="#" className="hover:text-[#d4681a] transition-colors">О нас</a>
            <a href="#" className="hover:text-[#d4681a] transition-colors">Доставка</a>
            <a href="#" className="hover:text-[#d4681a] transition-colors">Гарантия</a>
            <a href="#" className="hover:text-[#d4681a] transition-colors">Контакты</a>
          </div>
          <div className="text-[10px] text-[#2d3620] tracking-widest">
            © 2025 TACTICMIND // ALL RIGHTS RESERVED
          </div>
        </div>
      </footer>
    </div>
  );
}
