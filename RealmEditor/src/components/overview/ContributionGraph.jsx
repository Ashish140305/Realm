import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import useSettingsStore from '../../store/useSettingsStore';
import { Zap, Activity } from 'lucide-react';

// --- Helper Functions ---
const generateDummyData = () => {
    const data = new Map();
    for (let i = 0; i < 365; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        data.set(dateString, { count: Math.floor(Math.random() * 30) });
    }
    return data;
};

// --- Sub-Components for the new design ---
const StatCard = ({ label, value, icon }) => (
    <div className="flex items-center">
        {icon}
        <div>
            <p className="text-sm text-text-secondary">{label}</p>
            <p className="font-semibold text-text-primary">{value}</p>
        </div>
    </div>
);

// --- The Main Component ---
const ContributionGraph = () => {
    const contributions = generateDummyData();
    const accentColor = useSettingsStore((state) => state.accentColor);
    const [tooltip, setTooltip] = useState(null);

    const { activityData, totalContributions, productiveDay, streak } = useMemo(() => {
        const data = [];
        let maxCount = 0;
        const today = new Date();
        const dayCounts = [0,0,0,0,0,0,0];
        let currentStreak = 0;
        let streakBroken = false;
        
        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - (364 - i));
            const dateString = date.toISOString().split('T')[0];
            const count = contributions.get(dateString)?.count || 0;
            if (count > maxCount) maxCount = count;
            
            dayCounts[date.getDay()] += count;

            if (i >= 365 - 7 && !streakBroken) { // Check streak for the last 7 days from the end of the data
                if (count > 0) {
                    currentStreak++;
                } else {
                    streakBroken = true;
                }
            }

            data.push({ date: dateString, count });
        }
        
        const mostProductiveDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        const total = Array.from(contributions.values()).reduce((sum, day) => sum + day.count, 0);

        return {
            activityData: data.map(day => ({
                ...day,
                height: maxCount === 0 ? 1 : (day.count / maxCount) * 100,
            })),
            totalContributions: total,
            productiveDay: daysOfWeek[mostProductiveDayIndex],
            streak: currentStreak
        };
    }, [contributions]);

    return (
        <div className="bg-card-background p-4 rounded-xl shadow-lg">
            {/* Top section with stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-2">
                     <h3 className="text-md font-semibold text-text-primary">Activity Overview</h3>
                     <p className="text-sm text-text-secondary">{totalContributions} contributions this year</p>
                </div>
                <StatCard label="Most Productive" value={productiveDay} icon={<Activity size={20} className="text-accent mr-3" />} />
                <StatCard label="Current Streak" value={`${streak} Days`} icon={<Zap size={20} className="text-accent mr-3" />} />
            </div>

            {/* The elongated skyline graph */}
            <div
                className="relative w-full h-28 flex items-end justify-start"
                onMouseLeave={() => setTooltip(null)}
            >
                {activityData.map((day, index) => (
                    <div
                        key={day.date}
                        className="w-[0.27%] h-full flex items-end"
                        onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltip({
                                content: `${day.count} contributions on ${day.date}`,
                                x: rect.left + window.scrollX,
                                y: rect.top + window.scrollY,
                            });
                        }}
                    >
                        <motion.div
                            className="w-full rounded-t-full"
                            style={{ backgroundColor: accentColor, opacity: 0.1 + (day.height / 100) * 0.9 }}
                            initial={{ height: '1%' }}
                            animate={{ height: `${day.height}%` }}
                            transition={{ delay: index * 0.005, duration: 0.8, ease: "circOut" }}
                        />
                    </div>
                ))}
                {tooltip && (
                    <div
                        className="absolute z-10 bg-background text-text-primary text-xs rounded-md px-2 py-1 shadow-lg pointer-events-none -translate-x-1/2"
                        style={{ top: `${tooltip.y - 35}px`, left: `${tooltip.x}px` }}
                    >
                        {tooltip.content}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContributionGraph;