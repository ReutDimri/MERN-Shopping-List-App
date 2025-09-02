import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ShoppingList = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', icon: '🛍️' });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const defaultIcons = [
    '🍎', '🥛', '🍞', '🧀', '🥩', '🐟', '🥚', '🥔',
    '🥕', '🥬', '🍌', '🍊', '🍇', '🍓', '🥝', '🥑',
    '🍕', '🍝', '🍚', '🍜', '☕', '🧴', '🧽', '🛍️'
  ];

  useEffect(() => {fetchNote();}, [id]);

  const fetchNote = async () => {
    try {
      const res = await axios.get(`/api/notes/${id}`);
      setNote(res.data.note);} 
    catch (error) {
      console.error('Error fetching note:', error);} 
    finally {
      setLoading(false);}
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    setAdding(true);
    try {
      const res = await axios.post(`/api/notes/${id}/items`, newItem);
      setNote(res.data.note);
      setNewItem({ name: '', icon: '🛍️' });} 
    catch (error) {
      console.error('Error adding item:', error);} 
    finally {
      setAdding(false);}
  };

  const toggleItemComplete = async (itemId) => {
    try {
      const res = await axios.patch(`/api/notes/${id}/items/${itemId}/toggle`);
      setNote(res.data.note); }
    catch (error) { console.error('Error toggling item:', error); }
  };

  const deleteItem = async (itemId) => {
    try {
      const res = await axios.delete(`/api/notes/${id}/items/${itemId}`);
      setNote(res.data.note);} 
    catch (error) {console.error('Error deleting item:', error);}
  };

  const completeList = async () => {
    try {
      const res = await axios.patch(`/api/notes/${id}/complete`);
      setNote(res.data.note);} 
    catch (error) {console.error('Error completing list:', error);}
  };

  if (loading) {return <div className="loading">Loading shopping list...</div>;}
  if (!note) {return <div className="error">Shopping list not found</div>;}

  return (
    <div className="shopping-list">
      <header className="list-header">
        <Link to="/dashboard" className="back-btn">← Back to Lists</Link>
        <h1>{note.title}</h1> 
        <p className="date">Created: {new Date(note.createdAt).toLocaleDateString()}</p>
      </header>
      <div className="add-item-form">
        <form onSubmit={addItem}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Enter item name..."
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              disabled={adding}
            />
            <select 
              value={newItem.icon} 
              onChange={(e) => setNewItem({...newItem, icon: e.target.value})}
              disabled={adding}
            >
              {defaultIcons.map((icon, index) => (
                <option key={index} value={icon}>{icon}</option>
              ))}
            </select>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={adding || !newItem.name.trim()}
            >
              {adding ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
      <div className="items-grid">
        {note.items.length === 0 ? (<div className="no-items">
            <h3>No items yet</h3> <p>Add your first item above!</p></div>
        ) : (
          note.items.map((item) => (
            <div key={item._id} 
              className={`item-card ${item.completed ? 'completed' : ''}`}>
              <div className="item-icon">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="item-image"
                  />
                ) : (
                  <span className="icon">{item.icon}</span>
                )}
              </div>
              <div className="item-content">
                <span className="item-name">{item.name}</span>
                <div className="item-actions">
                  <button
                    onClick={() => toggleItemComplete(item._id)}
                    className={`complete-btn ${item.completed ? 'completed' : ''}`}
                  >
                    {item.completed ? '✓' : '○'}
                  </button>
                  <button
                    onClick={() => deleteItem(item._id)}
                    className="delete-btn"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="list-actions">
        <button 
          onClick={completeList}
          className="btn-success"
          disabled={note.completed}
        >
          {note.completed ? 'List Completed ✓' : 'Mark List Complete'}
        </button>
      </div>
    </div>
  );
};

export default ShoppingList;