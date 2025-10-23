import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { UserPlus, X } from 'lucide-react';

const FollowListModal = ({ isOpen, onClose, currentUsername }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async () => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            return;
        }
        try {
            const response = await axios.get(`/api/collaboration/search?query=${searchTerm}`);
            // ✅ DEFINITIVE FIX: Ensure the result is always an array.
            setSearchResults(response.data || []);
        } catch (error) {
            toast.error('Failed to search for users.');
            setSearchResults([]); // Reset to empty array on error
        }
    };

    const handleFollow = async (followedUsername) => {
        try {
            await axios.post('/api/collaboration/follow', {
                followerUsername: currentUsername,
                followedUsername: followedUsername,
            });
            toast.success(`You are now following ${followedUsername}`);
        } catch (error) {
            toast.error(error.response?.data || 'Failed to follow user.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-card text-foreground rounded-lg shadow-xl w-full max-w-md p-6 relative animate-in fade-in-0 zoom-in-95">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Find and Follow Users</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex gap-2 mb-4">
                    <Input
                        type="text"
                        placeholder="Search by username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch}>Search</Button>
                </div>
                <div className="search-results space-y-2 max-h-60 overflow-y-auto">
                    {searchResults.length > 0 ? (
                        searchResults.map((user) => (
                            <div key={user.username} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                                <div>
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => handleFollow(user.username)}>
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Follow
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground pt-4">No users found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowListModal;