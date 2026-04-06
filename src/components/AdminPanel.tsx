import { useState } from "react";
import Icon from "@/components/ui/icon";
import type { User, Order } from "@/hooks/useAuth";

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

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
  products: Product[];
  getUsers: () => User[];
  saveUsers: (u: User[]) => void;
  onLogout: () => void;
}

type AdminTab = "products" | "users" | "orders" | "stats" | "ai";

const STATUS_OPTIONS: Order["status"][] = ["Создан", "Оплачен", "Отправлен", "Доставлен"];
const STATUS_COLORS: Record<string, string> = {
  "Создан": "text-[#7a8a6a]",
  "Оплачен": "text-blue-400",
  "Отправлен": "text-yellow-400",
  "Доставлен": "text-green-400",
};

const DEFAULT_AI_WEIGHTS = { Защита: 40, Надёжность: 30, Цена: 20, Вес: 10 };
const AI_WEIGHTS_KEY = "tacticmind_ai_weights";

function getAiWeights() {
  try { return JSON.parse(localStorage.getItem(AI_WEIGHTS_KEY) || "null") || DEFAULT_AI_WEIGHTS; } catch { return DEFAULT_AI_WEIGHTS; }
}

export default function AdminPanel({ open, onClose, products, getUsers, saveUsers, onLogout }: AdminPanelProps) {
  const [tab, setTab] = useState<AdminTab>("products");
  const [search, setSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("Все");
  const [aiWeights, setAiWeights] = useState(getAiWeights());
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  if (!open) return null;

  const users = getUsers();
  const allOrders: (Order & { userEmail: string; userName: string })[] = users.flatMap(u =>
    u.orders.map(o => ({ ...o, userEmail: u.email, userName: u.name }))
  );
  const filteredOrders = orderFilter === "Все" ? allOrders : allOrders.filter(o => o.status === orderFilter);

  const toggleBlock = (id: string) => {
    const updated = users.map(u => u.id === id ? { ...u, isBlocked: !u.isBlocked } : u);
    saveUsers(updated);
  };
  const deleteUser = (id: string) => {
    if (!confirm("Удалить пользователя?")) return;
    saveUsers(users.filter(u => u.id !== id));
  };
  const changeOrderStatus = (userId: string, orderId: string, status: Order["status"]) => {
    const updated = users.map(u => u.id === userId ? {
      ...u,
      orders: u.orders.map(o => o.id === orderId ? { ...o, status } : o)
    } : u);
    saveUsers(updated);
  };

  const saveAiWeights = () => {
    localStorage.setItem(AI_WEIGHTS_KEY, JSON.stringify(aiWeights));
    alert("Настройки ИИ сохранены");
  };

  const totalOrders = allOrders.length;
  const totalRevenue = allOrders.reduce((s, o) => s + o.total, 0);
  const productSales: Record<number, { name: string; count: number }> = {};
  allOrders.forEach(o => o.items.forEach(i => {
    if (!productSales[i.id]) productSales[i.id] = { name: i.name, count: 0 };
    productSales[i.id].count += i.quantity;
  }));
  const topProduct = Object.values(productSales).sort((a, b) => b.count - a.count)[0];

  const TABS: { id: AdminTab; label: string; icon: string }[] = [
    { id: "products", label: "Товары", icon: "Package" },
    { id: "users", label: "Пользователи", icon: "Users" },
    { id: "orders", label: "Заказы", icon: "ShoppingBag" },
    { id: "stats", label: "Статистика", icon: "BarChart2" },
    { id: "ai", label: "Настройки ИИ", icon: "Cpu" },
  ];

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-[#0d0f0a]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#2d3620] bg-[#141810] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="font-oswald text-xl text-white tracking-widest uppercase">ADMIN PANEL</span>
          <span className="text-[10px] text-[#4a5a30] uppercase tracking-widest">// TACTICMIND</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { onLogout(); onClose(); }}
            className="text-xs text-[#4a5a30] hover:text-red-400 uppercase tracking-wider transition-colors flex items-center gap-1"
          >
            <Icon name="LogOut" size={14} />
            Выйти
          </button>
          <button onClick={onClose} className="text-[#4a5a30] hover:text-[#d4681a] transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2d3620] bg-[#141810] shrink-0 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 font-oswald uppercase tracking-widest text-xs whitespace-nowrap transition-all ${
              tab === t.id ? "text-[#d4681a] border-b-2 border-[#d4681a]" : "text-[#4a5a30] hover:text-[#7a8a6a]"
            }`}
          >
            <Icon name={t.icon as "Package"} size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">

        {/* PRODUCTS */}
        {tab === "products" && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск по названию..."
                className="bg-[#141810] border border-[#2d3620] text-[#d8dcc8] px-4 py-2 text-sm outline-none focus:border-[#d4681a] w-72 placeholder-[#3d4a2b]"
              />
              <span className="text-[#4a5a30] text-sm">Найдено: {filteredProducts.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2d3620] text-[10px] text-[#4a5a30] uppercase tracking-widest">
                    <th className="text-left py-3 px-3">ID</th>
                    <th className="text-left py-3 px-3">Название</th>
                    <th className="text-left py-3 px-3">Категория</th>
                    <th className="text-left py-3 px-3">Цена</th>
                    <th className="text-left py-3 px-3">Рейтинг</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="border-b border-[#2d3620]/50 hover:bg-[#1e2418] transition-colors">
                      <td className="py-3 px-3 text-[#4a5a30] font-oswald">{String(p.id).padStart(2, "0")}</td>
                      <td className="py-3 px-3 font-oswald text-white">{p.name}</td>
                      <td className="py-3 px-3 text-[#7a8a6a]">{p.category}</td>
                      <td className="py-3 px-3 text-[#d4681a] font-oswald">{p.price}</td>
                      <td className="py-3 px-3">
                        <span className="font-oswald font-bold" style={{ color: p.rating >= 90 ? "#d4681a" : "#7a8a6a" }}>{p.rating}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === "users" && (
          <div className="space-y-2">
            <div className="text-[10px] text-[#4a5a30] uppercase tracking-widest mb-4">
              Всего пользователей: <span className="text-[#d4681a]">{users.length}</span>
            </div>
            {users.length === 0 && <div className="text-[#4a5a30] text-sm">Нет зарегистрированных пользователей</div>}
            {users.map(u => (
              <div key={u.id} className="border border-[#2d3620] bg-[#141810]">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Icon name="User" size={16} className={u.isBlocked ? "text-red-500" : "text-[#4a5a30]"} />
                    <div>
                      <div className="font-oswald text-sm text-white">{u.name}</div>
                      <div className="text-[10px] text-[#4a5a30]">{u.email} · с {u.registrationDate}</div>
                    </div>
                    {u.isAdmin && <span className="text-[9px] bg-[#d4681a] text-white px-2 py-0.5">ADMIN</span>}
                    {u.isBlocked && <span className="text-[9px] bg-red-900/60 text-red-400 border border-red-700/40 px-2 py-0.5">ЗАБЛОКИРОВАН</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#4a5a30]">Заказов: {u.orders.length}</span>
                    <button
                      onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}
                      className="text-[#4a5a30] hover:text-[#d4681a] transition-colors text-xs flex items-center gap-1"
                    >
                      <Icon name={expandedUser === u.id ? "ChevronUp" : "ChevronDown"} size={14} />
                    </button>
                    {!u.isAdmin && (
                      <>
                        <button
                          onClick={() => toggleBlock(u.id)}
                          className={`text-xs px-3 py-1 border transition-colors ${u.isBlocked ? "border-green-700/40 text-green-400 hover:border-green-500" : "border-red-900/40 text-red-400 hover:border-red-500"}`}
                        >
                          {u.isBlocked ? "Разблокировать" : "Заблокировать"}
                        </button>
                        <button onClick={() => deleteUser(u.id)} className="text-[#3d4a2b] hover:text-red-500 transition-colors">
                          <Icon name="Trash2" size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {expandedUser === u.id && u.orders.length > 0 && (
                  <div className="border-t border-[#2d3620] px-4 py-3 bg-[#0d0f0a]">
                    <div className="text-[10px] text-[#4a5a30] uppercase tracking-widest mb-2">Заказы пользователя</div>
                    {u.orders.map(o => (
                      <div key={o.id} className="flex items-center justify-between py-1.5 border-b border-[#2d3620]/50 last:border-0 text-xs">
                        <span className="text-[#7a8a6a]">{o.date}</span>
                        <span className="font-oswald text-white">{o.total.toLocaleString("ru-RU")} ₽</span>
                        <span className={STATUS_COLORS[o.status]}>{o.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ORDERS */}
        {tab === "orders" && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <select
                value={orderFilter}
                onChange={e => setOrderFilter(e.target.value)}
                className="bg-[#141810] border border-[#2d3620] text-[#d8dcc8] px-3 py-2 text-sm outline-none focus:border-[#d4681a]"
              >
                {["Все", ...STATUS_OPTIONS].map(s => <option key={s}>{s}</option>)}
              </select>
              <span className="text-[#4a5a30] text-sm">Заказов: {filteredOrders.length}</span>
            </div>
            {filteredOrders.length === 0 && <div className="text-[#4a5a30] text-sm">Заказов нет</div>}
            <div className="space-y-2">
              {filteredOrders.map(o => (
                <div key={o.id} className="border border-[#2d3620] bg-[#141810]">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <div className="font-oswald text-sm text-white">#{o.id.slice(-6)} · {o.userName}</div>
                      <div className="text-[10px] text-[#4a5a30]">{o.userEmail} · {o.date}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-oswald text-[#d4681a]">{o.total.toLocaleString("ru-RU")} ₽</span>
                      <select
                        value={o.status}
                        onChange={e => {
                          const user = users.find(u => u.orders.some(ord => ord.id === o.id));
                          if (user) changeOrderStatus(user.id, o.id, e.target.value as Order["status"]);
                        }}
                        className={`bg-[#0d0f0a] border border-[#2d3620] px-2 py-1 text-xs outline-none ${STATUS_COLORS[o.status]}`}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
                        className="text-[#4a5a30] hover:text-[#d4681a] transition-colors"
                      >
                        <Icon name={expandedOrder === o.id ? "ChevronUp" : "ChevronDown"} size={14} />
                      </button>
                    </div>
                  </div>
                  {expandedOrder === o.id && (
                    <div className="border-t border-[#2d3620] px-4 py-3 bg-[#0d0f0a] space-y-1">
                      {o.items.map(i => (
                        <div key={i.id} className="flex justify-between text-xs">
                          <span className="text-[#7a8a6a]">{i.name} × {i.quantity}</span>
                          <span className="text-[#d4681a]">{(i.priceNum * i.quantity).toLocaleString("ru-RU")} ₽</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STATS */}
        {tab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Пользователей", val: users.length, icon: "Users" },
              { label: "Заказов", val: totalOrders, icon: "ShoppingBag" },
              { label: "Выручка", val: totalRevenue.toLocaleString("ru-RU") + " ₽", icon: "TrendingUp" },
              { label: "Топ товар", val: topProduct?.name || "—", icon: "Star" },
            ].map((s, i) => (
              <div key={i} className="border border-[#2d3620] bg-[#141810] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name={s.icon as "Users"} size={16} className="text-[#d4681a]" />
                  <span className="text-[10px] text-[#4a5a30] uppercase tracking-widest">{s.label}</span>
                </div>
                <div className="font-oswald text-2xl font-bold text-white">{s.val}</div>
              </div>
            ))}
            <div className="col-span-full border border-[#2d3620] bg-[#141810] p-5">
              <div className="text-[10px] text-[#4a5a30] uppercase tracking-widest mb-4">Заказы по статусам</div>
              <div className="flex gap-6 flex-wrap">
                {STATUS_OPTIONS.map(s => {
                  const count = allOrders.filter(o => o.status === s).length;
                  return (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[s].replace("text-", "bg-")}`} />
                      <span className="text-[#7a8a6a] text-sm">{s}: <span className="text-white font-oswald">{count}</span></span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* AI SETTINGS */}
        {tab === "ai" && (
          <div className="max-w-lg">
            <div className="border border-[#2d3620] bg-[#141810] p-6">
              <div className="text-[10px] text-[#4a5a30] uppercase tracking-widest mb-6">Веса параметров ИИ-подбора</div>
              <div className="space-y-5">
                {Object.entries(aiWeights).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-[#d8dcc8]">{key}</span>
                      <span className="font-oswald font-bold text-[#d4681a]">{val}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={val as number}
                      onChange={e => setAiWeights({ ...aiWeights, [key]: Number(e.target.value) })}
                      className="w-full accent-[#d4681a]"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs text-[#7a8a6a]">Сумма весов: <span className={Object.values(aiWeights).reduce((a, b) => a + (b as number), 0) === 100 ? "text-green-400" : "text-red-400"} >{Object.values(aiWeights).reduce((a, b) => a + (b as number), 0)}%</span></div>
              <div className="flex gap-3 mt-6">
                <button onClick={saveAiWeights} className="btn-combat text-sm">Сохранить</button>
                <button
                  onClick={() => setAiWeights(DEFAULT_AI_WEIGHTS)}
                  className="border border-[#2d3620] hover:border-[#7a8a6a] text-[#4a5a30] hover:text-[#7a8a6a] px-4 py-2 text-sm transition-all"
                >
                  Сбросить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
