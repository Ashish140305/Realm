import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ProfilePanel from '../components/overview/ProfilePanel';
import MainContent from '../components/overview/MainContent';
import ProfileEditorModal from '../components/overview/ProfileEditorModal';
import SettingsDrawer from '../components/overview/SettingsDrawer';
import OverviewHeader from '../components/overview/OverviewHeader';
import CreateProjectModal from '../components/overview/CreateProjectModal';
import useSettingsStore from '../store/useSettingsStore';

export default function OverviewPage() {
    const [isEditorOpen, setEditorOpen] = useState(false);
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [isCreateProjectOpen, setCreateProjectOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [projects, setProjects] = useState([]);
    const { profile } = useSettingsStore();

    const fetchProjects = useCallback(async () => {
        if (!profile.username) return;
        try {
            // Use relative path for the API call
            const response = await fetch(`/api/projects/${profile.username}`);
            if (response.ok) {
                const data = await response.json();
                setProjects(data);
            } else {
                console.error("Response not OK:", response.status);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    }, [profile.username]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleEditProfileClick = () => setEditorOpen(true);
    const handleCloseModal = () => setEditorOpen(false);
    const handleNewProjectClick = () => setCreateProjectOpen(true);
    const handleCloseCreateProjectModal = () => setCreateProjectOpen(false);

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary">
            <OverviewHeader
                onSettingsClick={() => setSettingsOpen(true)}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
                <div className="flex flex-col md:flex-row md:space-x-8">
                    <aside className="w-full md:w-1/4 flex-shrink-0">
                        <ProfilePanel onEditProfileClick={handleEditProfileClick} />
                    </aside>

                    <div className="flex-grow mt-8 md:mt-0">
                        <MainContent
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            onNewProjectClick={handleNewProjectClick}
                            projects={projects}
                        />
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {isEditorOpen && <ProfileEditorModal isVisible={isEditorOpen} onClose={handleCloseModal} />}
                {isCreateProjectOpen && (
                    <CreateProjectModal
                        isVisible={isCreateProjectOpen}
                        onClose={handleCloseCreateProjectModal}
                        onProjectCreated={fetchProjects}
                    />
                )}
            </AnimatePresence>

            <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
        </div>
    );
}