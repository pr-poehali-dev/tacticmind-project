import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const CONTACTS = [
  {
    icon: "Mail",
    title: "Электронная почта",
    value: "tmofey.kovalev@gmail.com",
    href: "mailto:tmofey.kovalev@gmail.com",
    desc: "Ответим в течение 24 часов",
  },
  {
    icon: "MessageCircle",
    title: "Telegram",
    value: "@tacticmind",
    href: "https://t.me/tacticmind",
    desc: "Быстрый ответ в рабочее время",
  },
  {
    icon: "Phone",
    title: "Телефон",
    value: "+7 (800) 000-00-00",
    href: "tel:+78000000000",
    desc: "Пн–Пт с 9:00 до 18:00 МСК",
  },
  {
    icon: "MapPin",
    title: "Адрес",
    value: "Москва, Россия",
    href: "#",
    desc: "Самовывоз — по договорённости",
  },
];

const FAQ = [
  {
    q: "Как быстро обрабатывается заказ?",
    a: "Заказы обрабатываются в течение 1 рабочего дня. Подтверждение приходит по email и SMS.",
  },
  {
    q: "Можно ли изменить или отменить заказ?",
    a: "Да, пока заказ не передан в доставку. Свяжитесь с нами как можно быстрее после оформления.",
  },
  {
    q: "Как отследить статус заказа?",
    a: "После отправки мы высылаем трек-номер на email. Отслеживание доступно на сайте службы доставки.",
  },
  {
    q: "Работаете ли вы с юридическими лицами?",
    a: "Да, работаем по безналичному расчёту с НДС. Направьте запрос на email для согласования условий.",
  },
  {
    q: "Есть ли оптовые скидки?",
    a: "При заказе от 10 единиц одной позиции или от 50 000 ₽ — обсуждаем индивидуальные условия.",
  },
];

export default function Contacts() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d0f0a] text-[#d8dcc8] font-roboto">
      <header className="bg-[#141810] border-b border-[#2d3620] py-4 px-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-[#7a8a6a] hover:text-[#d4681a] transition-colors">
            <Icon name="ArrowLeft" size={18} />
            <span className="font-oswald uppercase tracking-widest text-sm">Назад</span>
          </button>
          <div className="w-px h-5 bg-[#2d3620]" />
          <span className="font-oswald text-lg tracking-widest text-white">TACTICMIND</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="inline-flex items-center gap-2 border border-[#d4681a]/30 bg-[#d4681a]/5 px-3 py-1.5 mb-6">
          <Icon name="Phone" size={12} className="text-[#d4681a]" />
          <span className="text-[10px] text-[#d4681a] uppercase tracking-[0.2em]">Контакты</span>
        </div>

        <h1 className="font-oswald text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
          СВЯЗАТЬСЯ<br />
          <span className="text-[#d4681a]">С НАМИ</span>
        </h1>
        <div className="h-px bg-[#2d3620] my-8" />

        <div className="space-y-10">
          {/* Contact cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CONTACTS.map((c) => (
              <a
                key={c.title}
                href={c.href}
                className="border border-[#2d3620] bg-[#141810] p-6 flex gap-4 hover:border-[#d4681a]/40 hover:bg-[#1e2418] transition-all duration-200 group"
              >
                <div className="w-10 h-10 border border-[#d4681a]/30 bg-[#d4681a]/10 flex items-center justify-center shrink-0">
                  <Icon name={c.icon as "Mail"} size={18} className="text-[#d4681a]" />
                </div>
                <div>
                  <div className="text-[9px] text-[#4a5a30] uppercase tracking-[0.2em] mb-1">{c.title}</div>
                  <div className="font-oswald text-base font-bold text-white group-hover:text-[#d4681a] transition-colors mb-1">
                    {c.value}
                  </div>
                  <p className="text-[#7a8a6a] text-xs font-light">{c.desc}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Working hours */}
          <div className="border border-[#2d3620] bg-[#141810] p-8">
            <div className="text-[10px] text-[#4a5a30] uppercase tracking-[0.2em] mb-5">Режим работы</div>
            <div className="space-y-2">
              {[
                { days: "Понедельник — Пятница", hours: "09:00 — 18:00 МСК" },
                { days: "Суббота", hours: "10:00 — 16:00 МСК" },
                { days: "Воскресенье", hours: "Выходной" },
              ].map((h) => (
                <div key={h.days} className="flex items-center justify-between border-b border-[#2d3620] pb-2 last:border-0 last:pb-0">
                  <span className="text-[#7a8a6a] text-sm font-light">{h.days}</span>
                  <span className={`font-oswald text-sm font-bold ${h.hours === "Выходной" ? "text-[#4a5a30]" : "text-white"}`}>
                    {h.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <div className="text-[10px] text-[#4a5a30] uppercase tracking-[0.2em] mb-5">Частые вопросы</div>
            <div className="space-y-3">
              {FAQ.map((f, i) => (
                <div key={i} className="border border-[#2d3620] bg-[#141810] px-6 py-5">
                  <div className="font-oswald text-sm font-bold text-white mb-2">{f.q}</div>
                  <p className="text-[#7a8a6a] text-sm font-light leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#141810] border-t border-[#2d3620] py-8 mt-8">
        <div className="max-w-4xl mx-auto px-6 text-center text-[10px] text-[#2d3620] tracking-widest">
          © 2025 TACTICMIND // ALL RIGHTS RESERVED
        </div>
      </footer>
    </div>
  );
}
