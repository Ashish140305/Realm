import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

// Dummy data for tasks
const dummyTasks = [
    { id: 1, text: 'Review PR #78: Activity Dashboard UI', completed: false },
    { id: 2, text: 'Fix bug in theme state management', completed: false },
    { id: 3, text: 'Deploy backend schema updates', completed: true },
];

const MyTasksPanel = () => {
    const tasks = dummyTasks;

    return (
        <div className="bg-card-background p-4 rounded-xl shadow-lg">
            <h3 className="text-md font-semibold text-text-primary mb-4">
                My Tasks
            </h3>
            <div className="space-y-3">
                {tasks.map((task) => (
                    <div key={task.id} className="flex items-center text-sm">
                        <motion.button whileTap={{ scale: 0.9 }}>
                            <CheckCircle size={18} className={`${task.completed ? 'text-green-500' : 'text-text-secondary'} transition-colors`} />
                        </motion.button>
                        <span className={`ml-3 ${task.completed ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                            {task.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyTasksPanel;