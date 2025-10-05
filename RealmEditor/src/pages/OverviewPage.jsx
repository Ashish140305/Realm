import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ProfilePanel from '../components/overview/ProfilePanel';
import MainContent from '../components/overview/MainContent';
import ProfileEditorModal from '../components/overview/ProfileEditorModal';
import SettingsDrawer from '../components/overview/SettingsDrawer';
import OverviewHeader from '../components/overview/OverviewHeader';
import ShortcutsModal from '../components/overview/ShortcutsModal';
import CommandPalette from '../components/overview/CommandPalette'; // Make sure this is imported
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { toast } from 'react-toastify';

export default function OverviewPage() {
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false); // State for Command Palette
  const [activeTab, setActiveTab] = useState('projects');

  // --- Handlers ---
  const handleEditProfileClick = () => setEditorOpen(true);
  const handleCloseModal = () => setEditorOpen(false);
  const handleProfileClick = () => {
    setSettingsOpen(false);
    setEditorOpen(true);
  };
  const handleShortcutsClick = () => {
    setSettingsOpen(false);
    setIsShortcutsModalOpen(true);
  };

  // --- Map of all actions ---
  const shortcutActions = {
    openSettings: () => setSettingsOpen(true),
    openShortcuts: handleShortcutsClick,
    openInbox: () => toast.info('Shortcut: Opening Inbox...'),
    startFocus: () => toast.info('Shortcut: Starting Focus Session...'),
    newProject: () => toast.info('Shortcut: Creating New Project...'),
    searchFiles: () => toast.info('Shortcut: Searching Files...'),
    // This now opens the actual command palette
    openCommandPalette: () => setIsCommandPaletteOpen(true),
  };

  // Use the hook with the new action map
  useKeyboardShortcuts(shortcutActions);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <OverviewHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSettingsClick={() => setSettingsOpen(true)}
        // Pass the handler to open the palette from the header
        onSearchClick={() => setIsCommandPaletteOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex flex-col md:flex-row md:space-x-8">
          <aside className="w-full md:w-1/4 flex-shrink-0">
            <ProfilePanel onEditProfileClick={handleEditProfileClick} />
          </aside>

          <div className="flex-grow mt-8 md:mt-0">
            <MainContent activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isEditorOpen && <ProfileEditorModal isVisible={isEditorOpen} onClose={handleCloseModal} />}
      </AnimatePresence>

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        onProfileClick={handleProfileClick}
        onShortcutsClick={handleShortcutsClick}
      />

      <AnimatePresence>
        {isShortcutsModalOpen && <ShortcutsModal isOpen={isShortcutsModalOpen} onClose={() => setIsShortcutsModalOpen(false)} />}
      </AnimatePresence>

      {/* CORRECTED IMPLEMENTATION: Always render CommandPalette and control with the 'isOpen' prop */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}