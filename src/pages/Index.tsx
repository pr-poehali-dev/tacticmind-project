import { useState } from "react";
import Icon from "@/components/ui/icon";

const PRODUCTS = [
  {
    id: 1,
    name: "Рюкзак ASSAULT PRO",
    category: "Экипировка",
    price: "8 490 ₽",
    rating: 97,
    image: "https://cdn.poehali.dev/projects/600da521-22fd-451e-8c82-59b152c1d165/files/e36b36f6-28e7-40d1-b2b2-842f39d434ea.jpg",
    tag: "ТОП ВЫБОР ИИ",
    aiReason: "Оптимальное соотношение веса и объёма (45л / 1.8кг). Совместим с системой MOLLE. Водонепроницаемое покрытие 3000мм. Подходит для операций 72+ часов.",
    specs: ["45 литров", "Кордура 1000D", "MOLLE", "IP65"],
  },
  {
    id: 2,
    name: "Мультитул FORCE-7",
    category: "Инструменты",
    price: "4 200 ₽",
    rating: 94,
    image: "https://cdn.poehali.dev/projects/600da521-22fd-451e-8c82-59b152c1d165/files/8ea21448-585e-4cc6-8bdf-15653a06e9ca.jpg",
    tag: "ВЫБОР ЭКСПЕРТОВ",
    aiReason: "19 функций в одном корпусе из нержавеющей стали 420HC. Одноручное открытие. Выдерживает нагрузку до 80 кг. Гарантия 25 лет.",
    specs: ["19 функций", "Сталь 420HC", "156 гр", "25 лет гарантии"],
  },
  {
    id: 3,
    name: "Берцы GRUNT X2",
    category: "Обувь",
    price: "12 800 ₽",
    rating: 91,
    image: "https://cdn.poehali.dev/projects/600da521-22fd-451e-8c82-59b152c1d165/files/b272a69e-e2fc-459d-92b6-1eedea70a0f9.jpg",
    tag: "БЕСТСЕЛЛЕР",
    aiReason: "Мембрана Gore-Tex обеспечивает защиту от влаги 100%. Подошва Vibram выдерживает −40°C. Усиленный носок. Идеальны для длительных маршей.",
    specs: ["Gore-Tex", "Vibram sole", "−40°C", "Тактический носок"],
  },
];

const RATINGS = [
  { rank: 1, name: "Рюкзак ASSAULT PRO", score: 97, cat: "Экипировка", trend: "+2" },
  { rank: 2, name: "Мультитул FORCE-7", score: 94, cat: "Инструменты", trend: "+5" },
  { rank: 3, name: "Берцы GRUNT X2", score: 91, cat: "Обувь", trend: "−1" },
  { rank: 4, name: "Фонарь NIGHTHAWK", score: 89, cat: "Свет", trend: "+3" },
  { rank: 5, name: "Перчатки IRONGRIP", score: 86, cat: "Защита", trend: "0" },
];

