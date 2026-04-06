import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import type { AiProduct } from "@/components/AiSelector";
import type { User, Order } from "@/hooks/useAuth";

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
  products: AiProduct[];
  onUpdateProduct: (p: AiProduct) => void;
  onAddProduct: (p: Omit<AiProduct, "id">) => void;
  onDeleteProduct: (id: number) => void;
  onResetProducts: () => void;
  getUsers: () => User[];
  saveUsers: (u: User[]) => void;
  onLogout: () => void;
}

type AdminTab = "products" | "users" | "orders" | "stats";
type OrderStatus = Order["status"];

const STATUS_OPTIONS: OrderStatus[] = ["Создан", "Оплачен", "Отправлен", "Доставлен"];
const STATUS_COLORS: Record<string, string> = {
  "Создан": "text-[#7a8a6a]",
  "Оплачен": "text-blue-400",
  "Отправлен": "text-yellow-400",
  "Доставлен": "text-green-400",
};

const CATS = ["Экипировка", "Защита", "Обувь", "Инструменты", "Свет", "Одежда", "Питание и гидратация", "Средства связи", "Медицина"];
const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%231e2418'/%3E%3Ctext x='40' y='45' text-anchor='middle' font-size='28' fill='%232d3620'%3E🛡%3C/text%3E%3C/svg%3E";

interface ProductFormData {
  name: string;
  category: string;
  price: string;
  rating: number;
  aiReason: string;
  specs: string;
  tag: string;
  image: string;
}

const emptyForm: ProductFormData = {
  name: "", category: "Экипировка", price: "", rating: 80,
  aiReason: "", specs: "", tag: "", image: "",
};

function productToForm(p: AiProduct): ProductFormData {
  return {
    name: p.name,
    category: p.category,
    price: p.price.replace(/[₽\s]/g, ""),
    rating: p.rating,
    aiReason: p.aiReason,
    specs: p.specs.join(", "),
    tag: p.tag || "",
    image: p.image,
  };
}

function formToProduct(form: ProductFormData, id: number): AiProduct {
  const priceNum = parseInt(form.price.replace(/\D/g, ""), 10) || 0;
  const priceStr = priceNum.toLocaleString("ru-RU") + " ₽";
  return {
    id,
    name: form.name,
    category: form.category,
    price: priceStr,
    rating: Math.max(0, Math.min(100, form.rating)),
    aiReason: form.aiReason,
    specs: form.specs.split(",").map(s => s.trim()).filter(Boolean),
    tag: form.tag || undefined,
    image: form.image,
  };
}

