import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const CreateTaskModal = ({ projectId, onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post(`/projects/${projectId}/tasks`, {
        title,
        description,
        priority,
      });
      toast.success('Task created successfully');
      onCreated();
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create task';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: 16 }}>
      <h4>Create Task</h4>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
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

export default CreateTaskModal;