import { useState, useCallback, useRef } from "react";
import Icon from "@/components/ui/icon";
import AiSelector, { type AiProduct } from "@/components/AiSelector";
import CartModal from "@/components/CartModal";
import AddedToast from "@/components/AddedToast";
import ProductModal from "@/components/ProductModal";
import AuthModal from "@/components/AuthModal";
import AdminPanel from "@/components/AdminPanel";
import { useCart } from "@/hooks/useCart";
import { useAuth, type Order, type Selection } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";

// Данные товаров загружаются из useProducts (localStorage), см. src/hooks/useProducts.ts
const _PRODUCTS_LEGACY_STUB: AiProduct[] = [
  {
    id: 0, name: "", category: "", price: "", rating: 0,
    image: "", tag: "",
    aiReason: "Оптимальное соотношение веса и объёма (45л / 1.8кг). Совместим с системой MOLLE. Водонепроницаемое покрытие 3000мм.",
    specs: ["45 литров", "Кордура 1000D", "MOLLE", "IP65"],
  },
  {
    id: 2, name: "Мультитул FORCE-7", category: "Инструменты", price: "4 200 ₽", rating: 94,
    image: "", tag: "ВЫБОР ЭКСПЕРТОВ",
    aiReason: "19 функций в одном корпусе из нержавеющей стали 420HC. Одноручное открытие. Гарантия 25 лет.",
    specs: ["19 функций", "Сталь 420HC", "156 гр", "25 лет"],
  },
  {
    id: 3, name: "Берцы GRUNT X2", category: "Обувь", price: "12 800 ₽", rating: 91,
    image: "", tag: "БЕСТСЕЛЛЕР",
    aiReason: "Мембрана Gore-Tex, защита 100%. Подошва Vibram до −40°C. Идеальны для длительных маршей.",
    specs: ["Gore-Tex", "Vibram sole", "−40°C", "Тактический носок"],
  },
  {
    id: 4, name: "Фонарь NIGHTHAWK", category: "Свет", price: "3 500 ₽", rating: 89,
    image: "", tag: "ВЫБОР ИИ",
    aiReason: "1000 люмен при весе 98г. Ударопрочный корпус, защита IP68. 5 режимов, 12 часов работы.",
    specs: ["1000 люмен", "IP68", "5 режимов", "12 ч"],
  },
  {
    id: 5, name: "Перчатки IRONGRIP", category: "Защита", price: "2 800 ₽", rating: 86,
    image: "", tag: "ПОПУЛЯРНЫЙ",
    aiReason: "Кевларовая защита костяшек выдерживает удар 80 Дж. Антискользящее покрытие. Совместимы с сенсорами.",
    specs: ["Кевлар", "Полупалец", "Антипорез", "XS-XXL"],
  },
  {
    id: 6, name: "Бронежилет ГРАНИТ-4", category: "Защита", price: "54 990 ₽", rating: 96,
    image: "", tag: "МАКСИМАЛЬНАЯ ЗАЩИТА",
    aiReason: "Класс защиты Бр4. Керамические пластины, вес 9.2кг. Покрывает грудь, спину и боки. Сертифицирован ГОСТ.",
    specs: ["Бр4", "9.2 кг", "Керамика", "ГОСТ"],
  },
  {
    id: 7, name: "Шлем КИРАСА-Ш", category: "Защита", price: "23 490 ₽", rating: 93,
    image: "", tag: "ТОП ЗАЩИТА",
    aiReason: "Класс Бр3, вес всего 1.4кг. Титановая основа. Крепления NVG, слоты MOLLE. Совместим с гарнитурой.",
    specs: ["Бр3", "1.4 кг", "Титан", "NVG крепления"],
  },
  {
    id: 8, name: "Разгрузка МОЛОТ-М", category: "Экипировка", price: "18 990 ₽", rating: 92,
    image: "", tag: "ВЫБОР ЭКСПЕРТОВ",
    aiReason: "8 карманов, система быстрого сброса за 1 секунду. Совместима с бронепластинами. Регулируется по фигуре.",
    specs: ["8 карманов", "Быстросброс", "MOLLE", "Унисекс"],
  },
  {
    id: 9, name: "Аптечка СТОП-КРОВЬ", category: "Медицина", price: "3 500 ₽", rating: 98,
    image: "", tag: "ТОП ВЫБОР ИИ",
    aiReason: "Турникет CAT Gen7 + израильский бандаж + гемостатик. Всё что нужно при ранении в первые 3 минуты.",
    specs: ["Турникет", "Бандажи", "Гемостатик", "Инструкция"],
  },
  {
    id: 10, name: "Рация СВЯЗИСТ-ПРО", category: "Средства связи", price: "8 900 ₽", rating: 88,
    image: "", tag: "ПОПУЛЯРНЫЙ",
    aiReason: "Дальность связи до 10км на открытой местности. Влагозащита IP67. Шифрование сигнала. Аккумулятор 72 часа.",
    specs: ["10 км", "IP67", "Шифрование", "72 ч"],
  },
  {
    id: 11, name: "Тактические очки HAWK", category: "Защита", price: "4 200 ₽", rating: 87,
    image: "", tag: "ВЫБОР ИИ",
    aiReason: "Поляризованные линзы блокируют 99.9% УФ. Ударопрочный поликарбонат. Защита от осколков и ветра.",
    specs: ["Поляризация", "Ударопрочные", "UV400", "Антицарапин"],
  },
  {
    id: 12, name: "Накидка ЛЕСОВИК", category: "Экипировка", price: "5 900 ₽", rating: 85,
    image: "", tag: "МАСКИРОВКА",
    aiReason: "Маскхалат для любого времени года. Ткань имитирует лесную подстилку. Дышащий материал, вес 400г.",
    specs: ["Лето/зима", "400 г", "Дышащий", "Унисекс"],
  },
  {
    id: 13, name: "Нож ВИТЯЗЬ", category: "Инструменты", price: "3 200 ₽", rating: 90,
    image: "", tag: "ВЫБОР ЭКСПЕРТОВ",
    aiReason: "Сталь 440C, фиксированный клинок 15см. Рукоять G10. Ножны MOLLE-совместимые. Многофункциональный.",
    specs: ["Сталь 440C", "15 см", "Фиксация", "G10"],
  },
  {
    id: 14, name: "Навигатор СТРАЖ-GPS", category: "Инструменты", price: "15 900 ₽", rating: 84,
    image: "", tag: "НАВИГАЦИЯ",
    aiReason: "Многоконстелляционный GPS+ГЛОНАСС. Топографические карты РФ. Батарея 48ч. Работает без сотовой сети.",
    specs: ["GPS+ГЛОНАСС", "48 ч", "Карты РФ", "IP67"],
  },
  // --- НОВЫЕ (15–30) ---
  // ОДЕЖДА
  {
    id: 15, name: "Куртка АРКТИК-М", category: "Одежда", price: "18 500 ₽", rating: 93,
    image: "", tag: "ЗИМНЯЯ ЗАЩИТА",
    aiReason: "Мембрана Gore-Tex 3L, утеплитель Primaloft 200г. Работает от −30°C. Съёмный капюшон, система MOLLE на рукавах.",
    specs: ["Gore-Tex 3L", "−30°C", "Primaloft", "MOLLE рукав"],
  },
  {
    id: 16, name: "Штаны СПЕЦНАЗ-ТК", category: "Одежда", price: "9 800 ₽", rating: 88,
    image: "", tag: "УСИЛЕННЫЕ",
    aiReason: "Двойное усиление колен и ягодиц накладками Cordura. 8 карманов. Артикулированный крой не стесняет движения.",
    specs: ["Cordura накладки", "8 карманов", "Стрейч", "XS-4XL"],
  },
  {
    id: 17, name: "Флис ТЕПЛОВОЙ-ПРО", category: "Одежда", price: "5 400 ₽", rating: 86,
    image: "", tag: "ВЫБОР ИИ",
    aiReason: "Полар-флис 300г/м², быстро сохнет. Молния по всей длине. Отлично работает как средний слой в системе слоёв.",
    specs: ["300 г/м²", "Быстросохнущий", "Полная молния", "XS-XXXL"],
  },
  {
    id: 18, name: "Пончо ПРИЗРАК", category: "Одежда", price: "3 200 ₽", rating: 82,
    image: "", tag: "МАСКИРОВКА",
    aiReason: "Двусторонний дождевик: цифровой камуфляж / оливковый. Укрывает с рюкзаком. Вес 320г, пакуется в кулак.",
    specs: ["Двусторонний", "320 г", "Камуфляж", "Универсальный"],
  },
  // ПИТАНИЕ И ГИДРАТАЦИЯ
  {
    id: 19, name: "Гидропак ПОТОК-3Л", category: "Питание и гидратация", price: "2 900 ₽", rating: 87,
    image: "", tag: "ВЫБОР ИИ",
    aiReason: "Резервуар 3 литра с широкой горловиной для льда. Трубка с клапаном прикуса. Вставка в любой рюкзак с MOLLE.",
    specs: ["3 литра", "Антибактер.", "Клапан", "MOLLE"],
  },
  {
    id: 20, name: "Паёк СУТОЧНЫЙ-Б", category: "Питание и гидратация", price: "1 200 ₽", rating: 80,
    image: "", tag: "БАЗОВЫЙ",
    aiReason: "3200 ккал на сутки. 5 приёмов пищи, не требует варки. Срок хранения 5 лет. Соответствует ГОСТ Р 54033.",
    specs: ["3200 ккал", "5 блюд", "5 лет", "Без варки"],
  },
  {
    id: 21, name: "Котелок ПОЛЕВОЙ-Т", category: "Питание и гидратация", price: "1 800 ₽", rating: 83,
    image: "", tag: "УНИВЕРСАЛЬНЫЙ",
    aiReason: "Набор: котелок 1.2л + кружка 0.6л + крышка-сковорода. Анодированный алюминий, вес 320г. Совместим с горелками.",
    specs: ["1.2 л", "320 г", "Анод.алюминий", "Горелка"],
  },
  // СРЕДСТВА СВЯЗИ
  {
    id: 22, name: "Гарнитура СКРЫТНИК-Х", category: "Средства связи", price: "12 500 ₽", rating: 91,
    image: "", tag: "ВЫБОР ЭКСПЕРТОВ",
    aiReason: "Активная шумозащита, подавляет выстрелы до 22 дБ. PTT-кнопка, совместима с рациями Kenwood/Baofeng. Шлемное крепление.",
    specs: ["22 дБ", "PTT", "Kenwood/Baofeng", "Шлем крепление"],
  },
  {
    id: 23, name: "Антенна ДАЛЬНИЙ-КВ", category: "Средства связи", price: "3 700 ₽", rating: 79,
    image: "", tag: "ДАЛЬНОБОЙ",
    aiReason: "Увеличивает дальность рации на 40–60%. Разъём SMA-Female, универсальная. Компактно складывается, вес 85г.",
    specs: ["SMA-F", "+60% дальность", "85 г", "VHF/UHF"],
  },
  // МЕДИЦИНА
  {
    id: 24, name: "Аптечка ГРУППА-10", category: "Медицина", price: "8 900 ₽", rating: 95,
    image: "", tag: "ТОП ВЫБОР ИИ",
    aiReason: "На 10 человек: 3 турникета, перевязочный пакет ППМ, 10 бандажей, гемостатик, назофарингеальный воздуховод. Чехол MOLLE.",
    specs: ["На 10 чел.", "MOLLE чехол", "3 турникета", "Воздуховод"],
  },
  {
    id: 25, name: "Турникет ТАК-ПРО", category: "Медицина", price: "1 400 ₽", rating: 92,
    image: "", tag: "СПАСАЕТ ЖИЗНИ",
    aiReason: "Аналог CAT Gen7, одноручное наложение за 25 секунд. Пластиковая пряжка, не ржавеет. Военная атрибуция по ГОСТ.",
    specs: ["1 рука", "25 сек", "ГОСТ", "Пластик"],
  },
  {
    id: 26, name: "Повязка ХЕМОСТОП", category: "Медицина", price: "890 ₽", rating: 88,
    image: "", tag: "ГЕМОСТАТИК",
    aiReason: "Импрегнирована каолином, останавливает кровотечение за 3 минуты. Стерильная упаковка, 5-летний срок хранения.",
    specs: ["Каолин", "3 минуты", "Стерильная", "5 лет"],
  },
  // ИНСТРУМЕНТЫ
  {
    id: 27, name: "Лопатка САПЁР-М", category: "Инструменты", price: "2 600 ₽", rating: 85,
    image: "", tag: "ПОЛЕВОЙ",
    aiReason: "Складная малая сапёрная лопатка, сталь 65Г. Пила на обухе, рукоять прорезинена. Чехол MOLLE включён. Вес 520г.",
    specs: ["Сталь 65Г", "Пила", "520 г", "MOLLE чехол"],
  },
  {
    id: 28, name: "Мультитул ТЯЖЁЛЫЙ-19", category: "Инструменты", price: "6 800 ₽", rating: 89,
    image: "", tag: "ВЫБОР ЭКСПЕРТОВ",
    aiReason: "Плоскогубцы с проволокорезом, 19 функций. Нержавейка 420HC, рукояти G10. Включает пилу по металлу и стропорез.",
    specs: ["Плоскогубцы", "Стропорез", "420HC", "G10 рукоять"],
  },
  // ЭКИПИРОВКА
  {
    id: 29, name: "Пояс ШТУРМОВОЙ-Р", category: "Экипировка", price: "4 500 ₽", rating: 87,
    image: "", tag: "БЫСТРЫЙ ДОСТУП",
    aiReason: "Тактический пояс Rigger с застёжкой-монтажом. 8 слотов MOLLE, ширина 45мм. Сертифицирован для страховки.",
    specs: ["MOLLE", "45 мм", "Страховка", "Быстрая пряжка"],
  },
  {
    id: 30, name: "Чехол МУЛЬТИКАМ-ПТ", category: "Экипировка", price: "7 200 ₽", rating: 84,
    image: "", tag: "МАСКИРОВКА",
    aiReason: "",
    specs: [],
  },
];
void _PRODUCTS_LEGACY_STUB;