export default function AdminPanel({
  open, onClose, products,
  onUpdateProduct, onAddProduct, onDeleteProduct, onResetProducts,
  getUsers, saveUsers, onLogout,
}: AdminPanelProps) {
  const [tab, setTab] = useState<AdminTab>("products");
  const [search, setSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("Все");
  const [editingProduct, setEditingProduct] = useState<AiProduct | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [previewImage, setPreviewImage] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const users = getUsers();
  const allOrders: (Order & { userEmail: string; userName: string; userId: string })[] = users.flatMap(u =>
    u.orders.map(o => ({ ...o, userEmail: u.email, userName: u.name, userId: u.id }))
  );
  const filteredOrders = orderFilter === "Все" ? allOrders : allOrders.filter(o => o.status === orderFilter);
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const openEdit = (p: AiProduct) => {
    setEditingProduct(p);
    setFormData(productToForm(p));
    setPreviewImage(p.image || PLACEHOLDER);
    setIsAddingNew(false);
  };

  const openAdd = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setPreviewImage(PLACEHOLDER);
    setIsAddingNew(true);
  };

  const closeForm = () => {
    setEditingProduct(null);
    setIsAddingNew(false);
    setPreviewImage("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPreviewImage(dataUrl);
      setFormData(f => ({ ...f, image: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    if (isAddingNew) {
      onAddProduct(formToProduct(formData, 0) as Omit<AiProduct, "id">);
    } else if (editingProduct) {
      onUpdateProduct(formToProduct(formData, editingProduct.id));
    }
    closeForm();
  };

  const handleDelete = (id: number) => {
    onDeleteProduct(id);
    setDeleteConfirm(null);
  };

  const toggleBlock = (id: string) => {
    const updated = users.map(u => u.id === id ? { ...u, isBlocked: !u.isBlocked } : u);
    saveUsers(updated);
  };
  const deleteUser = (id: string) => {
    saveUsers(users.filter(u => u.id !== id));
    setExpandedUser(null);
  };
  const changeOrderStatus = (userId: string, orderId: string, status: OrderStatus) => {
    const updated = users.map(u => u.id === userId ? {
      ...u, orders: u.orders.map(o => o.id === orderId ? { ...o, status } : o)
    } : u);
    saveUsers(updated);
  };

  const totalRevenue = allOrders.reduce((s, o) => s + o.total, 0);

  const TABS: { id: AdminTab; label: string; icon: string }[] = [
    { id: "products", label: "Товары", icon: "Package" },
    { id: "users", label: "Пользователи", icon: "Users" },
    { id: "orders", label: "Заказы", icon: "ShoppingBag" },
    { id: "stats", label: "Статистика", icon: "BarChart2" },
  ];

  const FormModal = () => (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75" onClick={closeForm} />
      <div className="relative w-full max-w-2xl bg-[#141810] border border-[#2d3620] overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d3620] bg-[#0d0f0a] sticky top-0 z-10">
          <span className="font-oswald text-lg text-white tracking-widest uppercase">
            {isAddingNew ? "Добавить товар" : "Редактировать товар"}
          </span>
          <button onClick={closeForm} className="text-[#4a5a30] hover:text-[#d4681a] transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {/* Image upload */}
          <div>
            <label className="text-[10px] text-[#4a5a30] uppercase tracking-widest block mb-2">Фотография товара</label>
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 border border-[#2d3620] overflow-hidden shrink-0">
                <img src={previewImage || PLACEHOLDER} alt="preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-[#d4681a]/40 hover:border-[#d4681a] text-[#d4681a] text-xs font-oswald uppercase tracking-widest px-4 py-2 transition-all flex items-center gap-2"
                >
                  <Icon name="Upload" size={14} />
                  Загрузить фото
                </button>
                {formData.image && (
                  <button
                    onClick={() => { setFormData(f => ({ ...f, image: "" })); setPreviewImage(PLACEHOLDER); }}
                    className="border border-red-900/40 hover:border-red-500 text-red-400 text-xs px-4 py-2 transition-all"
                  >
                    Удалить фото
                  </button>
                )}
                <div className="text-[10px] text-[#3d4a2b]">JPG, PNG, WebP. Хранится в localStorage.</div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-[#4a5a30] uppercase tracking-widest block mb-1">Название *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                placeholder="Рюкзак ASSAULT PRO"
                className="w-full bg-[#0d0f0a] border border-[#2d3620] focus:border-[#d4681a] text-[#d8dcc8] px-3 py-2 text-sm outline-none transition-colors placeholder-[#3d4a2b]"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#4a5a30] uppercase tracking-widest block mb-1">Категория</label>
              <select
                value={formData.category}
                onChange={e => setFormData(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-[#0d0f0a] border border-[#2d3620] focus:border-[#d4681a] text-[#d8dcc8] px-3 py-2 text-sm outline-none transition-colors"
              >
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-[#4a5a30] uppercase tracking-widest block mb-1">Цена (₽)</label>
              <input
                type="number"
                value={formData.price}
                onChange={e => setFormData(f => ({ ...f, price: e.target.value }))}
                placeholder="8490"
                className="w-full bg-[#0d0f0a] border border-[#2d3620] focus:border-[#d4681a] text-[#d8dcc8] px-3 py-2 text-sm outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#4a5a30] uppercase tracking-widest block mb-1">AI-рейтинг (0–100)</label>
              <input
                type="number"
                value={formData.rating}
                min={0}
                max={100}
                onChange={e => setFormData(f => ({ ...f, rating: parseInt(e.target.value) || 0 }))}
                className="w-full bg-[#0d0f0a] border border-[#2d3620] focus:border-[#d4681a] text-[#d8dcc8] px-3 py-2 text-sm outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#4a5a30] uppercase tracking-widest block mb-1">Тег (необязательно)</label>
            <input
              type="text"
              value={formData.tag}
              onChange={e => setFormData(f => ({ ...f, tag: e.target.value }))}
              placeholder="ТОП ВЫБОР ИИ"
              className="w-full bg-[#0d0f0a] border border-[#2d3620] focus:border-[#d4681a] text-[#d8dcc8] px-3 py-2 text-sm outline-none transition-colors placeholder-[#3d4a2b]"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#4a5a30] uppercase tracking-widest block mb-1">Характеристики (через запятую)</label>
            <input
              type="text"
              value={formData.specs}
              onChange={e => setFormData(f => ({ ...f, specs: e.target.value }))}
              placeholder="45 литров, Кордура 1000D, MOLLE, IP65"
              className="w-full bg-[#0d0f0a] border border-[#2d3620] focus:border-[#d4681a] text-[#d8dcc8] px-3 py-2 text-sm outline-none transition-colors placeholder-[#3d4a2b]"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#4a5a30] uppercase tracking-widest block mb-1">AI-обоснование</label>
            <textarea
              value={formData.aiReason}
              onChange={e => setFormData(f => ({ ...f, aiReason: e.target.value }))}
              placeholder="Почему ИИ рекомендует этот товар..."
              rows={3}
              className="w-full bg-[#0d0f0a] border border-[#2d3620] focus:border-[#d4681a] text-[#d8dcc8] px-3 py-2 text-sm outline-none transition-colors resize-none placeholder-[#3d4a2b]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={!formData.name.trim()}
              className="flex-1 btn-combat disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Icon name="Check" size={16} />
              {isAddingNew ? "Добавить товар" : "Сохранить изменения"}
            </button>
            <button
              onClick={closeForm}
              className="border border-[#2d3620] hover:border-[#7a8a6a] text-[#4a5a30] hover:text-[#7a8a6a] px-5 transition-all"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-[#0d0f0a]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#2d3620] bg-[#141810] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="font-oswald text-xl text-white tracking-widest uppercase">ADMIN PANEL</span>
          <span className="text-[10px] text-[#4a5a30] uppercase tracking-widest hidden sm:block">// TACTICMIND</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { onLogout(); onClose(); }}
            className="text-xs text-[#4a5a30] hover:text-red-400 uppercase tracking-wider transition-colors flex items-center gap-1"
          >
            <Icon name="LogOut" size={14} />
            <span className="hidden sm:block">Выйти</span>
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
            {t.id === "products" && <span className="bg-[#2d3620] text-[#7a8a6a] text-[10px] px-1.5 py-0.5 ml-1">{products.length}</span>}
            {t.id === "orders" && allOrders.length > 0 && <span className="bg-[#d4681a] text-white text-[10px] px-1.5 py-0.5 ml-1">{allOrders.length}</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">

        {/* PRODUCTS */}
        {tab === "products" && (
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск по названию..."
                className="bg-[#141810] border border-[#2d3620] focus:border-[#d4681a] text-[#d8dcc8] px-4 py-2 text-sm outline-none w-64 placeholder-[#3d4a2b] transition-colors"
              />
              <span className="text-[#4a5a30] text-sm">Найдено: <span className="text-[#d4681a] font-oswald">{filteredProducts.length}</span></span>
              <div className="ml-auto flex gap-2">
                <button
                  onClick={openAdd}
                  className="btn-combat text-xs flex items-center gap-2"
                >
                  <Icon name="Plus" size={14} />
                  Добавить товар
                </button>
                <button
                  onClick={() => { if (confirm("Сбросить все товары к стандартным?")) onResetProducts(); }}
                  className="border border-[#2d3620] hover:border-red-900/60 text-[#4a5a30] hover:text-red-400 text-xs px-3 py-2 transition-all"
                >
                  Сбросить
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-[#2d3620]">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#2d3620] bg-[#141810] text-[10px] text-[#4a5a30] uppercase tracking-widest">
                    <th className="text-left py-3 px-3 w-10">ID</th>
                    <th className="text-left py-3 px-3 w-16">Фото</th>
                    <th className="text-left py-3 px-3">Название</th>
                    <th className="text-left py-3 px-3">Категория</th>
                    <th className="text-left py-3 px-3">Цена</th>
                    <th className="text-left py-3 px-3 w-20">Рейтинг</th>
                    <th className="text-left py-3 px-3 w-28">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="border-b border-[#2d3620]/50 hover:bg-[#1a1f15] transition-colors">
                      <td className="py-2.5 px-3 text-[#4a5a30] font-oswald text-xs">{String(p.id).padStart(2, "0")}</td>
                      <td className="py-2.5 px-3">
                        <div className="w-10 h-10 border border-[#2d3620] overflow-hidden">
                          <img src={p.image || PLACEHOLDER} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-oswald text-white text-sm">{p.name}</td>
                      <td className="py-2.5 px-3 text-[#7a8a6a] text-xs">{p.category}</td>
                      <td className="py-2.5 px-3 text-[#d4681a] font-oswald text-sm">{p.price}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-oswald font-bold text-sm" style={{ color: p.rating >= 90 ? "#d4681a" : p.rating >= 80 ? "#e8b04a" : "#7a8a6a" }}>
                          {p.rating}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(p)}
                            className="text-[#4a5a30] hover:text-[#d4681a] transition-colors p-1"
                            title="Редактировать"
                          >
                            <Icon name="Pencil" size={15} />
                          </button>
                          {deleteConfirm === p.id ? (
                            <div className="flex gap-1 items-center">
                              <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300 p-1"><Icon name="Check" size={14} /></button>
                              <button onClick={() => setDeleteConfirm(null)} className="text-[#4a5a30] hover:text-[#7a8a6a] p-1"><Icon name="X" size={14} /></button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(p.id)}
                              className="text-[#3d4a2b] hover:text-red-400 transition-colors p-1"
                              title="Удалить"
                            >
                              <Icon name="Trash2" size={15} />
                            </button>
                          )}
                        </div>
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
              Всего: <span className="text-[#d4681a]">{users.length}</span> пользователей
            </div>
            {users.length === 0 && <div className="text-[#4a5a30] text-sm py-8 text-center border border-dashed border-[#2d3620]">Нет зарегистрированных пользователей</div>}
            {users.map(u => (
              <div key={u.id} className="border border-[#2d3620] bg-[#141810]">
                <div className="flex items-center justify-between px-4 py-3 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <Icon name="User" size={16} className={u.isBlocked ? "text-red-500" : u.isAdmin ? "text-[#d4681a]" : "text-[#4a5a30]"} />
                    <div>
                      <div className="font-oswald text-sm text-white">{u.name}</div>
                      <div className="text-[10px] text-[#4a5a30]">{u.email} · {u.registrationDate}</div>
                    </div>
                    {u.isAdmin && <span className="text-[9px] bg-[#d4681a] text-white px-2 py-0.5 font-oswald">ADMIN</span>}
                    {u.isBlocked && <span className="text-[9px] bg-red-900/60 border border-red-700/40 text-red-400 px-2 py-0.5">ЗАБЛОК.</span>}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-[#4a5a30]">Заказов: <span className="text-white">{u.orders.length}</span></span>
                    <button onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)} className="text-[#4a5a30] hover:text-[#d4681a] transition-colors">
                      <Icon name={expandedUser === u.id ? "ChevronUp" : "ChevronDown"} size={14} />
                    </button>
                    {!u.isAdmin && (
                      <>
                        <button
                          onClick={() => toggleBlock(u.id)}
                          className={`text-[10px] px-2 py-1 border transition-colors ${u.isBlocked ? "border-green-700/40 text-green-400 hover:border-green-500" : "border-red-900/40 text-red-400 hover:border-red-500"}`}
                        >
                          {u.isBlocked ? "Разблок." : "Заблок."}
                        </button>
                        <button onClick={() => { if (confirm("Удалить пользователя?")) deleteUser(u.id); }} className="text-[#3d4a2b] hover:text-red-500 transition-colors">
                          <Icon name="Trash2" size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {expandedUser === u.id && (
                  <div className="border-t border-[#2d3620] px-4 py-3 bg-[#0d0f0a]">
                    <div className="text-[10px] text-[#4a5a30] uppercase tracking-widest mb-2">Заказы</div>
                    {u.orders.length === 0 ? <div className="text-[#3d4a2b] text-xs">Нет заказов</div> : u.orders.map(o => (
                      <div key={o.id} className="flex items-center justify-between py-1.5 border-b border-[#2d3620]/50 last:border-0 text-xs flex-wrap gap-2">
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
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <select
                value={orderFilter}
                onChange={e => setOrderFilter(e.target.value)}
                className="bg-[#141810] border border-[#2d3620] focus:border-[#d4681a] text-[#d8dcc8] px-3 py-2 text-sm outline-none transition-colors"
              >
                {["Все", ...STATUS_OPTIONS].map(s => <option key={s}>{s}</option>)}
              </select>
              <span className="text-[#4a5a30] text-sm">Заказов: <span className="text-[#d4681a] font-oswald">{filteredOrders.length}</span></span>
            </div>
            {filteredOrders.length === 0 && (
              <div className="text-[#4a5a30] text-sm py-8 text-center border border-dashed border-[#2d3620]">Заказов нет</div>
            )}
            <div className="space-y-2">
              {filteredOrders.map(o => (
                <div key={o.id} className="border border-[#2d3620] bg-[#141810]">
                  <div className="flex items-center justify-between px-4 py-3 flex-wrap gap-2">
                    <div>
                      <div className="font-oswald text-sm text-white">#{o.id.slice(-6)} · {o.userName}</div>
                      <div className="text-[10px] text-[#4a5a30]">{o.userEmail} · {o.date}</div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-oswald text-[#d4681a] font-bold">{o.total.toLocaleString("ru-RU")} ₽</span>
                      <select
                        value={o.status}
                        onChange={e => changeOrderStatus(o.userId, o.id, e.target.value as OrderStatus)}
                        className={`bg-[#0d0f0a] border border-[#2d3620] px-2 py-1 text-xs outline-none ${STATUS_COLORS[o.status]}`}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)} className="text-[#4a5a30] hover:text-[#d4681a] transition-colors">
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
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Товаров", val: products.length, icon: "Package", color: "#d4681a" },
                { label: "Пользователей", val: users.length, icon: "Users", color: "#7a8a6a" },
                { label: "Заказов", val: allOrders.length, icon: "ShoppingBag", color: "#e8b04a" },
                { label: "Выручка", val: totalRevenue.toLocaleString("ru-RU") + " ₽", icon: "TrendingUp", color: "#4a8a4a" },
              ].map((s, i) => (
                <div key={i} className="border border-[#2d3620] bg-[#141810] p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name={s.icon as "Package"} size={16} style={{ color: s.color }} />
                    <span className="text-[10px] text-[#4a5a30] uppercase tracking-widest">{s.label}</span>
                  </div>
                  <div className="font-oswald text-2xl font-bold text-white">{s.val}</div>
                </div>
              ))}
            </div>
            <div className="border border-[#2d3620] bg-[#141810] p-5">
              <div className="text-[10px] text-[#4a5a30] uppercase tracking-widest mb-4">Заказы по статусам</div>
              <div className="space-y-2">
                {STATUS_OPTIONS.map(s => {
                  const count = allOrders.filter(o => o.status === s).length;
                  const pct = allOrders.length ? Math.round(count / allOrders.length * 100) : 0;
                  return (
                    <div key={s}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className={STATUS_COLORS[s]}>{s}</span>
                        <span className="text-[#7a8a6a]">{count} заказов ({pct}%)</span>
                      </div>
                      <div className="h-1.5 bg-[#2d3620]">
                        <div className="h-full bg-gradient-to-r from-[#d4681a] to-[#e8890a]" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="border border-[#2d3620] bg-[#141810] p-5">
              <div className="text-[10px] text-[#4a5a30] uppercase tracking-widest mb-4">Категории каталога</div>
              {Array.from(new Set(products.map(p => p.category))).map(cat => {
                const count = products.filter(p => p.category === cat).length;
                return (
                  <div key={cat} className="flex items-center gap-3 py-1.5 text-xs">
                    <span className="text-[#7a8a6a] w-40 truncate">{cat}</span>
                    <div className="flex-1 h-1 bg-[#2d3620]">
                      <div className="h-full bg-[#d4681a]/60" style={{ width: `${(count / products.length) * 100}%` }} />
                    </div>
                    <span className="text-[#d4681a] font-oswald w-4 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Product form modal */}
      {(editingProduct || isAddingNew) && <FormModal />}
    </div>
  );
}
