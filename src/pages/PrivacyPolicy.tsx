import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d0f0a] text-[#d8dcc8] font-roboto">
      {/* Header */}
      <header className="bg-[#141810] border-b border-[#2d3620] py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[#7a8a6a] hover:text-[#d4681a] transition-colors"
          >
            <Icon name="ArrowLeft" size={18} />
            <span className="font-oswald uppercase tracking-widest text-sm">Назад</span>
          </button>
          <div className="flex items-center gap-3 ml-2">
            <div className="w-px h-5 bg-[#2d3620]" />
            <span className="font-oswald text-lg tracking-widest text-white">TACTICMIND</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="sec-badge mb-6">Документ</div>
        <h1 className="font-oswald text-5xl font-bold text-white mb-2">
          ПОЛИТИКА <span className="text-[#d4681a]">КОНФИДЕНЦИАЛЬНОСТИ</span>
        </h1>
        <div className="tac-divider my-8" />

        <div className="border border-[#2d3620] bg-[#141810] p-10 space-y-8 text-[#7a8a6a] font-light leading-relaxed">
          <div className="flex items-center gap-3 text-[#4a5a30] text-xs uppercase tracking-widest">
            <Icon name="FileText" size={14} className="text-[#d4681a]" />
            Текст политики конфиденциальности будет размещён здесь
          </div>

          <div className="border border-dashed border-[#2d3620] p-8 text-center">
            <Icon name="Shield" size={40} className="text-[#2d3620] mx-auto mb-4" />
            <div className="font-oswald text-xl text-[#2d3620] uppercase tracking-widest mb-2">
              Раздел в разработке
            </div>
            <p className="text-[#3d4a2b] text-sm">
              Текст политики конфиденциальности будет добавлен в ближайшее время.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#141810] border-t border-[#2d3620] py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 text-center text-[10px] text-[#2d3620] tracking-widest">
          © 2025 TACTICMIND // ALL RIGHTS RESERVED
        </div>
      </footer>
    </div>
  );
}
