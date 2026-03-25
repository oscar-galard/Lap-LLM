import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Hardware from './pages/Hardware'
import './App.css'

function App() {
  return (
        <Router>
	  <div className="min-h-screen bg-gray-50">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/hardware" element={<Hardware />} />
                </Routes>
	  </div>
        </Router>
  )
}

export default App
