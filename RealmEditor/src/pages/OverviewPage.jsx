import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ProfilePanel from '../components/overview/ProfilePanel';
import MainContent from '../components/overview/MainContent';
import ProfileEditorModal from '../components/overview/ProfileEditorModal';
import SettingsDrawer from '../components/overview/SettingsDrawer';
import OverviewHeader from '../components/overview/OverviewHeader';

export default function OverviewPage() {
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');

  // This function will be passed to the ProfilePanel to open the modal
  const handleEditProfileClick = () => setEditorOpen(true);
  
  // This function will be passed to the modal to close it
  const handleCloseModal = () => setEditorOpen(false);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <OverviewHeader 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onSettingsClick={() => setSettingsOpen(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex flex-col md:flex-row md:space-x-8">
          <aside className="w-full md:w-1/4 flex-shrink-0">
            {/* The function to open the modal is passed here */}
            <ProfilePanel onEditProfileClick={handleEditProfileClick} />
          </aside>
          
          <div className="flex-grow mt-8 md:mt-0">
            <MainContent activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      </main>

      {/* The modal's visibility is controlled by isEditorOpen and it receives the close function */}
      <AnimatePresence>
        {isEditorOpen && <ProfileEditorModal isVisible={isEditorOpen} onClose={handleCloseModal} />}
      </AnimatePresence>
      
      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}