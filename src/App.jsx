import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home.jsx'
import Integrations from './pages/Integrations.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'

function App() {
	return (
		<>
			<nav style={{ display: 'flex', gap: 12, padding: 12 }}>
				<Link to="/">Home</Link>
				<Link to="/integrations">Integrations</Link>
				<Link to="/dashboard">Dashboard</Link>
				<Link to="/login">Login</Link>
			</nav>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/integrations" element={<Integrations />} />
				<Route path="/login" element={<Login />} />
				<Route path="/dashboard" element={<Dashboard />} />
			</Routes>
		</>
	)
}

export default App
