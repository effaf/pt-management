import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [servicers, setServicers] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const servicersResponse = await fetch('http://localhost:50656/servicers');
    const servicersData = await servicersResponse.json();
    setServicers(servicersData);

    const clientsResponse = await fetch('http://localhost:50656/clients');
    const clientsData = await clientsResponse.json();
    setClients(clientsData);

    const servicesResponse = await fetch('http://localhost:50656/services');
    const servicesData = await servicesResponse.json();
    setServices(servicesData);
  };

  return (
    <div className="App">
      <h1>Service Management Application</h1>
      <div className="dashboard">
        <h2>Dashboard</h2>
        <p>Total Servicers: {servicers.length}</p>
        <p>Total Clients: {clients.length}</p>
        <p>Total Services: {services.length}</p>
      </div>
      <div className="servicers">
        <h2>Servicers</h2>
        <ul>
          {servicers.map(servicer => (
            <li key={servicer.id}>{servicer.name} - {servicer.specialties}</li>
          ))}
        </ul>
      </div>
      <div className="clients">
        <h2>Clients</h2>
        <ul>
          {clients.map(client => (
            <li key={client.id}>{client.name} - {client.treatment}</li>
          ))}
        </ul>
      </div>
      <div className="services">
        <h2>Recent Services</h2>
        <ul>
          {services.slice(0, 5).map(service => (
            <li key={service.id}>
              {service.type} - ${service.fee} - {new Date(service.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;