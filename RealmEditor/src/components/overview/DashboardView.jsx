import React from 'react';
import { motion } from 'framer-motion';
import ActivityDashboard from './ActivityDashboard';
import ActivityFeed from './ActivityFeed';
import QuickActionsPanel from './QuickActionsPanel';
import MyTasksPanel from './MyTasksPanel';

export default function DashboardView() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            // This is the main container for the new dashboard layout
            className="space-y-8"
        >
            {/* Top row with Quick Actions and My Tasks side-by-side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <QuickActionsPanel />
                <MyTasksPanel />
            </div>

            {/* The new, elongated Activity Dashboard */}
            <ActivityDashboard />

            {/* The new, elongated Activity Feed */}
            <ActivityFeed />
        </motion.div>
    );
}