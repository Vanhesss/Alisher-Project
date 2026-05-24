import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { getWhatsAppLink, getPhoneLink } from '../services/api';

export default function Contacts() {
  const [formData, setFormData] = useState({ name: '', phone: '', company: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setFormData({ name: '', phone: '', company: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-black/5">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 lg:py-14">
          <span className="label">Связаться</span>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-5xl text-primary tracking-tight mt-2">Контакты</h1>
          <p className="text-ash text-sm mt-3">Самый быстрый способ — написать в WhatsApp</p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-14 lg:py-20">
        {/* Quick contact CTA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-14">
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 bg-[#25D366] text-white no-underline group hover:bg-[#1ea952] transition-colors"
          >
            <MessageCircle size={24} />
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase opacity-70 block">Самый быстрый способ</span>
              <span className="text-lg font-medium">Написать в WhatsApp</span>
            </div>
          </a>
          <a
            href={getPhoneLink()}
            className="flex items-center gap-4 p-6 bg-primary text-white no-underline group hover:bg-charcoal transition-colors"
          >
            <Phone size={24} />
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase opacity-50 block">Звоните</span>
              <span className="text-lg font-medium">+7 (700) 123-45-67</span>
            </div>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Contact info */}
          <div className="lg:col-span-4 space-y-0">
            {[
              { icon: Phone, label: 'Телефон', value: '+7 (700) 123-45-67', href: getPhoneLink() },
              { icon: Mail, label: 'Email', value: 'info@prokitchen.kz', href: 'mailto:info@prokitchen.kz' },
              { icon: MessageCircle, label: 'WhatsApp', value: '+7 (700) 123-45-67', href: getWhatsAppLink() },
              { icon: MapPin, label: 'Склад', value: 'г. Алматы, Казахстан' },
              { icon: Clock, label: 'Режим работы', value: 'Пн — Пт: 9:00 — 18:00' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-4 py-5 border-b border-black/5 last:border-0">
                <div className="w-10 h-10 border border-black/8 flex items-center justify-center shrink-0">
                  <item.icon size={16} className="text-copper" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] text-ash tracking-[0.25em] uppercase font-medium mb-1.5">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith('https') ? '_blank' : undefined} rel="noopener noreferrer" className="text-primary font-medium text-sm no-underline hover:text-copper transition-colors">{item.value}</a>
                  ) : (
                    <p className="text-primary font-medium text-sm">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-8 border border-black/5 p-8 lg:p-12">
            {sent ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 border border-copper flex items-center justify-center mx-auto mb-6">
                  <Send size={20} className="text-copper" />
                </div>
                <h3 className="font-serif text-2xl text-primary mb-3">Заявка отправлена</h3>
                <p className="text-ash text-sm mb-8">Менеджер свяжется с вами в ближайшее время</p>
                <button onClick={() => setSent(false)} className="btn-outline text-[10px]">
                  Отправить ещё
                </button>
              </div>
            ) : (
              <>
                <span className="label">Обратная связь</span>
                <h2 className="font-serif text-2xl lg:text-3xl text-primary mt-2 mb-2 leading-tight">Оставьте заявку</h2>
                <p className="text-ash text-sm mb-10">Менеджер ответит в рабочее время в течение часа</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { key: 'name', label: 'Имя', type: 'text', required: true, placeholder: 'Ваше имя' },
                      { key: 'phone', label: 'Телефон', type: 'tel', required: true, placeholder: '+7 (___) ___-__-__' },
                      { key: 'company', label: 'Компания', type: 'text', required: false, placeholder: 'Название компании' },
                      { key: 'email', label: 'Email', type: 'email', required: false, placeholder: 'email@company.kz' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="block text-[10px] font-medium text-primary mb-3 tracking-[0.25em] uppercase">
                          {field.label}{field.required && ' *'}
                        </label>
                        <input
                          type={field.type}
                          required={field.required}
                          value={formData[field.key]}
                          onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                          className="w-full px-0 py-3 bg-transparent border-b border-black/10 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-mist font-sans"
                          placeholder={field.placeholder}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-primary mb-3 tracking-[0.25em] uppercase">Сообщение</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-0 py-3 bg-transparent border-b border-black/10 text-sm focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-mist font-sans"
                      placeholder="Какое оборудование вас интересует?"
                    />
                  </div>
                  <div className="pt-2">
                    <button type="submit" className="btn-primary gap-2">
                      Отправить заявку <Send size={14} />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
