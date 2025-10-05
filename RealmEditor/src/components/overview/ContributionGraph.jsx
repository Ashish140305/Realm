import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import useSettingsStore from '../../store/useSettingsStore';
import { Zap, Activity, ChevronDown } from 'lucide-react';

const generateDummyData = (startYear, endYear) => {
    const data = new Map();
    let currentDate = new Date(startYear, 0, 1);
    const endDate = new Date(endYear, 11, 31);
    while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        data.set(dateString, { count: Math.floor(Math.random() * 30) });
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
};

const StatCard = ({ label, value, icon }) => (
    <div className="flex items-center">
        {icon}
        <div>
            <p className="text-sm text-text-secondary">{label}</p>
            <p className="font-semibold text-text-primary">{value}</p>
        </div>
    </div>
);

const ContributionGraph = () => {
    const accentColor = useSettingsStore((state) => state.accentColor);
    const [tooltip, setTooltip] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [fullContributionData, setFullContributionData] = useState(new Map());
    const [availableYears, setAvailableYears] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const data = generateDummyData(currentYear - 2, currentYear);
        const years = new Set();
        data.forEach((_, dateString) => {
            years.add(new Date(dateString).getFullYear());
        });
        setFullContributionData(data);
        setAvailableYears(Array.from(years).sort((a, b) => b - a));
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const { activityData, totalContributions, productiveDay, streak } = useMemo(() => {
        const data = [];
        let maxCount = 0;
        const dayCounts = Array(7).fill(0);
        let total = 0;

        const startDate = new Date(selectedYear, 0, 1);
        const endDate = new Date(selectedYear, 11, 31);

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateString = d.toISOString().split('T')[0];
            const count = fullContributionData.get(dateString)?.count || 0;
            if (count > maxCount) maxCount = count;
            dayCounts[d.getDay()] += count;
            total += count;
            data.push({ date: new Date(d), count });
        }
        
        const mostProductiveDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        return {
            activityData: data.map(day => ({
                ...day,
                height: maxCount === 0 ? 1 : (day.count / maxCount) * 100,
            })),
            totalContributions: total,
            productiveDay: daysOfWeek[mostProductiveDayIndex] || 'N/A',
            streak: 12 // Placeholder
        };
    }, [selectedYear, fullContributionData]);

    const formatDateForTooltip = (date) => {
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }

    return (
        <div className="bg-card-background p-4 rounded-xl shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-2">
                     <h3 className="text-md font-semibold text-text-primary">Activity Overview</h3>
                     <p className="text-sm text-text-secondary">{totalContributions} contributions in {selectedYear}</p>
                </div>
                <StatCard label="Most Productive" value={productiveDay} icon={<Activity size={20} className="text-accent mr-3" />} />
                <StatCard label="Current Streak" value={`${streak} Days`} icon={<Zap size={20} className="text-accent mr-3" />} />
            </div>

             <div className="flex justify-end items-center mb-4">
                 <div className="relative" ref={dropdownRef}>
                     <button
                         onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                         className="flex items-center justify-between w-28 px-3 py-1 text-sm font-semibold bg-background text-text-primary rounded-md border border-accent hover:bg-opacity-50 transition-colors duration-200"
                     >
                         <span>{selectedYear}</span>
                         <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                     </button>
                     {isDropdownOpen && (
                         <div className="absolute top-full right-0 mt-2 w-28 bg-card-background border border-accent rounded-md shadow-lg z-10">
                             {availableYears.map(year => (
                                 <button
                                     key={year}
                                     onClick={() => {
                                         setSelectedYear(year);
                                         setIsDropdownOpen(false);
                                     }}
                                     className={`w-full text-left px-3 py-2 text-sm ${selectedYear === year ? 'bg-accent text-white' : 'text-text-secondary hover:bg-background'}`}
                                 >
                                     {year}
                                 </button>
                             ))}
                         </div>
                     )}
                 </div>
             </div>

            <div
                className="relative w-full h-28 flex items-end justify-start overflow-x-auto no-scrollbar"
                onMouseLeave={() => setTooltip(null)}
            >
                {activityData.map((day, index) => (
                    <div
                        key={day.date.toISOString()}
                        className="flex-grow h-full flex items-end"
                        onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltip({
                                content: `${day.count} contributions on ${formatDateForTooltip(day.date)}`,
                                x: rect.left + window.scrollX + rect.width / 2,
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