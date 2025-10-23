// RealmEditor/src/components/editor/CollaborationModal.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSettingsStore from '../../store/useSettingsStore';
import '../../styles/CollaborationModal.css';

const CollaborationModal = ({ onClose, projectName }) => {
    const navigate = useNavigate();
    const { profile } = useSettingsStore();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!profile.username) return;
            // This endpoint should return all users except the current one.
            const response = await fetch(`/api/profile/users`);
            if (response.ok) {
                const allUsers = await response.json();
                // Ensure profile is loaded and filter out the current user
                const otherUsers = allUsers.filter(user => user.username !== profile.username);
                setUsers(otherUsers);
            }
        };

        fetchUsers();
    }, [profile.username]);
    
    // This function now handles both selecting a user and starting the session
    const handleStartSessionWithUser = async (collaboratorUsername) => {
        try {
            const response = await fetch('/api/collaboration/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // The body now contains only the current user and the selected collaborator
                body: JSON.stringify([profile.username, collaboratorUsername]),
            });

            if (response.ok) {
                const session = await response.json();
                // Navigate to the editor with the new session ID
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
        <div className="collaboration-modal-backdrop" onClick={onClose}>
            <div className="collaboration-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Start a Collaboration Session</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="modal-body">
                    <p>Select a user to start a session:</p>
                    <div className="user-list">
                        {users.map(user => (
                            <div
                                key={user.username} // Use a unique key like username
                                className="user-item"
                                // On click, immediately start the session with this user
                                onClick={() => handleStartSessionWithUser(user.username)}
                            >
                                {user.name} (@{user.username})
                            </div>
                        ))}
                    </div>
                </div>
                {/* The footer with the "Start Session" button is removed */}
            </div>
        </div>
    );
};

export default CollaborationModal;