// Все категории для фильтра
const CATS = ["Все", "Экипировка", "Защита", "Обувь", "Инструменты", "Свет", "Одежда", "Питание и гидратация", "Средства связи", "Медицина"];
const RATING_FILTERS = [{ label: "Любой", val: 0 }, { label: "80+", val: 80 }, { label: "85+", val: 85 }, { label: "90+", val: 90 }, { label: "95+", val: 95 }];
const SORT_OPTIONS = [
  { label: "По умолчанию", val: "default" },
  { label: "Цена: сначала дешёвые", val: "price_asc" },
  { label: "Цена: сначала дорогие", val: "price_desc" },
  { label: "Рейтинг (высокий)", val: "rating_desc" },
];

const STEPS = [
  { num: "01", icon: "MessageSquare", title: "Опишите задачу", desc: "Расскажите ИИ о вашей миссии: условия, нагрузка, климат, бюджет." },
  { num: "02", icon: "Cpu", title: "ИИ анализирует", desc: "Алгоритм обрабатывает 30 позиций каталога по 47 параметрам за секунды." },
  { num: "03", icon: "Target", title: "Получаете подборку", desc: "Каждый товар сопровождается блоком «Почему именно он» с конкретным AI-обоснованием." },
  { num: "04", icon: "ShoppingCart", title: "Заказываете", desc: "Оформляете заказ прямо в интерфейсе. Доставка по России от 1 дня." },
];

