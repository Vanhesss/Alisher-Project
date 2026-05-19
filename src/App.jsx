import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductPage from './pages/ProductPage';
import Contacts from './pages/Contacts';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/about" element={<Placeholder title="О компании" />} />
          <Route path="/delivery" element={<Placeholder title="Доставка и оплата" />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function Placeholder({ title }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-serif text-4xl text-primary mb-4">{title}</h1>
        <p className="text-ash text-sm">Страница в разработке</p>
      </div>
    </div>
  );
}
