import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const TEAM = [
  { role: "Основатель", name: "Тимофей Ковалёв", desc: "10 лет в сфере тактического снаряжения. Ветеран силовых структур." },
  { role: "Эксперт по снаряжению", name: "Алексей Дорохов", desc: "Инструктор по выживанию. Лично тестирует каждую позицию каталога." },
  { role: "AI-аналитик", name: "Система TacticMind", desc: "Алгоритм обрабатывает 47 параметров по каждому товару ежедневно." },
];

const VALUES = [
  { icon: "Shield", title: "Только проверенное", desc: "Каждый товар проходит полевые испытания перед попаданием в каталог." },
  { icon: "Cpu", title: "Интеллектуальный подбор", desc: "ИИ анализирует вашу задачу и подбирает снаряжение точнее любого консультанта." },
  { icon: "Target", title: "Точность превыше всего", desc: "Описания, характеристики и фото — только реальные, без маркетингового глянца." },
  { icon: "Zap", title: "Скорость и надёжность", desc: "Подбор за секунды, доставка по России от 1 дня, гарантия на весь каталог." },
];

export default function About() {
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
          <Icon name="Info" size={12} className="text-[#d4681a]" />
          <span className="text-[10px] text-[#d4681a] uppercase tracking-[0.2em]">О компании</span>
        </div>

        <h1 className="font-oswald text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
          О НАС —<br />
          <span className="text-[#d4681a]">TACTICMIND</span>
        </h1>
        <div className="h-px bg-[#2d3620] my-8" />

        <div className="space-y-10">
          {/* Mission */}
          <div className="border border-[#2d3620] bg-[#141810] p-8">
            <div className="text-[10px] text-[#4a5a30] uppercase tracking-[0.2em] mb-3">Миссия</div>
            <p className="text-[#d8dcc8] text-lg leading-relaxed font-light mb-4">
              TacticMind — первый в России магазин тактического снаряжения с интегрированным искусственным интеллектом. Мы убеждены: правильное снаряжение спасает жизни.
            </p>
            <p className="text-[#7a8a6a] text-sm leading-relaxed font-light">
              Мы создали платформу, где каждый — от профессионального военного до туриста — может за секунды получить точную, обоснованную подборку снаряжения под свою конкретную задачу. Никакой воды, никаких догадок — только данные и опыт.
            </p>
          </div>

          {/* Values */}
          <div>
            <div className="text-[10px] text-[#4a5a30] uppercase tracking-[0.2em] mb-5">Наши принципы</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {VALUES.map((v) => (
                <div key={v.title} className="border border-[#2d3620] bg-[#141810] p-6 flex gap-4">
                  <div className="w-10 h-10 border border-[#d4681a]/30 bg-[#d4681a]/10 flex items-center justify-center shrink-0">
                    <Icon name={v.icon as "Shield"} size={18} className="text-[#d4681a]" />
                  </div>
                  <div>
                    <div className="font-oswald text-sm font-bold text-white uppercase tracking-widest mb-1">{v.title}</div>
                    <p className="text-[#7a8a6a] text-xs leading-relaxed font-light">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div>
            <div className="text-[10px] text-[#4a5a30] uppercase tracking-[0.2em] mb-5">Команда</div>
            <div className="space-y-3">
              {TEAM.map((m, i) => (
                <div key={i} className="border border-[#2d3620] bg-[#141810] px-6 py-5 flex items-start gap-4">
                  <span className="font-oswald text-2xl font-bold text-[#d4681a]/20 w-8 shrink-0 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="text-[9px] text-[#d4681a] uppercase tracking-[0.2em] mb-0.5">{m.role}</div>
                    <div className="font-oswald text-base font-bold text-white mb-1">{m.name}</div>
                    <p className="text-[#7a8a6a] text-xs font-light leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="border border-[#d4681a]/20 bg-[#d4681a]/5 p-8">
            <div className="text-[10px] text-[#d4681a] uppercase tracking-[0.2em] mb-6">Цифры</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { val: "2019", label: "Год основания" },
                { val: "30+", label: "Позиций каталога" },
                { val: "47", label: "Параметров анализа" },
                { val: "98%", label: "Довольных клиентов" },
              ].map((s) => (
                <div key={s.label} className="border-l-2 border-[#d4681a] pl-4">
                  <div className="font-oswald text-2xl font-bold text-white">{s.val}</div>
                  <div className="text-[10px] text-[#4a5a30] uppercase tracking-widest mt-1">{s.label}</div>
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
