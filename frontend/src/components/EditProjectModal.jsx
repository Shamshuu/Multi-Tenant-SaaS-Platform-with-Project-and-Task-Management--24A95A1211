import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const EditProjectModal = ({ project, onClose, onUpdated }) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || '');
  const [status, setStatus] = useState(project.status);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.put(`/projects/${project.id}`, {
        name,
        description,
        status,
      });
      toast.success('Project updated successfully');
      onUpdated();
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Update failed';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: 16 }}>
      <h3>Edit Project</h3>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <br />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
          <option value="completed">Completed</option>
        </select>
        <br />
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProjectModal;