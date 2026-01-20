import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

/**
 * CONFIGURACIÓN DE IMÁGENES REALES
 * Se asume que los archivos están dentro de una carpeta llamada "imagenes"
 */
const IMAGES = {
  LOGO: "imagenes/Logo-definitivo.png",
  HERO: "imagenes/Tournedo-de-rabo-de-toro.jpg",
  PHILOSOPHY: "imagenes/Foto-de-perfil.jpg",
  KITCHEN: "imagenes/Canelon-con-salsa-ligera.jpg",
  FORM_BG: "imagenes/Aperitivos-glaseados.jpg",
  MENU_1: "imagenes/Gambones-con-mango-y-aguacate.jpg",
  MENU_2: "imagenes/Carrillera-glaseada.jpg",
  MENU_3: "imagenes/Pastel-de-chocolate.jpg"
};

const SYSTEM_INSTRUCTION = `
You are the "Artesano Concierge", the virtual host for an elite Private Chef service in the UK.
You specialise in Spanish and Mediterranean haute cuisine. Your tone is impeccable, calm, and sophisticated.

BUSINESS GUIDELINES:
1. PRICING: Menus are between £50 and £100 per guest.
2. DIETARY REQUIREMENTS: Always respond: "That is no problem at all; we adapt our culinary approach swiftly to accommodate any requirements without compromising on excellence."
3. CLEANLINESS: The Chef leaves the kitchen IMMACULATE.
4. BOOKINGS: 20% deposit required.
5. CONTACT: The lead chef is Charlie, reachable at charliechef13@gmail.com. All enquiries are sent directly to him.
6. LANGUAGE: British English.
`;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Good day. I am the Artesano Concierge. How may I assist you in crafting your bespoke dining experience today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      if (!process.env.API_KEY) throw new Error("API_KEY_MISSING");
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.6 },
      });
      const text = response.text || "I do apologise, I am currently unable to retrieve that information.";
      setMessages(prev => [...prev, { role: 'model', text: text }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "The digital concierge is briefly resting. Please use the enquiry form below for an immediate response." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className="bg-gold text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-all duration-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      ) : (
        <div className="bg-bone w-80 md:w-96 h-[500px] rounded-3xl shadow-2xl flex flex-col border border-gold/10 overflow-hidden">
          <div className="bg-charcoal p-5 text-bone flex justify-between items-center">
            <span className="font-serif tracking-widest text-[10px] uppercase italic">Concierge</span>
            <button onClick={() => setIsOpen(false)} className="text-xl">&times;</button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-2xl max-w-[85%] text-xs ${m.role === 'user' ? 'bg-gold text-white rounded-tr-none' : 'bg-white border text-charcoal shadow-sm rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-5 bg-white border-t flex gap-3">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} className="flex-1 text-xs outline-none px-4 py-3 bg-bone rounded-full" placeholder="Your enquiry..." />
            <button onClick={handleSend} className="text-gold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    // En un entorno real, aquí se llamaría a una API que envíe a charliechef13@gmail.com
    console.log("Enviando propuesta a charliechef13@gmail.com...");
    setTimeout(() => {
      setFormStatus('success');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-bone">
      {/* Navigation */}
      <nav className={`fixed w-full z-40 transition-all duration-700 py-6 px-8 md:px-20 flex justify-between items-center ${isScrolled ? 'glass-nav py-4' : 'bg-transparent text-white'}`}>
        <div className="flex items-center gap-4">
          <img src={IMAGES.LOGO} className="h-10 w-auto object-contain" alt="Logo" onError={(e) => e.currentTarget.style.display='none'} />
          <h1 className="font-serif text-2xl tracking-[0.4em] uppercase cursor-pointer" onClick={() => window.scrollTo(0, 0)}>Artesano</h1>
        </div>
        <div className="hidden md:flex gap-12 text-[10px] font-bold tracking-[0.3em] uppercase items-center">
          <a href="#philosophy" className="hover:text-gold transition-colors">Philosophy</a>
          <a href="#menus" className="hover:text-gold transition-colors">Menus</a>
          <a href="#service" className="hover:text-gold transition-colors">Service</a>
          <a href="#enquire" className="bg-gold text-white px-10 py-3 rounded-full hover:scale-105 transition-all">Enquire</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="h-screen relative flex items-center justify-center text-bone text-center px-6">
        <div className="absolute inset-0 bg-charcoal">
          <img src={IMAGES.HERO} className="w-full h-full object-cover opacity-40 scale-105" alt="Artesano" />
        </div>
        <div className="relative z-10 space-y-12 max-w-4xl animate-fade-up">
          <p className="uppercase tracking-[0.8em] text-gold text-[10px] font-bold">A Bespoke Culinary Masterpiece</p>
          <h2 className="text-6xl md:text-9xl font-serif italic leading-[1.1]">Savour the <br/> Exceptional.</h2>
          <div className="pt-8 flex justify-center">
             <a href="#menus" className="bg-bone text-charcoal px-16 py-6 rounded-full hover:bg-gold hover:text-white transition-all shadow-2xl text-[11px] font-bold uppercase tracking-widest">Discover Menus</a>
          </div>
        </div>
      </header>

      {/* Philosophy */}
      <section id="philosophy" className="py-40 px-6 md:px-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-32 items-center">
        <div className="relative">
          <img src={IMAGES.PHILOSOPHY} className="rounded-3xl shadow-2xl relative z-10" alt="The Chef" />
          <div className="absolute top-10 -right-10 w-full h-full border border-gold/10 rounded-3xl -z-0"></div>
        </div>
        <div className="space-y-10">
          <span className="text-gold font-bold uppercase tracking-[0.5em] text-[10px]">Our Ethos</span>
          <h3 className="text-4xl md:text-6xl font-serif text-charcoal leading-tight">Profound Respect <br/> for the Produce.</h3>
          <p className="text-charcoal/60 text-lg leading-relaxed font-light italic">
            "Luxury is the ability to let time stand still. Our cuisine is rooted in the meticulous selection of seasonal ingredients, treated with modern technique but retaining the soul of Mediterranean heritage."
          </p>
        </div>
      </section>

      {/* Menus */}
      <section id="menus" className="py-40 bg-[#F2F1EE] px-6">
        <div className="max-w-7xl mx-auto text-center mb-24 space-y-4">
          <h4 className="text-gold font-bold uppercase tracking-[0.4em] text-[10px]">Bespoke Offerings</h4>
          <h3 className="text-4xl md:text-5xl font-serif text-charcoal italic">Seasonal Experiences</h3>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            { n: 'Tradition', p: '£65', d: 'Classic Mediterranean elegance.', img: IMAGES.MENU_1 },
            { n: 'Avant-Garde', p: '£85', d: 'High-technique meets local excellence.', img: IMAGES.MENU_2 },
            { n: 'Signature', p: '£100', d: 'The ultimate 8-course curated journey.', img: IMAGES.MENU_3 }
          ].map((m, i) => (
            <div key={i} className="bg-bone rounded-[3rem] shadow-sm border border-white overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="h-64 overflow-hidden">
                <img src={m.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={m.n} />
              </div>
              <div className="p-12 text-center">
                <h5 className="font-serif text-3xl mb-4">{m.n}</h5>
                <p className="text-charcoal font-bold text-xl mb-4">{m.p}</p>
                <p className="text-xs text-charcoal/50 mb-8 leading-relaxed h-10">{m.d}</p>
                <a href="#enquire" className="block w-full py-4 border border-gold/20 text-gold rounded-full text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-gold hover:text-white transition-all">Enquire</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Logistics */}
      <section id="service" className="py-40 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-32 items-center">
          <div className="space-y-16">
            <h3 className="text-4xl md:text-6xl font-serif text-charcoal leading-tight">Meticulous <br/> Logistics.</h3>
            <div className="space-y-12">
              <div className="flex gap-8">
                <div className="text-gold font-serif text-3xl opacity-30">01</div>
                <div>
                  <h6 className="font-bold text-charcoal text-[11px] uppercase tracking-widest mb-2">Immaculate Kitchen</h6>
                  <p className="text-charcoal/50 text-sm">We guarantee your kitchen will be left precisely as found. Cleaning is included.</p>
                </div>
              </div>
              <div className="flex gap-8">
                <div className="text-gold font-serif text-3xl opacity-30">02</div>
                <div>
                  <h6 className="font-bold text-charcoal text-[11px] uppercase tracking-widest mb-2">Bespoke Adjustments</h6>
                  <p className="text-charcoal/50 text-sm">Every menu is a conversation. Allergies are handled with mastery.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-[600px]">
            <img src={IMAGES.KITCHEN} className="w-full h-full object-cover rounded-3xl shadow-2xl" alt="Service Detail" />
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section id="enquire" className="py-40 bg-charcoal text-bone relative overflow-hidden min-h-[800px] flex items-center">
        <div className="absolute inset-0 opacity-10">
          <img src={IMAGES.FORM_BG} className="w-full h-full object-cover" alt="Background" />
        </div>
        <div className="max-w-2xl mx-auto text-center px-6 relative z-10 w-full">
          {formStatus === 'success' ? (
            <div className="animate-fade-up space-y-8 bg-bone/5 backdrop-blur-xl p-16 rounded-[3rem] border border-white/10">
              <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-4xl md:text-5xl font-serif italic text-white">Proposal Received.</h3>
              <p className="text-white/60 text-sm tracking-widest leading-relaxed">
                Thank you for choosing Artesano. <br/>
                Chef Charlie (charliechef13@gmail.com) will review your requirements and deliver a bespoke proposal within 24 hours.
              </p>
              <button 
                onClick={() => setFormStatus('idle')}
                className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold hover:text-white transition-colors"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <div className="space-y-16">
              <div className="space-y-6">
                <h4 className="text-gold font-bold uppercase tracking-[0.6em] text-[10px]">Private Bookings</h4>
                <h3 className="text-5xl md:text-7xl font-serif italic">Secure the Date.</h3>
              </div>
              <form className="grid gap-12 text-left" onSubmit={handleFormSubmit}>
                <div className="grid md:grid-cols-2 gap-12">
                  <input required className="bg-transparent border-b border-white/20 py-5 outline-none focus:border-gold transition-all w-full text-xs" placeholder="Full Name" />
                  <input required type="email" className="bg-transparent border-b border-white/20 py-5 outline-none focus:border-gold transition-all w-full text-xs" placeholder="Email Address" />
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                  <input required className="bg-transparent border-b border-white/20 py-5 outline-none focus:border-gold transition-all w-full text-xs" placeholder="Preferred Date (DD/MM/YYYY)" />
                  <input required type="number" min="1" className="bg-transparent border-b border-white/20 py-5 outline-none focus:border-gold transition-all w-full text-xs" placeholder="Number of Guests" />
                </div>
                <textarea className="bg-transparent border-b border-white/20 py-5 outline-none focus:border-gold transition-all w-full h-32 text-xs resize-none" placeholder="Special requirements (location, allergies, occasion...)"></textarea>
                <button 
                  disabled={formStatus === 'submitting'}
                  className="bg-gold text-white py-6 rounded-full font-bold uppercase tracking-[0.5em] text-[10px] shadow-2xl hover:bg-white hover:text-charcoal transition-all disabled:opacity-50 flex items-center justify-center gap-4"
                >
                  {formStatus === 'submitting' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending Proposal...
                    </>
                  ) : 'Submit Enquiry'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 bg-bone text-center border-t border-gold/5">
        <h2 className="font-serif text-3xl tracking-[0.8em] uppercase text-charcoal opacity-70 mb-12">Artesano</h2>
        <p className="text-[9px] uppercase tracking-[0.5em] text-charcoal/20">
          &copy; 2024 Artesano Private Chef | London & International
        </p>
      </footer>

      <Chatbot />
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}