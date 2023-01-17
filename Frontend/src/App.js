import './App.css'
import Login from './Components/Login/Login'
import Reports from './Components/Reports/PhysicalRegister/PhysicalRegister'
import Movements from './Components/Movements/Movements'
import Register from './Components/Register/Register'
import InwardNew from './Components/Inward/New/New'
import InwardOld from './Components/Inward/Old/Old'
import Dashboard from './Components/DashBoard/Dashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
function App() {
  return (
    <div className="App ">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin/:newform" element={<Dashboard />} />
          <Route path="/admin" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
