import { useEffect } from "react";
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
  tag?: string;
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
}

export default function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  useEffect(() => {
    if (product) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!product) return null;

  const ratingColor = product.rating >= 90 ? "#d4681a" : product.rating >= 80 ? "#e8b04a" : "#7a8a6a";

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: "fadeIn 0.2s ease-out" }}
      />
      <div
        className="relative w-full max-w-2xl bg-[#141810] border border-[#2d3620] overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ animation: "scaleIn 0.25s ease-out" }}
      >
        {/* Header image */}
        <div className="relative h-56 overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141810] via-[#141810]/60 to-transparent" />
          {product.tag && (
            <div className="absolute top-4 left-4 ai-tag text-[9px]">{product.tag}</div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-[#141810]/80 border border-[#2d3620] hover:border-[#d4681a] flex items-center justify-center text-[#7a8a6a] hover:text-[#d4681a] transition-colors"
          >
            <Icon name="X" size={16} />
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <div className="text-[10px] text-[#4a5a30] uppercase tracking-widest mb-1">{product.category}</div>
            <h2 className="font-oswald text-3xl font-bold text-white">{product.name}</h2>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Price + Rating */}
          <div className="flex items-center justify-between">
            <div className="font-oswald text-4xl font-bold text-white">{product.price}</div>
            <div className="text-right">
              <div className="font-oswald text-4xl font-bold" style={{ color: ratingColor }}>{product.rating}</div>
              <div className="text-[10px] text-[#4a5a30] uppercase tracking-widest">AI-рейтинг / 100</div>
            </div>
          </div>

          {/* Rating bar */}
          <div className="h-1.5 bg-[#2d3620] w-full">
            <div
              className="h-full transition-all duration-700"
              style={{ width: `${product.rating}%`, background: `linear-gradient(to right, ${ratingColor}, #e8b04a)` }}
            />
          </div>

          {/* Specs */}
          <div>
            <div className="text-[10px] text-[#4a5a30] uppercase tracking-[0.2em] mb-3">Характеристики</div>
            <div className="flex flex-wrap gap-2">
              {product.specs.map(s => (
                <span key={s} className="border border-[#2d3620] text-[#7a8a6a] px-3 py-1.5 text-xs uppercase tracking-wider">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* AI Reason */}
          <div className="border border-[#d4681a]/30 bg-[#d4681a]/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Cpu" size={14} className="text-[#d4681a]" />
              <span className="text-[10px] text-[#d4681a] uppercase tracking-[0.2em] font-oswald">
                Почему ИИ рекомендует это снаряжение
              </span>
            </div>
            <p className="text-[#d8dcc8] text-sm leading-relaxed font-light">{product.aiReason}</p>
          </div>

          {/* Rating breakdown */}
          <div>
            <div className="text-[10px] text-[#4a5a30] uppercase tracking-[0.2em] mb-3">Оценка по параметрам</div>
            <div className="space-y-2">
              {[
                { label: "Надёжность", val: Math.min(100, product.rating + 2) },
                { label: "Эргономика", val: Math.max(70, product.rating - 5) },
                { label: "Цена/качество", val: Math.max(65, product.rating - 10) },
                { label: "Долговечность", val: Math.min(100, product.rating - 3) },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="text-xs text-[#7a8a6a] w-28 shrink-0">{item.label}</div>
                  <div className="flex-1 h-1 bg-[#2d3620]">
                    <div className="h-full bg-gradient-to-r from-[#d4681a] to-[#e8890a]" style={{ width: `${item.val}%` }} />
                  </div>
                  <div className="text-xs font-oswald text-[#d4681a] w-8 text-right">{item.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { onAddToCart(product); onClose(); }}
              className="flex-1 btn-combat flex items-center justify-center gap-2"
            >
              <Icon name="ShoppingCart" size={16} />
              Добавить в корзину
            </button>
            <button
              onClick={onClose}
              className="border border-[#2d3620] hover:border-[#7a8a6a] text-[#4a5a30] hover:text-[#7a8a6a] px-5 transition-all"
            >
              Закрыть
            </button>
          </div>
        </div>

        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        `}</style>
      </div>
    </div>
  );
}
