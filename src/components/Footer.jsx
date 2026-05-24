import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, ArrowRight, MessageCircle } from 'lucide-react'
import { getWhatsAppLink, getPhoneLink } from '../services/api'

export default function Footer() {
  return (
    <footer>
      {/* CTA Banner */}
      <section className="relative bg-primary text-white overflow-hidden noise-bg">
        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 py-24 lg:py-32">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-[10px] font-medium tracking-[0.4em] uppercase text-copper">
              Нужно оборудование?
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl text-white mt-5 mb-6 leading-[1.1]">
              Напишите — <em className="text-copper-light">подберём</em>
              <br />и доставим
            </h2>
            <p className="text-white/40 text-sm mb-10 max-w-md mx-auto leading-relaxed">
              Менеджер ответит в течение часа.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white px-6 py-3.5 sm:px-8 sm:py-4 font-medium text-[11px] tracking-[0.2em] uppercase inline-flex items-center justify-center gap-2 hover:bg-[#1ea952] transition-colors no-underline"
              >
                <MessageCircle size={14} /> Написать в WhatsApp
              </a>
              <a href={getPhoneLink()} className="btn-outline-light gap-2">
                <Phone size={14} /> Позвонить
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main footer */}
      <div className="bg-[#0d0d0d] text-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-4">
              <span className="font-serif text-lg font-semibold tracking-[0.08em] block mb-5">
                PROKITCHEN
              </span>
              <p className="text-white/30 text-sm leading-relaxed max-w-xs mb-4">
                Профессиональное оборудование для HoReCa. Склад в Алматы.
                Доставка по Казахстану.
              </p>
            </div>

            {/* Catalog */}
            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-medium tracking-[0.3em] uppercase text-white/25 mb-6">
                Каталог
              </h4>
              <ul className="space-y-3 list-none p-0 m-0">
                {[
                  'Тепловое',
                  'Холодильное',
                  'Барное',
                  'Кофейное',
                  'Посудомоечное',
                ].map((item) => (
                  <li key={item}>
                    <Link
                      to="/catalog"
                      className="text-white/35 hover:text-white text-sm transition-colors duration-300 no-underline"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-medium tracking-[0.3em] uppercase text-white/25 mb-6">
                Компания
              </h4>
              <ul className="space-y-3 list-none p-0 m-0">
                {[
                  { label: 'О компании', path: '/about' },
                  { label: 'Доставка', path: '/delivery' },
                  { label: 'Контакты', path: '/contacts' },
                  { label: 'Каталог', path: '/catalog' },
                ].map((item) => (
                  <li key={item.path + item.label}>
                    <Link
                      to={item.path}
                      className="text-white/35 hover:text-white text-sm transition-colors duration-300 no-underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacts */}
            <div className="lg:col-span-4">
              <h4 className="text-[10px] font-medium tracking-[0.3em] uppercase text-white/25 mb-6">
                Контакты
              </h4>
              <ul className="space-y-4 list-none p-0 m-0">
                <li>
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] hover:text-[#4ae07e] text-sm transition-colors duration-300 no-underline flex items-center gap-3 font-medium"
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href={getPhoneLink()}
                    className="text-white/60 hover:text-white text-sm transition-colors duration-300 no-underline flex items-center gap-3"
                  >
                    <Phone size={14} className="text-copper/60" /> +7 (700)
                    123-45-67
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@prokitchen.kz"
                    className="text-white/35 hover:text-white text-sm transition-colors duration-300 no-underline flex items-center gap-3"
                  >
                    <Mail size={14} className="text-copper/60" />{' '}
                    info@prokitchen.kz
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin
                    size={14}
                    className="text-copper/60 mt-0.5 shrink-0"
                  />
                  <span className="text-white/35 text-sm">
                    г. Алматы, Казахстан
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/15 text-xs tracking-wider">
              &copy; 2026 ProKitchen. Все права защищены
            </p>
            <div className="flex gap-8">
              <a
                href="#"
                className="text-white/15 hover:text-white/40 text-xs transition-colors no-underline tracking-wider"
              >
                Конфиденциальность
              </a>
              <a
                href="#"
                className="text-white/15 hover:text-white/40 text-xs transition-colors no-underline tracking-wider"
              >
                Оферта
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
