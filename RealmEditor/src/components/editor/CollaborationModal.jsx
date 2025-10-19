import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/CollaborationModal.css';

const CollaborationModal = ({ onClose, projectName }) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([
        { id: 'Alice', name: 'Alice', online: true },
        { id: 'Bob', name: 'Bob', online: true },
        { id: 'Charlie', name: 'Charlie', online: false },
    ]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleUserSelect = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleStartSession = async () => {
        try {
            const response = await fetch('/api/collaboration/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedUsers),
            });

            if (response.ok) {
                const session = await response.json();
                console.log('Collaboration session started:', session.id);
                // Navigate to the editor with the session ID in the URL
                navigate(`/editor/${projectName}?session=${session.id}`);
                onClose();
            } else {
                console.error('Failed to start collaboration session');
            }
        } catch (error) {
            console.error('Error starting collaboration session:', error);
        }
    };

    return (
        <div className="collaboration-modal-backdrop">
            <div className="collaboration-modal">
                <div className="modal-header">
                    <h2>Start a Collaboration Session</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="modal-body">
                    <p>Select users to collaborate with:</p>
                    <div className="user-list">
                        {users.map(user => (
                            <div
                                key={user.id}
                                className={`user-item ${selectedUsers.includes(user.id) ? 'selected' : ''} ${!user.online ? 'offline' : ''}`}
                                onClick={() => user.online && handleUserSelect(user.id)}
                            >
                                {user.name}
                                <span className={`status-dot ${user.online ? 'online' : 'offline'}`}></span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={handleStartSession} className="start-session-btn" disabled={selectedUsers.length === 0}>
                        Start Session
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CollaborationModal;