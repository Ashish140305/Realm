import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const EndSessionButton = ({ sessionId }) => {
    const navigate = useNavigate();
    const { projectName } = useParams();

    const handleEndSession = async () => {
        const channel = supabase.channel(`session:${sessionId}`);
        await channel.send({
            type: 'broadcast',
            event: 'session-end',
            payload: { message: 'The session has ended.' },
        });
        supabase.removeChannel(channel);
        // Navigate to the same page but without the session parameter
        navigate(`/editor/${projectName}`);
    };

    return (
        <button
            onClick={handleEndSession}
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                padding: '10px 20px',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                zIndex: 1000
            }}
        >
            End Session
        </button>
    );
};

export default EndSessionButton;