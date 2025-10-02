import React, { useState } from 'react';
import ProfilePanel from '../components/overview/ProfilePanel';
import MainContent from '../components/overview/MainContent';
import ProfileEditorModal from '../components/overview/ProfileEditorModal';
import SettingsDrawer from '../components/overview/SettingsDrawer';

export default function OverviewPage() {
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <ProfileEditorModal isOpen={isEditorOpen} onClose={() => setEditorOpen(false)} />
      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
      <div className="min-h-screen bg-gray-dark text-gray-text-bright p-4 md:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <ProfilePanel onEditProfileClick={() => setEditorOpen(true)} />
          </aside>
          <main className="lg:col-span-9">
            <MainContent onSettingsClick={() => setSettingsOpen(true)} />
          </main>
        </div>
      </div>
    </>
  );
}