const STEPS = [
  {
    num: "01",
    icon: "MessageSquare",
    title: "Опишите задачу",
    desc: "Расскажите ИИ о вашей миссии: условия, нагрузка, климат, бюджет. Никаких лишних форм.",
  },
  {
    num: "02",
    icon: "Cpu",
    title: "ИИ анализирует",
    desc: "Алгоритм обрабатывает 10 000+ единиц снаряжения по 47 параметрам за секунды.",
  },
  {
    num: "03",
    icon: "Target",
    title: "Получаете подборку",
    desc: "Каждый товар сопровождается блоком «Почему именно он» с конкретным AI-обоснованием.",
  },
  {
    num: "04",
    icon: "ShoppingCart",
    title: "Заказываете",
    desc: "Оформляете заказ прямо в интерфейсе. Доставка по России от 1 дня.",
  },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [activeProduct, setActiveProduct] = useState<number | null>(null);
  const [filterCat, setFilterCat] = useState("Все");

  const cats = ["Все", "Экипировка", "Инструменты", "Обувь"];
  const filtered = filterCat === "Все" ? PRODUCTS : PRODUCTS.filter(p => p.category === filterCat);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0d0f0a] text-[#d8dcc8] font-roboto">

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

          <button className="btn-combat text-sm">
            Подобрать снаряжение
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
              Не просто товар — система аргументов, почему именно этот выбор оптимален для вас.
            </p>

            <div className="flex flex-wrap gap-4 mt-10 anim-fade anim-delay-4">
              <button className="btn-combat text-base" onClick={() => scrollTo("catalog")}>
                Запустить подбор
              </button>
              <button
                className="border border-[#2d3620] hover:border-[#d4681a] text-[#7a8a6a] hover:text-[#d4681a] font-oswald uppercase tracking-widest text-sm px-8 py-3 transition-all duration-200"
                onClick={() => scrollTo("how")}
              >
                Как это работает
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

      {/* CATALOG */}
      <section id="catalog" className="py-24 bg-[#0d0f0a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <div className="sec-badge">Каталог снаряжения</div>
            <h2 className="font-oswald text-5xl font-bold text-white">
              ОТОБРАНО <span className="text-[#d4681a]">ИИ</span>
            </h2>
            <p className="text-[#7a8a6a] mt-3 font-light">Каждая позиция прошла многоуровневый анализ по 47 параметрам</p>
          </div>

          <div className="flex gap-2 mb-8 flex-wrap">
            {cats.map(c => (
              <button
                key={c}
                onClick={() => setFilterCat(c)}
                className={`font-oswald uppercase tracking-widest text-sm px-5 py-2 border transition-all duration-200 ${
                  filterCat === c
                    ? "bg-[#d4681a] text-white border-[#d4681a]"
                    : "border-[#2d3620] text-[#7a8a6a] hover:border-[#d4681a] hover:text-[#d4681a]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <div
                key={p.id}
                className="card-tac group cursor-pointer"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="relative overflow-hidden h-56">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141810] via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 ai-tag">{p.tag}</div>
                  <div className="absolute top-3 right-3 bg-[#0d0f0a]/80 border border-[#2d3620] px-2 py-1">
                    <span className="font-oswald text-lg font-bold text-[#d4681a]">{p.rating}</span>
                    <span className="text-[10px] text-[#4a5a30]">/100</span>
                  </div>
                </div>

                <div className="h-1 w-full bg-[#2d3620]">
                  <div className="rating-bar h-full transition-all duration-700" style={{ width: `${p.rating}%` }} />
                </div>

                <div className="p-5">
                  <div className="text-[10px] text-[#4a5a30] tracking-[0.2em] uppercase mb-1">{p.category}</div>
                  <h3 className="font-oswald text-xl font-bold text-white mb-3">{p.name}</h3>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {p.specs.map(s => (
                      <span key={s} className="text-[10px] border border-[#2d3620] text-[#7a8a6a] px-2 py-1 uppercase tracking-wider">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-oswald text-2xl font-bold text-white">{p.price}</span>
                    <button
                      onClick={() => setActiveProduct(activeProduct === p.id ? null : p.id)}
                      className="text-[#d4681a] hover:text-[#e8890a] transition-colors flex items-center gap-1 text-sm font-oswald uppercase tracking-wider"
                    >
                      {activeProduct === p.id ? "Скрыть" : "Почему он?"}
                      <Icon name={activeProduct === p.id ? "ChevronUp" : "ChevronDown"} size={14} />
                    </button>
                  </div>

                  {activeProduct === p.id && (
                    <div className="mt-4 border-t border-[#2d3620] pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="Cpu" size={14} className="text-[#d4681a]" />
                        <span className="text-[10px] text-[#d4681a] tracking-[0.2em] uppercase font-oswald">AI-обоснование</span>
                      </div>
                      <p className="text-[#7a8a6a] text-sm leading-relaxed font-light">{p.aiReason}</p>
                    </div>
                  )}

                  <button className="w-full mt-4 btn-combat text-sm text-center">
                    В корзину
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="border border-[#2d3620] hover:border-[#d4681a] text-[#7a8a6a] hover:text-[#d4681a] font-oswald uppercase tracking-widest text-sm px-10 py-3 transition-all duration-200">
              Загрузить ещё 47 позиций
            </button>
          </div>
        </div>
      </section>

      {/* RATING */}
      <section id="rating" className="py-24 bg-[#141810] border-y border-[#2d3620]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="sec-badge">Рейтинг недели</div>
              <h2 className="font-oswald text-5xl font-bold text-white mb-2">
                ТОП <span className="text-[#d4681a]">СНАРЯЖЕНИЯ</span>
              </h2>
              <p className="text-[#7a8a6a] font-light mb-8">
                ИИ обновляет рейтинг еженедельно на основе реальных отзывов и полевых данных
              </p>

              <div className="space-y-1">
                {RATINGS.map((r) => (
                  <div
                    key={r.rank}
                    className="flex items-center gap-4 p-4 border border-[#2d3620] hover:border-[#d4681a]/50 hover:bg-[#1e2418] transition-all duration-200 group"
                  >
                    <div className="relative">
                      <span className="font-oswald text-4xl font-bold text-[#2d3620] group-hover:text-[#d4681a]/20 transition-colors leading-none">
                        {String(r.rank).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-oswald text-lg font-bold text-white">{r.name}</div>
                      <div className="text-[10px] text-[#4a5a30] uppercase tracking-widest">{r.cat}</div>
                      <div className="mt-2 h-0.5 bg-[#2d3620] w-full">
                        <div
                          className="h-full bg-gradient-to-r from-[#d4681a] to-[#e8890a] transition-all duration-700"
                          style={{ width: `${r.score}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-oswald text-2xl font-bold text-white">{r.score}</div>
                      <div className={`text-xs font-roboto ${r.trend.startsWith("+") ? "text-green-500" : r.trend === "0" ? "text-[#4a5a30]" : "text-red-500"}`}>
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
                        <div
                          className="h-full bg-gradient-to-r from-[#d4681a] to-[#e8890a]"
                          style={{ width: `${item.val * 2.86}%` }}
                        />
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
                      Рейтинг пересчитывается каждый понедельник. ИИ учитывает новые отзывы, полевые тесты и изменения цен. Следующее обновление через 3 дня.
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
            <p className="text-[#7a8a6a] mt-3 font-light max-w-xl mx-auto">
              Четыре шага от описания задачи до готовой посылки с проверенным снаряжением
            </p>
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
                <div className="font-oswald text-4xl font-bold text-white mb-2">
                  ГОТОВ К МИССИИ?
                </div>
                <p className="text-[#7a8a6a] font-light">
                  Опишите вашу задачу — ИИ подберёт снаряжение за 3 секунды
                </p>
              </div>
              <button className="btn-combat text-base px-10">
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
