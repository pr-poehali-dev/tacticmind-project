import { useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import type { CartItem } from "@/hooks/useCart";

interface CartModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  totalCount: number;
  onRemove: (id: number) => void;
  onChangeQty: (id: number, delta: number) => void;
  onClear: () => void;
}

export default function CartModal({ open, onClose, items, totalPrice, totalCount, onRemove, onChangeQty, onClear }: CartModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleOrder = () => {
    alert("Заказ оформлен! Менеджер свяжется с вами в течение 15 минут.");
    onClear();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: "fadeIn 0.2s ease-out" }}
      />

      {/* Panel */}
      <div
        className="relative ml-auto w-full max-w-md h-full bg-[#141810] border-l border-[#2d3620] flex flex-col"
        style={{ animation: "slideInRight 0.25s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d3620] bg-[#0d0f0a]">
          <div className="flex items-center gap-3">
            <Icon name="ShoppingCart" size={20} className="text-[#d4681a]" />
            <span className="font-oswald text-xl text-white tracking-widest uppercase">Корзина</span>
            {totalCount > 0 && (
              <span className="bg-[#d4681a] text-white text-xs font-oswald px-2 py-0.5 min-w-[24px] text-center">
                {totalCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[#4a5a30] hover:text-[#d4681a] transition-colors p-1"
          >
            <Icon name="X" size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
              <div className="w-20 h-20 border border-[#2d3620] flex items-center justify-center">
                <Icon name="ShoppingCart" size={32} className="text-[#2d3620]" />
              </div>
              <div className="font-oswald text-2xl text-[#2d3620] uppercase tracking-widest">Корзина пуста</div>
              <p className="text-[#3d4a2b] text-sm font-light">Добавьте снаряжение из каталога</p>
              <button
                onClick={onClose}
                className="btn-combat text-sm mt-2"
              >
                Перейти в каталог
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#2d3620]">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 p-4 hover:bg-[#1e2418] transition-colors group">
                  <div className="w-16 h-16 shrink-0 overflow-hidden border border-[#2d3620]">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-oswald text-sm text-white leading-tight mb-0.5">{item.name}</div>
                    <div className="text-[10px] text-[#4a5a30] uppercase tracking-wider mb-2">{item.category}</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onChangeQty(item.id, -1)}
                        className="w-6 h-6 border border-[#2d3620] hover:border-[#d4681a] text-[#7a8a6a] hover:text-[#d4681a] flex items-center justify-center transition-colors text-xs"
                      >
                        −
                      </button>
                      <span className="font-oswald text-white w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onChangeQty(item.id, 1)}
                        className="w-6 h-6 border border-[#2d3620] hover:border-[#d4681a] text-[#7a8a6a] hover:text-[#d4681a] flex items-center justify-center transition-colors text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-[#3d4a2b] hover:text-red-500 transition-colors"
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                    <div className="font-oswald text-[#d4681a] font-bold text-sm">
                      {(item.priceNum * item.quantity).toLocaleString("ru-RU")} ₽
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#2d3620] bg-[#0d0f0a] px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-[#7a8a6a] text-sm uppercase tracking-widest font-roboto">
                Итого ({totalCount} поз.)
              </div>
              <div className="font-oswald text-2xl font-bold text-white">
                {totalPrice.toLocaleString("ru-RU")} ₽
              </div>
            </div>
            <button
              onClick={handleOrder}
              className="w-full btn-combat text-base flex items-center justify-center gap-2"
            >
              <Icon name="CheckCircle" size={18} />
              Оформить заказ
            </button>
            <button
              onClick={onClear}
              className="w-full text-[#3d4a2b] hover:text-red-400 text-xs font-roboto uppercase tracking-widest transition-colors text-center"
            >
              Очистить корзину
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
