import React, { useState, useEffect } from 'react';
import config from '../config';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [servicers, setServicers] = useState([]);
  const [newService, setNewService] = useState({
    client_id: '',
    servicer_id: '',
    service_type: '',
    duration: '',
    fee: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchServices();
    fetchClients();
    fetchServicers();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/services`);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data);
    } catch (error) {
      setError('Error fetching services: ' + error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/clients`);
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      setError('Error fetching clients: ' + error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const fetchServicers = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/servicers`);
      if (!response.ok) {
        throw new Error('Failed to fetch servicers');
      }
      const data = await response.json();
      setServicers(data);
    } catch (error) {
      setError('Error fetching servicers: ' + error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.API_BASE_URL}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newService,
          duration: parseInt(newService.duration),
          fee: parseFloat(newService.fee)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create service');
      }

      setNewService({
        client_id: '',
        servicer_id: '',
        service_type: '',
        duration: '',
        fee: '',
      });
      setSuccess('Service added successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchServices();
    } catch (error) {
      setError('Error creating service: ' + error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setNewService({
      client_id: service.client.id.toString(),
      servicer_id: service.servicer.id.toString(),
      service_type: service.service_type,
      duration: service.duration.toString(),
      fee: service.fee.toString(),
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/services/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newService,
          duration: parseInt(newService.duration),
          fee: parseFloat(newService.fee)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update service');
      }

      setNewService({
        client_id: '',
        servicer_id: '',
        service_type: '',
        duration: '',
        fee: '',
      });
      setEditingId(null);
      setSuccess('Service updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchServices();
    } catch (error) {
      setError('Error updating service: ' + error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/services/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete service');
      }

      setSuccess('Service deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchServices();
    } catch (error) {
      setError('Error deleting service: ' + error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div className="service-list">
      <h2>Services</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(); } : handleSubmit}>
        <div className="form-group">
          <select
            value={newService.client_id}
            onChange={(e) => setNewService({ ...newService, client_id: e.target.value })}
            required
          >
            <option value="">Select Client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <select
            value={newService.servicer_id}
            onChange={(e) => setNewService({ ...newService, servicer_id: e.target.value })}
            required
          >
            <option value="">Select Servicer</option>
            {servicers.map((servicer) => (
              <option key={servicer.id} value={servicer.id}>
                {servicer.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Service Type"
            value={newService.service_type}
            onChange={(e) => setNewService({ ...newService, service_type: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={newService.duration}
            onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            step="0.01"
            placeholder="Fee"
            value={newService.fee}
            onChange={(e) => setNewService({ ...newService, fee: e.target.value })}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit">
            {editingId ? 'Update Service' : 'Add Service'}
          </button>
          {editingId && (
            <button type="button" onClick={() => {
              setEditingId(null);
              setNewService({
                client_id: '',
                servicer_id: '',
                service_type: '',
                duration: '',
                fee: '',
              });
            }}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Client</th>
            <th>Servicer</th>
            <th>Service Type</th>
            <th>Duration</th>
            <th>Fee</th>
            <th>Commission</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{new Date(service.date).toLocaleDateString()}</td>
              <td>{service.client.name}</td>
              <td>{service.servicer.name}</td>
              <td>{service.service_type}</td>
              <td>{service.duration} mins</td>
              <td>${service.fee.toFixed(2)}</td>
              <td>${service.commission.toFixed(2)}</td>
              <td>
                <button onClick={() => handleEdit(service)}>Edit</button>
                <button onClick={() => handleDelete(service.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceList;