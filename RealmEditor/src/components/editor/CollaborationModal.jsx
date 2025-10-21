import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import useSettingsStore from '../../store/useSettingsStore';
import '../../styles/CollaborationModal.css';

const CollaborationModal = ({ onClose, projectName }) => {
    const navigate = useNavigate();
    const { profile } = useSettingsStore();
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch(`/api/collaboration/users`);
            if (response.ok) {
                const allUsers = await response.json();
                const otherUsers = allUsers.filter(user => user.userId !== profile.username);
                setUsers(otherUsers);
            }
        };

        fetchUsers();
    }, [profile.username]);

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
                const channel = supabase.channel(`session:${session.id}`);
                channel.subscribe(async (status) => {
                    if (status === 'SUBSCRIBED') {
                        await channel.send({
                            type: 'broadcast',
                            event: 'session-start',
                            payload: { message: `Session started for project ${projectName}` },
                        });
                        navigate(`/editor/${projectName}?session=${session.id}`);
                        onClose();
                    }
                });
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
                                className={`user-item ${selectedUsers.includes(user.userId) ? 'selected' : ''}`}
                                onClick={() => handleUserSelect(user.userId)}
                            >
                                {user.userId}
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