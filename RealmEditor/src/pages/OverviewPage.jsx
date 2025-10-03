import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ProfilePanel from '../components/overview/ProfilePanel';
import MainContent from '../components/overview/MainContent';
import ProfileEditorModal from '../components/overview/ProfileEditorModal';
import SettingsDrawer from '../components/overview/SettingsDrawer';

// This component now correctly uses the theme's solid background.
export default function OverviewPage() {
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isEditorOpen && <ProfileEditorModal isOpen={isEditorOpen} onClose={() => setEditorOpen(false)} />}
      </AnimatePresence>
      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* This main container correctly applies the solid background from your theme */ }
      <div className="min-h-screen w-full bg-bg-primary text-text-primary">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-12 gap-8">
            <aside className="col-span-12 lg:col-span-3">
              <ProfilePanel onEditProfileClick={() => setEditorOpen(true)} />
            </aside>
            <main className="col-span-12 lg:col-span-9">
              <MainContent onSettingsClick={() => setSettingsOpen(true)} />
            </main>
          </div>
        </div>
      </div>
    </>
  );
}