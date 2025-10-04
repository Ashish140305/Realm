import React, { useMemo, useState, useEffect, useRef } from 'react';
import useSettingsStore from '../../store/useSettingsStore';
import { Zap, Activity, ChevronDown } from 'lucide-react';

// --- Helper Functions ---
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

const MonthlyHeatmap = ({ accentColor, activityData, insights, selectedYear }) => {
    const [tooltip, setTooltip] = useState(null);

    const yearInReview = useMemo(() => {
        const months = [];
        for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
            const monthDate = new Date(selectedYear, monthIndex, 1);
            const year = monthDate.getFullYear();
            const monthName = monthDate.toLocaleString('default', { month: 'short' });
            const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
            const firstDayOfMonth = monthDate.getDay();
            const startOffset = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

            const days = [];
            for (let j = 0; j < daysInMonth; j++) {
                const dayDate = new Date(year, monthIndex, j + 1);
                const dateString = dayDate.toISOString().split('T')[0];
                const dayData = activityData.find(d => d.date === dateString);
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
        <div className="relative p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                 <div className="md-col-span-2">
                     <h3 className="text-md font-semibold text-text-primary">Activity Overview</h3>
                     <p className="text-sm text-text-secondary">{insights.totalContributions} contributions in {selectedYear}</p>
                </div>
                <StatCard label="Most Productive" value={insights.productiveDay} icon={<Activity size={20} className="text-accent mr-3" />} />
                <StatCard label="Current Streak" value={`${insights.streak} Days`} icon={<Zap size={20} className="text-accent mr-3" />} />
            </div>

            <div className="overflow-x-auto pb-2">
                <div className="flex space-x-4">
                    {yearInReview.map((month) => (
                        <div key={`${month.name}-${month.year}`} className="flex-shrink-0">
                            <p className="text-xs font-semibold text-text-secondary mb-2 text-center">{month.name}</p>
                            <div className="grid grid-cols-7 gap-1.5">
                                {Array.from({ length: month.startOffset }).map((_, i) => <div key={`spacer-${i}`} className="w-3.5 h-3.5" />)}
                                {month.days.map((day, dayIndex) => {
                                    const opacity = Math.max(0.15, day.count / 20);
                                    return (
                                        <div
                                            key={dayIndex}
                                            className="w-3.5 h-3.5 rounded-sm transition-transform duration-150 hover:scale-125"
                                            style={{ backgroundColor: accentColor, opacity: day.count > 0 ? opacity : 0.05 }}
                                            onMouseEnter={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                setTooltip({ content: `${day.count} contributions on ${formatDateForTooltip(day.date)}`, x: rect.left + window.scrollX, y: rect.top + window.scrollY });
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
            {tooltip && <div className="absolute z-10 bg-background text-text-primary text-xs rounded-md px-2 py-1 shadow-lg pointer-events-none -translate-x-1/2" style={{ top: `${tooltip.y - 35}px`, left: `${tooltip.x}px` }}>{tooltip.content}</div>}
        </div>
    );
};

// --- Main Component ---
export default function ActivityDashboard() {
    const accentColor = useSettingsStore((state) => state.accentColor);
    const [fullActivityData, setFullActivityData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [availableYears, setAvailableYears] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Fetch and process data once on mount
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            const currentYear = new Date().getFullYear();
            const dummyData = generateDummyData(currentYear - 2, currentYear);
            const formattedData = [];
            const years = new Set();

            dummyData.forEach((value, dateString) => {
                formattedData.push({ date: dateString, count: value.count });
                years.add(new Date(dateString).getFullYear());
            });

            setFullActivityData(formattedData);
            setAvailableYears(Array.from(years).sort((a, b) => b - a));
            setIsLoading(false);
        }, 500);
    }, []);

    // Effect to handle clicks outside of the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const { yearlyData, insights } = useMemo(() => {
        if (!fullActivityData.length) {
            return { yearlyData: [], insights: { totalContributions: 0, productiveDay: 'N/A', streak: 0 } };
        }
        const dataForYear = fullActivityData.filter(d => new Date(d.date).getFullYear() === selectedYear);
        const dayCounts = Array(7).fill(0);
        let total = 0;
        dataForYear.forEach(d => {
            const dayOfWeek = new Date(d.date).getDay();
            dayCounts[dayOfWeek] += d.count;
            total += d.count;
        });
        const mostProductiveDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return {
            yearlyData: dataForYear,
            insights: {
                totalContributions: total,
                productiveDay: daysOfWeek[mostProductiveDayIndex] || 'N/A',
                streak: 12
            }
        };
    }, [selectedYear, fullActivityData]);

    if (isLoading) {
        return <div className="bg-card-background p-4 rounded-xl shadow-lg animate-pulse h-52" />;
    }

    return (
        <div className="bg-card-background rounded-xl shadow-lg">
            <div className="flex justify-end items-center pt-4 pr-4">
                {/* New Year Dropdown */}
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
            <MonthlyHeatmap
                accentColor={accentColor}
                activityData={yearlyData}
                insights={insights}
                selectedYear={selectedYear}
            />
        </div>
    );
}