import { useState } from "react";
import Icon from "@/components/ui/icon";
import type { User } from "@/hooks/useAuth";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onRegister: (email: string, password: string, name: string) => string | null;
  onLogin: (email: string, password: string) => string | null;
  onLogout: () => void;
  currentUser: User | null;
}

export default function AuthModal({ open, onClose, onRegister, onLogin, onLogout, currentUser }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!open) return null;

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleLogin = () => {
    setError("");
    if (!validateEmail(email)) return setError("Введите корректный email");
    if (!password) return setError("Введите пароль");
    const err = onLogin(email, password);
    if (err) setError(err);
    else { setSuccess("Добро пожаловать!"); setTimeout(onClose, 800); }
  };

  const handleRegister = () => {
    setError("");
    if (!validateEmail(email)) return setError("Введите корректный email");
    if (password.length < 6) return setError("Пароль минимум 6 символов");
    if (password !== confirmPwd) return setError("Пароли не совпадают");
    const err = onRegister(email, password, name);
    if (err) setError(err);
    else { setSuccess("Регистрация успешна!"); setTimeout(onClose, 800); }
  };

  const handleForgot = () => {
    alert("Для восстановления пароля обратитесь на support@tacticmind.ru с вашим email.");
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md bg-[#141810] border border-[#2d3620] m-4"
        style={{ animation: "slideUp 0.25s ease-out" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d3620] bg-[#0d0f0a]">
          <div className="flex items-center gap-2">
            <Icon name="User" size={18} className="text-[#d4681a]" />
            <span className="font-oswald text-lg text-white tracking-widest uppercase">
              {currentUser ? "Личный кабинет" : "Аккаунт"}
            </span>
          </div>
          <button onClick={onClose} className="text-[#4a5a30] hover:text-[#d4681a] transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        {currentUser ? (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-[#d4681a]/20 border border-[#d4681a]/40 flex items-center justify-center">
                <Icon name="User" size={24} className="text-[#d4681a]" />
              </div>
              <div>
                <div className="font-oswald text-xl text-white">{currentUser.name}</div>
                <div className="text-[#4a5a30] text-sm">{currentUser.email}</div>
                {currentUser.isAdmin && (
                  <div className="text-[9px] bg-[#d4681a] text-white px-2 py-0.5 mt-1 inline-block uppercase tracking-wider">
                    Администратор
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2 text-sm text-[#7a8a6a] border border-[#2d3620] p-4 mb-4">
              <div className="flex justify-between">
                <span>Дата регистрации:</span>
                <span className="text-[#d8dcc8]">{currentUser.registrationDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Заказов:</span>
                <span className="text-[#d8dcc8]">{currentUser.orders.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Подборок ИИ:</span>
                <span className="text-[#d8dcc8]">{currentUser.selections.length}</span>
              </div>
            </div>
            <button
              onClick={() => { onLogout(); onClose(); }}
              className="w-full border border-red-900/40 hover:border-red-500/60 text-red-400 hover:text-red-300 font-oswald uppercase tracking-widest text-sm py-2.5 transition-all"
            >
              Выйти из аккаунта
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex border-b border-[#2d3620] mb-6">
              {(["login", "register"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(""); setSuccess(""); }}
                  className={`flex-1 py-2.5 font-oswald uppercase tracking-widest text-sm transition-all ${
                    tab === t ? "text-[#d4681a] border-b-2 border-[#d4681a]" : "text-[#4a5a30] hover:text-[#7a8a6a]"
                  }`}
                >
                  {t === "login" ? "Вход" : "Регистрация"}
                </button>
              ))}
            </div>

            {success ? (
              <div className="flex items-center gap-2 bg-green-900/20 border border-green-700/40 text-green-400 p-4 font-oswald uppercase tracking-wider text-sm">
                <Icon name="CheckCircle" size={16} />
                {success}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-[#4a5a30] uppercase tracking-widest block mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tactical@example.com"
                    className="w-full bg-[#0d0f0a] border border-[#2d3620] focus:border-[#d4681a] text-[#d8dcc8] placeholder-[#3d4a2b] px-4 py-2.5 outline-none transition-colors text-sm"
                  />
                </div>
                {tab === "register" && (
                  <div>
                    <label className="text-[10px] text-[#4a5a30] uppercase tracking-widest block mb-1">Позывной / Имя (необязательно)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Позывной или имя"
                      className="w-full bg-[#0d0f0a] border border-[#2d3620] focus:border-[#d4681a] text-[#d8dcc8] placeholder-[#3d4a2b] px-4 py-2.5 outline-none transition-colors text-sm"
                    />
                  </div>
                )}
                <div>
                  <label className="text-[10px] text-[#4a5a30] uppercase tracking-widest block mb-1">Пароль</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={tab === "register" ? "Минимум 6 символов" : "••••••••"}
                    className="w-full bg-[#0d0f0a] border border-[#2d3620] focus:border-[#d4681a] text-[#d8dcc8] placeholder-[#3d4a2b] px-4 py-2.5 outline-none transition-colors text-sm"
                  />
                </div>
                {tab === "register" && (
                  <div>
                    <label className="text-[10px] text-[#4a5a30] uppercase tracking-widest block mb-1">Подтверждение пароля</label>
                    <input
                      type="password"
                      value={confirmPwd}
                      onChange={e => setConfirmPwd(e.target.value)}
                      placeholder="Повторите пароль"
                      className="w-full bg-[#0d0f0a] border border-[#2d3620] focus:border-[#d4681a] text-[#d8dcc8] placeholder-[#3d4a2b] px-4 py-2.5 outline-none transition-colors text-sm"
                    />
                  </div>
                )}
                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm border border-red-900/40 bg-red-900/10 px-4 py-2">
                    <Icon name="AlertTriangle" size={14} />
                    {error}
                  </div>
                )}
                <button
                  onClick={tab === "login" ? handleLogin : handleRegister}
                  className="w-full btn-combat flex items-center justify-center gap-2"
                >
                  <Icon name={tab === "login" ? "LogIn" : "UserPlus"} size={16} />
                  {tab === "login" ? "Войти" : "Зарегистрироваться"}
                </button>
                {tab === "login" && (
                  <button
                    onClick={handleForgot}
                    className="w-full text-[#4a5a30] hover:text-[#7a8a6a] text-xs text-center transition-colors"
                  >
                    Забыли пароль?
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}
