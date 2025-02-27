import React, { useState, useEffect } from 'react';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    commission_rate: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:52079/services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:52079/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newService,
          price: parseFloat(newService.price),
          commission_rate: parseFloat(newService.commission_rate)
        }),
      });
      setNewService({ name: '', description: '', price: '', commission_rate: '' });
      fetchServices();
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  return (
    <div className="service-list">
      <h2>Services</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={newService.name}
          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newService.description}
          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newService.price}
          onChange={(e) => setNewService({ ...newService, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Commission Rate"
          value={newService.commission_rate}
          onChange={(e) => setNewService({ ...newService, commission_rate: e.target.value })}
        />
        <button type="submit">Add Service</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Commission Rate</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{service.name}</td>
              <td>{service.description}</td>
              <td>${service.price}</td>
              <td>{service.commission_rate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceList;