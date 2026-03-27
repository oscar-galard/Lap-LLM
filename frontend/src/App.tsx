import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Landing from './pages/Landing'
import Hardware from './pages/Hardware'
import Terminos from './pages/terminos'
import Layout from './layouts/Layout'
import './App.css'

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
        <Router>
          <ScrollToTop />
          {/* CRT overlay effects */}
          <div className="crt-overlay"></div>

	  <Layout>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/hardware" element={<Hardware />} />
                    <Route path="/terminos" element={<Terminos />} />
                </Routes>
	  </Layout>
        </Router>
  )
}

export default App
