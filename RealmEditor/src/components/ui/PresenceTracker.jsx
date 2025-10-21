// src/components/ui/PresenceTracker.jsx
import { useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import useSettingsStore from '../../store/useSettingsStore';

export default function PresenceTracker() {
  const { profile, setOnlineUsers } = useSettingsStore();

  useEffect(() => {
    if (!profile.username) return;

    const channel = supabase.channel('online-users');

    const syncPresence = () => {
      const presenceState = channel.presenceState();
      const userIds = new Set();
      for (const key in presenceState) {
        presenceState[key].forEach(presence => {
          userIds.add(presence.username);
        });
      }
      setOnlineUsers(Array.from(userIds));
    };

    channel
      .on('presence', { event: 'sync' }, syncPresence)
      .on('presence', { event: 'join' }, syncPresence)
      .on('presence', { event: 'leave' }, syncPresence)
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ username: profile.username, online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile.username, setOnlineUsers]);

  return null; // This component does not render anything
}