import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const EditTaskModal = ({ task, onClose, onUpdated }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority || 'medium');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.put(`/tasks/${task.id}`, {
        title,
        description,
        status,
        priority,
      });
      toast.success('Task updated successfully');
      onUpdated();
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update task';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: 16 }}>
      <h4>Edit Task</h4>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <br />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
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
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditTaskModal;