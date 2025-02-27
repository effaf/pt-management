import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import ServicerList from './components/ServicerList';
import ClientList from './components/ClientList';
import ServiceList from './components/ServiceList';


function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/servicers">Servicers</Link></li>
            <li><Link to="/clients">Clients</Link></li>
            <li><Link to="/services">Services</Link></li>
          </ul>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/servicers" element={<ServicerList />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/services" element={<ServiceList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;