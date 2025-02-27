import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalServicers: 0,
    totalClients: 0,
    totalServices: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [servicers, clients, services] = await Promise.all([
          fetch('http://localhost:52079/servicers').then(res => res.json()),
          fetch('http://localhost:52079/clients').then(res => res.json()),
          fetch('http://localhost:52079/services').then(res => res.json())
        ]);

        setStats({
          totalServicers: servicers.length,
          totalClients: clients.length,
          totalServices: services.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Servicers</h3>
          <p>{stats.totalServicers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Clients</h3>
          <p>{stats.totalClients}</p>
        </div>
        <div className="stat-card">
          <h3>Total Services</h3>
          <p>{stats.totalServices}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;