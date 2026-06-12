import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const TERMS = [
  {
    num: "01",
    title: "Срок гарантии",
    content: "На всё снаряжение из каталога TacticMind распространяется гарантия от 12 до 36 месяцев в зависимости от категории товара. Срок гарантии указан на странице каждого товара.",
  },
  {
    num: "02",
    title: "Гарантийный случай",
    content: "Гарантия распространяется на производственные дефекты: расслоение материала, неисправность фурнитуры, дефекты швов и соединений, отказ электронных компонентов при нормальной эксплуатации.",
  },
  {
    num: "03",
    title: "Не является гарантийным случаем",
    content: "Механические повреждения от ударов, порезов, падений. Повреждения от химических веществ и огня. Естественный износ материала. Нарушение условий эксплуатации, указанных в инструкции.",
  },
  {
    num: "04",
    title: "Возврат и обмен",
    content: "Возврат товара надлежащего качества возможен в течение 14 дней с момента получения. Товар должен сохранять товарный вид, потребительские свойства, упаковку и ярлыки.",
  },
  {
    num: "05",
    title: "Порядок обращения",
    content: "Для оформления гарантийного обращения свяжитесь с нами по email или телефону. Приложите фото дефекта и чек (номер заказа). Решение принимается в течение 3 рабочих дней.",
  },
  {
    num: "06",
    title: "Ремонт и замена",
    content: "При подтверждении гарантийного случая мы бесплатно устраняем дефект или заменяем товар. Доставка на замену осуществляется за наш счёт. Срок замены — до 14 рабочих дней.",
  },
];

const CATEGORIES = [
  { cat: "Бронезащита", months: 36 },
  { cat: "Средства связи", months: 24 },
  { cat: "Экипировка и рюкзаки", months: 24 },
  { cat: "Обувь", months: 12 },
  { cat: "Инструменты", months: 24 },
  { cat: "Медицина", months: 36 },
  { cat: "Одежда", months: 12 },
  { cat: "Навигация", months: 24 },
];

export default function Warranty() {
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
          <Icon name="BadgeCheck" size={12} className="text-[#d4681a]" />
          <span className="text-[10px] text-[#d4681a] uppercase tracking-[0.2em]">Гарантия</span>
        </div>

        <h1 className="font-oswald text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
          ГАРАНТИЯ И<br />
          <span className="text-[#d4681a]">ВОЗВРАТ</span>
        </h1>
        <div className="h-px bg-[#2d3620] my-8" />

        <div className="space-y-10">
          {/* Warranty terms */}
          <div className="space-y-3">
            {TERMS.map((t) => (
              <div key={t.num} className="border border-[#2d3620] bg-[#141810] px-6 py-5 flex items-start gap-4">
                <span className="font-oswald text-2xl font-bold text-[#d4681a]/25 w-8 shrink-0 leading-none">{t.num}</span>
                <div>
                  <div className="font-oswald text-sm font-bold text-white uppercase tracking-widest mb-2">{t.title}</div>
                  <p className="text-[#7a8a6a] text-sm font-light leading-relaxed">{t.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Warranty periods by category */}
          <div className="border border-[#2d3620] bg-[#141810] p-8">
            <div className="text-[10px] text-[#4a5a30] uppercase tracking-[0.2em] mb-5">Сроки гарантии по категориям</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CATEGORIES.map((c) => (
                <div key={c.cat} className="flex items-center justify-between border border-[#2d3620] px-4 py-3">
                  <span className="text-[#7a8a6a] text-sm font-light">{c.cat}</span>
                  <span className="font-oswald text-sm font-bold text-[#d4681a]">{c.months} мес.</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[#d4681a]/20 bg-[#d4681a]/5 p-6 flex items-start gap-3">
            <Icon name="Mail" size={18} className="text-[#d4681a] shrink-0 mt-0.5" />
            <div>
              <div className="font-oswald text-sm text-white uppercase tracking-widest mb-1">Гарантийный отдел</div>
              <p className="text-[#7a8a6a] text-sm font-light">
                По всем вопросам гарантии и возврата:{" "}
                <a href="mailto:tmofey.kovalev@gmail.com" className="text-[#d4681a] hover:underline">
                  tmofey.kovalev@gmail.com
                </a>
              </p>
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
