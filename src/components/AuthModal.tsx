import { useState } from "react";
import Icon from "@/components/ui/icon";
import type { User } from "@/hooks/useAuth";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onRegister: (email: string, password: string, name: string) => string | null;
  onLogin: (email: string, password: string) => string | null;
  onLogout: () => void;
  onChangePassword?: (oldPwd: string, newPwd: string) => string | null;
  onUpdateUser?: (updates: Partial<User>) => void;
  currentUser: User | null;
  defaultTab?: "login" | "register";
}

type CabinetTab = "profile" | "orders" | "selections";

const STATUS_COLORS: Record<string, string> = {
  "Создан": "text-[#7a8a6a] border-[#2d3620]",
  "Оплачен": "text-blue-400 border-blue-900/40",
  "Отправлен": "text-yellow-400 border-yellow-900/40",
  "Доставлен": "text-green-400 border-green-900/40",
};

export default function AuthModal({
  open, onClose, onRegister, onLogin, onLogout,
  onChangePassword, onUpdateUser, currentUser, defaultTab = "login",
}: AuthModalProps) {
  const [authTab, setAuthTab] = useState<"login" | "register">(defaultTab);
  const [cabinetTab, setCabinetTab] = useState<CabinetTab>("profile");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editName, setEditName] = useState(currentUser?.name || "");
  const [changePwdMode, setChangePwdMode] = useState(false);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  if (!open) return null;

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleLogin = () => {
    setError("");
    if (!validateEmail(email)) return setError("Введите корректный email");
    if (!password) return setError("Введите пароль");
    const err = onLogin(email, password);
    if (err) setError(err);
    else { setSuccess("Добро пожаловать!"); setTimeout(onClose, 700); }
  };

  const handleRegister = () => {
    setError("");
    if (!validateEmail(email)) return setError("Введите корректный email");
    if (password.length < 6) return setError("Пароль минимум 6 символов");
    if (password !== confirmPwd) return setError("Пароли не совпадают");
    const err = onRegister(email, password, name);
    if (err) setError(err);
    else { setSuccess("Регистрация успешна!"); setTimeout(onClose, 700); }
  };

  const handleSaveName = () => {
    if (!editName.trim()) return;
    onUpdateUser?.({ name: editName.trim() });
    setSuccess("Имя обновлено");
    setTimeout(() => setSuccess(""), 2000);
  };

  const handleChangePwd = () => {
    setPwdError("");
    if (!oldPwd || !newPwd) return setPwdError("Заполните все поля");
    if (newPwd.length < 6) return setPwdError("Минимум 6 символов");
    const err = onChangePassword?.(oldPwd, newPwd);
    if (err) setPwdError(err);
    else {
      setChangePwdMode(false);
      setOldPwd(""); setNewPwd("");
      setSuccess("Пароль изменён");
      setTimeout(() => setSuccess(""), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg bg-[#141810] border border-[#2d3620] m-4 max-h-[90vh] flex flex-col"
        style={{ animation: "slideUp 0.25s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d3620] bg-[#0d0f0a] shrink-0">
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
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Cabinet tabs */}
            <div className="flex border-b border-[#2d3620] shrink-0 overflow-x-auto">
              {([
                { id: "profile", label: "Профиль", icon: "User" },
                { id: "orders", label: `Заказы (${currentUser.orders.length})`, icon: "ShoppingBag" },
                { id: "selections", label: `Подборки (${currentUser.selections.length})`, icon: "Cpu" },
              ] as { id: CabinetTab; label: string; icon: string }[]).map(t => (
                <button
                  key={t.id}
                  onClick={() => setCabinetTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 font-oswald text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
                    cabinetTab === t.id ? "text-[#d4681a] border-b-2 border-[#d4681a]" : "text-[#4a5a30] hover:text-[#7a8a6a]"
                  }`}
                >
                  <Icon name={t.icon as "User"} size={12} />
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {success && (
                <div className="flex items-center gap-2 bg-green-900/20 border border-green-700/40 text-green-400 p-3 text-sm">
                  <Icon name="CheckCircle" size={14} />
                  {success}
                </div>
              )}

              {/* PROFILE TAB */}
              {cabinetTab === "profile" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#d4681a]/20 border border-[#d4681a]/40 flex items-center justify-center shrink-0">
                      <Icon name="User" size={24} className="text-[#d4681a]" />
                    </div>
                    <div>
                      <div className="font-oswald text-xl text-white">{currentUser.name}</div>
                      <div className="text-[#4a5a30] text-sm">{currentUser.email}</div>
                      {currentUser.isAdmin && <span className="text-[9px] bg-[#d4681a] text-white px-2 py-0.5 mt-1 inline-block font-oswald">АДМИНИСТРАТОР</span>}
                    </div>
                  </div>

                  <div className="border border-[#2d3620] p-4 space-y-2">
                    {[
                      { label: "Email", val: currentUser.email },
                      { label: "Дата регистрации", val: currentUser.registrationDate },
                      { label: "Заказов", val: String(currentUser.orders.length) },
                      { label: "AI-подборок", val: String(currentUser.selections.length) },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between text-sm">
                        <span className="text-[#7a8a6a]">{row.label}:</span>
                        <span className="text-[#d8dcc8]">{row.val}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="text-[10px] text-[#4a5a30] uppercase tracking-widest block mb-1">Позывной / Имя</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="flex-1 bg-[#0d0f0a] border border-[#2d3620] focus:border-[#d4681a] text-[#d8dcc8] px-3 py-2 text-sm outline-none transition-colors"
                      />
                      <button onClick={handleSaveName} className="btn-combat text-xs px-4">Сохранить</button>
                    </div>
                  </div>

                  {!changePwdMode ? (
                    <button
                      onClick={() => setChangePwdMode(true)}
                      className="text-[#4a5a30] hover:text-[#d4681a] text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5"
                    >
                      <Icon name="Lock" size={12} />
                      Сменить пароль
                    </button>
                  ) : (
                    <div className="border border-[#2d3620] p-4 space-y-3">
                      <div className="font-oswald text-sm text-white uppercase tracking-widest">Смена пароля</div>
                      <div>
                        <label className="text-[10px] text-[#4a5a30] uppercase tracking-widest block mb-1">Текущий пароль</label>
                        <input type="password" value={oldPwd} onChange={e => setOldPwd(e.target.value)} className="w-full bg-[#0d0f0a] border border-[#2d3620] focus:border-[#d4681a] text-[#d8dcc8] px-3 py-2 text-sm outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#4a5a30] uppercase tracking-widest block mb-1">Новый пароль</label>
                        <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} className="w-full bg-[#0d0f0a] border border-[#2d3620] focus:border-[#d4681a] text-[#d8dcc8] px-3 py-2 text-sm outline-none transition-colors" />
                      </div>
                      {pwdError && <div className="text-red-400 text-xs flex items-center gap-1"><Icon name="AlertTriangle" size={12} />{pwdError}</div>}
                      <div className="flex gap-2">
                        <button onClick={handleChangePwd} className="btn-combat text-xs px-4">Сохранить</button>
                        <button onClick={() => { setChangePwdMode(false); setPwdError(""); }} className="border border-[#2d3620] hover:border-[#7a8a6a] text-[#4a5a30] text-xs px-4 py-2 transition-all">Отмена</button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => { onLogout(); onClose(); }}
                    className="w-full border border-red-900/40 hover:border-red-500/60 text-red-400 hover:text-red-300 font-oswald uppercase tracking-widest text-sm py-2.5 transition-all flex items-center justify-center gap-2"
                  >
                    <Icon name="LogOut" size={15} />
                    Выйти из аккаунта
                  </button>
                </div>
              )}

              {/* ORDERS TAB */}
              {cabinetTab === "orders" && (
                <div className="space-y-3">
                  {currentUser.orders.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-[#2d3620]">
                      <Icon name="ShoppingBag" size={32} className="text-[#2d3620] mx-auto mb-3" />
                      <div className="font-oswald text-lg text-[#2d3620] uppercase tracking-widest">Заказов пока нет</div>
                      <p className="text-[#3d4a2b] text-sm mt-1">Оформите заказ из корзины</p>
                    </div>
                  ) : (
                    [...currentUser.orders].reverse().map(order => (
                      <div key={order.id} className="border border-[#2d3620] bg-[#0d0f0a]">
                        <div
                          className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[#1a1f15] transition-colors"
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        >
                          <div>
                            <div className="font-oswald text-sm text-white">Заказ #{order.id.slice(-6)}</div>
                            <div className="text-[10px] text-[#4a5a30]">{order.date} · {order.items.length} поз.</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-oswald text-[#d4681a] font-bold text-sm">{order.total.toLocaleString("ru-RU")} ₽</span>
                            <span className={`text-[9px] border px-2 py-0.5 font-oswald uppercase ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                            <Icon name={expandedOrder === order.id ? "ChevronUp" : "ChevronDown"} size={13} className="text-[#4a5a30]" />
                          </div>
                        </div>
                        {expandedOrder === order.id && (
                          <div className="border-t border-[#2d3620] px-4 py-3 space-y-2">
                            {order.items.map(i => (
                              <div key={i.id} className="flex items-center gap-3 text-xs">
                                <div className="w-8 h-8 border border-[#2d3620] overflow-hidden shrink-0">
                                  <img src={i.image} alt={i.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-[#7a8a6a] flex-1">{i.name} × {i.quantity}</span>
                                <span className="text-[#d4681a] font-oswald">{(i.priceNum * i.quantity).toLocaleString("ru-RU")} ₽</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* SELECTIONS TAB */}
              {cabinetTab === "selections" && (
                <div className="space-y-3">
                  {currentUser.selections.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-[#2d3620]">
                      <Icon name="Cpu" size={32} className="text-[#2d3620] mx-auto mb-3" />
                      <div className="font-oswald text-lg text-[#2d3620] uppercase tracking-widest">Подборок пока нет</div>
                      <p className="text-[#3d4a2b] text-sm mt-1">Запустите AI-подбор на главной странице</p>
                    </div>
                  ) : (
                    [...currentUser.selections].reverse().map(sel => (
                      <div key={sel.id} className="border border-[#2d3620] bg-[#0d0f0a] p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <div className="text-[10px] text-[#4a5a30] uppercase tracking-widest mb-1">{sel.date}</div>
                            <p className="text-[#d8dcc8] text-sm font-light">{sel.task}</p>
                          </div>
                          <span className="text-[10px] text-[#d4681a] border border-[#d4681a]/30 px-2 py-0.5 font-oswald shrink-0">{sel.items.length} поз.</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {sel.items.map(i => (
                            <span key={i.id} className="text-[10px] border border-[#2d3620] text-[#7a8a6a] px-2 py-0.5">{i.name}</span>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto">
            <div className="flex border-b border-[#2d3620] mb-6">
              {(["login", "register"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => { setAuthTab(t); setError(""); setSuccess(""); }}
                  className={`flex-1 py-2.5 font-oswald uppercase tracking-widest text-sm transition-all ${
                    authTab === t ? "text-[#d4681a] border-b-2 border-[#d4681a]" : "text-[#4a5a30] hover:text-[#7a8a6a]"
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
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && (authTab === "login" ? handleLogin() : undefined)} placeholder="tactical@example.com" className="w-full bg-[#0d0f0a] border border-[#2d3620] focus:border-[#d4681a] text-[#d8dcc8] placeholder-[#3d4a2b] px-4 py-2.5 outline-none transition-colors text-sm" />
                </div>
                {authTab === "register" && (
                  <div>
                    <label className="text-[10px] text-[#4a5a30] uppercase tracking-widest block mb-1">Позывной / Имя (необязательно)</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Позывной или имя" className="w-full bg-[#0d0f0a] border border-[#2d3620] focus:border-[#d4681a] text-[#d8dcc8] placeholder-[#3d4a2b] px-4 py-2.5 outline-none transition-colors text-sm" />
                  </div>
                )}
                <div>
                  <label className="text-[10px] text-[#4a5a30] uppercase tracking-widest block mb-1">Пароль</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && authTab === "login" && handleLogin()} placeholder={authTab === "register" ? "Минимум 6 символов" : "••••••••"} className="w-full bg-[#0d0f0a] border border-[#2d3620] focus:border-[#d4681a] text-[#d8dcc8] placeholder-[#3d4a2b] px-4 py-2.5 outline-none transition-colors text-sm" />
                </div>
                {authTab === "register" && (
                  <div>
                    <label className="text-[10px] text-[#4a5a30] uppercase tracking-widest block mb-1">Подтверждение пароля</label>
                    <input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} onKeyDown={e => e.key === "Enter" && handleRegister()} placeholder="Повторите пароль" className="w-full bg-[#0d0f0a] border border-[#2d3620] focus:border-[#d4681a] text-[#d8dcc8] placeholder-[#3d4a2b] px-4 py-2.5 outline-none transition-colors text-sm" />
                  </div>
                )}
                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm border border-red-900/40 bg-red-900/10 px-4 py-2">
                    <Icon name="AlertTriangle" size={14} />
                    {error}
                  </div>
                )}
                <button onClick={authTab === "login" ? handleLogin : handleRegister} className="w-full btn-combat flex items-center justify-center gap-2">
                  <Icon name={authTab === "login" ? "LogIn" : "UserPlus"} size={16} />
                  {authTab === "login" ? "Войти" : "Зарегистрироваться"}
                </button>
                {authTab === "login" && (
                  <button onClick={() => alert("Для восстановления пароля обратитесь на support@tacticmind.ru")} className="w-full text-[#4a5a30] hover:text-[#7a8a6a] text-xs text-center transition-colors">
                    Забыли пароль?
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <style>{`
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    </div>
  );
}
