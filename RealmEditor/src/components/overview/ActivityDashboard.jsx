import React, { useMemo, useState, useEffect } from 'react';
import useSettingsStore from '../../store/useSettingsStore';
import { Zap, Activity, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Helper Functions ---
const generateDummyDataForYear = (year) => {
    const data = new Map();
    const startDate = new Date(year, 0, 1);
    // Loop through all days of the given year
    for (let i = 0; i < 366; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        if (date.getFullYear() === year) { // Ensure we stay within the year
            const dateString = new Date(date).toISOString().split('T')[0];
            data.set(dateString, { count: Math.floor(Math.random() * 30) });
        }
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

const MonthlyHeatmap = ({ accentColor, activityData, insights, year }) => {
    const [tooltip, setTooltip] = useState(null);

    const yearInReview = useMemo(() => {
        const months = [];
        for (let i = 0; i < 12; i++) {
            const monthDate = new Date(year, i, 1);
            const monthName = monthDate.toLocaleString('default', { month: 'short' });
            
            const daysInMonth = new Date(year, i + 1, 0).getDate();
            const firstDayOfMonth = new Date(year, i, 1).getDay();
            const startOffset = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

            const days = [];
            for (let j = 0; j < daysInMonth; j++) {
                const dayDate = new Date(year, i, j + 1);
                const dateString = dayDate.toISOString().split('T')[0];
                const dayData = activityData.find(d => d.date === dateString);
                days.push({
                    count: dayData?.count || 0,
                    date: dateString,
                });
            }
            months.push({ name: monthName, days, startOffset });
        }
        return months;
    }, [activityData, year]);

    return (
        <div className="relative p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                 <div className="md:col-span-2">
                     <h3 className="text-md font-semibold text-text-primary">Activity Overview</h3>
                     <p className="text-sm text-text-secondary">{insights.totalContributions} contributions in {year}</p>
                </div>
                <StatCard label="Most Productive" value={insights.productiveDay} icon={<Activity size={20} className="text-accent mr-3" />} />
                <StatCard label="Current Streak" value={`${insights.streak} Days`} icon={<Zap size={20} className="text-accent mr-3" />} />
            </div>

            <div className="overflow-x-auto pb-2">
                <div className="flex space-x-4">
                    {yearInReview.map((month) => (
                        <div key={month.name} className="flex-shrink-0">
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
                                                setTooltip({ content: `${day.count} contributions on ${day.date}`, x: rect.left + window.scrollX, y: rect.top + window.scrollY });
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

export default function ActivityDashboard() {
    const accentColor = useSettingsStore((state) => state.accentColor);
    const [activityData, setActivityData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [insights, setInsights] = useState({ totalContributions: 0, productiveDay: '', streak: 0 });
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchContributionData = (year) => {
            setIsLoading(true);
            setTimeout(() => {
                const dummyData = generateDummyDataForYear(year);
                const formattedData = [], dayCounts = Array(7).fill(0);
                let total = 0;

                const startDate = new Date(year, 0, 1);
                for (let i = 0; i < 366; i++) {
                    const date = new Date(startDate);
                    date.setDate(startDate.getDate() + i);
                    if (date.getFullYear() !== year) continue;
                    const dateString = date.toISOString().split('T')[0];
                    const count = dummyData.get(dateString)?.count || 0;
                    formattedData.push({ date: dateString, count });
                    dayCounts[date.getDay()] += count;
                    total += count;
                }

                const mostProductiveDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
                const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                setActivityData(formattedData);
                setInsights({
                    totalContributions: total,
                    productiveDay: daysOfWeek[mostProductiveDayIndex],
                    streak: 12 // Placeholder for a more complex cross-year streak logic
                });
                setIsLoading(false);
            }, 500);
        };
        fetchContributionData(currentYear);
    }, [currentYear]);

    if (isLoading) {
        return <div className="bg-card-background p-4 rounded-xl shadow-lg animate-pulse h-52" />;
    }

    return (
        <div className="bg-card-background rounded-xl shadow-lg">
            <div className="flex justify-end items-center pt-2 pr-4">
                <button onClick={() => setCurrentYear(currentYear - 1)} className="p-1 text-text-secondary hover:text-text-primary"><ChevronLeft size={20} /></button>
                <span className="font-semibold text-text-primary mx-2">{currentYear}</span>
                <button onClick={() => setCurrentYear(currentYear + 1)} disabled={currentYear === new Date().getFullYear()} className="p-1 text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight size={20} /></button>
            </div>
            <MonthlyHeatmap accentColor={accentColor} activityData={activityData} insights={insights} year={currentYear} />
        </div>
    );
}