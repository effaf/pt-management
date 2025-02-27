import React, { useState, useEffect } from 'react';
import config from '../config';

const ServicerList = () => {
  const [servicers, setServicers] = useState([]);
  const [newServicer, setNewServicer] = useState({
    name: '',
    contact_info: '',
    specialties: '',
    commission_rate: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchServicers();
  }, []);

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
      const response = await fetch(`${config.API_BASE_URL}/servicers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newServicer,
          rate_per_hour: parseFloat(newServicer.rate_per_hour)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create servicer');
      }

      setNewServicer({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        rate_per_hour: ''
      });
      setSuccess('Servicer added successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchServicers();
    } catch (error) {
      setError('Error creating servicer: ' + error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleEdit = (servicer) => {
    setEditingId(servicer.id);
    setNewServicer({
      name: servicer.name,
      contact_info: servicer.contact_info || '',
      specialties: servicer.specialties || '',
      commission_rate: servicer.commission_rate?.toString() || ''
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/servicers/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newServicer,
          rate_per_hour: parseFloat(newServicer.rate_per_hour)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update servicer');
      }

      setNewServicer({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        rate_per_hour: ''
      });
      setEditingId(null);
      setSuccess('Servicer updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchServicers();
    } catch (error) {
      setError('Error updating servicer: ' + error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this servicer?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:52079/servicers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete servicer');
      }

      setSuccess('Servicer deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchServicers();
    } catch (error) {
      setError('Error deleting servicer: ' + error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div className="servicer-list">
      <h2>Servicers</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(); } : handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            value={newServicer.name}
            onChange={(e) => setNewServicer({ ...newServicer, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Contact Info (Email, Phone, etc.)"
            value={newServicer.contact_info}
            onChange={(e) => setNewServicer({ ...newServicer, contact_info: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Specialties"
            value={newServicer.specialties}
            onChange={(e) => setNewServicer({ ...newServicer, specialties: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            step="0.01"
            placeholder="Commission Rate (%)"
            value={newServicer.commission_rate}
            onChange={(e) => setNewServicer({ ...newServicer, commission_rate: e.target.value })}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit">
            {editingId ? 'Update Servicer' : 'Add Servicer'}
          </button>
          {editingId && (
            <button type="button" onClick={() => {
              setEditingId(null);
              setNewServicer({
                name: '',
                contact_info: '',
                specialties: '',
                commission_rate: ''
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
            <th>Name</th>
            <th>Contact Info</th>
            <th>Specialties</th>
            <th>Commission Rate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {servicers.map((servicer) => (
            <tr key={servicer.id}>
              <td>{servicer.name}</td>
              <td>{servicer.contact_info}</td>
              <td>{servicer.specialties}</td>
              <td>{servicer.commission_rate}%</td>
              <td>
                <button onClick={() => handleEdit(servicer)}>Edit</button>
                <button onClick={() => handleDelete(servicer.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServicerList;
