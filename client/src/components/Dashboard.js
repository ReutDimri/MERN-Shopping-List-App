import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [newListTitle, setNewListTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {fetchNotes();}, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get('/api/notes');
      setNotes(res.data.notes);} 
    catch (error) {console.error('Error fetching notes:', error);} 
    finally {setLoading(false);}
  };

  const createNewList = async (e) => {e.preventDefault();
    if (!newListTitle.trim()) return;
    setCreating(true);
    try {
      const res = await axios.post('/api/notes', {title: newListTitle, items: []});
      setNotes([res.data.note, ...notes]);
      setNewListTitle('');} 
    catch (error) {console.error('Error creating list:', error);} 
    finally {setCreating(false);}
  };

  const deleteList = async (id) => {
    if (!window.confirm('Are you sure you want to delete this list?')) return;
    try {
      await axios.delete(`/api/notes/${id}`);
      setNotes(notes.filter(note => note._id !== id));} 
    catch (error) {console.error('Error deleting list:', error);}
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'});};
  if (loading) {return <div className="loading">Loading...</div>;}

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-top">
            <h1>My Shopping Lists</h1>
            <span className="user-welcome">Welcome, {user?.username}</span>
        </div>
        <button onClick={logout} className="btn-logout">Logout</button>
      </header>
      <div className="create-list-form">
        <form onSubmit={createNewList}>
          <input
            type="text"
            placeholder="Enter list name..."
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            disabled={creating}
          />
          <button 
            type="submit" 
            className="btn-primary"
            disabled={creating || !newListTitle.trim()}
          >
            {creating ? 'Creating...' : 'Create List'}
          </button>
        </form>
      </div>
      <div className="lists-grid">
        {notes.length === 0 ? (
          <div className="no-lists"><h3>No shopping lists yet</h3>
            <p>Create your first list above to get started!</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note._id} className={`list-card ${note.completed ? 'completed' : ''}`}>
              <div className="list-header"> <h3>{note.title}</h3>
                <button onClick={() => deleteList(note._id)}
                  className="delete-btn"> ✕ </button>
              </div>
              <div className="list-info">
                <p>Items: {note.items.length}</p>
                <p>Completed: {note.items.filter(item => item.completed).length}</p>
                <p className="date">Created: {formatDate(note.createdAt)}</p>
              </div>
              <div className="list-actions">
                <Link to={`/list/${note._id}`} className="btn-primary"> Open List </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;