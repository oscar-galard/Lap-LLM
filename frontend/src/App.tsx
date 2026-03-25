import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Hardware from './pages/Hardware'
import Terminos from './pages/terminos'
import Layout from './layouts/Layout'
import './App.css'

function App() {
  return (
        <Router>
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
