import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";

interface AddedToastProps {
  message: string;
  visible: boolean;
}

export default function AddedToast({ message, visible }: AddedToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
    } else {
      const t = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!show) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 flex items-center gap-3 bg-[#1e2418] border border-[#d4681a]/50 px-5 py-3 shadow-xl"
      style={{
        animation: visible ? "toastIn 0.3s ease-out" : "toastOut 0.3s ease-in forwards",
      }}
    >
      <div className="w-5 h-5 bg-[#d4681a] flex items-center justify-center shrink-0">
        <Icon name="Check" size={12} className="text-white" />
      </div>
      <span className="font-oswald text-sm text-white tracking-wider uppercase">{message}</span>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translate(-50%, 0); }
          to { opacity: 0; transform: translate(-50%, 20px); }
        }
      `}</style>
    </div>
  );
}
