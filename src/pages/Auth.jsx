import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Mail, Lock, User, Phone, Building2, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState(location.state?.mode === 'register' ? 'register' : 'login');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    email: '', password: '', fullName: '', phone: '', company: '',
  });

  function set(field) {
    return e => setForm(prev => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'login') {
      const { error } = await signIn(form.email, form.password);
      if (error) {
        setError(error.message === 'Invalid login credentials'
          ? 'Неверный email или пароль'
          : error.message);
      } else {
        navigate(location.state?.from || '/account');
      }
    } else {
      if (!form.fullName.trim()) { setError('Введите ваше имя'); setLoading(false); return; }
      if (form.password.length < 6) { setError('Пароль должен быть минимум 6 символов'); setLoading(false); return; }
      const { error } = await signUp(form.email, form.password, {
        fullName: form.fullName,
        phone: form.phone,
        company: form.company,
      });
      if (error) {
        setError(error.message === 'User already registered'
          ? 'Этот email уже зарегистрирован'
          : error.message);
      } else {
        setSuccess('Аккаунт создан! Вы вошли в систему.');
        setTimeout(() => navigate('/account'), 1200);
      }
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="no-underline">
            <span className="text-2xl font-extrabold text-primary tracking-tight">PROKITCHEN</span>
            <span className="block text-xs text-gray-400 tracking-widest uppercase mt-0.5">Professional</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="grid grid-cols-2 border-b border-gray-100">
            {[
              { key: 'login', label: 'Войти' },
              { key: 'register', label: 'Регистрация' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => { setMode(tab.key); setError(''); setSuccess(''); }}
                className={`py-4 text-sm font-bold transition-colors cursor-pointer ${
                  mode === tab.key
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            {/* Error/Success */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Name (register only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Имя и фамилия *</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={set('fullName')}
                    placeholder="Иван Иванов"
                    required
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="email@example.com"
                  required
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Пароль *</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder={mode === 'register' ? 'Минимум 6 символов' : '••••••••'}
                  required
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(prev => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Phone + Company (register only) */}
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Телефон</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={set('phone')}
                      placeholder="+7 (700) 000-00-00"
                      className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Компания</label>
                  <div className="relative">
                    <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={form.company}
                      onChange={set('company')}
                      placeholder="ТОО «Название»"
                      className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold text-sm hover:bg-charcoal transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading
                ? <Loader2 size={16} className="animate-spin" />
                : mode === 'login' ? 'Войти' : 'Создать аккаунт'
              }
            </button>

            <p className="text-center text-xs text-gray-400 pt-1">
              {mode === 'login' ? (
                <>Нет аккаунта?{' '}
                  <button type="button" onClick={() => setMode('register')} className="text-primary font-semibold hover:underline cursor-pointer">
                    Зарегистрируйтесь
                  </button>
                </>
              ) : (
                <>Уже есть аккаунт?{' '}
                  <button type="button" onClick={() => setMode('login')} className="text-primary font-semibold hover:underline cursor-pointer">
                    Войти
                  </button>
                </>
              )}
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          <Link to="/" className="hover:text-primary transition-colors no-underline text-gray-400">← Вернуться на главную</Link>
        </p>
      </div>
    </div>
  );
}
