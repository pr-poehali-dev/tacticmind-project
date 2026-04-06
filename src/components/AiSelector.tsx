import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  rating: number;
  image: string;
  specs: string[];
  aiReason: string;
}

interface AiResult {
  intro: string;
  items: Product[];
}

const EXAMPLES = [
  "Трёхдневный зимний поход в горы, нужно лёгкое и тёплое снаряжение",
  "Ночные дежурства, нужен хороший фонарь и удобные перчатки",
  "Длительный марш 50км, важна обувь и компактный инструмент",
];

const AI_SELECTOR_URL = "https://functions.poehali.dev/d6b6ebfb-f0a1-4d04-b79b-a3a494f70a81";

interface AiSelectorProps {
  onAddToCart?: (product: Product) => void;
}

export default function AiSelector({ onAddToCart }: AiSelectorProps) {
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiResult | null>(null);
  const [error, setError] = useState("");
  const [dots, setDots] = useState(0);

  const runSelection = async (taskText?: string) => {
    const query = (taskText ?? task).trim();
    if (!query) return;

    setLoading(true);
    setResult(null);
    setError("");

    const interval = setInterval(() => setDots(d => (d + 1) % 4), 400);

    try {
      const res = await fetch(AI_SELECTOR_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: query }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка подбора. Попробуйте ещё раз.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Ошибка соединения. Проверьте интернет и попробуйте снова.");
    } finally {
      setLoading(false);
      clearInterval(interval);
    }
  };

  const handleExample = (ex: string) => {
    setTask(ex);
    runSelection(ex);
  };

  return (
    <section id="ai-selector" className="py-24 bg-[#141810] border-y border-[#2d3620]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: form */}
          <div>
            <div className="sec-badge">
              <Icon name="Cpu" size={12} className="text-[#d4681a]" />
              AI-система подбора
            </div>
            <h2 className="font-oswald text-5xl font-bold text-white mb-3">
              ОПИШИТЕ <span className="text-[#d4681a]">ЗАДАЧУ</span>
            </h2>
            <p className="text-[#7a8a6a] font-light mb-8 leading-relaxed">
              Расскажите об условиях миссии — климат, нагрузка, длительность, бюджет.
              ИИ проанализирует 10 847 позиций и выдаст точную подборку с обоснованием.
            </p>

            <div className="relative">
              <textarea
                value={task}
                onChange={e => setTask(e.target.value)}
                onKeyDown={e => e.key === "Enter" && e.ctrlKey && runSelection()}
                placeholder="Например: планирую трёхдневный поход в горы зимой, важна влагозащита и минимальный вес..."
                rows={5}
                className="w-full bg-[#0d0f0a] border border-[#2d3620] focus:border-[#d4681a] text-[#d8dcc8] placeholder-[#3d4a2b] p-4 resize-none outline-none transition-colors duration-200 font-roboto text-sm leading-relaxed"
              />
              <div className="absolute bottom-3 right-3 text-[10px] text-[#3d4a2b] tracking-widest">
                Ctrl+Enter
              </div>
            </div>

            <button
              onClick={() => runSelection()}
              disabled={loading || !task.trim()}
              className="mt-4 w-full btn-combat text-base flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Icon name="Loader" size={18} className="animate-spin" />
                  АНАЛИЗИРУЮ{".".repeat(dots)}
                </>
              ) : (
                <>
                  <Icon name="Zap" size={18} />
                  ЗАПУСТИТЬ AI-ПОДБОР
                </>
              )}
            </button>

            {/* Example prompts */}
            <div className="mt-6">
              <div className="text-[10px] text-[#3d4a2b] uppercase tracking-[0.2em] mb-3">Примеры задач:</div>
              <div className="space-y-2">
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => handleExample(ex)}
                    className="w-full text-left text-[#4a5a30] hover:text-[#d4681a] text-sm border border-[#2d3620] hover:border-[#d4681a]/40 px-4 py-2.5 transition-all duration-200 flex items-center gap-2 group"
                  >
                    <Icon name="ChevronRight" size={12} className="shrink-0 group-hover:translate-x-1 transition-transform" />
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: results */}
          <div className="min-h-[400px]">
            {!result && !loading && !error && (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-[#2d3620] p-12 text-center">
                <div className="w-16 h-16 border border-[#2d3620] flex items-center justify-center mb-4">
                  <Icon name="Crosshair" size={28} className="text-[#2d3620]" />
                </div>
                <div className="font-oswald text-xl text-[#2d3620] mb-2">ОЖИДАНИЕ КОМАНДЫ</div>
                <div className="text-[#2d3620] text-sm font-light">Опишите задачу — получите подборку</div>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center border border-[#d4681a]/20 bg-[#d4681a]/5 p-12 text-center">
                <div className="w-16 h-16 border border-[#d4681a]/40 flex items-center justify-center mb-6 relative">
                  <Icon name="Cpu" size={28} className="text-[#d4681a]" />
                  <div className="absolute inset-0 border border-[#d4681a]/20 animate-ping" />
                </div>
                <div className="font-oswald text-xl text-[#d4681a] mb-2">
                  АНАЛИЗИРУЮ{".".repeat(dots)}
                </div>
                <div className="text-[#7a8a6a] text-sm font-light mb-6">
                  Обрабатываю 10 847 позиций по 47 параметрам
                </div>
                <div className="w-full max-w-xs space-y-1.5">
                  {["Классификация задачи", "Анализ условий", "Подбор позиций", "Формирование обоснований"].map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] text-[#4a5a30] uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#d4681a] animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="border border-red-900/40 bg-red-900/10 p-6 flex items-start gap-3">
                <Icon name="AlertTriangle" size={20} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-oswald text-red-400 mb-1">ОШИБКА СИСТЕМЫ</div>
                  <div className="text-[#7a8a6a] text-sm">{error}</div>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-4 animate-fade-in">
                {/* Intro */}
                <div className="border-l-2 border-[#d4681a] pl-4 py-2 bg-[#d4681a]/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name="Cpu" size={12} className="text-[#d4681a]" />
                    <span className="text-[10px] text-[#d4681a] uppercase tracking-[0.2em]">AI-анализ задачи</span>
                  </div>
                  <p className="text-[#d8dcc8] text-sm font-light leading-relaxed">{result.intro}</p>
                </div>

                {/* Products */}
                {result.items.map((p, i) => (
                  <div key={p.id} className="card-tac overflow-hidden">
                    <div className="flex gap-0">
                      <div className="w-24 shrink-0 relative overflow-hidden">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#141810]/80" />
                        <div className="absolute top-2 left-2 font-oswald text-2xl font-bold text-[#d4681a]/30 leading-none">
                          {String(i + 1).padStart(2, "0")}
                        </div>
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-oswald text-lg font-bold text-white leading-tight">{p.name}</h3>
                          <span className="font-oswald text-lg font-bold text-[#d4681a] whitespace-nowrap">{p.price}</span>
                        </div>
                        <div className="text-[10px] text-[#4a5a30] uppercase tracking-widest mb-2">{p.category}</div>

                        {/* AI reason */}
                        <div className="bg-[#0d0f0a] border-l border-[#d4681a]/40 pl-3 py-2 mb-3">
                          <div className="text-[9px] text-[#d4681a] uppercase tracking-[0.2em] mb-1">Почему именно он</div>
                          <p className="text-[#7a8a6a] text-xs leading-relaxed font-light">{p.aiReason}</p>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {p.specs.map(s => (
                            <span key={s} className="text-[9px] border border-[#2d3620] text-[#4a5a30] px-2 py-0.5 uppercase tracking-wider">
                              {s}
                            </span>
                          ))}
                        </div>

                        <button className="btn-combat text-xs px-4 py-2 flex items-center gap-1.5" onClick={() => onAddToCart?.(p)}>
                          <Icon name="ShoppingCart" size={12} />
                          В корзину
                        </button>
                      </div>
                    </div>

                    {/* Rating bar */}
                    <div className="h-0.5 w-full bg-[#2d3620]">
                      <div className="rating-bar h-full" style={{ width: `${p.rating}%` }} />
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => { setResult(null); setTask(""); }}
                  className="w-full border border-[#2d3620] hover:border-[#d4681a]/40 text-[#4a5a30] hover:text-[#d4681a] font-oswald uppercase tracking-widest text-xs py-2.5 transition-all duration-200"
                >
                  Новый подбор
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}