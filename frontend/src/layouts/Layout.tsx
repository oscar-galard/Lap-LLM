import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(true);

  // Check if cookie consent has been given
  useEffect(() => {
    const consentGiven = localStorage.getItem('cookieConsent');
    if (consentGiven === 'true') {
      setShowCookieBanner(false);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowCookieBanner(false);
  };

  const handleDeclineCookies = () => {
    localStorage.setItem('cookieConsent', 'false');
    setShowCookieBanner(false);
  };

  return (
    <div className="text-green-500 font-mono overflow-x-hidden min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md py-4 px-6 border-b border-green-500/30">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl md:text-2xl font-bold tracking-tighter hover:text-green-400 transition-colors">
              ~Lap<span className="text-white">-llm</span>
            </Link>
          </div>

          {/* Hamburger Menu (Mobile) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-green-500 focus:outline-none"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="https://drive.google.com/file/d/1Z46nxG2am428YQOuAzO8zmp-07UpTr_i/view?usp=sharing" target="_blank" className="hover:text-white transition-colors">./Documento RAG</a>
            <Link to="/hardware" className="bg-green-500 text-black px-6 py-2 rounded-md font-bold hover:bg-green-400 transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)]">
              Analizar mi Hardware!
            </Link>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center space-y-8 md:hidden border-b border-green-500">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-2xl hover:text-green-400">~Lap-llm</Link>
          <a href="https://drive.google.com/file/d/1Z46nxG2am428YQOuAzO8zmp-07UpTr_i/view?usp=sharing" target="_blank" onClick={() => setIsMenuOpen(false)} className="text-2xl hover:text-white">Documento RAG</a>
          <Link to="/hardware" onClick={() => setIsMenuOpen(false)} className="bg-green-500 text-black px-8 py-3 rounded-md text-xl font-bold">
            EJECUTAR_ANALISIS
          </Link>
        </div>
      )}

      {/* Main content */}
      <main className="pt-20 flex-grow">
        {children}
      </main>

      {/* Cookie Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md py-4 px-6 border-t border-green-500/30">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-green-400 text-sm">
              Esta web usa cookies para su funcionamiento. 
              <Link to="/terminos" className="ml-1 underline hover:text-green-300" onClick={() => setIsMenuOpen(false)}>
                Terminos y condiciones
              </Link>
            </p>
            <div className="flex gap-2">
              <button 
                onClick={handleDeclineCookies}
                className="px-4 py-2 bg-gray-700 text-green-400 rounded-md text-sm hover:bg-gray-600 transition-colors"
              >
                Rechazar
              </button>
              <button 
                onClick={handleAcceptCookies}
                className="px-4 py-2 bg-green-500 text-black rounded-md text-sm font-bold hover:bg-green-400 transition-colors"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black/90 backdrop-blur-md py-6 px-6 border-t border-green-500/30 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-green-400 text-sm mb-2 md:mb-0">
              © {new Date().getFullYear()} Lap-LLM. 
            </p>
            <div className="flex space-x-6">
              <Link to="/terminos" className="text-green-400 hover:text-green-300 text-sm transition-colors">
                Terminos y condiciones
              </Link>
              <a href="https://github.com/oscar-galard/Lap-LLM" target="_blank" className="text-green-400 hover:text-green-300 text-sm transition-colors">
                GitHub
              </a>
              <a href="https://www.upwork.com/freelancers/~01b36188f36195a6fd" target="_blank" className="text-green-400 hover:text-green-300 text-sm transition-colors">
                Mi Upwork
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
