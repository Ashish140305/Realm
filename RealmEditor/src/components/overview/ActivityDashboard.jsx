import React, { useMemo, useState, useEffect, useRef } from 'react';
import useSettingsStore from '../../store/useSettingsStore';
import { Zap, Activity, ChevronDown } from 'lucide-react';

// --- Helper Functions (Intact) ---
const generateDummyData = (startYear, endYear) => {
    const data = new Map();
    let currentDate = new Date(startYear, 0, 1);
    const endDate = new Date(endYear, 11, 31);

    while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        // Give a higher chance of contributions to make the graph look fuller
        if (Math.random() > 0.2) {
             data.set(dateString, { count: Math.floor(Math.random() * 25) + 1 });
        } else {
             data.set(dateString, { count: 0 });
        }
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

const MonthlyHeatmap = ({ accentColor, activityData, selectedYear }) => {
    const [tooltip, setTooltip] = useState(null);
    // 1. ADD REF: Use a ref to target the parent container's position
    const heatmapRef = useRef(null);

    const yearInReview = useMemo(() => {
        const months = [];
        const today = new Date();
        const endMonth = (selectedYear === today.getFullYear()) ? today.getMonth() : 11;

        // Loop backwards for the last 12 months.
        for (let i = 0; i < 12; i++) {
            const monthDate = new Date(selectedYear, endMonth - i, 1);
            const year = monthDate.getFullYear();
            const monthIndex = monthDate.getMonth();
            
            const monthName = monthDate.toLocaleString('default', { month: 'short' });
            const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
            
            const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
            const startOffset = firstDayOfMonth;

            const days = [];
            for (let j = 0; j < daysInMonth; j++) {
                const dayDate = new Date(year, monthIndex, j + 1);
                const dateString = dayDate.toISOString().split('T')[0];
                const dayData = activityData.get(dateString);
                days.push({
                    count: dayData?.count || 0,
                    date: dayDate,
                });
            }
            months.push({ name: monthName, days, startOffset, year });
        }
        return months;
    }, [activityData, selectedYear]);

    const formatDateForTooltip = (date) => {
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }

    return (
        // 2. ATTACH REF: Attach the ref to the relative container
        <div className="relative p-4" ref={heatmapRef}> 
            <div className="overflow-x-auto pb-2">
                <div className="flex space-x-4">
                    {yearInReview.map((month) => (
                        <div key={`${month.name}-${month.year}`} className="flex-shrink-0">
                            <p className="text-xs font-semibold text-text-secondary mb-2 text-center">{month.name}</p>
                            <div className="grid grid-cols-7 gap-1.5">
                                {Array.from({ length: month.startOffset }).map((_, i) => <div key={`spacer-${month.name}-${i}`} className="w-3.5 h-3.5" />)}
                                {month.days.map((day, dayIndex) => {
                                    const opacity = day.count > 0 ? 0.2 + (day.count / 25) * 0.8 : 0.05;
                                    return (
                                        <div
                                            key={dayIndex}
                                            className="w-3.5 h-3.5 rounded-sm transition-transform duration-150 hover:scale-125"
                                            style={{ backgroundColor: accentColor, opacity }}
                                            onMouseEnter={(e) => {
                                                // 3. CORRECT CALCULATION: Calculate position relative to the heatmap container
                                                if (!heatmapRef.current) return;
                                                
                                                const dayRect = e.currentTarget.getBoundingClientRect();
                                                const heatmapRect = heatmapRef.current.getBoundingClientRect();

                                                setTooltip({ 
                                                    content: `${day.count} contributions on ${formatDateForTooltip(day.date)}`, 
                                                    // x: Relative x position + half the day box width (for center alignment)
                                                    x: dayRect.left - heatmapRect.left + dayRect.width / 2, 
                                                    // y: Relative y position (position the tooltip above the box)
                                                    y: dayRect.top - heatmapRect.top, 
                                                });
                                            }}
                                            onMouseLeave={() => setTooltip(null)}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* 4. RENDER WITH RELATIVE COORDINATES */}
            {tooltip && (
                <div 
                    className="absolute z-10 bg-background text-text-primary text-xs rounded-md px-2 py-1 shadow-lg pointer-events-none -translate-x-1/2" 
                    // Use calculated relative position. Offset Y by -10px to place it above the element.
                    style={{ top: `${tooltip.y - 10}px`, left: `${tooltip.x}px` }} 
                >
                    {tooltip.content}
                </div>
            )}
        </div>
    );
};

// --- Main Component (ActivityDashboard) (Intact) ---
export default function ActivityDashboard() {
    const accentColor = useSettingsStore((state) => state.accentColor);
    const [fullActivityData, setFullActivityData] = useState(new Map());
    const [isLoading, setIsLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [availableYears, setAvailableYears] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            const currentYear = new Date().getFullYear();
            const dummyData = generateDummyData(currentYear - 2, currentYear);
            const years = new Set();
            dummyData.forEach((_, dateString) => {
                years.add(new Date(dateString).getFullYear());
            });
            setFullActivityData(dummyData);
            setAvailableYears(Array.from(years).sort((a, b) => b - a));
            setIsLoading(false);
        }, 500);
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

    const insights = useMemo(() => {
        if (fullActivityData.size === 0) {
            return { totalContributions: 0, productiveDay: 'N/A', streak: 0 };
        }
        
        const dataForYear = Array.from(fullActivityData.entries())
            .filter(([date]) => new Date(date).getFullYear() === selectedYear);

        if (dataForYear.length === 0) {
             return { totalContributions: 0, productiveDay: 'N/A', streak: 12 };
        }

        const dayCounts = Array(7).fill(0);
        let total = 0;
        dataForYear.forEach(([, value]) => {
            const dayOfWeek = new Date(value.date).getDay();
            dayCounts[dayOfWeek] += value.count;
            total += value.count;
        });
        const mostProductiveDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        return {
            totalContributions: total,
            productiveDay: daysOfWeek[mostProductiveDayIndex],
            streak: 12 
        };
    }, [selectedYear, fullActivityData]);

    if (isLoading) {
        return <div className="bg-card-background p-4 rounded-xl shadow-lg animate-pulse h-52" />;
    }

    return (
        <div className="bg-card-background rounded-xl shadow-lg">
            <div className="flex justify-between items-center pt-4 px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-grow">
                     <div className="md:col-span-2">
                         <h3 className="text-md font-semibold text-text-primary">Activity Overview</h3>
                         <p className="text-sm text-text-secondary">{insights.totalContributions} contributions in {selectedYear}</p>
                    </div>
                    <StatCard label="Most Productive" value={insights.productiveDay} icon={<Activity size={20} className="text-accent mr-3" />} />
                    <StatCard label="Current Streak" value={`${insights.streak} Days`} icon={<Zap size={20} className="text-accent mr-3" />} />
                </div>
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-between w-28 px-3 py-1 text-sm font-semibold bg-background text-text-primary rounded-md border border-border-color hover:border-accent transition-colors duration-200"
                    >
                        <span>{selectedYear}</span>
                        <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-28 bg-card-background border border-border-color rounded-md shadow-lg z-10">
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
            <MonthlyHeatmap
                accentColor={accentColor}
                activityData={fullActivityData}
                selectedYear={selectedYear}
            />
        </div>
    );
}