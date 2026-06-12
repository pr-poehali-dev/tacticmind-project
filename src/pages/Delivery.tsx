import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const METHODS = [
  {
    icon: "Truck",
    title: "Курьерская доставка",
    price: "от 350 ₽",
    time: "1–3 дня",
    desc: "Доставка до двери в Москве и Санкт-Петербурге. Курьер свяжется за час до прибытия.",
  },
  {
    icon: "Package",
    title: "СДЭК / Boxberry",
    price: "от 250 ₽",
    time: "2–7 дней",
    desc: "Доставка в пункты выдачи по всей России. Отслеживание заказа в реальном времени.",
  },
  {
    icon: "Mail",
    title: "Почта России",
    price: "от 180 ₽",
    time: "5–14 дней",
    desc: "Доставка в отдалённые регионы и за рубеж. Заказное отправление с уведомлением.",
  },
  {
    icon: "MapPin",
    title: "Самовывоз",
    price: "Бесплатно",
    time: "Сегодня",
    desc: "Получите заказ в нашем пункте выдачи. Адрес уточняйте при оформлении заказа.",
  },
];

const STEPS = [
  { num: "01", title: "Оформляете заказ", desc: "Добавляете товары в корзину и оформляете заказ на сайте." },
  { num: "02", title: "Подтверждение", desc: "Менеджер перезванивает в течение 30 минут для подтверждения." },
  { num: "03", title: "Сборка и упаковка", desc: "Комплектуем заказ, упаковываем в надёжную тару." },
  { num: "04", title: "Доставка", desc: "Передаём в службу доставки. Высылаем трек-номер на почту." },
];

export default function Delivery() {
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
          <Icon name="Truck" size={12} className="text-[#d4681a]" />
          <span className="text-[10px] text-[#d4681a] uppercase tracking-[0.2em]">Доставка</span>
        </div>

        <h1 className="font-oswald text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
          ДОСТАВКА И<br />
          <span className="text-[#d4681a]">ОПЛАТА</span>
        </h1>
        <div className="h-px bg-[#2d3620] my-8" />

        <div className="space-y-10">
          {/* Methods */}
          <div>
            <div className="text-[10px] text-[#4a5a30] uppercase tracking-[0.2em] mb-5">Способы доставки</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {METHODS.map((m) => (
                <div key={m.title} className="border border-[#2d3620] bg-[#141810] p-6">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 border border-[#d4681a]/30 bg-[#d4681a]/10 flex items-center justify-center">
                        <Icon name={m.icon as "Truck"} size={16} className="text-[#d4681a]" />
                      </div>
                      <div className="font-oswald text-sm font-bold text-white uppercase tracking-widest">{m.title}</div>
                    </div>
                  </div>
                  <div className="flex gap-4 mb-3">
                    <div className="border-l-2 border-[#d4681a] pl-3">
                      <div className="text-[9px] text-[#4a5a30] uppercase tracking-widest mb-0.5">Стоимость</div>
                      <div className="font-oswald text-sm font-bold text-[#d4681a]">{m.price}</div>
                    </div>
                    <div className="border-l-2 border-[#2d3620] pl-3">
                      <div className="text-[9px] text-[#4a5a30] uppercase tracking-widest mb-0.5">Срок</div>
                      <div className="font-oswald text-sm font-bold text-white">{m.time}</div>
                    </div>
                  </div>
                  <p className="text-[#7a8a6a] text-xs font-light leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div>
            <div className="text-[10px] text-[#4a5a30] uppercase tracking-[0.2em] mb-5">Как проходит заказ</div>
            <div className="space-y-2">
              {STEPS.map((s) => (
                <div key={s.num} className="border border-[#2d3620] bg-[#141810] px-6 py-4 flex items-start gap-4">
                  <span className="font-oswald text-2xl font-bold text-[#d4681a]/25 w-8 shrink-0 leading-none">{s.num}</span>
                  <div>
                    <div className="font-oswald text-sm font-bold text-white uppercase tracking-widest mb-1">{s.title}</div>
                    <p className="text-[#7a8a6a] text-xs font-light leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="border border-[#2d3620] bg-[#141810] p-8">
            <div className="text-[10px] text-[#4a5a30] uppercase tracking-[0.2em] mb-5">Способы оплаты</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: "CreditCard", title: "Банковская карта", desc: "Visa, Mastercard, МИР — онлайн на сайте" },
                { icon: "Smartphone", title: "СБП / QR-код", desc: "Быстрая оплата через мобильный банк" },
                { icon: "Banknote", title: "Наличные", desc: "При получении у курьера или самовывозе" },
              ].map((p) => (
                <div key={p.title} className="flex gap-3">
                  <div className="w-8 h-8 border border-[#2d3620] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon name={p.icon as "CreditCard"} size={14} className="text-[#d4681a]" />
                  </div>
                  <div>
                    <div className="font-oswald text-xs font-bold text-white uppercase tracking-widest mb-1">{p.title}</div>
                    <p className="text-[#7a8a6a] text-xs font-light">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[#d4681a]/20 bg-[#d4681a]/5 p-6 flex items-start gap-3">
            <Icon name="Info" size={18} className="text-[#d4681a] shrink-0 mt-0.5" />
            <p className="text-[#7a8a6a] text-sm font-light leading-relaxed">
              Бесплатная доставка при заказе от <span className="text-white font-semibold">15 000 ₽</span>. Доставляем по всей России, в страны СНГ и дальнее зарубежье.
            </p>
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
