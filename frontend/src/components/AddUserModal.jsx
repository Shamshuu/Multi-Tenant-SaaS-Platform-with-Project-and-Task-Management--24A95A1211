import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AddUserModal = ({ tenantId, onClose, onCreated }) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post(`/tenants/${tenantId}/users`, {
        email,
        fullName,
        password,
        role,
      });
      toast.success('User created successfully');
      onCreated();
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add user';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: 16 }}>
      <h3>Add User</h3>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="tenant_admin">Tenant Admin</option>
        </select>
        <br />
        <button type="submit">Create</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddUserModal;