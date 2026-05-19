import { MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '../services/api';

export default function WhatsAppButton() {
  return (
    <a
      href={getWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center
                 shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_30px_rgba(37,211,102,0.5)]
                 hover:scale-110 transition-all duration-300 group"
      aria-label="Написать в WhatsApp"
    >
      <MessageCircle size={24} className="text-white" fill="white" strokeWidth={0} />
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />

      {/* Tooltip */}
      <span className="absolute right-full mr-3 bg-white text-primary text-xs font-medium px-4 py-2.5
                        shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        pointer-events-none">
        Написать в WhatsApp
      </span>
    </a>
  );
}