function parsePrice(price: string) {
  return parseInt(price.replace(/\D/g, ""), 10) || 0;
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<"login" | "register">("login");
  const [adminOpen, setAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<AiProduct | null>(null);
  const [ratingExpanded, setRatingExpanded] = useState(false);

  const [filterCat, setFilterCat] = useState("Все");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [filterMinRating, setFilterMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("default");

  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { items, totalCount, totalPrice, addItem, removeItem, changeQty, clear } = useCart();
  const { currentUser, register, login, logout, saveOrder, saveSelection, changePassword, updateUser, getUsers, saveUsers } = useAuth();
  const { products, updateProduct, addProduct, deleteProduct, resetToDefaults } = useProducts();

  const TOP_ALL = [...products].sort((a, b) => b.rating - a.rating);

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMsg(msg);
    setToastVisible(true);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 2000);
  }, []);

  const handleAddToCart = (p: AiProduct) => {
    addItem({ id: p.id, name: p.name, price: p.price, image: p.image, category: p.category });
    showToast(`${p.name} добавлен в корзину`);
  };

  const handleOrder = () => {
    if (items.length === 0) return;
    const order: Order = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("ru-RU"),
      total: totalPrice,
      status: "Создан",
      items: [...items],
    };
    saveOrder(order);
    clear();
    showToast("Заказ оформлен! Менеджер свяжется с вами.");
    setCartOpen(false);
  };

  const handleSaveSelection = (task: string, selItems: AiProduct[]) => {
    if (!currentUser) return;
    const sel: Selection = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("ru-RU"),
      task,
      items: selItems.map(p => ({ id: p.id, name: p.name, price: p.price, image: p.image, category: p.category, aiReason: p.aiReason })),
    };
    saveSelection(sel);
  };

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  let filtered = products.filter(p => {
    if (filterCat !== "Все" && p.category !== filterCat) return false;
    if (filterMaxPrice && parsePrice(p.price) > parseInt(filterMaxPrice, 10)) return false;
    if (filterMinRating && p.rating < filterMinRating) return false;
    return true;
  });
  if (sortBy === "price_asc") filtered = [...filtered].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  if (sortBy === "price_desc") filtered = [...filtered].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  if (sortBy === "rating_desc") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  const ratingList = ratingExpanded ? TOP_ALL : TOP_ALL.slice(0, 5);

  const openAuthForOrder = () => {
    setAuthDefaultTab("login");
    setCartOpen(false);
    setAuthOpen(true);
  };

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
        onOrder={handleOrder}
        isAuthorized={!!currentUser}
        onLoginRequest={openAuthForOrder}
      />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p) => { handleAddToCart(p as AiProduct); setSelectedProduct(null); }}
      />

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onRegister={(e, p, n) => { const err = register(e, p, n); if (!err) showToast("Добро пожаловать!"); return err; }}
        onLogin={(e, p) => { const err = login(e, p); if (!err) showToast("Вход выполнен"); return err; }}
        onLogout={logout}
        onChangePassword={changePassword}
        onUpdateUser={updateUser}
        currentUser={currentUser}
        defaultTab={authDefaultTab}
      />

      <AdminPanel
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        products={products}
        onUpdateProduct={updateProduct}
        onAddProduct={addProduct}
        onDeleteProduct={deleteProduct}
        onResetProducts={resetToDefaults}
        getUsers={getUsers}
        saveUsers={saveUsers}
        onLogout={logout}
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
                  activeSection === item.id ? "text-[#d4681a] border-b-2 border-[#d4681a]" : "text-[#7a8a6a] hover:text-[#d8dcc8]"
                }`}
              >
                {item.label}
              </button>
            ))}
            {currentUser?.isAdmin && (
              <button
                onClick={() => setAdminOpen(true)}
                className="px-4 py-2 font-oswald text-sm tracking-widest uppercase text-red-400 hover:text-red-300 transition-colors border border-red-900/40 ml-1"
              >
                Админ
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Auth button */}
            <button
              onClick={() => setAuthOpen(true)}
              className="flex items-center gap-2 border border-[#2d3620] hover:border-[#d4681a]/60 text-[#7a8a6a] hover:text-[#d4681a] px-3 py-2 transition-all duration-200"
            >
              <Icon name="User" size={16} />
              <span className="font-oswald uppercase tracking-widest text-xs hidden sm:block">
                {currentUser ? currentUser.name.split(" ")[0] : "Войти"}
              </span>
            </button>

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 border border-[#2d3620] hover:border-[#d4681a] text-[#7a8a6a] hover:text-[#d4681a] px-4 py-2 transition-all duration-200"
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
            <span>ИИ-АНАЛИЗ: 30 ЕДИНИЦ СНАРЯЖЕНИЯ</span>
            <span className="hidden md:block">ВЕРСИЯ 3.0.0 // БОЕВАЯ ГОТОВНОСТЬ</span>
          </div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-4xl">
            <div className="sec-badge anim-fade anim-delay-1">
              <span className="w-1.5 h-1.5 bg-[#d4681a] rounded-full animate-pulse" />
              Искусственный интеллект × Тактическое снаряжение
            </div>
            <h1 className="font-oswald text-6xl md:text-8xl font-bold text-white leading-none mb-2 anim-fade anim-delay-2">
              ПРАВИЛЬНОЕ<br />
              <span className="text-[#d4681a] text-glow">СНАРЯЖЕНИЕ</span><br />
              СПАСАЕТ ЖИЗНИ
            </h1>
            <div className="tac-divider my-8 anim-fade anim-delay-3" />
            <p className="text-[#7a8a6a] text-lg max-w-2xl leading-relaxed anim-fade anim-delay-3 font-roboto font-light">
              TacticMind анализирует вашу задачу и подбирает снаряжение из 30 позиций с точным AI-обоснованием по каждой.
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
                { val: "30", label: "позиций в каталоге" },
                { val: "10", label: "категорий снаряжения" },
                { val: "< 2 сек", label: "время AI-подбора" },
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

      {/* AI SELECTOR */}
      <AiSelector
        onAddToCart={handleAddToCart}
        onProductClick={(p) => setSelectedProduct(p)}
        allProducts={products}
        onSaveSelection={handleSaveSelection}
      />

      {/* CATALOG */}
      <section id="catalog" className="py-24 bg-[#0d0f0a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <div className="sec-badge">Каталог снаряжения</div>
            <h2 className="font-oswald text-5xl font-bold text-white">
              ОТОБРАНО <span className="text-[#d4681a]">ИИ</span>
            </h2>
            <p className="text-[#7a8a6a] mt-2 font-light">30 позиций по 10 категориям, отобранных и протестированных специалистами</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8 items-end p-5 border border-[#2d3620] bg-[#141810]">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-[#4a5a30] uppercase tracking-widest">Категория</label>
              <select
                value={filterCat}
                onChange={e => setFilterCat(e.target.value)}
                className="bg-[#0d0f0a] border border-[#2d3620] text-[#d8dcc8] text-sm px-3 py-2 focus:border-[#d4681a] outline-none transition-colors"
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
                className="bg-[#0d0f0a] border border-[#2d3620] text-[#d8dcc8] text-sm px-3 py-2 focus:border-[#d4681a] outline-none transition-colors"
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
                  className="card-tac group flex flex-col"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <div
                    className="relative overflow-hidden h-48 cursor-pointer"
                    onClick={() => setSelectedProduct(p)}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141810] via-transparent to-transparent" />
                    {p.tag && <div className="absolute top-2 left-2 ai-tag text-[9px]">{p.tag}</div>}
                    <div className="absolute top-2 right-2 bg-[#0d0f0a]/80 border border-[#2d3620] px-2 py-0.5">
                      <span className="font-oswald text-base font-bold text-[#d4681a]">{p.rating}</span>
                      <span className="text-[9px] text-[#4a5a30]">/100</span>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-[#2d3620]">
                    <div className="rating-bar h-full" style={{ width: `${p.rating}%` }} />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="text-[9px] text-[#4a5a30] tracking-[0.2em] uppercase mb-1">{p.category}</div>
                    <h3
                      className="font-oswald text-base font-bold text-white mb-2 leading-tight cursor-pointer hover:text-[#d4681a] transition-colors"
                      onClick={() => setSelectedProduct(p)}
                    >
                      {p.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.specs.slice(0, 3).map(s => (
                        <span key={s} className="text-[9px] border border-[#2d3620] text-[#7a8a6a] px-1.5 py-0.5 uppercase tracking-wider">{s}</span>
                      ))}
                    </div>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-oswald text-xl font-bold text-white">{p.price}</span>
                        <button
                          onClick={() => setSelectedProduct(p)}
                          className="text-[#d4681a] hover:text-[#e8890a] transition-colors flex items-center gap-1 text-xs font-oswald uppercase tracking-wider"
                        >
                          Подробнее
                          <Icon name="ChevronRight" size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleAddToCart(p)}
                        className="w-full btn-combat text-xs py-2 flex items-center justify-center gap-2"
                      >
                        <Icon name="ShoppingCart" size={13} />
                        В корзину
                      </button>
                    </div>
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
              <p className="text-[#7a8a6a] font-light mb-6">ИИ обновляет рейтинг еженедельно из 30 позиций</p>
              <div className="space-y-1">
                {ratingList.map((p, i) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 px-4 py-3 border border-[#2d3620] hover:border-[#d4681a]/40 hover:bg-[#1e2418] transition-all duration-200 group cursor-pointer"
                    onClick={() => setSelectedProduct(p)}
                  >
                    <span className="font-oswald text-2xl font-bold text-[#2d3620] group-hover:text-[#d4681a]/25 transition-colors w-8 shrink-0 leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-oswald text-sm font-bold text-white truncate group-hover:text-[#d4681a] transition-colors">{p.name}</div>
                      <div className="text-[9px] text-[#4a5a30] uppercase tracking-widest">{p.category}</div>
                      <div className="mt-1 h-0.5 bg-[#2d3620]">
                        <div className="h-full bg-gradient-to-r from-[#d4681a] to-[#e8890a]" style={{ width: `${p.rating}%` }} />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-oswald text-lg font-bold text-white">{p.rating}</div>
                      <div className="text-[10px] text-[#4a5a30]">pts</div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setRatingExpanded(!ratingExpanded)}
                className="mt-4 w-full border border-[#2d3620] hover:border-[#d4681a]/40 text-[#4a5a30] hover:text-[#d4681a] font-oswald uppercase tracking-widest text-xs py-3 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Icon name={ratingExpanded ? "ChevronUp" : "ChevronDown"} size={14} />
                {ratingExpanded ? `Скрыть (показано ${TOP_ALL.length})` : `Показать все ${TOP_ALL.length} позиций`}
              </button>
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
                <p className="text-[#7a8a6a] font-light">Опишите вашу задачу — ИИ подберёт снаряжение из 30 позиций</p>
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
          <div className="text-[10px] text-[#2d3620] tracking-widest">© 2025 TACTICMIND // ALL RIGHTS RESERVED</div>
        </div>
      </footer>
    </div>
  );
}