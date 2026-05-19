import { useState } from 'react';
import { X, Send, MessageCircle, Phone } from 'lucide-react';
import { getWhatsAppLink, getPhoneLink } from '../services/api';

export default function InquiryModal({ product, onClose }) {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // В реальности — отправка на backend или в CRM
    setSent(true);
    setTimeout(onClose, 2000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md animate-fade-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-ash hover:text-primary transition-colors cursor-pointer"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <div className="p-8 lg:p-10">
          {sent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 border border-[#25D366] flex items-center justify-center mx-auto mb-5">
                <Send size={20} className="text-[#25D366]" />
              </div>
              <h3 className="font-serif text-xl text-primary mb-2">Заявка отправлена</h3>
              <p className="text-ash text-sm">Менеджер свяжется с вами в ближайшее время</p>
            </div>
          ) : (
            <>
              <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-copper">Быстрый запрос</span>
              <h3 className="font-serif text-xl lg:text-2xl text-primary mt-2 mb-1">Узнать цену и наличие</h3>

              {product && (
                <div className="flex items-center gap-3 mt-4 mb-6 p-3 bg-ivory">
                  <img src={product.image} alt="" className="w-14 h-14 object-cover" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-copper tracking-[0.15em] uppercase">{product.brand}</p>
                    <p className="text-xs text-primary truncate">{product.name}</p>
                  </div>
                </div>
              )}

              {/* Quick contact buttons */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                <a
                  href={getWhatsAppLink(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white text-[10px] font-medium tracking-[0.15em] uppercase hover:bg-[#1ea952] transition-colors no-underline"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
                <a
                  href={getPhoneLink()}
                  className="flex items-center justify-center gap-2 py-3 border border-black/10 text-primary text-[10px] font-medium tracking-[0.15em] uppercase hover:bg-ivory transition-colors no-underline"
                >
                  <Phone size={14} /> Позвонить
                </a>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-black/5" />
                <span className="text-[10px] text-mist tracking-wider uppercase">или оставьте заявку</span>
                <div className="flex-1 h-px bg-black/5" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-0 py-3 bg-transparent border-b border-black/10 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-mist font-sans"
                    placeholder="Ваше имя *"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-0 py-3 bg-transparent border-b border-black/10 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-mist font-sans"
                    placeholder="Телефон *"
                  />
                </div>
                <div>
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-0 py-3 bg-transparent border-b border-black/10 text-sm focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-mist font-sans"
                    placeholder="Комментарий"
                  />
                </div>
                <button type="submit" className="w-full btn-primary gap-2">
                  Отправить заявку <Send size={13} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
