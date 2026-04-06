import { useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  registrationDate: string;
  isAdmin: boolean;
  isBlocked: boolean;
  orders: Order[];
  selections: Selection[];
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: "Создан" | "Оплачен" | "Отправлен" | "Доставлен";
  items: { id: number; name: string; price: string; priceNum: number; quantity: number; image: string; category: string }[];
}

export interface Selection {
  id: string;
  date: string;
  task: string;
  items: { id: number; name: string; price: string; image: string; category: string; aiReason: string }[];
}

const USERS_KEY = "tacticmind_users";
const CURRENT_KEY = "tacticmind_current";
const ADMIN_EMAIL = "admin@tacticmind.ru";
const ADMIN_PASS = "admin123";

function getUsers(): User[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}
function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getCurrent(): User | null {
  try { return JSON.parse(localStorage.getItem(CURRENT_KEY) || "null"); } catch { return null; }
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrent);

  const register = (email: string, password: string, name: string): string | null => {
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) return "Email уже зарегистрирован";
    const newUser: User = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      password,
      name: name || email.split("@")[0],
      registrationDate: new Date().toLocaleDateString("ru-RU"),
      isAdmin: email.toLowerCase() === ADMIN_EMAIL,
      isBlocked: false,
      orders: [],
      selections: [],
    };
    const updated = [...users, newUser];
    saveUsers(updated);
    localStorage.setItem(CURRENT_KEY, JSON.stringify(newUser));
    setCurrentUser(newUser);
    return null;
  };

  const login = (email: string, password: string): string | null => {
    if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASS) {
      const users = getUsers();
      let admin = users.find(u => u.email === ADMIN_EMAIL);
      if (!admin) {
        admin = { id: "admin", email: ADMIN_EMAIL, password: ADMIN_PASS, name: "Администратор", registrationDate: new Date().toLocaleDateString("ru-RU"), isAdmin: true, isBlocked: false, orders: [], selections: [] };
        saveUsers([...users, admin]);
      }
      localStorage.setItem(CURRENT_KEY, JSON.stringify(admin));
      setCurrentUser(admin);
      return null;
    }
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return "Пользователь не найден";
    if (user.isBlocked) return "Аккаунт заблокирован";
    if (user.password !== password) return "Неверный пароль";
    localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
    setCurrentUser(user);
    return null;
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_KEY);
    setCurrentUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!currentUser) return;
    const users = getUsers();
    const updated = users.map(u => u.id === currentUser.id ? { ...u, ...updates } : u);
    saveUsers(updated);
    const newUser = { ...currentUser, ...updates };
    localStorage.setItem(CURRENT_KEY, JSON.stringify(newUser));
    setCurrentUser(newUser);
  };

  const saveOrder = (order: Order) => {
    if (!currentUser) return;
    const users = getUsers();
    const updated = users.map(u => u.id === currentUser.id ? { ...u, orders: [...u.orders, order] } : u);
    saveUsers(updated);
    const newUser = { ...currentUser, orders: [...currentUser.orders, order] };
    localStorage.setItem(CURRENT_KEY, JSON.stringify(newUser));
    setCurrentUser(newUser);
  };

  const saveSelection = (selection: Selection) => {
    if (!currentUser) return;
    const users = getUsers();
    const updated = users.map(u => u.id === currentUser.id ? { ...u, selections: [...u.selections, selection] } : u);
    saveUsers(updated);
    const newUser = { ...currentUser, selections: [...currentUser.selections, selection] };
    localStorage.setItem(CURRENT_KEY, JSON.stringify(newUser));
    setCurrentUser(newUser);
  };

  const changePassword = (oldPwd: string, newPwd: string): string | null => {
    if (!currentUser) return "Не авторизован";
    if (currentUser.password !== oldPwd) return "Неверный текущий пароль";
    updateUser({ password: newPwd });
    return null;
  };

  return { currentUser, register, login, logout, updateUser, saveOrder, saveSelection, changePassword, getUsers, saveUsers };
}
