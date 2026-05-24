import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, Building2, Mail, LogOut, Heart, Edit2, Check, X, Loader2, Package, ChevronRight, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../data/products';

export default function Account() {
  const navigate = useNavigate();
  const { user, profile, favorites, loading, signOut, updateProfile, toggleFavorite } = useAuth();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);
  const [saveError, setSaveError] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={28} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Войдите в аккаунт</h2>
          <p className="text-gray-500 text-sm mb-6">Для доступа к личному кабинету необходимо авторизоваться</p>
          <Link to="/auth" className="btn-primary">Войти / Зарегистрироваться</Link>
        </div>
      </div>
    );
  }

  function startEdit() {
    setForm({
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      company: profile?.company || '',
    });
    setEditing(true);
    setSaveError('');
  }

  function cancelEdit() {
    setEditing(false);
    setForm(null);
    setSaveError('');
  }

  async function saveProfile() {
    setSaving(true);
    setSaveError('');
    const { error } = await updateProfile(form);
    setSaving(false);
    if (error) {
      setSaveError('Ошибка сохранения. Попробуйте ещё раз.');
    } else {
      setEditing(false);
      setForm(null);
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Пользователь';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-5 sm:py-7">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-1">
                <Link to="/" className="hover:text-primary no-underline text-gray-400">Главная</Link>
                <ChevronRight size={10} />
                <span>Личный кабинет</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                Привет, {displayName}! 👋
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors cursor-pointer border border-gray-200 hover:border-red-200 rounded-lg px-4 py-2"
            >
              <LogOut size={14} /> Выйти
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Profile card ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                <h2 className="font-bold text-gray-900">Профиль</h2>
                {!editing && (
                  <button
                    onClick={startEdit}
                    className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline cursor-pointer"
                  >
                    <Edit2 size={12} /> Изменить
                  </button>
                )}
              </div>

              {/* Avatar */}
              <div className="px-5 pt-5 pb-4 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-xl">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="font-bold text-gray-900 text-base">{displayName}</p>
                <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
              </div>

              <div className="px-5 pb-5 space-y-3">
                {editing ? (
                  <>
                    {saveError && (
                      <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{saveError}</p>
                    )}
                    {[
                      { key: 'full_name', label: 'Имя и фамилия', icon: User, placeholder: 'Иван Иванов' },
                      { key: 'phone', label: 'Телефон', icon: Phone, placeholder: '+7 (700) 000-00-00' },
                      { key: 'company', label: 'Компания', icon: Building2, placeholder: 'ТОО «Название»' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                        <div className="relative">
                          <f.icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={form[f.key]}
                            onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                            placeholder={f.placeholder}
                            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={saveProfile}
                        disabled={saving}
                        className="flex-1 bg-primary text-white py-2 rounded-lg text-xs font-bold hover:bg-charcoal transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                        Сохранить
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 border border-gray-200 text-gray-500 py-2 rounded-lg text-xs font-bold hover:border-gray-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <X size={13} /> Отмена
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {[
                      { icon: Mail, value: user.email, label: 'Email' },
                      { icon: Phone, value: profile?.phone, label: 'Телефон' },
                      { icon: Building2, value: profile?.company, label: 'Компания' },
                    ].map(item => item.value && (
                      <div key={item.label} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                        <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                          <item.icon size={13} className="text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] text-gray-400 font-medium">{item.label}</p>
                          <p className="text-sm text-gray-800 font-medium truncate">{item.value}</p>
                        </div>
                      </div>
                    ))}
                    {!profile?.phone && !profile?.company && !editing && (
                      <button
                        onClick={startEdit}
                        className="w-full text-center text-xs text-primary font-semibold hover:underline cursor-pointer py-1"
                      >
                        + Заполнить профиль
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── Favorites ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-gray-900">Избранное</h2>
                  {favorites.length > 0 && (
                    <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {favorites.length}
                    </span>
                  )}
                </div>
                {favorites.length > 0 && (
                  <Link to="/catalog" className="text-xs text-primary font-semibold hover:underline no-underline">
                    В каталог →
                  </Link>
                )}
              </div>

              {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                  <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Heart size={24} className="text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium text-sm mb-1">Нет избранных товаров</p>
                  <p className="text-gray-400 text-xs mb-5">Нажмите ♥ на карточке товара, чтобы добавить в избранное</p>
                  <Link to="/catalog" className="btn-primary text-sm">Перейти в каталог</Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {favorites.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group">
                      {/* Image */}
                      <Link to={`/product/${item.product_id}`} className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 no-underline">
                        {item.product_image
                          ? <img src={item.product_image} alt={item.product_name} className="w-full h-full object-contain p-1.5" />
                          : <div className="w-full h-full flex items-center justify-center"><Package size={18} className="text-gray-300" /></div>
                        }
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        {item.product_brand && (
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-0.5">{item.product_brand}</p>
                        )}
                        <Link to={`/product/${item.product_id}`} className="block text-sm font-semibold text-gray-800 hover:text-primary transition-colors no-underline line-clamp-2 leading-snug">
                          {item.product_name}
                        </Link>
                        <p className="text-base font-bold text-gray-900 mt-1.5">{formatPrice(item.product_price)}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          to={`/product/${item.product_id}`}
                          className="hidden sm:flex items-center gap-1.5 bg-primary text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-charcoal transition-colors no-underline"
                        >
                          <ShoppingCart size={12} /> В корзину
                        </Link>
                        <button
                          onClick={() => toggleFavorite({ id: item.product_id, name: item.product_name, price: item.product_price, image: item.product_image })}
                          className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Удалить из избранного"
                        >
                          <Heart size={15} fill="currentColor" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
