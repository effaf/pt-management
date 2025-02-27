import React, { useState, useEffect } from 'react';
import config from '../config';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    name: '',
    contact_info: '',
    treatment: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.API_BASE_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClient),
      });

      if (!response.ok) {
        throw new Error('Failed to create client');
      }

      setNewClient({
        name: '',
        contact_info: '',
        treatment: ''
      });
      setSuccess('Client added successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchClients();
    } catch (error) {
      setError('Error creating client: ' + error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleEdit = (client) => {
    setEditingId(client.id);
    setNewClient({
      name: client.name,
      contact_info: client.contact_info || '',
      treatment: client.treatment || ''
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/clients/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClient),
      });

      if (!response.ok) {
        throw new Error('Failed to update client');
      }

      setNewClient({
        name: '',
        contact_info: '',
        treatment: ''
      });
      setEditingId(null);
      setSuccess('Client updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchClients();
    } catch (error) {
      setError('Error updating client: ' + error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) {
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/clients/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete client');
      }

      setSuccess('Client deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchClients();
    } catch (error) {
      setError('Error deleting client: ' + error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div className="client-list">
      <h2>Clients</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(); } : handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            value={newClient.name}
            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Contact Info (Email, Phone, etc.)"
            value={newClient.contact_info}
            onChange={(e) => setNewClient({ ...newClient, contact_info: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Treatment Notes"
            value={newClient.treatment}
            onChange={(e) => setNewClient({ ...newClient, treatment: e.target.value })}
          />
        </div>
        <div className="form-actions">
          <button type="submit">
            {editingId ? 'Update Client' : 'Add Client'}
          </button>
          {editingId && (
            <button type="button" onClick={() => {
              setEditingId(null);
              setNewClient({
                name: '',
                contact_info: '',
                treatment: ''
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
            <th>Treatment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.name}</td>
              <td>{client.contact_info}</td>
              <td>{client.treatment}</td>
              <td>
                <button onClick={() => handleEdit(client)}>Edit</button>
                <button onClick={() => handleDelete(client.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientList;