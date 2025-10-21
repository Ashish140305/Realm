import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const SessionNotification = () => {
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const channel = supabase.channel('session-notifications');

        channel
            .on('broadcast', { event: 'session-start' }, ({ payload }) => {
                setNotification(payload.message);
                setTimeout(() => setNotification(null), 5000);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (!notification) {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '10px 20px',
            backgroundColor: 'lightblue',
            borderRadius: '5px',
            zIndex: 1000,
        }}>
            {notification}
        </div>
    );
};

export default SessionNotification;